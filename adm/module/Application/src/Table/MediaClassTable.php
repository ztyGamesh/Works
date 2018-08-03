<?php
namespace Application\Table;

class MediaClassTable extends BaseTable
{
    protected $table = 'media_class';
    protected $gateway;
    protected $adapter;


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
