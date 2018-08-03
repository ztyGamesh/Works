<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/31
 * Time: 19:58
 */
namespace Application\Table;

class DrawLogTable extends BaseTable
{
    protected $table = 'draw_log';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

}