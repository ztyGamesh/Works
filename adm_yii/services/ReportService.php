<?php

namespace app\services;


use app\models\ReportsAllianceHourlyModel;
use app\services\custom\ArrayHandle;
use app\services\custom\ConditionCombineModel;

class ReportService
{
    /**
     * 报表汇总数据中缺少的数据项使用符号代替
     */
    const REPORT_SUM_NO_DATA_CHARACTERS = '-';


    #region 联盟报表

    /**
     * 联盟账户分日报表
     * @param $params
     */
    public static function AllianceClientDailyReport($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();
        $begin = date('Y-m-d', strtotime($params['begin']));
        $end = date('Y-m-d', strtotime($params['end']));

        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$begin}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$end}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");

        $order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        //分时数据
        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`,                 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        //报表分页数据
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);

        //汇总数据
        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                GROUP BY c.`create_user` order by imp desc LIMIT 1
                ";

        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);
        $sum_data['period_date'] = [$begin, $end];
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟账户分时报表
     * @param $params
     */
    public static function AllianceClientHourlyReport($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`creative_id` = c.`id`");

        $order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        //分时数据
        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        //报表分页数据
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);

        //汇总数据 添加到报表中
        $sql = "SELECT 
                '' AS `hour`, 
                '' AS `period`, 
                d.`date` as period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                GROUP BY c.`create_user`    order by imp desc LIMIT 1
                ";
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告组分时报表
     * @param $params
     */
    public static function AllianceAdgroupHourlyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`creative_id` = c.`id`");
        $from_condition->AndCondition($params['ids'], "c.`group_id` IN ({$params['ids']})");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        /**
         * 某一维度（时间、广告组）下的分页数据
         */
        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";
            /**
             * 设置总计行的时段日期
             */
            $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
        } else if ($params['dimension'] == 'adgroup') {
            $sql = "SELECT 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) AS `group_name`, 
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_hour` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY g.`id` having imp is not null
                {$order_condition}";
//            exit($sql);
            /**
             * 汇总数据组名称
             */
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;

        } else {
            $order_condition = "order by d.date ASC,d.hour ASC";
            if (!empty($params['sort']) && !empty($params['order'])) {
                $order_condition = "order by `{$params['sort']}` {$params['order']},d.date ASC,d.hour ASC";
            }

            $sql = "SELECT
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) AS `group_name`, 
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_hour` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                 {$where_condition->Condition()}
                GROUP BY g.`id`,d.hour
                HAVING imp is not NULL
                {$order_condition}
             ";
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['period_date'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        }

        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'group_name');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告组分日报表
     * @param $params
     */
    public static function AllianceAdgroupDailyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");
        $from_condition->AndCondition($params['ids'], "c.`group_id` IN ({$params['ids']})");

        $order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN  `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] === 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";
            /**
             * 设置总计行的日期
             */
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        } else if ($params['dimension'] === 'adgroup') {
            $sql = "SELECT 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) AS `group_name`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_date` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`group_id` HAVING imp is not null
                {$order_condition}";
            /**
             * 设置总计行的广告组
             */
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        } else {//时间-广告组两个维度
            $order_condition = "order by d.date,group_name";
            if (!empty($params['sort']) && !empty($params['order'])) {
                $order_condition = "order by `{$params['sort']}` {$params['order']},d.date,group_name";
            }
            $sql = "SELECT 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) AS `group_name`, 
                d.`date` AS `date`,
                d.`date` AS `period_date`,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_date` AS d ON c.`group_id` = g.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`group_id`,d.date HAVING imp is not null
                {$order_condition}";
            /**
             * 设置总计行的广告组
             */
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];

        }

//        exit($sql);
        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'group_name');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告计划分日报表
     * @param $params
     */
    public static function AllianceAdplanDailyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");
        $from_condition->AndCondition($params['ids'], "c.`plan_id` IN ({$params['ids']})");

        $order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] === 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        } else if ($params['dimension'] === 'adplan') {
            $sql = "SELECT 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                join ad_group g on p.group_id=g.id 
                RIGHT JOIN  `dic_date` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`plan_id` having imp is not null
                {$order_condition}";
            $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        } else {//计划+日期两个维度
            $order_condition = 'order by d.date,p.name';
            if (!empty($params['sort']) && !empty($params['order'])) {
                $order_condition = "order by {$params['sort']} {$params['order']},d.date,p.name";
            }
            $sql = "SELECT 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                join ad_group g on p.group_id=g.id 
                RIGHT JOIN  `dic_date` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`plan_id`,d.date having imp is not null
                {$order_condition}";
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
            $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        }
        //详细报表
//        exit($sql);
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'plan_name');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告计划分时报表
     * @param $params
     */
    public static function AllianceAdplanHourlyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`creative_id` = c.`id`");
        $from_condition->AndCondition($params['ids'], "c.`plan_id` IN ({$params['ids']})");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, 
                SUM(clk) AS clk, 
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr,
                ROUND(SUM(income),2) AS income, 
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm ,
                ROUND(SUM(income) / SUM(clk),2) AS ecpc 
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                RIGHT JOIN  `dic_hour` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`,d.`hour`
                {$order_condition}";
        //图数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, 
                SUM(clk) AS clk, 
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr,
                ROUND(SUM(income),2) AS income, 
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , 
                ROUND(SUM(income) / SUM(clk),2) AS ecpc 
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                RIGHT JOIN  `dic_hour` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";
        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        //分时数据
        if ($params['dimension'] === 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";
            $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
        } else if ($params['dimension'] === 'adplan') {
            $sql = "SELECT 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                join ad_group g on g.id=p.group_id
                RIGHT JOIN  `dic_hour` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY p.`id` HAVING imp is not NULL
                {$order_condition}";
            $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;

        } else {
            $order_condition = 'order by d.hour,p.name';
            if (!empty($params['sort']) && !empty($params['order'])) {
                $order_condition = "order by {$params['sort']} {$params['order']}, d.hour,p.name";
            }
            $sql = "SELECT 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                join ad_group g on g.id=p.group_id
                RIGHT JOIN  `dic_hour` AS d ON c.`plan_id` = p.`id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY p.`id`,d.hour HAVING imp is not NULL
                {$order_condition}";
            $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['group_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        }
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'plan_name');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data, 'sum' => $sum_data];
    }

    /**
     * 联盟广告创意分日报表
     * @param $params
     */
    public static function AllianceAdcreativeDailyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $params['template_class'] = $params['template_class'] ? str_replace(',', "','", $params['template_class']) : '';

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND h.`creative_id` = c.`id`");
        $from_condition->AndCondition($params['ids'], "c.`id` IN ({$params['ids']})");
        $from_condition->AndCondition($params['template_class'], "c.`template_class` IN ('{$params['template_class']}')");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                 d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN  `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        } else if ($params['dimension'] == 'adcreative') {
            $sql = "SELECT 
                if(c.status='delete',concat(c.name,'(已删除)'),c.name) AS `creative_name`, 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_date` AS d ON c.`plan_id` = p.`id` AND g.`id` = c.`group_id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`id`
                {$order_condition}";
            $sum_data['creative_name'] = $sum_data['group_name'] = $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        } else {
            $order_condition = "order by d.date,c.name";
            if (!empty($params['sort']) && !empty($params['order'])) {
                $order_condition = "order by `{$params['sort']}` {$params['order']},d.date,c.name";
            }
            $sql = "SELECT
                d.date as period_date,
                if(c.status='delete',concat(c.name,'(已删除)'),c.name) AS `creative_name`, 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_date` AS d ON c.`plan_id` = p.`id` AND g.`id` = c.`group_id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.date,c.`id` HAVING imp is not NULL
                {$order_condition}";
            $sum_data['creative_name'] = $sum_data['group_name'] = $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        }

        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'creative_name');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告创意分时报表
     * @param $params
     */
    public static function AllianceAdcreativeHourlyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $params['template_class'] = $params['template_class'] ? str_replace(',', "','", $params['template_class']) : '';

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "c.`create_user` = '{$uid}'");
        $from_condition->AndCondition($uid, "d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`creative_id` = c.`id`");
        $from_condition->AndCondition($params['ids'], "c.`id` IN ({$params['ids']})");
        $from_condition->AndCondition($params['template_class'], "c.`template_class` IN ('{$params['template_class']}')");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
               ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
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
                {$order_condition}";
            $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));

        } else if ($params['dimension'] == 'adcreative') {
            $sql = "SELECT 
                if(c.status='delete',concat(c.name,'(已删除)'),c.name) AS `creative_name`, 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_hour` AS d ON c.`plan_id` = p.`id` AND g.`id` = c.`group_id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`id`
                {$order_condition}";
            $sum_data['creative_name'] = $sum_data['group_name'] = $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        } else {
            $order_condition = "ORDER BY d.hour,c.name";
            if (!empty($params['sort']) && !empty($params['order'])) {
                $order_condition = "ORDER BY `{$params['sort']}` {$params['order']},d.hour,c.name";
            }
            $sql = "SELECT 
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                if(c.status='delete',concat(c.name,'(已删除)'),c.name) AS `creative_name`, 
                if(p.status='delete',concat(p.name,'(已删除)'),p.name) AS `plan_name`, 
                if(g.status='delete',concat(g.name,'(已删除)'),g.name) as group_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_hourly` AS h
                INNER JOIN `ad_creative` AS c 
                INNER JOIN `ad_plan` AS p
                INNER JOIN `ad_group` AS g
                RIGHT JOIN  `dic_hour` AS d ON c.`plan_id` = p.`id` AND g.`id` = c.`group_id`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`id`,d.hour HAVING imp is not NULL
                {$order_condition}";
            $sum_data['creative_name'] = $sum_data['group_name'] = $sum_data['plan_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
        }

        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'creative_name');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告关键词分日报表
     * @param $params
     */
    public static function AllianceWordDailyReport($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();

        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "w.`id` = h.`word` AND d.`date` = h.`date` AND h.`creative_id` = c.`id` AND c.`create_user` = '{$uid}'");

        if ($params['filter'] == 'adgroup')
            $from_condition->AndCondition($params['ids'], "c.`group_id` IN ({$params['ids']})");
        if ($params['filter'] == 'adplan')
            $from_condition->AndCondition($params['ids'], "c.`plan_id` IN ({$params['ids']})");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`,
                  d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";

        //图数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                  `reports_alliance_word_hourly` AS h
                  JOIN `dic_adm_word` AS w
                  JOIN `ad_creative` AS c
                  RIGHT JOIN     `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if (isset($params['words']) and !empty($params['words'])) {
            $params['words'] = str_replace(',', "','", $params['words']);
            $from_condition->AndCondition($params['words'], "w.`word` IN ('{$params['words']}')");
        }

        //分时数据
        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        } else if ($params['dimension'] == 'word') {
            $sql = "SELECT 
                w.`word` AS `word`,
                p.name as adplan_name,
                g.name as adgroup_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                JOIN ad_plan p on c.plan_id=p.id
                join ad_group g on g.id=c.group_id
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY w.`id`,p.id
                {$order_condition}";
            $sum_data['word'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        } else {
            $sql = "SELECT 
                    w.`word` AS `word`,
                    p.name as adplan_name,
                    g.name as adgroup_name,
                    d.date as period_date,
                    SUM(imp) AS imp, -- 展示量
                    SUM(clk) AS clk, -- 点击量
                    ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                    ROUND(SUM(income),2) AS income, -- 总花费
                    ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                    ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                    FROM 
                    `reports_alliance_word_hourly` AS h 
                    INNER JOIN `ad_creative` AS c
                    INNER JOIN `dic_adm_word` AS w
                    JOIN ad_plan p on c.plan_id=p.id
                    join ad_group g on g.id=c.group_id
                    RIGHT JOIN `dic_date` AS d ON 1
                    {$from_condition->Condition()}
                    WHERE 1
                    {$where_condition->Condition()}
                    GROUP BY w.`id`,p.id,d.date HAVING imp>0 ORDER BY d.date,word
                    {$order_condition}";
            $sum_data['word'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];

        }

        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'word');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告关键词分时报表
     * @param $params
     */
    public static function AllianceWordHourlyReport($params)
    {
        $uid = UserService::getCurrentUid();

        $where_condition = new ConditionCombineModel();

        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "w.`id` = h.`word` AND d.`date` = h.`date` AND d.`hour` = h.`hour` AND h.`creative_id` = c.`id` AND c.`create_user` = '{$uid}'");

        if ($params['filter'] == 'adgroup')
            $from_condition->AndCondition($params['ids'], "c.`group_id` IN ({$params['ids']})");
        if ($params['filter'] == 'adplan')
            $from_condition->AndCondition($params['ids'], "c.`plan_id` IN ({$params['ids']})");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `dic_hour` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`,d.`hour`
                {$order_condition}";

        //图数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `dic_hour` AS d INNER JOIN
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `ad_creative` AS c ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY c.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if (isset($params['words']) and !empty($params['words'])) {
            $params['words'] = str_replace(',', "','", $params['words']);
            $from_condition->AndCondition($params['words'], "w.`word` IN ('{$params['words']}')");
        }

        //分时数据
        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, 
                d.`hour` AS `hour`,
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `dic_hour` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`,d.`hour`
                {$order_condition}";
            if ($params['begin']===$params['end']){
                $sum_data['period_date']=[date('Y-m-d', strtotime($params['begin']))];
            }else{
                $sum_data['period_date']= [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
            }
        } else if ($params['dimension'] == 'word') {
            $sql = "SELECT 
                w.`word` AS `word`,
                p.name as adplan_name,
                g.name as adgroup_name,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                INNER JOIN `dic_adm_word` AS w 
                JOIN ad_plan p on c.plan_id=p.id
                join ad_group g on g.id=c.group_id
                RIGHT JOIN `dic_hour` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY w.`id`
                {$order_condition}";
            $sum_data['word'] = $sum_data['period'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        } else {//unlimited
            $sql = "SELECT 
                w.`word` AS `word`,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                CONCAT(LPAD(d.`hour`,2,'0'),':00-',LPAD(d.`hour`,2,'0'),':59',' ',d.`date`) AS period_date,
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_word_hourly` AS h 
                INNER JOIN `ad_creative` AS c
                INNER JOIN `dic_adm_word` AS w 
                RIGHT JOIN `dic_hour` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY w.`id` HAVING imp>0 ORDER BY d.hour,word
                {$order_condition}";
            $sum_data['word'] = $sum_data['period'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        }
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        self::removeNameNullRow($page_data, 'word');
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告地域分日报表
     * @param $params
     */
    public static function AllianceGeoDailyReport($params)
    {
        $uid = UserService::getCurrentUid();
        $condition = new ConditionCombineModel();

        $condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");
        $condition->AndCondition($uid, "c.`create_user` = '{$uid}'", "c.`create_user` IS NULL");

        if ($params['filter'] == 'adgroup')
            $condition->AndCondition($params['ids'], "c.`group_id` IN ({$params['ids']})", "c.`group_id` IS NULL");
        if ($params['filter'] == 'adplan')
            $condition->AndCondition($params['ids'], "c.`plan_id` IN ({$params['ids']})", "c.`plan_id` IS NULL");

        //指标字段
        if (!in_array($params['target'], ['imp', 'clk', 'ctr']))
            throw new \Exception('Target Wrong!');

        if ($params['target'] == 'imp') {
            $target_sum = ReportsAllianceHourlyModel::queryRow("SELECT 
                                                                            SUM(imp) AS target_sum
                                                                            FROM 
                                                                            `dic_date` AS d INNER JOIN 
                                                                            `reports_alliance_geo_hourly` AS h ON d.`date` = h.`date` INNER JOIN `ad_creative` AS c
                                                                            ON h.`creative_id` = c.`id`
                                                                            WHERE 1
                                                                            {$condition->Condition()}
                                                                            GROUP BY c.`create_user`");
            $target_sum = $target_sum ? $target_sum['target_sum'] : '0';

            $target =
                "SUM(imp) AS target,
                 ROUND(SUM(imp) / {$target_sum},2) AS occupy
                ";
        }
        if ($params['target'] == 'clk') {
            $target_sum = ReportsAllianceHourlyModel::queryRow("SELECT 
                                                                            SUM(clk) AS target_sum
                                                                            FROM 
                                                                            `dic_date` AS d INNER JOIN 
                                                                            `reports_alliance_geo_hourly` AS h ON d.`date` = h.`date`INNER JOIN `ad_creative` AS c
                                                                            ON h.`creative_id` = c.`id`
                                                                            WHERE 1
                                                                            {$condition->Condition()}
                                                                            GROUP BY c.`create_user`");
            $target_sum = $target_sum ? $target_sum['target_sum'] : '0';

            $target =
                "
                SUM(clk) AS target,
                ROUND(SUM(clk) / {$target_sum},2) AS occupy
                ";
        }
        if ($params['target'] == 'ctr') {
            $target =
                "
                ROUND((SUM(clk) / SUM(imp) * 100),2) AS target,
                null AS occupy
                ";
        }

        $sql = "SELECT 
                ge.`province` AS `province_name`,
                {$target}
                FROM 
                `dic_date` AS d INNER JOIN
                `reports_alliance_geo_hourly` AS h 
                ON d.`date` = h.`date`
                INNER JOIN `ad_creative` AS c
                ON h.`creative_id` = c.`id`
                INNER JOIN `geo` AS ge 
                ON ge.`code` = h.`code`
                WHERE 1
                {$condition->Condition()}
                GROUP BY ge.`province` 
                ORDER BY target DESC";

        //省数据
        $province_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                ge.`city` AS `city_name`,
                {$target}
                FROM 
                `dic_date` AS d INNER JOIN
                `reports_alliance_geo_hourly` AS h 
                ON d.`date` = h.`date`
                INNER JOIN `ad_creative` AS c
                ON h.`creative_id` = c.`id`
                INNER JOIN `geo` AS ge 
                ON (ge.`type` = 2 OR  ge.`type` = 3) AND ge.`code` = h.`code`
                WHERE 1
                {$condition->Condition()}
                GROUP BY ge.`code`
                ORDER BY target DESC
                LIMIT 0,50
                ";

        //市数据
        $city_data = ReportsAllianceHourlyModel::queryList($sql);

        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        if ($params['dimension'] == 'province') {
            $sql = "SELECT 
                ge.`province` AS `province_name`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `dic_date` AS d INNER JOIN
                `reports_alliance_geo_hourly` AS h 
                ON d.`date` = h.`date`
                INNER JOIN `ad_creative` AS c
                ON h.`creative_id` = c.`id`
                INNER JOIN  `geo` AS ge 
                ON ge.`code` = h.`code`
                WHERE 1
                {$condition->Condition()}
                GROUP BY ge.`province`
                {$order_condition}";
            $sum_sql = "SELECT 
                '-' AS `province_name`, 
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(income),2) AS income, -- 总花费
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用(元)
                ROUND(SUM(income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `dic_date` AS d INNER JOIN
                `reports_alliance_geo_hourly` AS h 
                ON d.`date` = h.`date`
                INNER JOIN `ad_creative` AS c
                ON h.`creative_id` = c.`id`
                INNER JOIN  `geo` AS ge 
                ON ge.`code` = h.`code`
                WHERE 1
                {$condition->Condition()}
                {$order_condition}";
        } else {
            $sql = "SELECT 
                ge.`city` AS `city_name`, 
                SUM(imp) AS imp,
                SUM(clk) AS clk,
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr,
                ROUND(SUM(income),2) AS income,
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , 
                ROUND(SUM(income) / SUM(clk),2) AS ecpc 
                FROM
                `dic_date` AS d INNER JOIN 
                `reports_alliance_geo_hourly` AS h 
                ON d.`date` = h.`date`
                INNER JOIN `ad_creative` AS c
                ON h.`creative_id` = c.`id`
                INNER JOIN `geo` AS ge 
                ON (ge.`type` = 2 OR  ge.`type` = 3) AND ge.`code` = h.`code`
                WHERE 1
                {$condition->Condition()}
                GROUP BY ge.`code`
                {$order_condition}";
            $sum_sql = "SELECT 
                '-' AS `city_name`, 
                SUM(imp) AS imp,
                SUM(clk) AS clk,
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr,
                ROUND(SUM(income),2) AS income,
                ROUND(SUM(income) / SUM(imp) * 1000,2) AS ecpm , 
                ROUND(SUM(income) / SUM(clk),2) AS ecpc 
                FROM
                `dic_date` AS d INNER JOIN 
                `reports_alliance_geo_hourly` AS h 
                ON d.`date` = h.`date`
                INNER JOIN `ad_creative` AS c
                ON h.`creative_id` = c.`id`
                INNER JOIN `geo` AS ge 
                ON (ge.`type` = 2 OR  ge.`type` = 3) AND ge.`code` = h.`code`
                WHERE 1
                {$condition->Condition()}
                {$order_condition}";
        }

        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        $sum_data = ReportsAllianceHourlyModel::queryRow($sum_sql);
        array_unshift($page_data['rows'], $sum_data);
        return ['province' => $province_data, 'report' => $page_data, 'city' => $city_data];
    }

    /**
     * 联盟媒体账户报表
     * @param $params
     * @return array
     */
    public static function AllianceMediaAccountDailyReport($params)
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

        $order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                d.`date` AS `period_date`, 
                SUM(bid_num) AS bid_num, -- bid_num
                SUM(pv) AS pv, -- 请求量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_slot_hourly` AS h
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        //分页报表数据
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);

        $sql = "SELECT 
                SUM(pv) AS pv, -- 请求量
                SUM(imp) AS imp, -- 展示量
                SUM(bid_num) AS bid_num, -- 竞价量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}                
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);
        if ($params['begin'] == $params['end']) {
            $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
        } else {
            $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
        }
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟媒体报表
     * @param $params
     * @return array
     */
    public static function AllianceMediaDailyReport($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");
        $params['media'] = $params['media'] ? str_replace(',', "','", $params['media']) : null;
        $from_condition->AndCondition($params['media'], "s.`media` IN ('{$params['media']}')");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        //分日数据
        $sql = "SELECT 
                d.`date` AS `date`,
                  d.`date` AS `period_date`, 
                SUM(bid_num) AS bid_num, -- bid_num
                SUM(pv) AS pv, -- 请求量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num, -- 展示量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s 
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, -- 时间
                d.`date` AS `period_date`, -- 时间
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num, -- 展示量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";
            if ($params['begin'] == $params['end']) {
                $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
            } else {
                $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
            }
        } else {
            $sql = "SELECT 
                m.`name` AS `media_name`, -- 媒体
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num, -- 展示量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                INNER JOIN `media` AS m ON m.`uid` = s.`media` 
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`media`
                {$order_condition}";
            $sum_data['media_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        }

        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟广告位报表
     * @param $params
     * @return array
     */
    public static function AllianceSlotDailyReport($params)
    {
        $uid = UserService::getCurrentUid();

        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot` = s.`uid`");


        if (!empty($params['slot_class'])) {
            $params['slot_class'] = ArrayHandle::SplitByComma(explode(',', $params['slot_class']));
        }
        $from_condition->AndCondition($params['slot_class'], "s.`class` in ({$params['slot_class']})");
//        $from_condition->AndCondition($params['slot_class'], "s.`class` = '{$params['slot_class']}'");
        $params['slot'] = str_replace(',', "','", $params['slot']);
        $from_condition->AndCondition($params['slot'], "s.`uid` IN ('{$params['slot']}')");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $order_condition = $from_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`,
                  d.`date` AS `period_date`, 
                SUM(bid_num) AS bid_num, -- bid
                SUM(pv) AS pv, -- 请求量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";
//        exit($sql);

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_slot_hourly` AS h
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, -- 时间
                d.`date` AS `period_date`, -- 时间
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `reports_alliance_slot_hourly` AS h 
                INNER JOIN `slot` AS s
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";
            if ($params['begin'] == $params['end']) {
                $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
            } else {
                $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
            }
        } else {
            $sql = "SELECT 
                s.`name` AS `slot_name`, -- 广告位名称
                m.`name` AS `media_name`, -- 媒体名称
                sc.`name` AS `slot_class_name`, -- 广告位类型名称
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                 `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_hourly` AS h
                INNER JOIN `slot` AS s 
                INNER JOIN `media` AS m
                INNER JOIN `slot_class` AS sc ON sc.`uid` = s.`class` AND m.`uid` = s.`media` 
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`uid`
                {$order_condition}";
            $sum_data['slot_name'] = $sum_data['media_name'] = $sum_data['slot_class_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        }

        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }

    /**
     * 联盟模板报表
     * @param $params
     * @return array
     */
    public static function AllianceTemplateDailyReport($params)
    {
        $uid = UserService::getCurrentUid();
        //查询拥有权限的广告位
        $slots = UserService::GetUserSlot();
        $slots = implode("','", $slots);

        $from_condition = new ConditionCombineModel();
        $from_condition->AndCondition($uid, "s.`uid` IN ('{$slots}') AND d.`date` = h.`date` AND h.`slot_template` = st.`uid` AND st.`slot` = s.`uid`");
        $params['slot_template'] = str_replace(',', "','", $params['slot_template']);
        $from_condition->AndCondition($params['slot_template'], "h.`slot_template` IN ('{$params['slot_template']}')");

        $where_condition = new ConditionCombineModel();
        $where_condition->AndCondition($params['begin'], "d.`date` >= '{$params['begin']}'");
        $where_condition->AndCondition($params['end'], "d.`date` <= '{$params['end']}'");

        $order_condition = $where_condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                d.`date` AS `date`, 
                 d.`date` AS `period_date`, 
                SUM(bid_num) AS bid_num, -- bid
                SUM(pv) AS pv, -- 请求量
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_slot_template_hourly` AS h
                INNER JOIN `slot_template` AS st
                INNER JOIN `slot` AS s 
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";

        //图表数据
        $chart_data = ReportsAllianceHourlyModel::queryList($sql);

        $sql = "SELECT 
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `reports_alliance_slot_template_hourly` AS h 
                INNER JOIN `slot_template` AS st 
                INNER JOIN `slot` AS s 
                RIGHT JOIN `dic_date` AS d ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY s.`create_user` ORDER BY imp DESC LIMIT 1
                ";

        //汇总数据
        $sum_data = ReportsAllianceHourlyModel::queryRow($sql);

        if ($params['dimension'] == 'date') {
            $sql = "SELECT 
                d.`date` AS `date`, -- 时间
                d.`date` AS `period_date`, -- 时间
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM
                `dic_date` AS d 
                INNER JOIN `reports_alliance_slot_template_hourly` AS h 
                INNER JOIN `slot_template` AS st 
                INNER JOIN `slot` AS s ON 1
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY d.`date`
                {$order_condition}";
            if ($params['begin'] == $params['end']) {
                $sum_data['period_date'] = date('Y-m-d', strtotime($params['begin']));
            } else {
                $sum_data['period_date'] = [date('Y-m-d', strtotime($params['begin'])), date('Y-m-d', strtotime($params['end']))];
            }
        } else {
            $sql = "SELECT 
                st.`template_name` AS `template_name`, -- 广告位模板名称
                s.`name` AS `slot_name`, -- 广告位名称
                m.`name` AS `media_name`, -- 媒体名称
                sc.`name` AS `slot_class_name`, -- 广告位类型名称
                SUM(pv) AS pv, -- 请求量
                SUM(bid_num) AS bid_num,
                SUM(imp) AS imp, -- 展示量
                SUM(clk) AS clk, -- 点击量
                ROUND(SUM(imp)/SUM(pv),2) AS fr, -- 填充率
                ROUND(SUM(clk) / SUM(imp) ,4) AS ctr, -- 点击率
                ROUND(SUM(media_income),2) AS income, -- 总收入
                ROUND(SUM(media_income) / SUM(pv) * 1000,2) AS rpm , -- 每千次访问收入
                ROUND(SUM(media_income) / SUM(imp) * 1000,2) AS ecpm , -- 平均千次展示费用
                ROUND(SUM(media_income) / SUM(clk),2) AS ecpc -- 平均点击单价
                FROM 
                `dic_date` AS d INNER JOIN 
                reports_alliance_slot_template_hourly AS h
                INNER JOIN `slot_template` as st
                INNER JOIN `slot` AS s
                INNER JOIN `media` AS m 
                INNER JOIN `slot_class` AS sc ON m.`uid` = s.`media` AND sc.`uid` = s.`class`
                {$from_condition->Condition()}
                WHERE 1
                {$where_condition->Condition()}
                GROUP BY h.`slot_template`
                {$order_condition}";
            $sum_data['template_name'] = $sum_data['slot_name'] = $sum_data['media_name'] = $sum_data['slot_class_name'] = static::REPORT_SUM_NO_DATA_CHARACTERS;
        }

        //详细报表
        $page_data = BaseService::Paging($sql, $params['limit'], $params['offset']);
        array_unshift($page_data['rows'], $sum_data);
        return ['chart' => $chart_data, 'report' => $page_data];
    }


    /**
     * @param $page_data
     */
    public static function removeNameNullRow(&$page_data, $field)
    {
        foreach ($page_data['rows'] as $k => $row) {
            if (!isset($row['date']) && $row[$field] === null) {
                array_splice($page_data['rows'], $k, 1);
                $page_data['total'] = $page_data['total'] - 1;
                break;
            }
        }
    }

    #endregion
}
