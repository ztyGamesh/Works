<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace app\services;


use app\models\AdcreativeAuditOtherModel;
use app\models\AdcreativeModel;
use app\models\AdgroupModel;
use app\models\AdplanModel;
use app\models\ArticleCategoryModel;
use app\models\MediaModel;
use app\models\SlotModel;
use app\models\TagModel;
use app\models\WordModel;
use app\services\custom\ArrayHandle;
use yii\base\InvalidParamException;
use yii\helpers\ArrayHelper;

class AdplanService extends BaseService
{


    public static function CheckAdplanRepeat($name, $id = null, $group_id=null)
    {
        if (!$name)
            return false;

        $uid = UserService::getCurrentUid();
        if ($id){
            if ($group_id){
                $exists = AdplanModel::queryRow("SELECT 
                                                        1
                                                        FROM `ad_plan` AS p
                                                        WHERE p.`group_id` = {$group_id} AND p.`id` != {$id} and p.status!='delete' AND p.`name` = '{$name}'
                                                        AND p.`create_user` = '{$uid}'");
            }else{
                $sql="SELECT 1
FROM ad_plan p
  JOIN ad_plan p2 ON p.group_id = p2.group_id AND p.id != p2.id AND p2.status != 'delete' AND p2.name = '{$name}'
WHERE p.id = {$id}";
                $exists = AdplanModel::queryRow($sql);

            }
        }

        else
            $exists = AdplanModel::queryRow("SELECT 
                                                        1
                                                        FROM `ad_plan` AS p
                                                        WHERE p.`group_id` = {$group_id} AND p.`name` = '{$name}' and p.status!='delete'
                                                        AND p.`create_user` = '{$uid}'");
        return $exists ? true : false;
    }

    /**
     * 提取用户权限的媒体定向列表 账户-媒体必须是激活状态
     * + bundle_id去重去null去空字符串
     * @return array [['media_name'=>'a','bundle_id'=>']]
     */
    public static function FetchUserMediaTarget()
    {
        $uid = UserService::getCurrentUid();
        $sql = "SELECT r.id as bundle_id from resource r  WHERE  r.uid='$uid' and r.type='bundle_id' AND r.`platform_role` = 'alliance' and r.id!='' ";
        $rows = MediaModel::queryList($sql);

//        $sql2 = "SELECT DISTINCT mn.bundle_id, mn.media_name
// FROM media_name mn
// JOIN media m on m.bundle_id=mn.bundle_id and m.status='active'
// JOIN user u on m.medium=u.uid and u.pause=0";
        $sql2 = "SELECT DISTINCT mn.bundle_id,mn.name AS media_name
FROM user u
  JOIN media m ON m.medium=u.uid AND m.status='active'
  JOIN (
       SELECT
         m.bundle_id,
         m.name
       FROM media m
         JOIN (SELECT
                 min(create_time) AS create_time,
                 bundle_id
               FROM media
               WHERE bundle_id != \"\"
               GROUP BY bundle_id) AS t1 ON t1.bundle_id = m.bundle_id AND t1.create_time = m.create_time
       WHERE m.bundle_id != \"\"
     ) AS mn ON mn.bundle_id=m.bundle_id
WHERE u.pause=0";
        //用户没有媒体定向,返回所有的媒体
        if (empty($rows)) {
            return MediaModel::queryList($sql2);
        }
        $escapeStr = '';
        foreach ($rows as $row) {
            $bid = $row['bundle_id'];
            $escapeStr .= "'$bid',";
        }
        $escapeStr = trim($escapeStr, ',');
        $sql = "{$sql2}  and  mn.bundle_id in({$escapeStr})";
        return MediaModel::queryList($sql);
    }

    /**
     * 获取计划下的媒体定向 返回bundle_ids [[bundle_id=>xx],[bundle_id=>xx2]]
     */
    public static function FetchPlanMediaTarget($params)
    {
        if (!isset($params['plan_id'])) {
            return ['error' => '缺少参数plan_id'];
        }
        $plan_id = $params['plan_id'];
        $media_target = MediaModel::queryRow("select media_target  from ad_plan WHERE id='$plan_id'");
        $ret = [];
        if (isset($media_target['media_target'])) {
            $bundle_ids = explode(',', $media_target['media_target']);
            foreach ($bundle_ids as $bundle_id) {
                $ret[] = ['bundle_id' => $bundle_id];
            }
        }
        return $ret;
    }

    public static function fetchOne($id)
    {
        if (!is_numeric($id)){
            throw new \InvalidArgumentException('plan id must be an integer');
        }
        $plan_data = AdplanModel::getRow(['id' => $id]);
        if ($plan_data) {
            //媒体定向查询
            /* $medias = MediaTable::factory()::queryList(
                 "SELECT
                   m.`uid` as media_id,
                   m.`name` as media_name
                 FROM
                 `ad_plan` AS p
                 INNER JOIN `media` AS m
                 ON p.id = {$id} AND FIND_IN_SET(m.uid,p.media_target) > 0");*/

            /**
             * 保证计划的媒体定向中的媒体同时也是该用户的媒体； 减少广告主账户媒体时，没有对计划的媒体定向做改动导致需做兼容处理
             */
            $plan_data['media_slot_target'] = self::queryMediaTarget($id);
            //日期整形
            $plan_data['s'] = date('Y-m-d', $plan_data['s']);
            $plan_data['e'] = date('Y-m-d', $plan_data['e']);
            $plan_data['hour_target'] = json_decode($plan_data['hour_target']);
            //关键词
            $word = WordService::FetchPlanWord($id);
            $plan_data['key_word'] = $word;
            // 频次控制
            if ($plan_data['frequency']) {
                $tmp = json_decode($plan_data['frequency'], true);
                if ($tmp && $tmp['same_plan_one_day']) {
                    $plan_data['frequency'] = $tmp['same_plan_one_day'];
                } else {
                    $plan_data['frequency'] = '';
                }
            }
            //tag_target
            if ($plan_data['tag_target']) {
                // 过滤删除的标签
                $sql = "select code from tag where find_in_set(code,'{$plan_data['tag_target']}')>0 and status=0";
                $tagTargets = TagModel::queryList($sql);
                $tags = [];
                foreach ($tagTargets as $tagTarget) {
                    $len = strlen($tagTarget['code']);
                    $tag['level1'] = substr($tagTarget['code'], 0, $len - 4) . '0000';
                    if ($tagTarget['code'] % 10000 != 0) {
                        $tag['level2'] = substr($tagTarget['code'], 0, $len - 2) . '00';
                    }
                    $tags[] = $tag;
                }
                $plan_data['tag_target'] = $tags;
            }
            // category_target
            if ($plan_data['category_target']) {
                $sql = "select category_id from article_category where find_in_set(category_id,'{$plan_data['category_target']}') > 0 and status = 0";
                $categoryTargets = ArticleCategoryModel::queryList($sql);
                $categories = [];
                foreach ($categoryTargets as $categoryTarget) {
                    $len = strlen($categoryTarget['category_id']);
                    $category['level1'] = substr($categoryTarget['category_id'], 0, $len - 6). '000000';
                    if ($categoryTarget['category_id'] % 1000000 != 0) {
                        $category['level2'] = substr($categoryTarget['category_id'], 0, $len - 3). '000';
                    }
                    $categories[] = $category;
                }
                $plan_data['category_target'] = $categories;
            }
        }
        return $plan_data;
    }

    /**
     * 保存
     * @param $params
     * @return string
     * @throws \yii\base\InvalidParamException
     */
    public static function Save($params)
    {
        $data = AdplanModel::IntersectKey($params);
        $user_id = UserService::getCurrentUid();

//        if($data['budget'] < 50 or $data['budget'] > 1000000000)
//            throw new \Exception('日预算必须在50 到 1000000000之间！');

        if (isset($data['s']))
            $data['s'] = strtotime($data['s']);
        if (isset($data['e']))
            $data['e'] = strtotime($data['e']);

        //目前的强制设定
        $data['budget_type'] = 'daily_budget';
//        $data['speed'] = 'asap';

        $data['edit_user'] = $user_id;
        $data['edit_time'] = time();
        // 频次控制
        if (!empty($data['frequency'])) {
            $tmp = $data['frequency'];
            $data['frequency'] = array();
            $data['frequency']['same_plan_one_day'] = array($tmp);
        } else {
            $data['frequency'] = array();
            $data['frequency']['same_plan_one_day'] = array();
        }
        if(empty($data['frequency_status'])){
            throw new InvalidParamException('lack  frequency_status');
        }
        if(!in_array($data['frequency_status'],AdplanModel::FREQUENCY_STATUS_VALUES,true)){
            throw new InvalidParamException('invalid frequency_status');
        }
        $data['frequency'] = json_encode($data['frequency']);
        $data['hour_target'] = json_encode($data['hour_target']);

        if(!isset($params['media_slot_target'])){
            throw new InvalidParamException('lack media_slot_target');
        }
        if(!is_array($params['media_slot_target'])){
            throw new InvalidParamException('media_slot_target should be array');
        }
        $mediaSlotTarget=$params['media_slot_target'];
        $data['media_target']=implode(',',array_keys($mediaSlotTarget));

        if (isset($data['id']) && !empty($data['id'])) {
            if (self::CheckAdplanRepeat($params['name'], $data['id'], $data['group_id']))
                throw new InvalidParamException('广告计划重名！');

            AdplanModel::updateAll($data, array('id' => $data['id']));

            //计划被修改时调用创意审核推送
            AdcreativeAuditOtherService::addAuditStatusForPlan($data['id']);
            $creatives = AdcreativeModel::getList(['plan_id' => $data['id']]);
            if ($creatives) {
                $ids = ArrayHandle::FetchMultipleArrayLeafWithKey($creatives, "id");
                //不需要它审的直接自动化审核通过
                AdcreativeAuditOtherService::AutoPassCreatives($ids);
            }

            SlotTargetService::save($data['id'],$mediaSlotTarget);
            return $data['id'];
        } else {
            if (self::CheckAdplanRepeat($params['name'], null, $data['group_id']))
                throw new InvalidParamException('广告计划重名！');

            $data['status'] = 'active';
            $data['create_user'] = $user_id;
            $data['create_time'] = time();
            AdplanModel::insertOne($data);
            $planId = AdplanModel::getLastInsertValue();
            SlotTargetService::save($planId,$mediaSlotTarget,false);
            return $planId;
        }
    }

    /**
     * 查询接口
     * @param $params
     */
    public static function getList($params)
    {
        $params['begin'] = !$params['begin'] ? date('Ymd') : date('Ymd', strtotime($params['begin']));
        $params['end'] = !$params['end'] ? date('Ymd', strtotime('+1 day')) : date('Ymd', strtotime($params['end']) + 86400);

        $user_id = UserService::getCurrentUid();
        $where = "p.create_user = '{$user_id}' and p.status!='delete' and g.status!='delete'";

        if (isset($params['status']) and !empty($params['status']))
            $where .= " AND p.`status` = '{$params['status']}'";
        if (isset($params['search']) and strlen($params['search']=trim($params['search']))>0)
            $where .= " AND p.`name` LIKE  '%{$params['search']}%'";
        if (isset($params['group_id']) and !empty($params['group_id']))
            $where .= " AND p.`group_id` = '{$params['group_id']}'";
        if (!empty($params['purpose'])){
            $where .= " AND g.`purpose` = '{$params['purpose']}'";
        }
        if (!empty($params['bid_type'])){
            $bidType=strtolower($params['bid_type']);
            $where .= " AND p.`bid_type` = '{$bidType}'";
        }

        $group_name = AdgroupModel::getRow(['id' => isset($params['group_id']) ? $params['group_id'] : '']);

        $limit = " LIMIT {$params['offset']},{$params['limit']}";

        $sql = "SELECT 
                g.id AS goup_id,
                g.name AS goup_name,
                g.purpose as purpose,
                p.id,
                p.`name`,
                p.`status`,
                p.`price`,
                p.`budget_type`,
                p.`budget`,
                p.bid_type,
                CONCAT(FROM_UNIXTIME(p.s,'%Y-%m-%d'),'-',FROM_UNIXTIME(p.e,'%Y-%m-%d')) AS period,
                SUM(r.`imp`) AS imp,
                SUM(r.`clk`) AS clk,
                round(SUM(r.`clk`) / SUM(r.`imp`),4) AS ctr,
                round(SUM(r.`income`),2) AS spend_budget
                FROM 
                `ad_group` as g INNER JOIN 
                `ad_plan` as p ON g.id = p.group_id LEFT JOIN
                `ad_creative` AS c ON p.id = c.plan_id LEFT JOIN 
                `reports_alliance_hourly` AS r ON c.`id` = r.`creative_id`  
                AND r.`date` >= '{$params['begin']}' 
                AND r.`date` < '{$params['end']}' 
                WHERE {$where}" . " 
                GROUP BY p.`id` ORDER BY p.create_time desc,p.name asc
                {$limit}";

        $data = AdplanModel::queryList($sql);
        $total = AdplanModel::queryRow("
                SELECT 
                COUNT(*) as `total`
                FROM 
                `ad_group` as g INNER JOIN 
                `ad_plan` as p ON g.id = p.group_id 
                WHERE {$where}");

        return
            [
                'rows' => $data,
                'total' => $total['total'],
                'group_id' => isset($group_name['id']) ? $group_name['id'] : '',
                'group_name' => isset($group_name['name']) ? $group_name['name'] : '',
            ];
    }

    public static function updateStatus($ids, $status)
    {
        if (!$status or !$ids)
            throw new \Exception('参数错误！');

        if (!in_array($status,AdplanModel::STATUS_VALUES)){
            throw new \Exception('参数错误！status='.$status);
        }
        if($status==='delete'){
            $sql="
UPDATE ad_plan p LEFT JOIN ad_creative c on p.id=c.plan_id
SET  p.status='delete',c.status='delete',
     p.delete_time=unix_timestamp(),c.delete_time=unix_timestamp(),
     p.edit_time=unix_timestamp(),c.edit_time=unix_timestamp()
WHERE p.id in({$ids})";

            return AdplanModel::execute($sql);
        }
        return AdplanModel::execute("UPDATE `ad_plan` SET `status` = '{$status}',edit_time=unix_timestamp() WHERE id IN ({$ids})");
    }

    /**
     * 获取adx账户一计划下的广告位模板设置
     * @param $planId
     */
    public static function fetchplantemplatesSetting($planId)
    {
        $row = AdplanModel::queryRow("SELECT p.media_target FROM  ad_plan p WHERE p.id='{$planId}'");
        $data = [];
        if (!empty($row['media_target'])) {
            $media_targets = explode(',', $row['media_target']);
            $joinStr = array_reduce($media_targets, function ($old, $new) {
                return "$old,'$new'";
            }, '');
            $joinStr = substr($joinStr, 1);
            $sql = "SELECT setting,template_class,t.name as template_name
                    FROM media m
                      inner join medium_template mt on m.medium=mt.medium
                      inner join template t on mt.template_class=t.uid
                    WHERE m.bundle_id in({$joinStr})";
        } else {//没有媒体定向则返回所有adx的模板
            $sql = "SELECT setting,template_class,t.name AS template_name FROM medium_template mt JOIN template t ON mt.template_class=t.uid";
        }
        $data = AdplanModel::queryList($sql);
        return $data;
    }

    /**
     * check whether plan ad format is fixed feeds
     * @param $planId
     */
    public static function isPlanFixedFeeds($planId)
    {
        $sql = "SELECT uid FROM slot_class sl JOIN ad_plan p on p.class=sl.uid WHERE sl.name='固定信息流' and p.id='{$planId}'";
        $row = AdplanModel::queryRow($sql);
        return !empty($row);
    }

    public static function isCreativeFixedFeeds($cid)
    {
        $sql = "SELECT sl.uid FROM slot_class sl JOIN ad_plan p on p.class=sl.uid join ad_creative c on c.plan_id=p.id
WHERE sl.name='固定信息流' and c.id='{$cid}'";
        $row = AdplanModel::queryRow($sql);
        $isFixed = empty($row) ? false : true;
        return ['isFixed' => $isFixed];
    }

    /**
     * 可用的创意形式 根据广告主定向、媒体广告位进行汇总得到
     */
    public static function availableCreativeFormats($pId)
    {
        $sql1 = "
SELECT
  st.class as slot_class,st.template_class as template,st.setting,t.name as template_name,sc.name as slot_class_name
FROM ad_plan p
   JOIN media m on  m.status='active' and ((find_in_set(m.bundle_id,p.media_target))>0
                   OR (
                      p.media_target = '' AND
                      (
                         exists(SELECT 1
                                FROM resource r
                                WHERE
                                   r.uid = p.create_user AND r.platform_role = 'alliance' AND r.type = 'bundle_id' AND
                                   r.id = m.bundle_id)
                         OR NOT exists(SELECT 1
                                       FROM resource r
                                       WHERE r.uid = p.create_user AND r.platform_role = 'alliance' AND
                                             r.type = 'bundle_id')
                      )
                   ))
   JOIN user u on m.medium=u.uid and u.pause=0
   JOIN slot s on s.media=m.uid  and s.status='active'
   JOIN slot_template st on st.slot=s.uid and st.status='active'
   JOIN template t on st.template_class=t.uid
  JOIN slot_class sc on sc.uid=st.class
WHERE p.id=$pId ORDER BY slot_class,template";
        $templates = \Yii::$app->db->createCommand($sql1)->queryAll();

//        //最终格式
        $formats = [];
        $defSetting = [
//            pic_setting": {
//				"scale": "4_3",
//              "position": "left",//图文
//				"format": ["static_pic", "dynamic_pic"],
//              "number": "3",//组图
//			}，
//            "title_setting": {
//              "font": "",
//                 "align": "top",
//				"font-size": "14",
//				"font-color": "#000000",
//				"length": "23"
//			}
//            "description_setting": {
//              "font": "",
//				"font-size": "12",
//				"font-color": "#000000",
//				"length": "23"
//			}
//            "video_setting": {
//               "format": ["mp4"]
//			},
//
            'pic_setting' => [
                //setting中有的有且格式为["static_pic", "dynamic_pic"]，有的没有
                "format" => ['jpg', 'jpeg', 'png', 'gif'],
                //setting中无对应设置
                'size' => ['text' => '80kb', 'bytes' => 80 * 1024],
                'scale' => [],//图片比例
                'count'=>'1',//图片数量
            ],
            'big_pic_setting' => [//大图和视频图片设置
                //setting中有的有且格式为["static_pic", "dynamic_pic"]，有的没有
                "format" => ['jpg', 'jpeg', 'png', 'gif'],
                //setting中无对应设置
                'size' => ['text' => '100kb', 'bytes' => 100 * 1024],
                'scale' => [],//图片比例
                'count'=>'1',
            ],
            'video_setting' => [
                //setting中无对应设置
                "format" => ["mp4"],
                //setting中无对应设置
                'size' => ['text' => '5m', 'bytes' => 5 * 1024 * 1024],
                'scale' => ['16_9', '4_3'],//720*405(16:9) 800*600(4:3)
            ],
            'title_setting' => ['max' => 23, 'min' => 2],
            'description_setting' => ['max' => 23, 'min' => 2],
        ];
        //大图/视频图片 size 100kb 其他的图片大小 80kb
        foreach ($templates as $template) {
            $slot_class = self::replaceFixedSlotClass2Dynamic($template['slot_class']);
            $formats[$slot_class][$template['template']][] = $template;
        }
        $rets = [];
        foreach ($formats as $slot_class => $allTemplates) {
            $scRow = ['slot_class' => $slot_class];//一个slot_class对应的各种设置
            foreach ($allTemplates as $templates) {
                $row = [];//一种template对应的各种设置

                foreach ($templates as $template) {
                    $row['template_name'] = self::replaceTemplateName($template['template_name']);
                    $scRow['name'] = self::replaceSlotClassName($template['slot_class_name']);
                    $row['template'] = $template['template'];

                    $setting = json_decode($template['setting'], true);
                    if (isset($setting['pic_setting'])) {
                        if (!isset($row['pic_setting'])) {
                            if (mb_strpos($template['template_name'], '视频') !== false
                                || mb_strpos($template['template_name'], '大图') !== false
                            ) {//TODO improve
                                $row['pic_setting'] = $defSetting['big_pic_setting'];
                            } else {
                                $row['pic_setting'] = $defSetting['pic_setting'];
                            }
                            if (mb_strpos($template['template_name'], '组图')!==false){
                                $row['pic_setting']['count']=3;
                            }
                        }

                        $scale = $setting['pic_setting']['scale'];
                        if (!in_array($scale, $row['pic_setting']['scale'])) {
                            if (is_array($scale)){//有些是数组形式
                                array_push($row['pic_setting']['scale'], ...$scale);
                            }else{
                                array_push($row['pic_setting']['scale'], $scale);
                            }
                        }
                    }
                    if (isset($setting['title_setting'])) {
                        if (!isset($row['title_setting'])) {
                            $row['title_setting'] = $defSetting['title_setting'];
                        }
                        $row['title_setting']['max'] = max($row['title_setting']['max'], $setting['title_setting']['length']);
                    }
                    if (isset($setting['description_setting'])) {
                        if (!isset($row['description_setting'])) {
                            $row['description_setting'] = $defSetting['description_setting'];
                        }
                        $row['description_setting']['max'] = max($row['description_setting']['max'], $setting['description_setting']['length']);
                    }
                    if (isset($setting['video_setting'])) {
                        if (!isset($row['video_setting'])) {
                            $row['video_setting'] = $defSetting['video_setting'];
                        }
                    }

                }
                $scRow['child'][] = $row;
            }
            ArrayHelper::multisort($scRow['child'],'template');
            $rets[] = $scRow;
        }
        ArrayHelper::multisort($rets,'slot_class');
        return $rets;

    }

    /**
     * 把固定信息流转为动态信息流
     * @param $slot_class
     * @return string
     */
    protected static function replaceFixedSlotClass2Dynamic($slot_class)
    {
        if ($slot_class === 'c96089f7-9cff-4149-997f-bb03d617cda0') {
            $slot_class = '29076f0d-a923-47d4-bfef-2e3cf28fc099';
        }
        return $slot_class;
    }

    /**
     * 数据库和前端展示的名字不一致，进行转换
     * @param $dbName
     * @return mixed
     */
    protected static function replaceTemplateName($dbName)
    {
        static $templateDisplayNames = [
            '视频模板' => '视频样式',
            '视频+文字模板' => '视频+文字样式',
            '组图模板' => '组图样式',
            '文字链模板' => '文字链样式',
            '插屏-纯图模板' => '纯图样式',
            '大图模板' => '大图样式',
            '大图+文字模板' => '大图+文字样式',
            '图文模板' => '图文样式',
            '横幅-图文模板'=>'图文样式',
            '横幅-纯图模板'=>'纯图样式',
        ];
        return isset($templateDisplayNames[$dbName]) ? $templateDisplayNames[$dbName] : $dbName;

    }

    protected static function replaceSlotClassName($dbName)
    {
        static $slotClassDisplayNames = [
            'app_动态信息流' => '信息流',
            '固定信息流' => '信息流',
            '插屏' => '插屏',
            '横幅' => '横幅',
        ];
        return isset($slotClassDisplayNames[$dbName]) ? $slotClassDisplayNames[$dbName] : $dbName;
    }

    /**
     * 更新预算
     * @param $budget
     * @param $idArr
     */
    public static function updateBudget($budget, $ids)
    {
        if (!is_numeric($budget)){
            throw new \Exception("invalid param:budget={$budget}");
        }
        if (is_array($ids)){
            $ids=implode(',',$ids);
        }

        $sql="UPDATE ad_plan set budget='$budget',edit_time=unix_timestamp() WHERE id in($ids) ";
        return \Yii::$app->db->createCommand($sql)->execute();
    }

    public static function updatePrice($price, $ids)
    {
        if (!is_numeric($price)){
            throw new \Exception("invalid param:price={$price}");
        }
        if (is_array($ids)){
            $ids=implode(',',$ids);
        }

        $sql="UPDATE ad_plan set price='$price',edit_time=unix_timestamp() WHERE id in($ids) ";
        return \Yii::$app->db->createCommand($sql)->execute();
    }

    /**
     * 单个修改计划名称
     * @param $name
     * @param $id
     * @return int
     * @throws \Exception
     */
    public static function updateName($name, $id)
    {
        if (self::CheckAdplanRepeat($name,$id)){
            throw new \Exception('广告计划重名！');
        }
        $sql="update ad_plan set name='{$name}',edit_time=unix_timestamp() WHERE id=$id";
        return \Yii::$app->db->createCommand($sql)->execute();
    }

    /**
     * 批量添加关键字
     * @param $word array
     * @param $idArr
     */
    public static function updateWord(&$plan_words)
    {
        foreach ($plan_words as $plan_id=>$words){
            WordService::SavePlanWord($words, $plan_id);
            \Yii::$app->db->createCommand("update ad_plan set edit_time=unix_timestamp() WHERE id=$plan_id")->execute();
        }
        return 1;
    }

    /**
     * 导出计划的关键词
     * @param $pid string|int 计划id
     * @param int $targetType 1:正向关键词  2:否定关键词
     * @return string
     */
    public static function exportWord($pid,$targetType=1){
        if (!is_numeric($pid) || !in_array($targetType,[1,2])){
            throw new \Exception("invalid parameter:pid={$pid},targetType={$targetType}");
        }
        $sql="
SELECT daw.word
FROM ad_plan_word pw
  JOIN dic_adm_word daw on daw.id=pw.word_id
WHERE pw.plan_id= {$pid} and pw.target_type={$targetType}";
        $words=\Yii::$app->db->createCommand($sql)->queryColumn();

      return static::iconv(implode("\r\n",$words));
    }

    /**
     * 批量拷贝计划
     * @param $pidArr
     * @param $gidArr
     * @param $recurse bool 递归拷贝
     */
    public static function batchCopy(array $pidArr, array $gidArr, $recurse=false)
    {
        if (empty($pidArr)||empty($gidArr)){
            throw new \Exception('invalid parameter:pid or gid empty');
        }

        $ids=[];//新创建的计划id
        foreach ($gidArr as $gid) {
            foreach ($pidArr as $pid) {
                $ids[]= self::copy($pid,$gid,$recurse);
            }
        }
        $idStr=implode(',',$ids);
        \Yii::$app->db->createCommand("UPDATE ad_plan set edit_time=unix_timestamp() WHERE id in({$idStr})")->execute();
        return $ids;
    }

    /**
     * 拷贝单个计划到一个广告组，返回新生成的计划id
     * @param $pid
     * @param $gid
     * @param bool $recurse
     * @return int
     */
    public static function copy($pid,$gid,$recurse=false){
        $timeStamp=microtime(true);
        $currentUserId=UserService::getCurrentUid();
        $sql1="insert into ad_plan (bid_type,status,budget_type,group_id, name, class, area, platform, network, channel_class, media_target, tag_target, category_target, frequency, s, e, budget, speed, price, create_time, create_user, edit_time, edit_user, hour_target,app_pkg , download_link , app_store_id)
SELECT bid_type,status,budget_type,$gid, concat(name,'(复制)-',$timeStamp), class, area, platform, network, channel_class, media_target, tag_target, category_target, frequency, s, e, budget, speed, price, unix_timestamp(), create_user, unix_timestamp(), '$currentUserId', hour_target,app_pkg , download_link , app_store_id
FROM ad_plan WHERE id=$pid";

        \Yii::$app->db->createCommand($sql1)->execute();
        $newId=\Yii::$app->db->getLastInsertID();
        $sqlCopyPlanWord=" insert into ad_plan_word SELECT $newId,word_id,target_type,match_type FROM ad_plan_word WHERE plan_id=$pid";
        $sqlCopySlotTarget="INSERT into slot_target(plan_id, slot_id) SELECT {$newId},slot_id from slot_target WHERE plan_id={$pid}";
        \Yii::$app->db->createCommand($sqlCopyPlanWord)->execute();
        \Yii::$app->db->createCommand($sqlCopySlotTarget)->execute();
        if ($recurse){//拷贝计划下的创意到新生成的计划下面
            $sql3="SELECT id FROM ad_creative c WHERE c.status!='delete' and c.plan_id=$pid";
            $ids=\Yii::$app->db->createCommand($sql3)->queryColumn();
            if (!empty($ids)){
                AdcreativeService::batchCopy([$newId],$ids);
            }
        }
        return $newId;
    }

    /**
     * @param $plan_ids int|string '12' '12,13'
     */
    public static function getPlanKeyWords($plan_ids,$target_type=1)
    {
        $map=[];
        $ids=explode(',',$plan_ids);
        array_walk($ids, function ($val)use (&$map) {
            if (!is_numeric($val)){
                throw new \Exception("invalid parameter:id={$val}");
            }
            $map[$val]=[];
        });

        $sql=" SELECT w.*,
                d.`word`
                FROM `ad_plan_word` AS w INNER JOIN `dic_adm_word` AS d ON w.`word_id` = d.`id`
                WHERE w.`plan_id` in ({$plan_ids})";
        if ($target_type){
            $sql.=" and w.target_type='{$target_type}'";
        }
        $rows=\Yii::$app->db->createCommand($sql)->queryAll();

        foreach ($rows as $row){
            $map[$row['plan_id']][]=$row;
        }
        return $map;
    }

    public static function exportWordExample()
    {
        $data = [
            '奶油蛋糕',
            '水果蛋糕',
            '巧克力蛋糕',
            '蛋糕',
            'cake',
            '芝士蛋糕',
            '乳酪蛋糕',
            '慕斯蛋糕',
            '布朗尼蛋糕',
            '维也纳巧克力杏仁蛋糕',
            '提拉米苏蛋糕',
            '黑森林蛋糕',
        ];
        return static::iconv(implode("\r\n",$data));
    }

    /**
     * 查询计划的媒体定向(如果全部则返回[])
     * [ { "bundle_id": ".dddemo00.SDKdemo", "media_name": "oppo-dddemo00", "slots":[{slot_id:'uid1','slot_name':'name1'}]  //广告位 } ]
     * @return array
     */
    public static function queryMediaTarget($planId)
    {
        //            $sql1 = "SELECT
//                      m.bundle_id,
//                      m.`uid`  AS media_id,
//                      t2.`name` AS media_name
//                    FROM
//                      `ad_plan` AS p
//                      INNER JOIN `media` AS m ON p.id = {$id} AND FIND_IN_SET(m.bundle_id, p.media_target) > 0
//                      JOIN user u ON p.create_user = u.uid
//                      LEFT JOIN resource r ON r.uid = u.uid AND ((r.uid IS NULL) OR (r.platform_role = 'alliance' AND m.bundle_id = r.id))
//                      JOIN ( -- 媒体名称取最近创建的
//                        SELECT *
//                        FROM (SELECT m.uid,m.bundle_id,m.name FROM media m join user u on u.uid=m.medium and u.pause='0'  order by m.bundle_id asc,m.create_time asc) t1
//                        GROUP BY bundle_id ) t2 on t2.bundle_id=m.bundle_id
//                    GROUP BY m.bundle_id
//                ";

        $sql1 = "SELECT
  m.bundle_id,
  t2.`name` AS media_name,
  s.uid as slot_id,
  s.name as slot_name
FROM
  `ad_plan` AS p
  INNER JOIN `media` AS m ON p.id = '$planId' AND FIND_IN_SET(m.bundle_id, p.media_target) > 0
  JOIN user u ON p.create_user = u.uid
  LEFT JOIN resource r ON r.uid = u.uid AND ((r.uid IS NULL) OR (r.platform_role = 'alliance' AND m.bundle_id = r.id))
  JOIN (-- 媒体名称取最早创建的
         SELECT *
         FROM (SELECT
                 m.uid,
                 m.bundle_id,
                 m.name
               FROM media m
                 JOIN user u ON u.uid = m.medium AND u.pause = '0'
               ORDER BY m.bundle_id ASC, m.create_time ASC) t1
         GROUP BY bundle_id) t2 ON t2.bundle_id = m.bundle_id
  LEFT JOIN slot_target st on  st.plan_id=p.id
  LEFT JOIN slot s  on  st.slot_id=s.uid and s.media=m.uid
GROUP BY m.bundle_id,st.slot_id";
        $rows = MediaModel::queryList($sql1);
        $slotMap=[];
        foreach ($rows as $row){
            if (!isset($slotMap[$row['bundle_id']])){
                $slotMap[$row['bundle_id']]=[
                    'bundle_id'=>$row['bundle_id'],
                    'media_name'=>$row['media_name'],
                    'slots'=>[]
                ];
            }
            if ($row['slot_id']){
                $slotMap[$row['bundle_id']]['slots'][]=['slot_id'=>$row['slot_id'],'slot_name'=>$row['slot_name']];
            }
        }
        return array_values($slotMap);
    }

}