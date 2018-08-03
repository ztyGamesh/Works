<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace Application\Table;


class AdcreativeTable extends BaseTable
{
    protected $table = 'ad_creative';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}