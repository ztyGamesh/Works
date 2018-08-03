<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace Application\Table;


class AdgroupTable extends BaseTable
{
    protected $table = 'ad_group';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

    /**
     * 查询接口
     * @param $params
     */
    public function getList($params)
    {

    }
}