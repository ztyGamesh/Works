<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace app\services;


use app\models\BaseModel;
use app\services\custom\Guid;
use Exception;
use Yii;
use yii\base\InvalidParamException;
use yii\helpers\ArrayHelper;

class BaseService
{

    /**
     * 通用分页方法
     * @param $sql
     * @param $limit int
     * @param $offset int
     * @param $rank boolean 是否生成序号
     */
    public static function Paging($sql, $limit = 10, $offset = 0,$rank=false)
    {
        $limit=(int)$limit;
        $offset=(int)$offset;
        if ($limit<1 || $offset<0){
            throw new InvalidParamException("invalid offset:{$offset} or limit:{$limit}");
        }
        $tmpTable = 't_' . mt_rand(0, 1000);
        $total_sql = "SELECT count(1) as total FROM ({$sql}) as {$tmpTable}";

        $sql = "SELECT * FROM ({$sql}) as {$tmpTable}  LIMIT {$offset},{$limit} ";

        $totalResult = BaseModel::queryRow($total_sql);
        $rows = BaseModel::queryList($sql);
        if ($rank){
            $init=$offset+1;
            array_walk($rows,function (&$row) use (&$init) {
                $row['rank']=$init++;
            });
        }

        return ['rows' => $rows, 'total' => $totalResult['total'] ?: 0];

    }

    /**
     * 实例化*Table类对象,如果具体类不存在，实例化BaseTable
     * @param string $table_name
     * @return BaseTable
     * @demo:   $table = BaseModel::getModel('balance');
     */
    /*public static function getModel($table_name)
    {
        throw new \Exception('not support');

        $classTable = '\Application\Table\\' . ucfirst($table_name) . 'Table';

//        if (class_exists($classTable, false)) {
//            $table = new $classTable();
//        } else {
//            $table = new BaseModel($table_name);
//        }
//        return $table;
    }*/

    /**
     * 带事物的动作方法调用
     * @param $chain_call
     * @return array
     */
    public static function Transaction($chain_call)
    {

        try {
            BaseModel::beginTransaction();
            $data = $chain_call();
            BaseModel::commit();
        } catch (\Exception $ex) {
            BaseModel::rollBack();
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
            return [0, $ex->getMessage(),null];
        }
        return [1, '', $data];
    }

    /**
     * ,拼接的字符串 进行转义 eg. "a,b" => "'a','b'"
     * @param string $dottedStr ','拼接的字符串
     * @return string
     */
    protected static function escapeDottedStr($dottedStr)
    {
        if (!$dottedStr){
            return $dottedStr;
        }
        $codes = explode(',', $dottedStr);
        $escapedStr = '';
        foreach ($codes as $code) {
            $escapedStr .= "'$code',";
        }
        $escapedStr = rtrim($escapedStr, ',');
        return $escapedStr;
    }

    /**
     * 检查分页参数limit offset,并返回整数值
     * @param $params
     * @return array
     * @throws Exception
     */
    protected static function checkPageParam(&$params)
    {
        $limit = ArrayHelper::getValue($params, 'limit');
        $offset = ArrayHelper::getValue($params, 'offset');
        if (is_null($limit) || is_null($offset)) {
            throw new Exception('缺少参数 limit/offset');
        }
        $limit = (int)$limit;
        $offset = (int)$offset;
        return array($limit, $offset);
    }

    /**
     * 根据begin、end检查日期
     * @param $params
     * @return array
     * @throws Exception
     */
    protected static function checkDateParam($params)
    {
        $begin = ArrayHelper::getValue($params, 'begin');
        $end = ArrayHelper::getValue($params, 'end');
        if (!strtotime($begin) || !strtotime($end)) {
            throw new Exception('begin/end时间格式不对');
        }
        return array(date('Y-m-d',strtotime($begin)), date('Y-m-d',strtotime($end)));
    }

    /**
     * @param $rows array
     * @param $reportHeaders array 报表头
     * @return string
     */
    protected static function generateCsvData($rows,$reportHeaders)
    {
        $csvData = '';
        // 报表头部
        foreach (array_values($reportHeaders) as $header) {
            $csvData .= "$header,";
        }
        $csvData = trim($csvData, ',');
        $csvData .= "\n";
        // 报表内容
        foreach ($rows as $row) {
            foreach ($reportHeaders as $key=>$val){
                $csvData .= "{$row[$key]},";
            }
            $csvData = trim($csvData, ',');
            $csvData .= "\n";
        }

        return self::iconv($csvData);
    }

    /**
     * @param $csvData string
     * @return string
     */
    protected static function iconv($csvData)
    {
        $data = iconv('utf-8', 'gb2312//IGNORE', $csvData);
        if (false === $data) {
            Yii::warning("iconv error");
            $data = iconv('utf8', 'gbk', $csvData);
            if (false === $data) {
                Yii::error("iconv error");
            }
        }
        return $data;
    }

    /**
     * @param $originalWords
     * @return array
     */
    public static function makeHolderAndValues(&$originalWords)
    {
        $placeHolder = '';
        $bindValues = [];
        foreach ($originalWords as $k => $originalWord) {
            $placeHolder .= ":v$k,";
            $bindValues[":v$k"] = $originalWord;
        }
        $placeHolder = rtrim($placeHolder, ',');
        return array($placeHolder, $bindValues);
    }
}
