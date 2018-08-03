<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/28
 * Time: 18:27
 */

namespace Application\Table;

/**
 * 充值
 * Class ChargeTable
 * @package Application\Table
 */
class ChargeTable extends BaseTable
{
    protected $table = 'charge_log';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}