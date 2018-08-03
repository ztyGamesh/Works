<?php
namespace Application\Table;

class AgencyTable extends BaseTable
{
    protected $table = 'agency';
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
     * 获取代理名称通过uid
     * @param array $uids
     */
    public function getAgencyNames( $uids ) {
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
    
}
