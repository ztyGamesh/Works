<?php
/**
 * Created by PhpStorm.
 * User: gaosiyuan
 * Date: 2016/11/9
 * Time: 16:41
 */

namespace Application\Table;


class AuthorityTable extends BaseTable
{
    protected $table = 'authority';
    protected $gateway;
    protected $adapter;
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}