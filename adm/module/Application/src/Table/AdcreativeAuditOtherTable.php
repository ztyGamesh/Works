<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/6
 * Time: 15:44
 */

namespace Application\Table;


class AdcreativeAuditOtherTable extends BaseTable
{
    protected $table = 'ad_creative_audit_other';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

}