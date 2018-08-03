<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22
 * Time: 13:49
 */

namespace Application\Table;

class DicWordTable extends BaseTable
{
    protected $table = 'dic_adm_word';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}