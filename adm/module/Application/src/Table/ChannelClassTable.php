<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/27
 * Time: 15:18
 */

namespace Application\Table;

/**
 * 频道分类表
 * Class ChannelClassTable
 * @package Application\Table
 */
class ChannelClassTable extends BaseTable
{
    protected $table = 'channel_class';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}