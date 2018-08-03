<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/31
 * Time: 19:58
 */
namespace Application\Table;

class MonthBillTable extends BaseTable
{
    protected $table = 'job_month_bill';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

}