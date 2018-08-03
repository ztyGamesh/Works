<?php
namespace Application\Table;

class ClientTable extends BaseTable
{
    protected $table = 'client';
    protected $gateway;
    protected $adapter;

    protected $valid = 'is_deleted';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
    
    /**
     * 获取有效的列表
     */
    public function getValidList() {
        $list = $this->getList(array($this->valid => 0));
        return $list;
    }
    
    /**
     * 获取客户名称列表
     * @param unknown $uids
     */
    public function getClientNames( $uids ) {
        if (empty($uids) || !is_array($uids)) return false;
        $uids = array_unique($uids);
        $list = $this->getList(array('uid'=>$uids));
        
        $data = array();
        if (!empty($list)) {
            foreach ($list as $val) {
                $data[ $val['uid'] ] = $val['name'];
            }
        }
        return $data;
    }
    
    public function getListByAgency( $agency ) {
        $list = $this->getList(array(
            $this->valid => 0,
            'agency' => $agency,
        ));
        return $list;
    }
    
    
}
