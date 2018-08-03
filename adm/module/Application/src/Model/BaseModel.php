<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Application\Model;

use Application\Table\BaseTable;
use Custom\Guid;

class BaseModel
{
    public function __construct()
    {
        return new self();
    }

    /**
     * 通用分页方法
     * @param $sql
     * @param $limit
     * @param $offset
     */
    public static function Paging($sql, $limit = 10, $offset = 0)
    {
        if (!$sql)
            return null;

        if (!isset($limit))
            $limit = 10;
        if (!isset($offset))
            $offset = 0;

        $guid = Guid::factory()->create();
        $total_guid = Guid::factory()->create();

        $total_sql =
            "SELECT Count(1) as `{$total_guid}`
             FROM ({$sql}) as `{$guid}`
            ";

        $sql =
            "SELECT *
             FROM ({$sql}) as `{$guid}`
             LIMIT {$offset},{$limit}
            ";

        $total_query = \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter()->query($total_sql)->execute();
        $data_query = \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter()->query($sql)->execute();

        $resultSet = new \Zend\Db\ResultSet\ResultSet();
        $total_row = $resultSet->initialize($total_query)->toArray();
        $data = $resultSet->initialize($data_query)->toArray();

        return ['rows' => $data, 'total' => $total_row[0][$total_guid]];
    }

    /**
     * 实例化*Table类对象,如果具体类不存在，实例化BaseTable
     * @param string $table_name
     * @return BaseTable
     * @demo:   $table = BaseModel::getModel('balance');
     */
    public static function getModel($table_name)
    {
        $classTable = '\Application\Table\\' . ucfirst($table_name) . 'Table';

        if (class_exists($classTable, false)) {
            $table = new $classTable();
        } else {
            $table = new BaseTable($table_name);
        }
        return $table;
    }

    /**
     * 带事物的动作方法调用
     * @param $chain_call
     * @return array
     */
    public static function Transaction($chain_call)
    {
        try {
            BaseTable::beginTransaction();
            $data = $chain_call();
            BaseTable::commit();
        } catch (\Exception $ex) {
            BaseTable::rollBack();
            return [0, $ex->getMessage()];
        }
        return [1, '', $data];
    }

    /**
     * 不带事物的方法调用
     * @param $chain_call
     * @return array
     */
    public static function ExecuteWithoutTransaction($chain_call)
    {
        try {
            $data = $chain_call();
        } catch (\Exception $ex) {
            return [0, $ex->getMessage()];
        }
        return [1, '', $data];
    }
}
