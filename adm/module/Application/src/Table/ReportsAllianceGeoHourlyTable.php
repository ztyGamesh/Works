<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/10
 * Time: 18:11
 */

namespace Application\Table;

/**
 * 地域报表
 * Class ReportsAllianceGeoHourlyTable
 * @package Application\Table
 */
class ReportsAllianceGeoHourlyTable extends BaseTable
{
    protected $table = 'reports_alliance_geo_hourly';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}