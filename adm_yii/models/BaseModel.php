<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/8/18
 * Time: 下午8:35
 */

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Transaction;
use yii\helpers\ArrayHelper;

/**
 * Class BaseModel
 * public方法是ActiveRecord，需要有具体表
 * public方法可以执行一些完整的sql，不需要表名
 *
 * @package app\models
 * @property Transaction|null $transaction
 *
 */
abstract class BaseModel extends ActiveRecord
{
    protected static $table;
    protected static $transaction;

    /**
     * 查询符合条件的一条记录 | null
     * @param mixed $mail [k=>v,]
     * @return array|null
     */
    public static function findOne($condition)
    {
        $user = parent::findOne($condition);
        return $user ? $user->toArray() : null;
    }

    /**
     * 查询所有符合条件的记录
     * @param mixed $condition
     * @param $fields string|array 要查询的字段
     * @return array
     */
    public static function findAll($condition = [], $fields = '*')
    {
        return parent::find()->select($fields)->where($condition)->asArray()->all();
    }

    public static function tableName()
    {
        return static::$table;
    }

    public static function beginTransaction()
    {
        Yii::$app->db->beginTransaction();

    }

    public static function rollBack()
    {
        Yii::$app->db->getTransaction()->rollBack();
    }

    public static function commit()
    {
        Yii::$app->db->getTransaction()->commit();
    }


    /**
     * 插入一条记录
     * @param array $data {k1:v1, k2:v2}
     */
    public static function insertOne($data)
    {
        return Yii::$app->db->createCommand()->insert(static::$table, $data)->execute();
    }

    /**
     * 自增id
     * @return string
     */
    public static function getLastInsertValue()
    {
        return Yii::$app->db->getLastInsertID();
    }


    /**
     * 获取数据表字段列表
     * @param boolean $flip true|fase
     * @return array if $flip true (field0=>0, filed1=>1,....)
     *                if $flip false array(field0, field1,...)
     */
    public static function getFields($flip = true)
    {
        $tableSchema = Yii::$app->db->schema->getTableSchema(static::$table);
        $fields = ArrayHelper::getColumn($tableSchema->columns, 'name', false);
        return $flip ? array_flip($fields) : $fields;
    }

    public static function IntersectKey(array $array)
    {
        $fields = static::getFields();
        return array_intersect_key($array, $fields);
    }

    /**
     * 获取单表的多条数据
     * 兼容老系统 //todo rename
     */
    public static function getList($where = null)
    {
        return static::findAll($where);
    }

    /**
     * 获取单条数据
     * @param string|array $where
     */
    public static function getRow($where)
    {
        return static::findOne($where);
    }

    /**
     * 获取单条数据中某字段值
     */
    public static function getAttr($where, $attr)
    {
        $row = static::findOne($where);
        if (!empty($row) && isset($row[$attr])) {
            return $row[$attr];
        }
        return null;
    }


    /**
     * 通过执行sql，获取列表数据
     * @param string $sql
     * @return array
     */
    public static function queryList($sql)
    {
        return Yii::$app->db->createCommand($sql)->queryAll();
    }


    /**
     * @param $sql string raw sql
     * @return array|null
     */
    public static function queryRow($sql)
    {
        return Yii::$app->db->createCommand($sql)->queryOne();
    }

    public static function queryRowWithBind($sql,$bind)
    {
        return Yii::$app->db->createCommand($sql)->bindValues($bind)->queryOne();
    }

    /**
     * @param $sql string raw sql
     * @return int
     */
    public static function execute($sql)
    {
        return Yii::$app->db->createCommand($sql)->execute();
    }


    /**
     * 获取列表
     */
    public static function getTableList($paramArr)
    {
        $options = array(
            'tblName' => '',     #表名
            'cols' => '*',    #列名
            'whereSql' => '',     #where条件
            'groupBy' => '',     #group by
            'orderBy' => '',     #排序 <field asc|desc>
            'offset' => 0,      #offset
            'limit' => '',     #条数
            'debug' => 0,      #显示sql
            'formGet' => '',     #$_GET 数组里的值 传了这个值,limit,offset,search,sort,order 等变量都从这获取
            'searchCols' => array(), #搜索的字段
        );
        if (is_array($paramArr)) $options = array_merge($options, $paramArr);
        extract($options, EXTR_OVERWRITE);

        if ($tblName) {
            static::$table = $tblName;
        }

        if ($formGet) {
            $limit =  (int)ArrayHelper::getValue($formGet,'limit',0);
            $offset = (int)ArrayHelper::getValue($formGet,'offset',0);
            $search = trim($formGet['search']);
            $order = strtolower($formGet['order']) == 'asc' ? 'ASC' : 'DESC';
            if (!empty($formGet['sort'])) $orderBy = " {$formGet['sort']} $order ";

            if (strlen($search)>0 && $searchCols) {

                $whereSql .= " and (";
                $likeComma = "";
                foreach ($searchCols as $colName) {
                    $whereSql .= $likeComma . '  ' . $colName . ' like "%' . $search . '%" ';
                    $likeComma = " or ";
                }
                $whereSql .= ")";
            }
        }

        $limitSql = '';
        if ($limit) $limitSql = " LIMIT $offset, $limit";
        if ($groupBy) $groupBy = " GROUP BY $groupBy ";
        if ($orderBy) $orderBy = " ORDER BY $orderBy ";
        $sql = "select {$cols} from {$tblName} where 1 {$whereSql} {$groupBy} {$orderBy} {$limitSql}";
        $data = static::queryList($sql);

        #获得数量信息
        if ($groupBy) {
            // 含有groupby的count
            $sql = " SELECT COUNT(*) total FROM (select {$cols} from {$tblName} where 1 {$whereSql} {$groupBy}) tableList ";
        } else {
            $sql = "select count('x') total from {$tblName} where 1 {$whereSql}";
        }
        if ($debug) {
            Yii::trace($sql, __METHOD__);
        }
        $row = static::queryRow($sql);

        return array(
            'total' => (int)$row['total'],
            'rows' => (array)$data,
        );
    }

// --------------------------------------
// as follows is example for demo
// --------------------------------------

    /**
     * 获取多条数据
     * @param $paramArr
     */
    public static function getRows($paramArr)
    {
        $options = array(
            'cols' => '*',   #列名
            'tblName' => '',    #表名
            'offset' => 0,     #offset
            'limit' => '',    #条数
            'whereSql' => '',    #where条件
            'groupBy' => '',    #group by
            'orderSql' => '',    #where条件
            'debug' => 0,     #显示sql
        );
        if (is_array($paramArr)) $options = array_merge($options, $paramArr);
        extract($options);

        if (!$tblName) {
            $tblName = static::$table;
        }
        $limitSql = "";
        if ($limit) {
            $limitSql = " limit ";
            if ($offset) $limitSql .= $offset . ",";
            $limitSql .= $limit;
        }

        if ($groupBy) $groupBy = ' group by ' . $groupBy;
        $sql = "select {$cols}  from {$tblName} where 1 {$whereSql} {$groupBy} {$orderSql} {$limitSql}";
        //die($sql);
        if ($debug) {
            Yii::trace($sql, __METHOD__);
        }
//        $query = static::adapter->query($sql)->execute();
//        $data = $query->getResource()->fetchAll();
        $data = static::queryList($sql);
        $returnData = array();
        #去掉数字索引
        if ($data) {
            foreach ($data as $key => $item) {
                foreach ($item as $index => $val) {
                    if (is_numeric($index)) unset($item[$index]);
                }
                $returnData[$key] = $item;
            }
        }

        return $returnData;
    }

    public static function deleteRow($paramArr)
    {
        $options = array(
            'tblName' => '',    #表名
            'whereSql' => '',    #where条件
            'debug' => 0,     #显示sql
        );

        if (is_array($paramArr)) $options = array_merge($options, $paramArr);
        extract($options);

        if (!$tblName) {
            $tblName = static::$table;
        }

        $sql = "delete FROM `{$tblName}`  where 1 {$whereSql}";

        return Yii::$app->db->createCommand($sql)->execute();
    }


}