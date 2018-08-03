<?php
namespace Application\Table;

use Zend\Db\TableGateway\TableGateway;

class BaseTable extends TableGateway 
{
    protected $table;
    protected $gateway;    
    protected $adapter;
    
    // gateway->select object
    protected $select;

    public static function factory() {
        return new self();
    }

    public function __construct() {
        $this->setAdapter();

        if (@func_get_arg(0)) {
            $this->table = func_get_arg(0);
        }
        $this->setGateway();
    }

    /**
     * 设置 数据库 adapter
     */
    public function setAdapter() {
        $this->adapter = \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter();
        return $this->adapter;
    }
    
    /**
     * 设置数据库 gateway
     * @return type
     */
    public function setGateway() {
        if (!$this->adapter) {
            $this->setAdapter();
        }
        $this->gateway = new TableGateway($this->table, $this->adapter);
        return $this->gateway;
    }

    public static function beginTransaction()
    {
        \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter()->getDriver()->getConnection()->beginTransaction();
    }

    public static function rollBack()
    {
        \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter()->getDriver()->getConnection()->rollback();
    }

    public static function commit()
    {
        \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter()->getDriver()->getConnection()->commit();
    }

    /**
     * 获取数据表字段列表
     * @param boolean $flip true|fase
     * @return array if $flip true (field0=>0, filed1=>1,....)
     *                if $flip false array(field0, field1,...)
     */
    public function getFields( $flip=true ) {

        $metadata = new \Zend\Db\Metadata\Metadata( $this->adapter );
//         $table = $metadata->getTable($this->table);
//         $colums = $table->getColumns();
        $colums = $metadata->getColumnNames($this->table);
        if ($flip) {
            return array_flip($colums);
        }
        return $colums;
    }

    public function IntersectKey(array $array)
    {
        $fields = $this->getFields();
        return array_intersect_key($array, $fields);
    }
    
    /**
     * 获取单表的多条数据
     */
    public function getList( $where=null ) {
        $this->select = $rowset = $this->gateway->select($where);
        $rows = $rowset->toArray();
        return $rows ?: false;
    }

    /**
     * 获取单条数据
     * @param string|array $where
     */
    public function getRow( $where ) {
        $this->select = $rowset = $this->gateway->select($where);
        $row = $rowset->toArray();
        return $row ? $row[0] : false ;
    }
    
    /**
     * 获取单条数据中某字段值
     */
    public function getAttr($where, $attr) {
        $row = $this->getRow($where);
        if (!empty($row) && isset($row[$attr])) {
            return $row[$attr];
        }
        return false;
    }
    
    
    /**
     * 通过执行sql，获取列表数据
     * @param string $sql
     * @return array
     */
    public function queryList( $sql ){
    	
        $query = $this->adapter->query($sql)->execute();
        
         
        // 1. return only string for key
        $resultSet = new \Zend\Db\ResultSet\ResultSet();
        $data = $resultSet->initialize($query)->toArray();
       
     
        // 2. return numeric and string for key 
//        $data = $query->getResource()->fetchAll();
        return $data;
    }

    
    public function queryRow( $sql ){
        $data = $this->queryList($sql);
        return $data[0];
    }

    
    public function getLastQuery(){
        $query = $this->select->getDataSource()->getResource();
        print_r( $query->queryString );
    }
    
    
    /**
     * 获取列表
     */
    public function getTableList($paramArr){
        $options = array(
            'tblName'       =>  '',     #表名
            'cols'          =>  '*',    #列名
            'whereSql'      =>  '',     #where条件
            'groupBy'       =>  '',     #group by
            'orderBy'       =>  '',     #排序 <field asc|desc>
            'offset'        =>  0,      #offset
            'limit'         =>  '',     #条数
            'debug'         =>  0,      #显示sql
            'formGet'       =>  '',     #$_GET 数组里的值 传了这个值,limit,offset,search,sort,order 等变量都从这获取
            'searchCols'    =>  array(), #搜索的字段
        );
        if (is_array($paramArr))$options = array_merge($options, $paramArr);
        extract($options);

        if ($tblName) $this->table = $tblName;

        if ($formGet) {
            $limit      = (int)$formGet['limit'];
            $offset     = (int)$formGet['offset'];
            $search     = trim($formGet['search']);
            $order      = strtolower($formGet['order']) == 'asc'  ? 'ASC'  : 'DESC';
            if (!empty($formGet['sort'])) $orderBy = " {$formGet['sort']} $order ";
			
            if ($search && $searchCols) {
            	
                $whereSql.= " and (";
                $likeComma = "";
                foreach ($searchCols as $colName) {
                    $whereSql .= $likeComma . '  ' . $colName . ' like "%' . $search . '%" ';
                    $likeComma = " or ";
                }
                $whereSql.=")";
            }
        }
		
        $limitSql = '';
        if ($limit)  $limitSql = " LIMIT $offset, $limit";
        if ($groupBy) $groupBy = " GROUP BY $groupBy ";
        if ($orderBy) $orderBy = " ORDER BY $orderBy ";
		//$debug = 1;
        $sql = "select {$cols} from {$this->table} where 1 {$whereSql} {$groupBy} {$orderBy} {$limitSql}";
//         die($sql);
        $data = $this->queryList($sql);

        #获得数量信息
        if ($groupBy) {
            // 含有groupby的count
            $sql = " SELECT COUNT(*) total FROM (select {$cols} from {$this->table} where 1 {$whereSql} {$groupBy}) tableList ";
        } else {
            $sql = "select count('x') total from {$this->table} where 1 {$whereSql}";
        }
        if ($debug) {echo $sql.'<br/>';}
        $row = $this->queryRow($sql);
        
        return array(
            'total'  => (int)$row['total'],
            'rows'   => (array)$data,
        );
    }

// --------------------------------------
// as follows is example for demo
// --------------------------------------
    
    /**
     * 获取多条数据
     * @param $paramArr
     */
    public function getRows($paramArr){
        $options = array(
            'cols'          =>  '*',   #列名
            'tblName'       =>  '',    #表名
            'offset'        =>  0,     #offset
            'limit'         =>  '',    #条数
            'whereSql'      =>  '',    #where条件
            'groupBy'       =>  '',    #group by
            'orderSql'      =>  '',    #where条件
            'debug'         =>  0,     #显示sql
        );
        if (is_array($paramArr))$options = array_merge($options, $paramArr);
        extract($options);

        if(!$tblName){
            $tblName    =   $this->table;
        }
        $limitSql = "";
        if($limit){
            $limitSql = " limit ";
            if($offset)$limitSql .= $offset . ",";
            $limitSql .= $limit;
        }
       
        if($groupBy) $groupBy = ' group by ' . $groupBy;
        $sql      = "select {$cols}  from {$tblName} where 1 {$whereSql} {$groupBy} {$orderSql} {$limitSql}";
        //die($sql);
        if($debug) { echo $sql.'<br>';}
        $query  = $this->adapter->query($sql)->execute();
        $data   = $query->getResource()->fetchAll();
        $returnData =   array();
        #去掉数字索引
        if($data){
            foreach($data as $key => $item){
                foreach ($item as $index => $val){
                    if(is_numeric($index)) unset($item[$index]);
                }
                $returnData[$key]    =   $item;
            }
        }

        return $returnData;
    }
    
    public function deleteRow($paramArr){
    	 $options = array(
            'tblName'       =>  '',    #表名
            'whereSql'      =>  '',    #where条件
            'debug'         =>  0,     #显示sql
        );
        
        if (is_array($paramArr))$options = array_merge($options, $paramArr);
        	extract($options);

        if(!$tblName){
            $tblName    =   $this->table;
        }
        
    	 $sql = "delete FROM `{$tblName}`  where 1 {$whereSql}";
    	 
    	 
         $query = $this->adapter->query($sql)->execute();
         
         return $query;
    }

    public function execute($sql)
    {
        $result = $this->adapter->query($sql)->execute();
        return $result;
    }
    
    /**
     * demo get list for gateway
     */
    private function _demo_get_list() {
        $result = $this->gateway->select();
        return $result->toArray();
    }

    /**
     * demo get row for gateway
     */
    private function _demo_get_row( $id ) {
        $rowset = $this->gateway->select(array('id' => $id));
        $row = $rowset->current();
        return $row;
    }

    /**
     * demo exec sql for adapter
     */
    private function _demo_exec_sql() {
        $sql = "SELECT * FROM $this->table";
        $query = $this->adapter->query($sql)->execute();
        // example on top of 1, or under of 2
//         $query = $this->_adapter->createStatement($sql)->execute();
//              
        // return numeric and string for key 
        $data = $query->getResource()->fetchAll();
        // example on top of 1, or under of 2
        // return only string for key
//         $resultSet = new \Zend\Db\ResultSet\ResultSet();
//         $data = $resultSet->initialize($query)->toArray();
        
        var_dump( $data );
    }

    
}
