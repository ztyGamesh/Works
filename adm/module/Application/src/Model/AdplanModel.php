<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace Application\Model;

use Application\Table\AdcreativeTable;
use Application\Table\AdgroupTable;
use Application\Table\AdplanTable;
use Application\Table\MediaTable;

use Application\Table\TagTable;
use Custom\ArrayHandle;

class AdplanModel
{
    public static function factory()
    {
        return new self();
    }

    public function CheckAdplanRepeat($name, $id = null, $group_id)
    {
        if (!$name)
            return false;

        $uid = UserModel::factory()->getCurrentUid();
        if ($id)
            $exists = AdplanTable::factory()->queryRow("SELECT 
                                                        1
                                                        FROM `ad_plan` AS p
                                                        WHERE p.`group_id` = {$group_id} AND p.`id` != {$id} AND p.`name` = '{$name}'
                                                        AND p.`create_user` = '{$uid}'");
        else
            $exists = AdplanTable::factory()->queryRow("SELECT 
                                                        1
                                                        FROM `ad_plan` AS p
                                                        WHERE p.`group_id` = {$group_id} AND p.`name` = '{$name}'
                                                        AND p.`create_user` = '{$uid}'");
        return $exists ? true : false;
    }

    /**
     * 提取用户权限的媒体定向列表
     * + bundle_id去重去null去空字符串
     * @return array [['media_name'=>'a','bundle_id'=>']]
     */
    public function FetchUserMediaTarget()
    {
        $uid = UserModel::factory()->getCurrentUid();
        /*$sql = "SELECT
                  m.`uid` AS media_id,
                  m.`bundle_id` AS bundle_id,
                  m.`name` AS media_name
                FROM
                  `user` AS u
                  INNER JOIN `resource` AS r
                    ON u.`uid` = r.`uid`
                    AND r.`type` = 'media'
                    AND r.`platform_role` = 'alliance'
                    AND u.`role` = 'client'
                  INNER JOIN `media` AS m
                    ON m.`uid` = r.`id`
                    WHERE u.uid = '{$uid}'
                    and m.bundle_id is not null and trim(m.bundle_id)!=''
                    ";*/
        $sql = "SELECT r.id as bundle_id from resource r  WHERE  r.uid='$uid' and r.type='bundle_id' AND r.`platform_role` = 'alliance' and r.id!='' ";
        $bundleids = MediaTable::factory()->queryList($sql);
        //用户没有媒体定向,返回所有的媒体
        if(empty($bundleids)){
            $data=MediaModel::factory()->getMediaBundleid();
            return $data;
        }
        $bids = [];
        $bidstring = '';
        foreach ($bundleids as $bundleid) {
            $bids[] = $bid = $bundleid['bundle_id'];
            $bidstring .= "'$bid',";
        }
        $bidstring = trim($bidstring, ',');
        $sql = "SELECT m.name media_name,m.bundle_id from media m WHERE m.bundle_id in({$bidstring}) GROUP BY m.bundle_id";
        $media = MediaTable::factory()->queryList($sql);
        return $media;
    }

    /**
     * 获取计划下的媒体定向 返回bundle_ids [[bundle_id=>xx],[bundle_id=>xx2]]
     */
    public function FetchPlanMediaTarget($params)
    {
        if (!isset($params['plan_id'])) {
            return ['error' => '缺少参数plan_id'];
        }
        $plan_id = $params['plan_id'];
        $media_target = MediaTable::factory()->queryRow("select media_target  from ad_plan WHERE id='$plan_id'");
        $ret = [];
        if (isset($media_target['media_target'])) {
            $bundle_ids = explode(',', $media_target['media_target']);
            foreach ($bundle_ids as $bundle_id) {
                $ret[] = ['bundle_id' => $bundle_id];
            }
        }
        return $ret;
    }

    public function fetchOne($id)
    {
        $plan_data = AdplanTable::factory()->getRow(['id' => $id]);
        if ($plan_data) {
            //媒体定向查询
            /* $medias = MediaTable::factory()->queryList(
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
            $medias = MediaTable::factory()->queryList(
                "SELECT 
                      m.bundle_id,
                      m.`uid`  AS media_id,
                      t2.`name` AS media_name
                    FROM
                      `ad_plan` AS p
                      INNER JOIN `media` AS m ON p.id = 7 AND FIND_IN_SET(m.bundle_id, p.media_target) > 0
                      JOIN user u ON p.create_user = u.uid
                      LEFT JOIN resource r ON r.uid = u.uid AND ((r.uid IS NULL) OR (r.platform_role = 'alliance' AND m.bundle_id = r.id))
                      JOIN ( -- 媒体名称取最近创建的
                        SELECT *
                        FROM (SELECT m.uid,m.bundle_id,m.name FROM media m join user u on u.uid=m.medium and u.pause='0'  order by m.bundle_id asc,m.create_time asc) t1
                        GROUP BY bundle_id ) t2 on t2.bundle_id=m.bundle_id
                    GROUP BY m.bundle_id
                ");

            //为空代表全部，有可能是个坑
            $plan_data['media_target'] = $medias;
            //日期整形
            $plan_data['s'] = date('Y-m-d', $plan_data['s']);
            $plan_data['e'] = date('Y-m-d', $plan_data['e']);
            //关键词
            $word = WordModel::factory()->FetchPlanWord($id);
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
            if($plan_data['tag_target']){
                // 过滤删除的标签
                $sql = "select code from tag where find_in_set(code,'{$plan_data['tag_target']}')>0 and status=0";
                $tagTargets=TagTable::factory()->queryList($sql);
                $tags=[];
                foreach ($tagTargets as $tagTarget){
                    $len=strlen($tagTarget['code']);
                    $tag['level1'] = substr($tagTarget['code'], 0, $len-4) . '0000';
                    if ($tagTarget['code']%10000 != 0){
                        $tag['level2'] = substr($tagTarget['code'], 0, $len-2) . '00';
                    }
                    $tags[]=$tag;
                }
                $plan_data['tag_target']=$tags;
            }
        }
        return $plan_data;
    }

    /**
     * 保存
     * @param $params
     */
    public function Save($params)
    {
        $data = AdplanTable::factory()->IntersectKey($params);
        $user_id = UserModel::factory()->getCurrentUid();

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
        $data['frequency'] = json_encode($data['frequency']);

        //计划没有媒体定向则定向到当前信息流形式下面的所有媒体 => 全选则为空''
//        if (empty($data['media_target'])){
//            $rows= MediaModel::factory()->getUserMediaListBySlotClass($data['class']);
//            $ids=ArrayHandle::FetchMultipleArrayLeafWithKey($rows,'bundle_id');
//            $data['media_target']=implode(',',$ids);
//        }

        if (isset($data['id']) && !empty($data['id'])) {
            if ($this->CheckAdplanRepeat($params['name'], $data['id'], $data['group_id']))
                throw new \Exception('广告计划重名！');

            AdplanTable::factory()->update($data, array('id' => $data['id']));

            //计划被修改时调用创意审核推送
            AdcreativeAuditOtherModel::factory()->PushCreativeToOthersWait($data['id']);
            $creatives = AdcreativeTable::factory()->getList(['plan_id' => $data['id']]);
            if($creatives) {
                $ids = ArrayHandle::FetchMultipleArrayLeafWithKey($creatives, "id");
                //不需要它审的直接自动化审核通过
                AdcreativeAuditOtherModel::factory()->AutoPassCreatives($ids);
            }

            return $data['id'];
        } else {
            if ($this->CheckAdplanRepeat($params['name'], null, $data['group_id']))
                throw new \Exception('广告计划重名！');

            $data['status'] = 'active';
            $data['create_user'] = $user_id;
            $data['create_time'] = time();

            AdplanTable::factory()->insert($data);
            return AdplanTable::factory()->getLastInsertValue();
        }
    }

    /**
     * 查询接口
     * @param $params
     */
    public function getList($params)
    {
        $params['begin'] = !$params['begin'] ? date('Ymd') : date('Ymd', strtotime($params['begin']));
        $params['end'] = !$params['end'] ? date('Ymd', strtotime('+1 day')) : date('Ymd', strtotime($params['end']) + 86400);

        $user_id = UserModel::factory()->getCurrentUid();
        $where = "p.create_user = '{$user_id}'";

        if (isset($params['status']) and !empty($params['status']))
            $where .= " AND p.`status` = '{$params['status']}'";
        if (isset($params['search']) and !empty($params['search']))
            $where .= " AND p.`name` LIKE  '{$params['search']}%'";
        if (isset($params['group_id']) and !empty($params['group_id']))
            $where .= " AND p.`group_id` = '{$params['group_id']}'";

        $group_name = AdgroupTable::factory()->getRow(['id' => isset($params['group_id']) ? $params['group_id'] : '']);

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
                GROUP BY p.`id` 
                {$limit}";

        $data = AdplanTable::factory()->queryList($sql);
        $total = AdplanTable::factory()->queryRow("
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

    public function updateStatus($ids, $status)
    {
        if (!$status or !$ids)
            throw new \Exception('参数错误！');

        AdplanTable::factory()->execute("UPDATE `ad_plan`
                                        SET `status` = '{$status}'
                                        WHERE id IN ({$ids})");
        return true;
    }

    /**
     * 获取adx账户一计划下的广告位模板设置
     * @param $planId
     */
    public function fetchplantemplatesSetting($planId)
    {
        $row = AdplanTable::factory()->queryRow("SELECT p.media_target FROM  ad_plan p WHERE p.id='{$planId}'");
        $data=[];
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
        }
        else{//没有媒体定向则返回所有adx的模板
            $sql="SELECT setting,template_class,t.name as template_name FROM medium_template mt join template t on mt.template_class=t.uid";
        }
        $data = AdplanTable::factory()->queryList($sql);
        return $data;
    }

    /**
     * check whether plan ad format is fixed feeds
     * @param $planId
     */
    public function isPlanFixedFeeds($planId){
        $sql="SELECT uid FROM slot_class sl JOIN ad_plan p on p.class=sl.uid WHERE sl.name='固定信息流' and p.id='{$planId}'";
        $row = AdplanTable::factory()->queryRow($sql);
        return !empty($row);
    }

    public function isCreativeFixedFeeds($cid){
        $sql="SELECT sl.uid FROM slot_class sl JOIN ad_plan p on p.class=sl.uid join ad_creative c on c.plan_id=p.id
WHERE sl.name='固定信息流' and c.id='{$cid}'";
        $row = AdplanTable::factory()->queryRow($sql);
        $isFixed=empty($row)?false:true;
        return ['isFixed'=>$isFixed];
    }

}