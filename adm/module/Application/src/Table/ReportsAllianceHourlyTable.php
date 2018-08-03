<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/9
 * Time: 17:18
 */

namespace Application\Table;

/**
 * 联盟小时报表
 * Class ReportsAllianceHourlyTable
 * @package Application\Table
 */
class ReportsAllianceHourlyTable extends BaseTable
{
    protected $table = 'reports_alliance_hourly';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}