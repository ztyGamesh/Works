<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22
 * Time: 13:26
 */

namespace Application\Table;


class WordTable  extends BaseTable
{
    protected $table = 'ad_plan_word';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}