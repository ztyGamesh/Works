<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/28
 * Time: 18:28
 */

namespace Application\Model;

use Application\Table\ChargeTable;

class ChargeModel
{
    public static function factory()
    {
        return new self();
    }

    /**
     * 返回所有充值数据
     * @return array
     */
    public function ChargeList($params)
    {
        $condition = new ConditionCombineModel();

        //如果是广告主账户则只看到自己相关的充值数据
        if (UserModel::factory()->IsClientRole()) {
            $uid = UserModel::factory()->getCurrentUid();
            $condition->AndCondition($uid, "l.`client` = '{$uid}'");
        }

        $condition->AndCondition($params['search'], "c.`name` LIKE '{$params['search']}%'");
        $where_condition = $condition->Condition();
        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                l.`client`,
                l.`charge_money`,
                FROM_UNIXTIME(l.`create_time`) AS `create_time`,
                u.`name`,
                c.`name` AS corporation_name
                FROM `charge_log` AS l INNER JOIN `user` AS u ON u.`uid` = l.`client` AND u.`role` = 'client'
                LEFT JOIN `corporation` AS c ON c.`id` = u.`corporation_id`
                WHERE 1 {$where_condition}
                {$order_condition}
                ";

        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    /**
     * 获取所有广告主账户信息
     */
    public function GetClientList()
    {
        return ChargeTable::factory()->queryList("SELECT  
                                                    u.uid,
                                                    u.`name`,
                                                    c.`id` AS corporation_id,
                                                    c.`name` AS corporation_name
                                                    FROM `user` AS u INNER JOIN `corporation` AS c
                                                    ON u.`corporation_id` = c.`id` AND u.`role` = 'client'");
    }

    /**
     * 保存充值
     * @param $params
     */
    public function Save($params)
    {
        $data = ChargeTable::factory()->IntersectKey($params);
        $user = UserModel::factory()->getCurrentUid();

        if (!isset($data['client']))
            throw new \Exception('广告主有误！');

        if (!isset($data['charge_money']) or $data['charge_money'] <= 0)
            throw new \Exception('充值金额有误！');

        $data['create_user'] = $user;
        $data['create_time'] = time();

        ChargeTable::factory()->insert($data);
        return ChargeTable::factory()->getLastInsertValue();
    }
}