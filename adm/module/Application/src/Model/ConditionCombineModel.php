<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/30
 * Time: 15:58
 */

namespace Application\Model;

/**
 * 条件组合工具类
 * Class ConditionCombineModel
 * @package Application\Model
 */
class ConditionCombineModel
{
    private $where = '';

    function __construct()
    {
        $this->where = " ";
    }

    /**
     * 与条件
     * @param $param
     * @param $condition
     */
    public function AndCondition(&$param, $condition,$or_condition = null)
    {
        if(!$condition)
            return;

        if (isset($param) and '' !== $param) {
            if($or_condition == null)
                $this->where .= " AND " . $condition . ' ';
            else
                $this->where .= " AND (" . $condition . " OR {$or_condition}) ";
        }
    }

    /**
     * 或条件
     * @param $param
     * @param $condition
     */
    public function OrCondition(&$param, $condition)
    {
        if(!$condition)
            return;

        if (isset($param) and '' !== $param) {
            $this->where .= " OR " . $condition . ' ';
        }
    }

    public function OrderCondition(&$sort, &$order, $statment)
    {
        if (isset($sort) and isset($order) and isset($statment)) {
            return " ".$statment." ";
        }
        return " ";
    }

    public function Condition()
    {
        return $this->where;
    }
}