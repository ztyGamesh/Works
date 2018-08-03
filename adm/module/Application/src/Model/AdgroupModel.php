<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:46
 */

namespace Application\Model;

use Application\Table\AdgroupTable;

class AdgroupModel
{
    public static function factory()
    {
        return new self();
    }

    public function CheckAdgroupRepeat($name,$id = null)
    {
        if (!$name)
            return false;

        $uid = UserModel::factory()->getCurrentUid();
        if ($id != null)
            $exists = AdgroupTable::factory()->queryRow("SELECT
                                            1
                                            FROM `corporation` AS c,
                                            `ad_group` AS g,
                                            `user` AS u
                                            WHERE
                                            c.`id` = u.`corporation_id` 
                                            AND g.`create_user` = u.`uid`
                                            AND g.id != {$id}
                                            AND g.`name` = '{$name}'
                                            AND g.`create_user` = '{$uid}'");
        else
            $exists = AdgroupTable::factory()->queryRow("SELECT
                                            1
                                            FROM `corporation` AS c,
                                            `ad_group` AS g,
                                            `user` AS u
                                            WHERE
                                            c.`id` = u.`corporation_id` 
                                            AND g.`create_user` = u.`uid`
                                            AND g.`name` = '{$name}'
                                            AND g.`create_user` = '{$uid}'");
        return $exists ? true : false;
    }

    /**
     * 保存
     * @param $params
     */
    public function Save($params)
    {
        $data = AdgroupTable::factory()->IntersectKey($params);

        if (empty($data['name'])) {
            throw new \Exception('请填写必填信息。');
        }

//        if($data['budget'] < 50 or $data['budget'] > 1000000000)
//            throw new \Exception('日预算必须在50 到 1000000000之间！');

        $user = UserModel::factory()->getCurrentUid();

        //目前的强制设定
        $data['budget_type'] = 'daily_budget';
        $data['edit_user'] = $user;
        $data['edit_time'] = time();

        if (isset($data['id']) && !empty($data['id'])) {
            if ($this->CheckAdgroupRepeat($data['name'], $data['id']))
                throw new \Exception('广告组名称重复！');
            AdgroupTable::factory()->update($data, array('id' => $data['id']));
            return $data['id'];
        } else {
            if ($this->CheckAdgroupRepeat($data['name'],null))
                throw new \Exception('广告组名称重复！');

            $data['status'] = 'active';
            $data['create_user'] = $user;
            $data['create_time'] = time();

            AdgroupTable::factory()->insert($data);
            return AdgroupTable::factory()->getLastInsertValue();
        }
    }

    public function fetchOne($id)
    {
        return AdgroupTable::factory()->getRow(['id'=>$id]);
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
        $where = "g.create_user = '{$user_id}'";

        if (isset($params['status']) and !empty($params['status']))
            $where .= " AND g.`status` = '{$params['status']}'";
        if (isset($params['purpose']) and !empty($params['purpose']))
            $where .= " AND g.`purpose` = '{$params['purpose']}'";
        if (isset($params['search']) and !empty($params['search']))
            $where .= " AND g.`name` LIKE  '{$params['search']}%'";

        $limit = " LIMIT {$params['offset']},{$params['limit']}";

        $sql = "SELECT 
                g.id,
                g.`name`,
                g.`status`,
                g.`purpose`,
                g.`budget_type`,
                g.`budget`,
                SUM(r.`imp`) AS imp,
                SUM(r.`clk`) AS clk,
                round(SUM(r.`clk`) / SUM(r.`imp`),4) AS ctr,
                round(SUM(r.`income`),2) AS spend_budget
                FROM
                `ad_group` AS g LEFT JOIN 
                `ad_creative` AS c ON c.`group_id` = g.`id`  LEFT JOIN
                `reports_alliance_hourly` AS r ON c.`id` = r.`creative_id` 
                AND r.`date` >= '{$params['begin']}' 
                AND r.`date` < '{$params['end']}' 
                WHERE {$where}" . " GROUP BY g.`id` " . $limit;

        $data = AdgroupTable::factory()->queryList($sql);
        $total = AdgroupTable::factory()->queryRow("
                SELECT 
                COUNT(*) as `total`
                FROM
                `ad_group` AS g 
                WHERE {$where}");

        return ['rows' => $data, 'total' => $total['total']];
    }

    /**
     * 更新广告组状态
     * @param $ids
     * @param $status
     * @return bool
     * @throws \Exception
     */
    public function updateStatus($ids, $status)
    {
        if (!$status or !$ids)
            throw new \Exception('参数错误！');

        AdgroupTable::factory()->execute("UPDATE `ad_group`
                                        SET `status` = '{$status}'
                                        WHERE id IN ({$ids})");
        return true;
    }
}