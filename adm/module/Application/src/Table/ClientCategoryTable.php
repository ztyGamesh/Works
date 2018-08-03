<?php
namespace Application\Table;

class ClientCategoryTable extends BaseTable
{
    protected $table = 'client_category';
    protected $gateway;
    protected $adapter;

    /**
     * 获取主分类
     * @return array
     */
    public function getMainList() {
        $rowset = $this->gateway->select(array('pid' => ''));
        $row    = $rowset->toArray();
        return $row ?: false;
    }
    
    /**
     * 获取有效的主分类
     * @return array|false
     */
    public function getValidMainList() {
        $list = $this->getList(array('pid' => '', 'is_deleted' => 0));
        return $list ?: false;
    }
    
    /**
     * 获取主指定分类
     * @return array
     */
    public function getListByUids($uidArr) {
         
        $rowset = $this->gateway->select(array('uid' => $uidArr));
        $row    = $rowset->toArray();
        return $row ?: false;
    }
    
    /**
     * 获取所有分类
     * @return array
     */
    public function getAllCategory() {
        $rowset = $this->gateway->select();
        $row    = $rowset->toArray();
        return $row ?: false;
    }
    
}
