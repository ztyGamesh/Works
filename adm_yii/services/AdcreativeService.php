<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace app\services;

use app\models\AdcreativeAuditModel;
use app\models\AdcreativeModel;
use app\models\AdgroupModel;
use app\models\TemplateModel;
use app\services\custom\ArrayHandle;
use app\services\custom\ConditionCombineModel;
use yii\base\InvalidParamException;

class AdcreativeService
{
    private static $instance = null;

    public static function add_url_suffix($url)
    {
        if ($url) {
            preg_match("/^(dp-)?(http:\/\/|https:\/\/)?(.+)/i", $url, $arr);
            return $arr[2] . $arr[3];
        }
        return $url;
    }

    private static function ReplaceTemplate($base_template, $setting)
    {
        if (!$setting)
            return $setting;

        $search_sign =
            [
                '[:LINK:]',

                '[:FILE:]',
                '[:FILE1:]',
                '[:FILE2:]',
                '[:FILE3:]',

                '[:VIDEO:]',
                //'[:SCALE:]',

                '[:TITLE:]',
                '[:DES:]',

                '[:AD_SOURCE:]',
                '[:EXTEND_TYPE:]',
                '[:EXTEND_TITLE:]',
                '[:BUTTON_TEXT:]',
                '[:EXTEND_URL:]',
                '[:PHONE_NUMBER:]'
            ];

        $replace_val[] = isset($setting['link']) ? self::add_url_suffix($setting['link']) : '';

        $replace_val[] = isset($setting['material']['pic']) ? $setting['material']['pic'] : '';
        $replace_val[] = isset($setting['material']['pic1']) ? $setting['material']['pic1'] : '';
        $replace_val[] = isset($setting['material']['pic2']) ? $setting['material']['pic2'] : '';
        $replace_val[] = isset($setting['material']['pic3']) ? $setting['material']['pic3'] : '';

        $replace_val[] = isset($setting['material']['video']) ? $setting['material']['video'] : '';
        //$replace_val[] = isset($setting['material']['pic_scale']) ? $setting['material']['pic_scale'] : '';
        $replace_val[] = isset($setting['material']['title']) ? $setting['material']['title'] : '';
        $replace_val[] = isset($setting['material']['description']) ? $setting['material']['description'] : '';

        //附加创意
        $replace_val[] = isset($setting['ad_source']) ? $setting['ad_source'] : '';
        $replace_val[] = isset($setting['extend_type']) ? $setting['extend_type'] : '';
        $replace_val[] = isset($setting['extend_data']['title']) ? $setting['extend_data']['title'] : '';
        $replace_val[] = isset($setting['extend_data']['button_text']) ? $setting['extend_data']['button_text'] : '';
        $replace_val[] = isset($setting['extend_data']['extend_url']) ? $setting['extend_data']['extend_url'] : '';
        $replace_val[] = isset($setting['extend_data']['phone_number']) ? $setting['extend_data']['phone_number'] : '';

        return str_replace($search_sign, $replace_val, $base_template);
    }

    // update.xlx.2017.6.26 创意名称广告组内不重复即可
    public static function CheckAdcreativeRepeat($name, $group_id, $id = null)
    {
        if (!$name)
            throw new \Exception('创意名称不能为空');

        $sql = "
            SELECT c.name
            FROM ad_group g
              JOIN ad_creative c ON c.group_id = g.id  and c.status!='delete' AND g.id ='{$group_id}'";
        if ($id) {
            $sql .= " where c.id!={$id}";
        }
        $names = AdgroupModel::queryList($sql);
        $names = ArrayHandle::FetchMultipleArrayLeafWithKey($names, 'name');
        return in_array($name, $names);
    }

    private static function find_child($array, $pid = null, $queryDate = null)
    {
        $final = [];
        $queryTime = strtotime($queryDate);

        foreach ($array as $item) {
            $new_item = [];
            if ($item['pid'] == $pid) {
                if ($item['status'] === 'delete') {
//                    $delete_time = (int)$item['delete_time'];
//                    if($delete_time <= $queryTime){
//                        continue;
//                    }
                    $new_item['name'] = $item['name'] . '(已删除)';
                } else {
                    $new_item['name'] = $item['name'];
                }
                $new_item['id'] = $item['id'];
                $new_item['child'] = self::find_child($array, $item['id'], $queryDate);
                $final[] = $new_item;
            }
        }
        return $final;
    }

    public static function useradstruct($params = [])
    {
        if (!isset($params['query_date'])) {
            $params['query_date'] = date('Y-m-d');
        }
        $user_id = UserService::getCurrentUid();
        $sql = "SELECT
                  CONCAT('p', plan_id) AS `pid`,
                  CONCAT('c', `id`)    AS id,
                  `name`,
                  status,
                  delete_time
                FROM
                  `ad_creative`
                WHERE create_user = '{$user_id}'
                UNION ALL
                SELECT
                  CONCAT('g', `group_id`) AS `pid`,
                  CONCAT('p', `id`)       AS id,
                  `name`,
                  status,
                  delete_time
                FROM
                  `ad_plan`
                WHERE id IN (SELECT plan_id
                             FROM `ad_creative`
                             WHERE create_user = '{$user_id}')
                UNION ALL
                SELECT
                  NULL              AS `pid`,
                  CONCAT('g', `id`) AS id,
                  `name`,
                  status,
                  delete_time
                FROM
                  `ad_group`
                WHERE id IN (SELECT group_id
                             FROM `ad_creative`
                             WHERE create_user = '{$user_id}')";
        $data = AdcreativeModel::queryList($sql);

        $data = self::find_child($data, NULL, $params['query_date']);
        array_walk_recursive($data, function (&$val, $key) {
            if ($key == 'id')
                $val = ltrim($val, 'pcg');
        });
        return $data;
    }

    public static function useradstructbytemplate($params)
    {
        if (!isset($params['template_class']))
            throw new \Exception('parameter wrong!');

        if (!isset($params['query_date'])) {
            $params['query_date'] = date('Y-m-d');
        }
        $template_class = explode(",", $params['template_class']);
        $template_class = "'" . implode("','", $template_class) . "'";

        $user_id = UserService::getCurrentUid();
        $sql = "SELECT 
                                                        CONCAT('p',plan_id) AS `pid`,
                                                        CONCAT('c',`id`) as id,
                                                        `name`,
                                                        status,
                                                        delete_time
                                                        FROM 
                                                        `ad_creative`
                                                        WHERE create_user = '{$user_id}' AND `template_class` IN ({$template_class})
                                                        UNION ALL
                                                        SELECT 
                                                        CONCAT('g',`group_id`) AS `pid`,
                                                        CONCAT('p',`id`) AS id,
                                                        `name`,
                                                         status,
                                                        delete_time
                                                        FROM 
                                                        `ad_plan` 
                                                        WHERE id IN (SELECT plan_id FROM `ad_creative`  WHERE create_user = '{$user_id}')
                                                        UNION ALL
                                                        SELECT
                                                        NULL AS `pid`,
                                                        CONCAT('g',`id`) AS id,
                                                        `name`,
                                                         status,
                                                        delete_time
                                                        FROM 
                                                        `ad_group` WHERE id IN (SELECT group_id FROM `ad_creative`  WHERE create_user = '{$user_id}')";
        $data = AdcreativeModel::queryList($sql);

        $data = self::find_child($data, NULL, $params['query_date']);
        array_walk_recursive($data, function (&$val, $key) {
            if ($key == 'id')
                $val = ltrim($val, 'pcg');
        });
        return $data;
    }

    public static function fetchAdcreativeByTemplate($params)
    {
        if (!isset($params['template_class']))
            throw new \Exception('parameter wrong!');

        if (!isset($params['query_date'])) {
            $params['query_date'] = date('Y-m-d');
        }
        $template_class = explode(",", $params['template_class']);
        $template_class = "'" . implode("','", $template_class) . "'";
        $user_id = UserService::getCurrentUid();
        $data = AdcreativeModel::queryList("SELECT 
                                                       `id`,
                                                       `name`,
                                                       `template_class` AS pid 
                                                       FROM
                                                       `ad_creative` 
                                                       WHERE create_user = '{$user_id}' AND `template_class` IN ({$template_class})
                                                       UNION ALL 
                                                       SELECT 
                                                       uid AS id ,  
                                                       `name`,
                                                       NULL AS pid
                                                       FROM
                                                       `template` 
                                                       WHERE `uid` IN ({$template_class})
                                                        ");

        $data = self::find_child($data, NULL, $params['query_date']);
        return $data;
    }

    public static function fetchPlanIDByCreativeId($ids)
    {
        if (!$ids)
            throw new \Exception('parameter wrong!');

        $ids = ArrayHandle::SplitByComma($ids);

        $ids = AdcreativeModel::queryList("
        SELECT plan_id FROM ad_creative WHERE id IN ({$ids})
        ");
        return ArrayHandle::FetchMultipleArrayLeaf($ids);
    }

    /**
     * 保存
     * @param $params
     */
    public static function Save($params)
    {
        $data = AdcreativeModel::IntersectKey($params);
        $user = UserService::getCurrentUid();
        $template = TemplateModel::getRow(['uid' => $data['template_class']]);

        if (!$template)
            throw new \Exception('模板错误！');

        $code = self::ReplaceTemplate($template['code'], $data);

        //目前的强制设定
        $data['code'] = $code;
        array_walk($data['material'],function(&$v){
            if (is_string($v)){
                $v=addslashes($v);
            }
        });
        $data['material'] = json_encode($data['material']);
        $data['extend_data'] = isset($data['extend_data']) ? json_encode($data['extend_data'], JSON_FORCE_OBJECT) : '{}';
        $data['edit_user'] = $user;
        $data['edit_time'] = time();

        if (isset($params['creative_id']))
            $data['creative_id'] = $params['creative_id'];

        if (isset($data['creative_id']) && !empty($data['creative_id'])) {
            if (self::CheckAdcreativeRepeat($data['name'], $data['group_id'], $data['creative_id']))
                throw new \Exception('创意名称重复！');

            $creative = AdcreativeAuditService::GetLatestAuditCreative($data['creative_id']);

            if (!$creative)
                throw new \Exception('查询创意失败，更新失败！');

            $columns = [
                'name',
                'material',
                'link',
                'deep_link',
                'landing',
                'monitoring_url',
                'ad_source',
                'extend_type',
                'extend_data',
                'bundle_id',
            ];

            //是否修改过创意内容
            $is_equal = ArrayHandle::CompareArrayContent($data, $creative, $columns);
            if ($is_equal)
                throw new \Exception('创意未修改！');

            //进入审核创意表
            $data['audit_status'] = 'audit';
            $data['status'] = $creative['status'];
            $data['create_user'] = $creative['create_user'];
            $data['create_time'] = $creative['create_time'];
            unset($data['id']);

            //提交新的创意审核
            AdcreativeAuditService::SubmitAuditCreative($data);
            //这个创意已有的第三方审核都要重审！
            AdcreativeAuditOtherService::ModifyCreativeToWait($data['creative_id']);
            $creative_data['edit_user'] = $user;
            $creative_data['audit_status'] = 'audit';
            $creative_data['bundle_id'] = $data['bundle_id'];
            $creative_data['edit_time'] = time();
            $creative_data['name'] = $data['name'];

            //更新下创意的编辑人和编辑时间 其他数据不更新
            AdcreativeModel::updateAll($creative_data, array('id' => $data['creative_id']));

            return $data['creative_id'];
        } else {
            if (self::CheckAdcreativeRepeat($data['name'], $data['group_id'], null))
                throw new \Exception('创意名称重复！');

            $data['status'] = 'active';
            $data['audit_status'] = 'audit';
            $data['create_user'] = $user;
            $data['create_time'] = time();
            AdcreativeModel::insertOne($data);
            $data['creative_id'] = AdcreativeModel::getLastInsertValue();

            AdcreativeAuditService::SubmitAuditCreative($data);
            AdcreativeAuditOtherService::PushNewCreative($data['creative_id']);

            return $data['creative_id'];
        }
    }

    /**
     * 提取一条创意,标签的一二级三级数据
     * @param $id
     */
    public static function fetchOne($id)
    {
        $sql = "SELECT 
                    c.*,
                    c.`creative_id` AS id,
                    t.level1 as level1_name,
                    t.level2 as level2_name,
                    t.level3 as level3_name,
                    t.code as tag_code,
                    tmp.template_class,
                    tmp.slot_class
                FROM `ad_creative_audit` AS c
                LEFT JOIN tag t on c.tag_code=t.code and t.status=0 -- 过滤被删除的标签
                LEFT JOIN (SELECT c.id,c.`template_class`,t.slot_class FROM `ad_creative` c JOIN template t on t.uid=c.template_class WHERE id = {$id}) as tmp
                   ON tmp.id=c.creative_id
                WHERE c.id = (SELECT MAX(id) FROM `ad_creative_audit` WHERE `creative_id` = {$id})";
        $row = AdcreativeAuditModel::queryRow($sql);
        self::generateCreativeTags($row);
        return $row;
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
        $where = "c.create_user = '{$user_id}' and g.status!='delete' and p.status!='delete' and c.status!='delete' ";

        if (isset($params['status']) and !empty($params['status']))
            $where .= " AND c.`status` = '{$params['status']}'";
        if (isset($params['search']) and strlen($params['search'] = trim($params['search'])) > 0)
            $where .= " AND c.`name` like  '%{$params['search']}%'";
        if (isset($params['plan_id']) and !empty($params['plan_id']))
            $where .= " AND c.`plan_id` =  '{$params['plan_id']}'";

        $plan_group_name = AdcreativeModel::queryRow("SELECT 
                                                                g.`id` AS group_id,
                                                                g.`name` AS group_name,
                                                                p.`id` AS plan_id,
                                                                p.`name` AS plan_name
                                                                FROM
                                                                `ad_group` AS g INNER JOIN `ad_plan` AS p
                                                                ON g.id = p.`group_id`
                                                                WHERE p.`id` = '{$params['plan_id']}'");

        $limit = " LIMIT {$params['offset']},{$params['limit']}";

        $sql = "SELECT 
                g.id AS goup_id,
                g.name AS goup_name,
                p.id AS plan_id,
                p.name AS plan_name,
                c.creative_id AS id,
                c.name,
                c.`status`,
                c.`audit_status`,
                c.`code`,
                c.`ad_source`,
                c.`extend_type`,
                c.`extend_data`,
                c.material,
                c.link,
                c.deep_link,
                SUM(r.`imp`) AS imp,
                SUM(r.`clk`) AS clk,
                round(SUM(r.`clk`) / SUM(r.`imp`),4) AS ctr,
                round(SUM(r.income),2) AS spend_budget,
                CASE c.`audit_status`
                WHEN 'reject' THEN c.`comment`
                ELSE '' END AS comment
                FROM 
                `ad_group` as g INNER JOIN 
                `ad_plan` as p ON g.id = p.group_id INNER JOIN
                `ad_creative_audit` AS c ON p.id = c.plan_id AND c.`id` IN (SELECT MAX(id) FROM `ad_creative_audit` GROUP BY `creative_id`) 
                JOIN ad_creative adc on adc.id=c.creative_id
                LEFT JOIN `reports_alliance_hourly` AS r ON c.`creative_id` = r.`creative_id`           
                AND r.`date` >= '{$params['begin']}' 
                AND r.`date` < '{$params['end']}' 
                WHERE {$where}
                GROUP BY c.`creative_id`  ORDER BY adc.create_time desc,c.name asc
                {$limit}";

        $data = AdcreativeModel::queryList($sql);

        //json字段处理
        array_walk_recursive($data, function (&$val, $key) {
            if ($key == 'extend_data' || $key == 'material') {
                $val = json_decode($val, true);
            }
        });
        //创意对应的媒体审核列表
        foreach ($data as &$row) {
//            $auditList=AdcreativeAuditOtherService::getAuditList(['ids'=>$row['id']]);
//            $row['audit_others']=$auditList['rows'];
            $row['audit_others'] = AdcreativeAuditOtherService::CreativeAuditStatusForClient($row['id']);
            $row['usable'] = AdcreativeService::usable($row['id'])[$row['id']];
        }

        $total = AdcreativeModel::queryRow("
                SELECT 
                COUNT(DISTINCT c.creative_id) as `total`
                FROM 
                `ad_group` as g INNER JOIN 
                `ad_plan` as p ON g.id = p.group_id INNER JOIN
                `ad_creative_audit` AS c ON p.id = c.plan_id 
                WHERE {$where}");
//        exit(json_encode($data));
        return
            [
                'rows' => $data,
                'total' => $total['total'],
                'group_id' => isset($plan_group_name['group_id']) ? $plan_group_name['group_id'] : '',
                'group_name' => isset($plan_group_name['group_name']) ? $plan_group_name['group_name'] : '',
                'plan_id' => isset($plan_group_name['plan_id']) ? $plan_group_name['plan_id'] : '',
                'plan_name' => isset($plan_group_name['plan_name']) ? $plan_group_name['plan_name'] : '',
            ];
    }

    public static function getAuditList($params)
    {
        $params['limit'] = $params['limit'] ? $params['limit'] : 10;
        $params['offset'] = $params['offset'] ? $params['offset'] : 0;
        $condition = new ConditionCombineModel();
        $whereCond = new ConditionCombineModel();
        $params['search'] = ArrayHandle::SplitByComma($params['search']);

//        $condition->AndCondition($params['audit_status'], "c.`audit_status` = '{$params['audit_status']}'");
        $condition->AndCondition($params['search'], "c.`name` like '{$params['search']}%'");
//        $condition->AndCondition($params['other_audit_status'], "oca.`audit_status` = '{$params['other_audit_status']}'");
//        $condition->AndCondition($params['medium'], "oca.`uid` = '{$params['medium']}'");
//
//        $other_condition = new ConditionCombineModel();
//
//        $other_condition->AndCondition($params['medium'], "oc.`uid` = '{$params['medium']}'");
//        //$other_condition->AndCondition($params['ids'], "oc.`creative_id` IN ({$params['ids']})");
//
//        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");
//
//        $sql =
//            "SELECT
//            c.`creative_id` AS id,
//            c.`code`,
//            c.`audit_status`,
//            (SELECT `audit_status` FROM `ad_creative_audit_other` as oc WHERE oc.`creative_id` = c.`creative_id` {$other_condition->Condition()}) AS `other_audit_status`,
//            (SELECT `comment` FROM `ad_creative_audit_other` as oc WHERE oc.`creative_id` = c.`creative_id` {$other_condition->Condition()}) AS `other_comment`,
//            c.`name` as creative_name,
//            u.`name`,
//            g.`name` AS group_name,
//            p.`name` AS plan_name,
//            GROUP_CONCAT(w.`word`) AS key_words,
//            FROM_UNIXTIME(c.`edit_time`,'%Y-%m-%d %H:%i:%s') AS commit_time,
//            c.`comment`
//            FROM
//            `ad_creative_audit` AS c, `user` AS u,ad_group AS g,`ad_plan` AS p,
//            `ad_plan_word` AS pw,`dic_adm_word` AS w,`ad_creative_audit_other` AS oca
//            WHERE
//            c.`create_user` = u.`uid`
//            AND g.`id` = c.`group_id`
//            AND p.`id` = c.`plan_id`
//            AND pw.`plan_id` = p.`id`
//            AND w.`id` = pw.`word_id`
//            AND oca.`creative_id` = c.`creative_id`
//            AND c.`id` = (SELECT MAX(`id`) FROM `ad_creative_audit` WHERE `creative_id` = c.`creative_id`)
//            {$condition->Condition()}
//            GROUP BY c.`creative_id`
//            {$order_condition}";

        if (!empty($params['other_audit_status'])) {#adx
            $whereCond->AndCondition($params['medium'], "ao.uid='{$params['medium']}'");
            $whereCond->AndCondition($params['other_audit_status'], "ao.audit_status='{$params['other_audit_status']}'");
//            WHERE  ao.uid='{$params['medium']}' and  ao.audit_status='{$params['other_audit_status']}' {$condition->Condition()}

            $sql = "SELECT DISTINCT c.id,a.code,a.audit_status,ifnull(ao.audit_status,'-') as other_audit_status,
                  ifnull(ao.comment,'-') as other_comment,c.name as creative_name,u.name,g.name as group_name,p.name as plan_name,
                  '' as key_words,
                  FROM_UNIXTIME(c.`edit_time`, '%Y-%m-%d %H:%i:%s')         AS commit_time,ifnull(a.comment,'') as comment,
                  concat(t.level1,';',t.level2,';',t.level3) as tag
                  FROM ad_creative_audit_other ao
                  left join ad_creative_audit a on  a.creative_id=ao.creative_id and a.id in(SELECT max(a1.id)  FROM ad_creative_audit_other ao1 JOIN ad_creative_audit a1 on a1.creative_id=ao1.creative_id WHERE ao1.uid = '{$params['medium']}' AND ao1.audit_status = '{$params['other_audit_status']}' GROUP BY a1.creative_id)
                  JOIN ad_creative c on c.id=a.creative_id
                  JOIN ad_group g on c.group_id=g.id
                  JOIN ad_plan p on p.id=c.plan_id and c.status!='delete' and p.status!='delete' and g.status!='delete'
                  JOIN user u on u.uid=c.create_user
                  LEFT JOIN tag t on t.code=a.tag_code and t.status=0
                  WHERE  ao.uid='{$params['medium']}'
                   and  a.`id` = (SELECT MAX(`id`) FROM `ad_creative_audit` WHERE `creative_id` = a.`creative_id`)
                   and  ao.audit_status='{$params['other_audit_status']}'
                    {$condition->Condition()}
                ORDER BY commit_time {$params['order']}";
        } else {#dl
            $condition->AndCondition($params['audit_status'], "a.audit_status='{$params['audit_status']}'");
            $str = "SELECT DISTINCT c.id,a.code,a.audit_status,ifnull(ao.audit_status,'-') as other_audit_status,
              ifnull(ao.comment,'-') as other_comment,c.name as creative_name,u.name,g.name as group_name,p.name as plan_name,
              '' as key_words,
              FROM_UNIXTIME(c.`edit_time`, '%Y-%m-%d %H:%i:%s')         AS commit_time,ifnull(a.comment,'') as comment,
              concat(t.level1,';',t.level2,';',t.level3) as tag
              FROM  ad_creative_audit a
              left join ad_creative_audit_other ao on  a.creative_id=ao.creative_id and ao.uid='{$params['medium']}'
              JOIN ad_creative c on c.id=a.creative_id
              JOIN ad_group g on c.group_id=g.id
              JOIN ad_plan p on p.id=c.plan_id and c.status!='delete' and p.status!='delete' and g.status!='delete'
              JOIN user u on u.uid=c.create_user
              LEFT JOIN tag t on t.code=a.tag_code and t.status=0 and c.status!='delete' and p.status!='delete' and g.status!='delete'
              ";

            $sql = "{$str}  where 1 and c.status!='delete'  and  a.`id` = (SELECT MAX(`id`) FROM `ad_creative_audit` WHERE `creative_id` = a.`creative_id`)  {$condition->Condition()}  ORDER BY commit_time  {$params['order']}";
        }
        return BaseService::Paging($sql, $params['limit'], $params['offset']);
    }

    public static function updateStatus($ids, $status)
    {
        if (!$status or !$ids)
            throw new \Exception('参数错误！');

        if ($status === 'delete') {
            AdcreativeModel::execute("UPDATE ad_creative SET status ='{$status}',delete_time=unix_timestamp(),edit_time=unix_timestamp() WHERE id in ($ids)");
        } else {
            AdcreativeModel::execute("UPDATE ad_creative SET status ='{$status}',edit_time=unix_timestamp() WHERE id in ($ids)");
        }
        AdcreativeAuditModel::execute("UPDATE ad_creative_audit SET status ='{$status}',edit_time=unix_timestamp() WHERE creative_id in ($ids)");
        return true;
    }

    /**
     * 根据创意的标签,生成1，2，3级标签数据
     * @param $row 创意数据
     */
    public static function generateCreativeTags(&$row)
    {
        if (empty($row['tag_code'])) {
            return;
        }
        $len = strlen($row['tag_code']);
        $row['level1'] = substr($row['tag_code'], 0, $len - 4) . '0000';
        $row['level2'] = substr($row['tag_code'], 0, $len - 2) . '00';
        $row['level3'] = $row['tag_code'];
    }

    //更新内审状态
    public static function updateAuditStatus($params)
    {
        $id = $params['ids'];
        $status = $params['audit_status'];
        $comment = $params['comment'];
        $tagCode = $params['tag'];
        if (!$status || !$id) {
            throw new \Exception('参数错误！');
        }
        $ids = ArrayHandle::SplitByComma($id);
        $userId = UserService::getCurrentUid();
        $time = time();
        //更新不需要审核的媒体审核状态
        if ($status == 'pass') {
            if (empty($tagCode)) {
                throw new \Exception('标签编码错误！');
            }
            $sql = "
            UPDATE `ad_creative` AS o INNER JOIN
            (
            SELECT * FROM `ad_creative_audit` WHERE id IN (SELECT MAX(id) FROM `ad_creative_audit` WHERE creative_id IN ({$ids}) GROUP BY creative_id)
            )AS n
            ON o.id = n.creative_id
            INNER JOIN ad_creative_audit AS n1
            ON n1.id=n.id
            SET 
            o.`name` = n.`name`,
            o.`audit_status` = 'pass',
            o.`code` = n.`code`,
            o.`landing` = n.`landing`,
            o.`link` = n.`link`,
            o.`deep_link` = n.`deep_link`,
            o.`material` = n.`material`,
            o.`monitoring_url` = n.`monitoring_url`,
            o.`ad_source` = n.`ad_source`,
            o.`extend_type` = n.`extend_type`,
            o.`extend_data` = n.`extend_data`,            
            o.`status` = n.`status`,
            o.tag_code='{$tagCode}',
            o.edit_time = {$time},
            n1.`audit_status` = 'pass',
            n1.edit_user = '{$userId}',
            n1.edit_time = {$time},
            n1.`comment` = '{$comment}',
            n1.tag_code='{$tagCode}'
            ";
            AdcreativeModel::execute($sql);
//  创意创建后就处于待审核状态
//            $plan_ids = AdcreativeModel::factory()->fetchPlanIDByCreativeId($ids);
//            array_walk($plan_ids, function ($val) {
//                //审核通过则推送第三方审核
//                AdcreativeAuditOtherModel::factory()->PushCreativeToOthersWait($val);
//            });
            //不需要外审的则自动化通过
            AdcreativeAuditOtherService::AutoPassCreatives($ids);
        }
        if ($status == 'reject') {
            AdcreativeModel::execute("
            UPDATE `ad_creative` AS o INNER JOIN
            (
            SELECT * FROM `ad_creative_audit` WHERE id IN (SELECT MAX(id) FROM `ad_creative_audit` WHERE creative_id IN ({$ids}) GROUP BY creative_id)
            )AS n
            ON o.id = n.creative_id
            INNER JOIN ad_creative_audit AS n1
            ON n1.id=n.id
            SET 
            o.`name` = n.`name`,
            o.`audit_status` = 'reject',
            o.edit_time={$time},
            n1.`audit_status` = 'reject',
            n1.edit_user = '{$userId}',
            n1.edit_time = {$time},
            n1.`comment` = '{$comment}'");
        }
        return true;
    }

    /**
     * 批量更细物料(标题、描述)
     * @param $material array
     * @param $idArr array
     */
    public static function updateMaterial(array &$material, array $idArr)
    {
        if (empty($idArr)) {
            throw new \Exception('invalid parameter:empty ids');
        }
        $title = isset($material['title']) ? trim($material['title']) : '';
        $desc = isset($material['description']) ? trim($material['description']) : '';
        if (empty($title) && empty($desc)) {
            return 0;
        }
        $ids = implode(',', $idArr);
        $sql = "select id,material from ad_creative WHERE id in($ids)";
        $rows = \Yii::$app->db->createCommand($sql)->queryAll();
        $affected = 0;
        foreach ($rows as $row) {
            $oldMaterial = json_decode($row['material'], true);
            $id = $row['id'];
            $update = false;
            if ($title && isset($oldMaterial['title'])) {//只有原来的物料上有title才设置title
                if($oldMaterial['title'] !== $title){
                    $oldMaterial['title'] = $title;
                    $update = true;
                }
            }
            if ($desc && isset($oldMaterial['description'])) {//只有原来的物料上有title才设置title
                if($oldMaterial['description'] !== $desc){
                    $oldMaterial['description'] = $desc;
                    $update = true;
                }
            }
            if ($update) {
                array_walk($oldMaterial,function(&$val){
                    $val=addslashes($val);
                });
                $newMaterial = json_encode($oldMaterial, JSON_UNESCAPED_UNICODE);
                $sql = "update ad_creative set material='$newMaterial',audit_status='audit',edit_time=unix_timestamp() where id ={$id}";
                $sql2 = "
update ad_creative_audit a JOIN 
(SELECT max(id) as cid FROM ad_creative_audit WHERE creative_id ={$id} GROUP BY creative_id) t1 on a.id=t1.cid
set material='$newMaterial',audit_status='audit'";
                $sqlAuditOther="UPDATE ad_creative_audit_other ao set ao.audit_status='wait' WHERE ao.creative_id='$id'";
                \Yii::$app->db->createCommand($sqlAuditOther)->execute();
                \Yii::$app->db->createCommand($sql)->execute();
                $affected += \Yii::$app->db->createCommand($sql2)->execute();
            }
        }
        return $affected;

    }

    /**
     * 批量更新url(落地页url、第三方曝光url、第三方点击url)【为空则不修改】
     * @param $ids string 创意id字符串 1,4,5
     * @param $url array [link 'url地址', landing '第三方点击监测地址', monitoring_url '第三方曝光监测地址']
     */
    public static function updateUrl($ids, $url)
    {
        if (empty($ids) || empty($url)) {
            throw new \Exception("invalid paramter:ids or url empty");
        }
        $setClause = '';
        $keys = ['link', 'landing', 'monitoring_url'];
        foreach ($url as $k => $v) {
            $v = trim($v);
            if (!empty($v) && in_array($k, $keys)) {
                $setClause .= " $k='{$v}',";
            }
        }
        if (!empty($setClause)) {
            $setClause = rtrim($setClause, ',');
            $sql1 = "UPDATE ad_creative set {$setClause},audit_status='audit',edit_time=unix_timestamp() WHERE id in($ids)";
            $sql2 = "
update ad_creative_audit a JOIN 
(SELECT max(id) as cid FROM ad_creative_audit WHERE creative_id IN ($ids) GROUP BY creative_id) t1 on a.id=t1.cid
set {$setClause},audit_status='audit'";
            $sqlAuditOther="UPDATE ad_creative_audit_other ao set ao.audit_status='wait' WHERE ao.creative_id in ($ids)";
            \Yii::$app->db->createCommand($sqlAuditOther)->execute();
            \Yii::$app->db->createCommand($sql1)->execute();
            return \Yii::$app->db->createCommand($sql2)->execute();
        }
        return 0;
    }

    /**
     * 修改创意名称
     * @param $name
     * @param $id
     */
    public static function updateName($name, $id)
    {
        if (empty($name) || empty($id)) {
            throw new \Exception("invalid parameter:id/name empty");
        }
        $sql1 = " update ad_creative set name='{$name}',edit_time=unix_timestamp() WHERE id =$id ";
        $sql2 = "
update ad_creative_audit a JOIN 
(SELECT max(id) as cid FROM ad_creative_audit WHERE creative_id =$id GROUP BY creative_id) t1 on a.id=t1.cid
set  name='{$name}'";
        \Yii::$app->db->createCommand($sql1)->execute();
        return \Yii::$app->db->createCommand($sql2)->execute();
    }

    /**
     * 批量复制创意
     * @param $pidArr array 计划id数组
     * @param $cidArr array 创意id数组
     * @return array 新生成的创意id
     */
    public static function batchCopy($pidArr, $cidArr)
    {

        if (empty($pidArr) || empty($cidArr)) {
            throw new \Exception('invalid parameter:cid or pid empty');
        }
        $pidStr = implode(',', $pidArr);
        $rows = \Yii::$app->db->createCommand("SELECT id, group_id FROM ad_plan WHERE id in($pidStr)")->queryAll();
        $pidGroups = [];
        foreach ($rows as $row) {
            $pidGroups[$row['id']] = $row['group_id'];
        }
        $ids = [];
        foreach ($pidArr as $pid) {
            $gid = isset($pidGroups[$pid]) ? $pidGroups[$pid] : null;
            if (empty($gid)) {
                //无效的计划id
                continue;
            }
            foreach ($cidArr as $cid) {
                $ids[] = self::copy($cid, $pid, $gid);
            }
        }
        $idStr=implode(',',$ids);
        \Yii::$app->db->createCommand("UPDATE ad_creative set edit_time=unix_timestamp() WHERE id in({$idStr})")->execute();
        return $ids;

    }

    /**
     * 把创意id=$cid复制到计划(id=$pid)下面
     * @param $pid
     * @param $cid
     * @param $gid int 组id
     * @return int 新生成的创意id
     */
    public static function copy($cid, $pid, $gid)
    {
        if (!is_numeric($cid) || !is_numeric($pid) || !is_numeric($gid)) {
            throw new \Exception('invalid parameter:cid/pid/gid not int');
        }
        $timeStamp = microtime(true);
        $currentUserId=UserService::getCurrentUid();

        $sql1 = "
insert into ad_creative (group_id, plan_id, name, bundle_id, status, audit_status, template_class, code, material, tag_code, link, deep_link,landing, monitoring_url, ad_source, extend_type, extend_data, monitoring_format, comment, create_time, create_user, edit_time, edit_user)
  select $gid, $pid, concat(name,'-(复制)',{$timeStamp}), bundle_id, status, audit_status, template_class, code, material, tag_code, link, deep_link,landing, monitoring_url, ad_source, extend_type, extend_data, monitoring_format, comment, unix_timestamp(), create_user, unix_timestamp(), '$currentUserId'
  from ad_creative WHERE id=$cid";
        \Yii::$app->db->createCommand($sql1)->execute();
        $newId = \Yii::$app->db->getLastInsertID();

        $sql2 = "INSERT into ad_creative_audit (group_id, plan_id, creative_id, name, bundle_id, status, audit_status, code, material, tag_code, link,deep_link, landing, monitoring_url, ad_source, extend_type, extend_data, comment, create_time, create_user, edit_time, edit_user)
  SELECT $gid, $pid, $newId, concat(name,'-(复制)',{$timeStamp}), bundle_id, status, audit_status, code, material, tag_code, link,deep_link, landing, monitoring_url, ad_source, extend_type, extend_data, comment, unix_timestamp(), create_user, unix_timestamp(), '$currentUserId'
  FROM (
    SELECT a.* from ad_creative_audit a JOIN (
    SELECT max(id) as id from ad_creative_audit a WHERE a.creative_id =$cid
    ) t1 on a.id=t1.id
       ) as t";

        $sql3 = "insert into ad_creative_audit_other (uid, creative_id, audit_status, comment, edit_time, edit_user)
  SELECT uid, $newId, audit_status, comment, unix_timestamp(), '$currentUserId' from ad_creative_audit_other WHERE creative_id=$cid";

        \Yii::$app->db->createCommand($sql2)->execute();
        \Yii::$app->db->createCommand($sql3)->execute();
        return $newId;
    }

    /**
     * @param string $ids
     * @return array
     */
    public static function usable($ids = '')
    {
        if(empty($ids)){
            throw new InvalidParamException('ids 不能为空');
        }
        $idArr = explode(',', $ids);
        $res = [];
        foreach ($idArr as $id) {
            $res[$id] = 0;//不可用
        }
        $sql = "SELECT c.id,c.template_class,c.material,p.media_target,group_concat(r.id) as bundle_ids
FROM ad_creative c
  JOIN ad_plan p on c.plan_id=p.id
  LEFT JOIN resource r on c.create_user=r.uid and r.type='bundle_id' and r.platform_role='alliance'
WHERE c.id IN ($ids)
GROUP BY c.id ";
        $db = \Yii::$app->db;
        $rows = $db->createCommand($sql)->queryAll();

        foreach ($rows as $row) {
            $cid = $row['id'];
            $template_class = $row['template_class'];
            $bundle_ids = $row['bundle_ids'];
            $mediaTarget = $row['media_target'];
            $material = json_decode($row['material'], true);
            if (false === $material) {
                $res[$cid] = 0;
                continue;
            }
            $sql1 = "
select st.setting from media m
  JOIN user u on m.medium=u.uid
  JOIN slot s on s.media=m.uid
  JOIN slot_template st on st.slot=s.uid
WHERE u.pause=0 and m.status='active' and s.status='active' and st.status='active'
and st.template_class='{$template_class}'";
            if (empty($bundle_ids) && empty($mediaTarget)) {
                //通投
            } else {
                $bundleIds = empty($mediaTarget) ? $bundle_ids : $mediaTarget;
                $sql1 .= " and find_in_set(m.bundle_id,'{$bundleIds}')>0";
            }
            $settings = $db->createCommand($sql1)->queryColumn();
            if (isset($material['pic_scale'])) {//目前只限制图片尺寸
                foreach ($settings as $setting) {
                    $setting = json_decode($setting, true);
                    if (isset($setting['pic_setting']['scale'])) {
                        if($setting['pic_setting']['scale'] == $material['pic_scale']
                            || in_array($material['pic_scale'],$setting['pic_setting']['scale'])){
                            $res[$cid] = 1;
                            continue;
                        }
                    }
                }
            } else {
                $res[$cid] = 1;
            }
        }

        return $res;
    }

    //3_2,1_1  3*2,1*1
    public static function recommendSize($template)
    {
        if (empty($template)) {
            throw  new \Exception('invalid parameter:empty template');
        }
        $sql = "SELECT size,scale from template_rec_size WHERE template_id='{$template}'";
        $rows = \Yii::$app->db->createCommand($sql)->queryAll();
        $res = [];
        foreach ($rows as $row) {
            $res[$row['scale']][] = $row['size'];
        }
        return $res;
    }
}