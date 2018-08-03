<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/9
 * Time: 11:03
 */

namespace Application\Table;


/**
 * 分词表
 * Class SplitWordTable
 * @package Application\Table
 */
class SplitWordTable extends BaseTable
{
    protected $table = 'dic_word';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}