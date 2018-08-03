<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace Application\Model;


use Application\Table\AdcreativeAuditTable;
use Application\Table\AdcreativeTable;
use Application\Table\AdgroupTable;
use Application\Table\TemplateTable;
use Custom\ArrayHandle;

class AdcreativeModel
{
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

    public function add_url_suffix($url)
    {
        if ($url) {
            preg_match("/^(dp-)?(http:\/\/|https:\/\/)?(.+)/i", $url, $arr);
            return $arr[2] . $arr[3];
        }
        return $url;
    }

    private function ReplaceTemplate($base_template, $setting)
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

        $replace_val[] = isset($setting['link']) ? $this->add_url_suffix($setting['link']) : '';

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
    public function CheckAdcreativeRepeat($name, $group_id, $id = null)
    {
        if (!$name)
            throw new \Exception('Parameter Wrong!');

        $sql = "
            SELECT c.name
            FROM ad_group g
              JOIN ad_creative c ON c.group_id = g.id AND g.id ='{$group_id}'";
        if ($id){
            $sql.=" where c.id!={$id}";
        }
        $names = AdgroupTable::factory()->queryList($sql);
        $names = ArrayHandle::FetchMultipleArrayLeafWithKey($names, 'name');
        return in_array($name, $names);
    }

    private function find_child($array, $pid = null)
    {
        $final = [];
        foreach ($array as $item) {
            $new_item = [];
            if ($item['pid'] == $pid) {
                $new_item['id'] = $item['id'];
                $new_item['name'] = $item['name'];
                $new_item['child'] = $this->find_child($array, $item['id']);
                $final[] = $new_item;
            }
        }
        return $final;
    }

    public function useradstruct()
    {
        $user_id = UserModel::factory()->getCurrentUid();
        $data = AdcreativeTable::factory()->queryList("SELECT 
                                                        CONCAT('p',plan_id) AS `pid`,
                                                        CONCAT('c',`id`) as id,
                                                        `name`
                                                        FROM 
                                                        `ad_creative`
                                                        WHERE create_user = '{$user_id}'
                                                        UNION ALL
                                                        SELECT 
                                                        CONCAT('g',`group_id`) AS `pid`,
                                                        CONCAT('p',`id`) AS id,
                                                        `name`
                                                        FROM 
                                                        `ad_plan` 
                                                        WHERE id IN (SELECT plan_id FROM `ad_creative`  WHERE create_user = '{$user_id}')
                                                        UNION ALL
                                                        SELECT
                                                        NULL AS `pid`,
                                                        CONCAT('g',`id`) AS id,
                                                        `name`
                                                        FROM 
                                                        `ad_group` WHERE id IN (SELECT group_id FROM `ad_creative`  WHERE create_user = '{$user_id}')");

        $data = $this->find_child($data, NULL);
        array_walk_recursive($data, function (&$val, $key) {
            if ($key == 'id')
                $val = ltrim($val, 'pcg');
        });
        return $data;
    }

    public function useradstructbytemplate($params)
    {
        if (!isset($params['template_class']))
            throw new \Exception('parameter wrong!');

        $template_class = explode(",", $params['template_class']);
        $template_class = "'" . implode("','", $template_class) . "'";

        $user_id = UserModel::factory()->getCurrentUid();
        $data = AdcreativeTable::factory()->queryList("SELECT 
                                                        CONCAT('p',plan_id) AS `pid`,
                                                        CONCAT('c',`id`) as id,
                                                        `name`
                                                        FROM 
                                                        `ad_creative`
                                                        WHERE create_user = '{$user_id}' AND `template_class` IN ({$template_class})
                                                        UNION ALL
                                                        SELECT 
                                                        CONCAT('g',`group_id`) AS `pid`,
                                                        CONCAT('p',`id`) AS id,
                                                        `name`
                                                        FROM 
                                                        `ad_plan` 
                                                        WHERE id IN (SELECT plan_id FROM `ad_creative`  WHERE create_user = '{$user_id}')
                                                        UNION ALL
                                                        SELECT
                                                        NULL AS `pid`,
                                                        CONCAT('g',`id`) AS id,
                                                        `name`
                                                        FROM 
                                                        `ad_group` WHERE id IN (SELECT group_id FROM `ad_creative`  WHERE create_user = '{$user_id}')");

        $data = $this->find_child($data, NULL);
        array_walk_recursive($data, function (&$val, $key) {
            if ($key == 'id')
                $val = ltrim($val, 'pcg');
        });
        return $data;
    }

    public function fetchAdcreativeByTemplate($params)
    {
        if (!isset($params['template_class']))
            throw new \Exception('parameter wrong!');

        $template_class = explode(",", $params['template_class']);
        $template_class = "'" . implode("','", $template_class) . "'";
        $user_id = UserModel::factory()->getCurrentUid();
        $data = AdcreativeTable::factory()->queryList("SELECT 
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

        $data = $this->find_child($data, NULL);
        return $data;
    }

    public function fetchPlanIDByCreativeId($ids)
    {
        if (!$ids)
            throw new \Exception('parameter wrong!');

        $ids = ArrayHandle::SplitByComma($ids);

        $ids = AdcreativeTable::factory()->queryList("
        SELECT plan_id FROM ad_creative WHERE id IN ({$ids})
        ");
        return ArrayHandle::FetchMultipleArrayLeaf($ids);
    }

    /**
     * 保存
     * @param $params
     */
    public function Save($params)
    {
        $data = AdcreativeTable::factory()->IntersectKey($params);
        $user = UserModel::factory()->getCurrentUid();
        $template = TemplateTable::factory()->getRow(['uid' => $data['template_class']]);

        if (!$template)
            throw new \Exception('模板错误！');

        $code = $this->ReplaceTemplate($template['code'], $data);

        //目前的强制设定
        $data['code'] = $code;
        $data['material'] = json_encode($data['material']);
        $data['extend_data'] = isset($data['extend_data']) ? json_encode($data['extend_data'],JSON_FORCE_OBJECT) : '{}';
        $data['edit_user'] = $user;
        $data['edit_time'] = time();

        if (isset($params['creative_id']))
            $data['creative_id'] = $params['creative_id'];

        if (isset($data['creative_id']) && !empty($data['creative_id'])) {
            if ($this->CheckAdcreativeRepeat($data['name'], $data['group_id'], $data['creative_id']))
                throw new \Exception('创意名称重复！');

            $creative = AdcreativeAuditModel::factory()->GetLatestAuditCreative($data['creative_id']);

            if (!$creative)
                throw new \Exception('查询创意失败，更新失败！');

            $columns = [
                'name',
                'material',
                'link',
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
            AdcreativeAuditModel::factory()->SubmitAuditCreative($data);
            //这个创意已有的第三方审核都要重审！
            AdcreativeAuditOtherModel::factory()->ModifyCreativeToWait($data['creative_id']);
            $creative_data['edit_user'] = $user;
            $creative_data['bundle_id'] = $data['bundle_id'];
            $creative_data['edit_time'] = time();
            $creative_data['name'] = $data['name'];

            //更新下创意的编辑人和编辑时间 其他数据不更新
            AdcreativeTable::factory()->update($creative_data, array('id' => $data['creative_id']));

            return $data['creative_id'];
        } else {
            if ($this->CheckAdcreativeRepeat($data['name'], $data['group_id'], null))
                throw new \Exception('创意名称重复！');

            $data['status'] = 'active';
            $data['audit_status'] = 'audit';
            $data['create_user'] = $user;
            $data['create_time'] = time();
            AdcreativeTable::factory()->insert($data);
            $data['creative_id'] = AdcreativeTable::factory()->getLastInsertValue();

            AdcreativeAuditModel::factory()->SubmitAuditCreative($data);
            AdcreativeAuditOtherModel::factory()->PushNewCreative($data['creative_id']);

            return $data['creative_id'];
        }
    }

    /**
     * 提取一条创意,标签的一二级三级数据
     * @param $id
     */
    public function fetchOne($id)
    {
        $sql = "SELECT 
                    c.*,
                    c.`creative_id` AS id,
                    t.level1 as level1_name,
                    t.level2 as level2_name,
                    t.level3 as level3_name,
                    t.code as tag_code,
                    (SELECT `template_class` FROM `ad_creative` WHERE id = {$id}) AS `template_class`
                FROM `ad_creative_audit` AS c
                LEFT JOIN tag t on c.tag_code=t.code and t.status=0 -- 过滤被删除的标签
                WHERE c.id = (SELECT MAX(id) FROM `ad_creative_audit` WHERE `creative_id` = {$id})";
        $row = AdcreativeAuditTable::factory()->queryRow($sql);
        $this->generateCreativeTags($row);
        return $row;
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
        $where = "c.create_user = '{$user_id}'";

        if (isset($params['status']) and !empty($params['status']))
            $where .= " AND c.`status` = '{$params['status']}'";
        if (isset($params['search']) and !empty($params['search']))
            $where .= " AND c.`name` =  {$params['search']}";
        if (isset($params['plan_id']) and !empty($params['plan_id']))
            $where .= " AND c.`plan_id` =  {$params['plan_id']}";

        $plan_group_name = AdcreativeTable::factory()->queryRow("SELECT 
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
                `ad_creative_audit` AS c ON p.id = c.plan_id AND c.`id` IN (SELECT MAX(id) FROM `ad_creative_audit` GROUP BY `creative_id`) LEFT JOIN 
                `reports_alliance_hourly` AS r ON c.`creative_id` = r.`creative_id`           
                AND r.`date` >= '{$params['begin']}' 
                AND r.`date` < '{$params['end']}' 
                WHERE {$where}
                GROUP BY c.`creative_id` 
                {$limit}";

        $data = AdcreativeTable::factory()->queryList($sql);

        //json字段处理
        array_walk_recursive($data, function (&$val, $key) {
            if ($key == 'extend_data')
                $val = json_decode($val, true);
        });
        $model=AdcreativeAuditOtherModel::factory();
        foreach ($data as &$row){
            $auditList=$model->getAuditList(['ids'=>$row['id']]);
            $row['audit_others']=$auditList['rows'];
        }

        $total = AdcreativeTable::factory()->queryRow("
                SELECT 
                COUNT(DISTINCT c.creative_id) as `total`
                FROM 
                `ad_group` as g INNER JOIN 
                `ad_plan` as p ON g.id = p.group_id INNER JOIN
                `ad_creative_audit` AS c ON p.id = c.plan_id 
                WHERE {$where}");

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

    public function getAuditList($params)
    {
        $params['limit'] = $params['limit'] ? $params['limit'] : 10;
        $params['offset'] = $params['offset'] ? $params['offset'] : 0;
        $condition = new ConditionCombineModel();
        $whereCond=new ConditionCombineModel();
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

        if (!empty($params['other_audit_status'])){#adx
            $whereCond->AndCondition($params['medium'],"ao.uid='{$params['medium']}'");
            $whereCond->AndCondition($params['other_audit_status'],"ao.audit_status='{$params['other_audit_status']}'");
//            WHERE  ao.uid='{$params['medium']}' and  ao.audit_status='{$params['other_audit_status']}' {$condition->Condition()}

            $sql="SELECT DISTINCT c.id,a.code,a.audit_status,ifnull(ao.audit_status,'-') as other_audit_status,
                  ifnull(ao.comment,'-') as other_comment,c.name as creative_name,u.name,g.name as group_name,p.name as plan_name,
                  '' as key_words,
                  FROM_UNIXTIME(c.`edit_time`, '%Y-%m-%d %H:%i:%s')         AS commit_time,ifnull(a.comment,'') as comment,
                  concat(t.level1,';',t.level2,';',t.level3) as tag
                  FROM ad_creative_audit_other ao
                  left join ad_creative_audit a on  a.creative_id=ao.creative_id and a.id in(SELECT max(a1.id)  FROM ad_creative_audit_other ao1 JOIN ad_creative_audit a1 on a1.creative_id=ao1.creative_id WHERE ao1.uid = '{$params['medium']}' AND ao1.audit_status = '{$params['other_audit_status']}' GROUP BY a1.creative_id)
                  JOIN ad_creative c on c.id=a.creative_id
                  JOIN ad_group g on c.group_id=g.id
                  JOIN ad_plan p on p.id=c.plan_id
                  JOIN user u on u.uid=c.create_user
                  LEFT JOIN tag t on t.code=a.tag_code and t.status=0
                  WHERE  ao.uid='{$params['medium']}'
                   and  a.`id` = (SELECT MAX(`id`) FROM `ad_creative_audit` WHERE `creative_id` = a.`creative_id`)
                   and  ao.audit_status='{$params['other_audit_status']}'
                    {$condition->Condition()}
                ORDER BY commit_time {$params['order']}";
        }else{#dl
            $condition->AndCondition($params['audit_status'],"a.audit_status='{$params['audit_status']}'");
            $str = "SELECT DISTINCT c.id,a.code,a.audit_status,ifnull(ao.audit_status,'-') as other_audit_status,
              ifnull(ao.comment,'-') as other_comment,c.name as creative_name,u.name,g.name as group_name,p.name as plan_name,
              '' as key_words,
              FROM_UNIXTIME(c.`edit_time`, '%Y-%m-%d %H:%i:%s')         AS commit_time,ifnull(a.comment,'') as comment,
              concat(t.level1,';',t.level2,';',t.level3) as tag
              FROM  ad_creative_audit a
              left join ad_creative_audit_other ao on  a.creative_id=ao.creative_id and ao.uid='{$params['medium']}'
              JOIN ad_creative c on c.id=a.creative_id
              JOIN ad_group g on c.group_id=g.id
              JOIN ad_plan p on p.id=c.plan_id
              JOIN user u on u.uid=c.create_user
              LEFT JOIN tag t on t.code=a.tag_code and t.status=0
              ";

            $sql= "{$str}  where 1 and  a.`id` = (SELECT MAX(`id`) FROM `ad_creative_audit` WHERE `creative_id` = a.`creative_id`)  {$condition->Condition()}  ORDER BY commit_time  {$params['order']}";
        }
        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    public function updateStatus($ids, $status)
    {
        if (!$status or !$ids)
            throw new \Exception('参数错误！');

        AdcreativeAuditTable::factory()->execute("
        UPDATE 
        (SELECT 
        MAX(id) AS id
        FROM
        `ad_creative_audit` 
        WHERE creative_id IN ({$ids}) 
        GROUP BY creative_id) AS n 
        INNER JOIN ad_creative_audit AS n1 
        ON n1.id = n.id 
        SET n1.`status` ='{$status}'");

        AdcreativeTable::factory()->execute("
        UPDATE 
        ad_creative AS c 
        INNER JOIN 
        (SELECT * FROM ad_creative_audit WHERE `audit_status` = 'pass' AND id IN (SELECT MAX(id) FROM ad_creative_audit GROUP BY creative_id)) AS n
        ON c.id = n.creative_id AND c.id IN ({$ids}) 
        SET c.`status` = n.`status`
        ");

        return true;
    }

    /**
     * 根据创意的标签,生成1，2，3级标签数据
     * @param $row 创意数据
     */
    public function generateCreativeTags(&$row)
    {
        if (empty($row['tag_code'])) {
            return;
        }
        $len=strlen($row['tag_code']);
        $row['level1'] = substr($row['tag_code'], 0, $len-4) . '0000';
        $row['level2'] = substr($row['tag_code'], 0, $len-2) . '00';
        $row['level3'] = $row['tag_code'];
    }

    /**
     * 更新不需要审核的媒体的创意
     * @param $creative_ids 45,34,67
     */
    private function updateAuditStatusForCreative($creative_ids,$audit_status){
        $sql="SELECT ao.id
            FROM ad_creative_audit_other ao
            JOIN medium mm on mm.uid=ao.uid and mm.audit_type='self'
            WHERE ao.creative_id in ({$creative_ids})";
       $rows= AdcreativeTable::factory()->queryList($sql);
       if (!empty($rows)){
           $ids = ArrayHandle::SplitByComma($rows);
           $sql1 = "UPDATE ad_creative_audit_other set audit_status='{$audit_status}' WHERE  id in ($ids)";
           AdcreativeTable::factory()->execute($sql1);
       }
    }
    //更新内审状态
    public function updateAuditStatus($params)
    {
        $id=$params['ids'];
        $status=$params['audit_status'];
        $comment=$params['comment'];
        $tagCode=$params['tag'];
        if (!$status || !$id ){
            throw new \Exception('参数错误！');
        }
        $ids = ArrayHandle::SplitByComma($id);
        $userId = UserModel::factory()->getCurrentUid();
        $time = time();
        //更新不需要审核的媒体审核状态
        if ($status == 'pass') {
            if (empty($tagCode)){
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
            o.`material` = n.`material`,
            o.`monitoring_url` = n.`monitoring_url`,
            o.`ad_source` = n.`ad_source`,
            o.`extend_type` = n.`extend_type`,
            o.`extend_data` = n.`extend_data`,            
            o.`status` = n.`status`,
            o.tag_code='{$tagCode}',
            n1.`audit_status` = 'pass',
            n1.edit_user = '{$userId}',
            n1.edit_time = {$time},
            n1.`comment` = '{$comment}',
            n1.tag_code='{$tagCode}'
            ";
            AdcreativeTable::factory()->execute($sql);
//  创意创建后就处于待审核状态
//            $plan_ids = AdcreativeModel::factory()->fetchPlanIDByCreativeId($ids);
//            array_walk($plan_ids, function ($val) {
//                //审核通过则推送第三方审核
//                AdcreativeAuditOtherModel::factory()->PushCreativeToOthersWait($val);
//            });
            //不需要外审的则自动化通过
            AdcreativeAuditOtherModel::factory()->AutoPassCreatives($ids);
        }
        if ($status == 'reject') {
            AdcreativeTable::factory()->execute("
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
            n1.`audit_status` = 'reject',
            n1.edit_user = '{$userId}',
            n1.edit_time = {$time},
            n1.`comment` = '{$comment}'");
        }
        return true;
    }
}