<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/28
 * Time: 18:22
 */
namespace Application\Table;

class AdcreativeAuditTable extends BaseTable
{
    protected $table = 'ad_creative_audit';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

}