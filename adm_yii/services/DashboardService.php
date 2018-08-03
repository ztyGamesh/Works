<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/24
 * Time: 20:14
 */
namespace app\services;



use app\models\ReportsAllianceHourlyModel;
use app\services\custom\ConditionCombineModel;

class DashboardService
{


    /**
     * 报表数据时间
     * @return false|string
     */
    private static function DataTimeGenerate()
    {
        $date = time() - 600;
        $i = floor(date('i', $date) / 5) * 5;
        $i = str_pad($i, 2, '0', STR_PAD_LEFT);
        return date("H:{$i}", $date);
    }

    #region 广告主接口

    /**
     * 媒体合计数据
     * @param $params
     */
    public static function ClientSumReport($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "h.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "h.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}' AND c.`id` = h.`creative_id`");
        //$from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");

        //$order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");
        $time = self::DataTimeGenerate();

        //汇总数据
        $sql = "SELECT 
                '{$time}' AS `data_time`,
                FORMAT(SUM(imp),0) AS imp, -- 展示量
                FORMAT(SUM(clk),0) AS clk, -- 点击量
                FORMAT((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                FORMAT(SUM(income),2) AS income, -- 总花费
                FORMAT(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                FORMAT(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                ";

        //汇总数据
        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 媒体dashboard分日折线数据
     * @param $params
     */
    public static function ClientDashboardDaily($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");

        //分时数据
        $sql = "
                SELECT 
                `date`, 
                {$params['dimension']}
                FROM
                (
                    SELECT 
                    d.`date` AS `date`, 
                    SUM(imp) AS imp, -- 展示量
                    SUM(clk) AS clk, -- 点击量
                    ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                    ROUND(SUM(income),2) AS income, -- 总花费
                    ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                    ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                    FROM 
                    `reports_alliance_hourly` AS h
                    INNER JOIN `ad_creative` AS c 
                    RIGHT JOIN  `dic_date` AS d ON 1
                    {$from_condition->Condition()}
                    WHERE 1
                    {$where_condition->Condition()}
                    GROUP BY d.`date`
                    ORDER BY d.`date` ASC
                ) as f";

        //图表数据
        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 媒体dashboard分时折线报表
     * @param $params
     */
    public static function ClientDashboardHourly($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`creative_id` = c.`id`");

        //分时数据
        $sql = "
                SELECT 
                `date`, 
                `hour`,
                `period`,
                {$params["dimension"]}
                FROM
                (
                    SELECT 
                    d.`date` AS `date`, 
                    d.`hour` AS `hour`,
                    CONCAT(LPAD(d.`hour`,2,'0'),':00 至 ',LPAD(d.`hour`,2,'0'),':59') AS period,
                    SUM(imp) AS imp, -- 展示量
                    SUM(clk) AS clk, -- 点击量
                    ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                    ROUND(SUM(income),2) AS income, -- 总花费
                    ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                    ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                    FROM 
                    `reports_alliance_hourly` AS h
                    INNER JOIN `ad_creative` AS c 
                    RIGHT JOIN  `dic_hour` AS d ON 1
                    {$from_condition->Condition()}
                    WHERE 1
                    {$where_condition->Condition()}
                    GROUP BY d.`date`,d.`hour`
                    ORDER BY d.`date` ASC,d.`hour` ASC
                ) AS f";

        //图表数据
        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 广告组top数据
     * @param $params
     */
    public static function AdgroupTopReport($params)
    {
        $uid = UserService::getCurrentUid();
        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");

        $imp_sql = "
                SELECT 
                g.`name` AS `group_name`, 
                SUM(imp) AS imp -- 展示量
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                INNER JOIN  `dic_date` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY g.id
                ORDER BY SUM(imp) DESC
                LIMIT 0,{$params['top']}";

        $imp_data = ReportsAllianceHourlyModel::queryList($imp_sql);

        $clk_sql = "
                SELECT 
                g.`name` AS `group_name`, 
                SUM(clk) AS clk -- 点击量
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                INNER JOIN  `dic_date` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY g.id
                ORDER BY SUM(clk) DESC
                LIMIT 0,{$params['top']}";

        $clk_data = ReportsAllianceHourlyModel::queryList($clk_sql);

        $ctr_sql = "
                SELECT 
                g.`name` AS `group_name`, 
                ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr -- 点击量
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                INNER JOIN  `dic_date` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY g.id
                ORDER BY SUM(clk) / SUM(imp) * 100 DESC
                LIMIT 0,{$params['top']}";

        $ctr_data = ReportsAllianceHourlyModel::queryList($ctr_sql);

        $income_sql = "
                SELECT 
                g.`name` AS `group_name`, 
                ROUND(SUM(income),2) AS income -- 总花费
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                INNER JOIN  `dic_date` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY g.id
                ORDER BY SUM(income) DESC
                LIMIT 0,{$params['top']}";

        $income_data = ReportsAllianceHourlyModel::queryList($income_sql);

        return
            [
                'imp_data' => $imp_data,
                'clk_data' => $clk_data,
                'ctr_data' => $ctr_data,
                'income_data' => $income_data
            ];
    }

    /**
     * 广告计划top数据
     * @param $params
     */
    public static function AdplanTopReport($params)
    {
        $uid = UserService::getCurrentUid();
        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");

        $imp_sql = "
                SELECT 
                p.`name` AS `plan_name`, 
                SUM(imp) AS imp -- 展示量
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN  `dic_date` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY p.id
                ORDER BY SUM(imp) DESC
                LIMIT 0,{$params['top']}";

        $imp_data = ReportsAllianceHourlyModel::queryList($imp_sql);

        $clk_sql = "
                SELECT 
                p.`name` AS `plan_name`, 
                SUM(clk) AS clk -- 点击量
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN  `dic_date` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY p.id
                ORDER BY SUM(clk) DESC
                LIMIT 0,{$params['top']}";

        $clk_data = ReportsAllianceHourlyModel::queryList($clk_sql);

        $ctr_sql = "
                SELECT 
                p.`name` AS `plan_name`, 
                ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr -- 点击率
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN  `dic_date` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY p.id
                ORDER BY (SUM(clk) / SUM(imp) * 100) DESC
                LIMIT 0,{$params['top']}";

        $ctr_data = ReportsAllianceHourlyModel::queryList($ctr_sql);

        $income_sql = "
                SELECT 
                p.`name` AS `plan_name`, 
                ROUND(SUM(income),2) AS income -- 总花费
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN  `dic_date` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY p.id
                ORDER BY SUM(income) DESC
                LIMIT 0,{$params['top']}";

        $income_data = ReportsAllianceHourlyModel::queryList($income_sql);

        return
            [
                'imp_data' => $imp_data,
                'clk_data' => $clk_data,
                'ctr_data' => $ctr_data,
                'income_data' => $income_data
            ];
    }

    /**
     * 关键词top数据
     * @param $params
     */
    public static function WordTopReport($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "w.`id` = h.`word` AND d.`date` = h.`date` AND h.`creative_id` = c.`id` AND c.`create_user` = '{$uid}'");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                w.`word`,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `dic_date` AS d INNER JOIN
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `dic_adm_word` AS w 
                INNER JOIN `ad_creative` AS c ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY h.`word`
                {$order_condition}
                LIMIT 0,{$params['top']}
                ";

        return ReportsAllianceHourlyModel::queryList($sql);
    }

    #endregion

    #region 媒体接口

    /**
     * 媒体收入合计
     * @param $params
     */
    public static function MediaSumReport($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND h.`slot` = s.`uid`");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "h.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "h.`date` <= '{$params['end']}'");

        $time = self::DataTimeGenerate();

        //汇总数据
        $sql = "SELECT 
                '{$time}' AS `data_time`,
                FORMAT(SUM(bid_num),0) AS bid_num, -- 竞价量
                FORMAT(SUM(imp),0) AS imp, -- 展示量
                FORMAT(SUM(clk),0) AS clk, -- 点击量
                FORMAT((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                FORMAT(SUM(media_income),2) AS income, -- 总花费
                FORMAT(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                FORMAT(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价                
                FROM 
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s 
                ON 1
                {$from_condition->Condition()}        
                WHERE 1
                {$where_condition->Condition()}
                ";
//        die($sql);
        //汇总数据
        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 返回媒体报表中当前用户报表数据的最新的日期 imp>0
     * 管理员则返回所有记录中符合条件的日期
     */
    public static function MediaReportRecentDate(){
        $join_condition = new ConditionCombineModel();
        if(!UserService::IsAdminUser()){
            $uid=UserService::getCurrentUid();
            $join_condition->AndCondition($uid,"u.uid='{$uid}'");
        }
        $sql="SELECT r.date
            FROM reports_alliance_slot_hourly r 
            JOIN slot s on r.slot=s.uid and r.imp>0
            JOIN user u on s.create_user=u.uid {$join_condition->Condition()}
            ORDER BY r.date DESC LIMIT 1";

        return ReportsAllianceHourlyModel::queryRow($sql);
    }

    /**
     * 媒体折线图日报数据
     * @param $params
     */
    public static function MediaDashboardDaily($params)
    {
        $uid = UserService::getCurrentUid();

        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $sql = "
                SELECT 
                `date`, 
                {$params['dimension']}
                FROM
                (
                    SELECT 
                    d.`date` AS `date`, 
                    SUM(bid_num) AS bid_num, -- 竞价量
                    SUM(imp) AS imp, -- 展示量
                    SUM(clk) AS clk, -- 点击量
                    ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                    ROUND(SUM(media_income),2) AS income, -- 总收入
                    ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                    ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                    FROM
                    `reports_alliance_slot_hourly` AS h 
                    INNER JOIN `slot` AS s
                    RIGHT JOIN `dic_date` AS d 
                    ON 1
                    {$from_condition->Condition()}
                    WHERE 1
                    {$where_condition->Condition()}
                    GROUP BY d.`date`
                    ORDER BY d.`date` ASC
                ) as f";

        //图表数据
        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 媒体折线图小时报数据
     * @param $params
     */
    public static function MediaDashboardHourly($params)
    {
        $uid = UserService::getCurrentUid();

        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`slot` = s.`uid`");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $sql = "                
                SELECT 
                `date`, 
                `hour`,
                `period`,
                {$params['dimension']}
                FROM
                (
                    SELECT 
                    d.`date` AS `date`, 
                    d.`hour` AS `hour`,
                    CONCAT(LPAD(d.`hour`,2,'0'),':00 至 ',LPAD(d.`hour`,2,'0'),':59') AS period,
                    SUM(bid_num) AS bid_num, -- bid量
                    SUM(imp) AS imp, -- 展示量
                    SUM(clk) AS clk, -- 点击量
                    ROUND((SUM(clk) / SUM(imp) * 100),2) AS ctr, -- 点击率
                    ROUND(SUM(media_income),2) AS income, -- 总收入
                    ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                    ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                    FROM
                    `reports_alliance_slot_hourly` AS h 
                    INNER JOIN `slot` AS s
                    RIGHT JOIN `dic_hour` AS d
                    ON 1
                    {$from_condition->Condition()}
                    WHERE 1
                    {$where_condition->Condition()}
                    GROUP BY d.`date`,d.`hour`
                    ORDER BY d.`date` ASC,d.`hour` ASC
                 ) as f";

        //图表数据
        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 媒体收入报表
     * @param $params
     */
    public static function MediaIncomeReport($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");

        $sql = "SELECT 
                m.`name` AS `media_name`, -- 媒体
                IFNULL(SUM(bid_num),0) AS bid_num, -- 竞价量
                IFNULL(SUM(imp),0) AS imp, -- 展示量
                IFNULL(SUM(clk),0) AS clk, -- 点击量
                IFNULL(ROUND((SUM(clk) / SUM(imp) * 100),2),0) AS ctr, -- 点击率
                IFNULL(ROUND(SUM(media_income),2),0) AS income, -- 总收入
                IFNULL(ROUND(SUM(media_income) / SUM(imp) * 1000,2),0) AS ecpm , -- 平均千次展示费用
                IFNULL(ROUND(SUM(media_income) / SUM(clk),2),0) AS ecpc -- 平均点击单价
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                INNER JOIN `media` AS m 
                ON m.`uid` = s.`media` 
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`media`
                ORDER BY SUM(media_income) DESC
                LIMIT 0,{$params['top']}";

        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 媒体收入占比
     * @param $params
     */
    public static function MediaIncomeOccupy($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");

        $sql = "SELECT 
                m.`name` AS `media_name`, -- 媒体
                ROUND(SUM(media_income) / (SELECT SUM(media_income) FROM reports_alliance_slot_hourly WHERE `date` >= '{$params['begin']}' AND `date` <= '{$params['end']}' AND `slot` IN ('{$slots}')) * 100,2) AS occupy -- 总收入占比
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                INNER JOIN `media` AS m 
                ON m.`uid` = s.`media` 
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`media`
                ORDER BY occupy DESC
                LIMIT 0,{$params['top']}";

        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 广告位收入报表
     * @param $params
     */
    public static function SlotIncomeReport($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");

        $sql = "SELECT 
                s.`name` AS `slot_name`, -- 广告位
                IFNULL(SUM(bid_num),0) AS bid_num, -- 竞价量
                IFNULL(SUM(imp),0) AS imp, -- 展示量
                IFNULL(SUM(clk),0) AS clk, -- 点击量
                IFNULL(ROUND((SUM(clk) / SUM(imp) * 100),2),0) AS ctr, -- 点击率
                IFNULL(ROUND(SUM(media_income),2),0) AS income, -- 总收入
                IFNULL(ROUND(SUM(media_income) / SUM(imp) * 1000,2),0) AS ecpm , -- 平均千次展示费用
                IFNULL(ROUND(SUM(media_income) / SUM(clk),2),0) AS ecpc -- 平均点击单价
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`uid`
                ORDER BY SUM(media_income) DESC
                LIMIT 0,{$params['top']}";

        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 广告位收入占比
     * @param $params
     */
    public static function SlotIncomeOccupy($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");

        $sql = "SELECT 
                s.`name` AS `slot_name`, -- 广告位名称
                ROUND(SUM(media_income) / (SELECT SUM(media_income) FROM reports_alliance_slot_hourly WHERE `date` >= '{$params['begin']}' AND `date` <= '{$params['end']}' AND `slot` IN ('{$slots}')) * 100,2) AS occupy -- 总收入占比
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s 
                ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`uid`
                ORDER BY occupy DESC
                LIMIT 0,{$params['top']}";

        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 基础模板收入top
     * @param $params
     */
    public static function BaseTemplateIncomeTop($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot_template` = st.`uid` AND st.`slot` = s.`uid`");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $sql = "
                SELECT 
                (SELECT `name` FROM template WHERE `uid` = st.`template_class`) AS template_name,
                IFNULL(ROUND(SUM(media_income),2),0) AS income -- 总收入
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_template_hourly` AS h 
                INNER JOIN `slot_template` AS st 
                INNER JOIN `slot` AS s 
                ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY st.`template_class`
                ORDER BY SUM(media_income) DESC
                LIMIT 0,{$params['top']}";

        return ReportsAllianceHourlyModel::queryList($sql);
    }

    /**
     * 基础模板点击率top
     * @param $params
     */
    public static function BaseTemplateCtrTop($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot_template` = st.`uid` AND st.`slot` = s.`uid`");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >='{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $sql = "SELECT 
                (SELECT `name` FROM template WHERE `uid` = st.`template_class`) AS template_name,
                IFNULL(ROUND((SUM(clk) / SUM(imp) * 100),2),0) AS ctr -- 点击率
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_template_hourly` AS h 
                INNER JOIN `slot_template` AS st 
                INNER JOIN `slot` AS s 
                ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY st.`template_class`
                ORDER BY SUM(clk) / SUM(imp) * 100 DESC
                LIMIT 0,
                {$params['top']}";

        return ReportsAllianceHourlyModel::queryList($sql);
    }
    #endregion
}