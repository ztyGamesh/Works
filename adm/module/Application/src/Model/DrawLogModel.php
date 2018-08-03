<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/31
 * Time: 20:00
 */
namespace Application\Model;

use Application\Table\DrawLogTable;
use Application\Table\MediumTable;
use Application\Table\UserTable;

class DrawLogModel
{
    public static function factory()
    {
        return new self();
    }

    /**
     * 提现列表
     * @param $params
     */
    public function getlist($params)
    {
        $condition = new ConditionCombineModel();

        $condition->AndCondition($params['status'], "d.`status` = '{$params['status']}'");

        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "
                SELECT 
                d.`id`,
                u.`name`,
                c.`name` AS corporation_name,
                u.`mail`,
                DATE_FORMAT(FROM_UNIXTIME(d.`create_time`),'%Y-%m-%d') as `create_time`,
                d.`status`,
                d.`pay_time`,
                d.`amount`,
                d.`comment`
                FROM `draw_log` AS d INNER JOIN `user` AS u
                ON d.`uid` = u.`uid`
                LEFT JOIN `corporation` AS c
                ON c.`id` = u.`corporation_id`
                WHERE 1
                {$condition->Condition()}
                {$order_condition}
                ";

        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    public function getmediadrawlist($params)
    {
        $condition = new ConditionCombineModel();
        $uid = UserModel::factory()->getCurrentUid();

        $condition->AndCondition($uid, "d.`uid` = '{$uid}'");

        $sql = "
                SELECT 
                d.`id`,
                DATE_FORMAT(FROM_UNIXTIME(d.`create_time`),'%Y-%m-%d %H:%i:%S') as `create_time`,
                d.`status`,
                d.`link_name`,
                d.`amount`
                FROM `draw_log` AS d
                WHERE 1
                {$condition->Condition()}
                ORDER BY d.`create_time` DESC
                ";

        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    public function drawdetail($params)
    {
        if (!isset($params['id'])) {
            throw new \Exception('parameter id should be given!');
        }

        $condition = new ConditionCombineModel();
        $condition->AndCondition($params['id'], "d.`id` = '{$params['id']}'");

        $sql = "
                SELECT 
                u.`name`,
                c.`name` AS corporation_name,
                u.`mail`,
                u.`link_name`,
                u.`tel`,                
                f.`bank`,
                f.`bank_account`,
                f.`account_name`,
                f.`attach`,                
                d.`amount`,
                d.`pay_time`,
                d.`comment`,
                d.status
                FROM `draw_log` AS d INNER JOIN `user` AS u
                ON d.`uid` = u.`uid`
                LEFT JOIN `corporation` AS c
                ON c.`id` = u.`corporation_id`
                LEFT JOIN `medium` AS f
                ON u.`uid` = f.`uid`
                WHERE 1
                {$condition->Condition()}
                ";

        $data = DrawLogTable::factory()->queryRow($sql);
        isset($data['attach']) ? ($data['attach'] = json_decode($data['attach'], true)):'';
        return $data;
    }

    public function paytomedia($params)
    {
        if (!isset($params['id']) or !isset($params['pay_time'])) {
            throw new \Exception('parameter wrong!');
        }

        $uid = UserModel::factory()->getCurrentUid();
        $time = time();
        $log = DrawLogTable::factory()->getRow(['id'=>$params['id']]);

        if (!$log or $log['status'] != 'un_pay')
            throw new \Exception('支付请求不合法！');

        //检查用户财务信息是否完备
        $check_finance = MediumTable::factory()->getRow(['uid' => $log['uid']]);
        if (!$check_finance)
            throw new \Exception('请补齐媒体银行账户信息！');

        $params['comment'] = $params['comment'] ? $params['comment'] : '';

        DrawLogTable::factory()->execute("
        UPDATE
        `draw_log` 
        SET `status` = 'paid',
            `pay_time` = '{$params['pay_time']}',
            `comment` = '{$params['comment']}',
            `edit_time` = '{$time}',
            `edit_user` = '{$uid}'
        WHERE id = {$params['id']} AND `status` = 'un_pay'");

        return true;
    }

    public function checkdraw()
    {
        //申请时间范围检查
        if (intval(date('d')) < 5 or intval(date('d')) > 24)
            return false;

        $uid = UserModel::factory()->getCurrentUid();

        $draw_check = DrawLogTable::factory()->queryRow("
        SELECT 1
        FROM `draw_log`
        WHERE 
        FROM_UNIXTIME(`create_time`,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m') AND `uid` = '{$uid}'
        ");

        //是否已申请检查
        if($draw_check)
            return false;

        $data = $this->getaccountfinanceinfo();
        if(!isset($data['allow_draw_remain']) or $data['allow_draw_remain'] <= 0)
            return false;

        return true;
    }

    /**
     * 申请提现
     * @param $params
     * @return bool
     * @throws \Exception
     */
    public function applydraw($params)
    {
        if (!isset($params['amount']))
            throw new \Exception('parameter wrong!');

        //申请时间范围检查
        if (intval(date('d')) < 5 or intval(date('d')) > 24)
            throw new \Exception('每月可提现日期为5-24号！');

        $uid = UserModel::factory()->getCurrentUid();

        $draw_check = DrawLogTable::factory()->queryRow("
        SELECT 1
        FROM `draw_log`
        WHERE 
        FROM_UNIXTIME(`create_time`,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m') AND `uid` = '{$uid}'
        ");

        //是否已申请检查
        if($draw_check)
            throw new \Exception('本月已申请！');

        $check_finance = MediumTable::factory()->getRow(['uid' => $uid]);
        if (!$check_finance)
            throw new \Exception('请补齐媒体银行账户信息！');

        //申请余额检查
        $remain_check = DrawLogTable::factory()->queryRow("
        SELECT 
        ((SELECT 
        SUM(amount) AS amount
        FROM `job_month_bill`
        WHERE `uid` = '{$uid}') 
            - 
        (
        SELECT 
        SUM(amount)
        FROM `draw_log`
        WHERE `uid` = '{$uid}'
        ))  AS remain
        ");

        if (!$remain_check or empty($remain_check) or $remain_check[0] > $params['amount'])
            throw new \Exception('可提现余额不足！');

        $user = UserTable::factory()->getUserByUid($uid);

        $data['uid'] = $uid;
        $data['status'] = 'un_pay';
        $data['amount'] = $params['amount'];
        $data['comment'] = $params['comment'];
        $data['link_name'] = isset($user['link_name']) ? $user['link_name'] : '';
        $data['create_time'] = time();
        $data['create_user'] = $uid;
        $data['edit_time'] = time();
        $data['edit_user'] = $uid;

        DrawLogTable::factory()->insert($data);

        return true;
    }

    /**
     * 获取当前媒体账户累计收入、账户余额、可提现余额
     */
    public function getaccountfinanceinfo()
    {
        $uid = UserModel::factory()->getCurrentUid();

        return DrawLogTable::factory()->queryRow("
        SELECT 
        IFNULL(u.`total_income`,0) AS total_income,
        IFNULL(u.`total_income`,0) - IFNULL((SELECT SUM(amount) FROM `draw_log` WHERE uid = u.uid),0) AS account_remain,
        (IFNULL((SELECT 
        SUM(amount) AS amount
        FROM `job_month_bill`
        WHERE `uid` = u.uid) ,0)
            - 
        IFNULL((
        SELECT 
        SUM(amount)
        FROM `draw_log`
        WHERE `uid` = u.uid
        ),0)) AS allow_draw_remain
        FROM 
        `user` AS u
        WHERE u.uid = '{$uid}'");
    }

    /**
     * 计算时间范围内媒体账户累计收入
     */
    public function ComputeAllianceMediaTotalIncome($params)
    {
//        $params['begin'] = $params['begin'] ? $params['begin'] : '1970-01-01';
//        $params['end'] = $params['end'] ? $params['end'] : date('Y-m-d', strtotime('-1 day'));

        $params['begin'] = '1970-01-01';
        $params['end'] = date('Y-m-d', strtotime('-1 day'));

        $condition = new ConditionCombineModel();
        $condition->AndCondition($params['begin'], "r.`date` >= '{$params['begin']}'");
        $condition->AndCondition($params['end'], "r.`date` <= '{$params['end']}'");

        //全量更新联盟用户截止昨日收入
        DrawLogTable::factory()->execute("
        UPDATE `user` AS u1
        INNER JOIN 
        (
        SELECT 
          u.`uid`,
          SUM(r.`media_income`) AS total_income 
        FROM
          `slot` AS s,
          reports_alliance_slot_hourly AS r,
          `user` AS u 
        WHERE (
            s.`media` IN 
            (SELECT 
              r.id 
            FROM
              resource AS res 
            WHERE res.`platform_role` = 'alliance' 
              AND res.`type` = 'media' 
              AND res.uid = u.`create_user`) 
            OR s.`create_user` = u.`uid`
          ) 
          AND s.`platform_role` = 'alliance' 
          AND r.`slot` = s.`uid` 
          AND u.`role` = 'media' 
          {$condition->Condition()}
        GROUP BY u.`uid` 
        ) AS t
        ON u1.`uid` = t.uid
        SET u1.`total_income` = t.total_income
        ");

        return true;
    }

    /**
     * 计算联盟媒体时间范围内月账单
     */
    public function ComputeAllianceMediaBill($params)
    {
        if (!isset($params['begin']) or !isset($params['end']) or ($params['begin'] > $params['end']))
            throw new \Exception('parameter wrong!');

        $condition = new ConditionCombineModel();
        $condition->AndCondition($params['begin'], "r.`date` >= '{$params['begin']}'");
        $condition->AndCondition($params['end'], "r.`date` <= '{$params['end']}'");

        //全量更新联盟用户截止昨日收入
        DrawLogTable::factory()->execute("
        INSERT IGNORE `job_month_bill`(`uid`,`date`,amount,create_time)
        SELECT 
          u.`uid`,
          DATE_FORMAT(r.`date`,'%Y-%m-01') AS `date`,
          SUM(r.`media_income`) AS total_income ,
          UNIX_TIMESTAMP()
        FROM
          `slot` AS s,
          reports_alliance_slot_hourly AS r,
          `user` AS u 
        WHERE (
            s.`media` IN 
            (SELECT 
              r.id 
            FROM
              resource AS res 
            WHERE res.`platform_role` = 'alliance' 
              AND res.`type` = 'media' 
              AND res.uid = u.`create_user`) 
            OR s.`create_user` = u.`uid`
          ) 
          AND s.`platform_role` = 'alliance' 
          AND r.`slot` = s.`uid` 
          AND u.`role` = 'media'   
          {$condition->Condition()}
        GROUP BY u.`uid`,DATE_FORMAT(r.`date`,'%Y-%m-01') 
        ");

        return true;
    }

    /**
     * 计算上月联盟媒体月账单
     * @return bool
     */
    public function ComputeAllianceLastMonthMediaBill()
    {
        $params['begin'] = date('Y-m-01', strtotime('-1 month'));
        $params['end'] = date('Y-m-t', strtotime('-1 month'));

        $this->ComputeAllianceMediaBill($params);
        return true;
    }

    /**
     * 计算1970年后到上月为止所有媒体账户月账单
     */
    public function ComputeAllianceWholeMediaBill()
    {
        $params['begin'] = '1970-01-01';
        $params['end'] = date('Y-m-t', strtotime('-1 month'));

        $this->ComputeAllianceMediaBill($params);
        return true;
    }
}