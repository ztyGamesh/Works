<?php
namespace Application\Table;


class AclTable extends BaseTable
{
    protected $table = 'acl';
    protected $gateway;
    
    
    public function checkPower($power, $controller, $action = null, $user='') {
        $aclList = $this->getRebulidAuth($power);
	
        
        //        return true;
        //         if ($action == "index") $action = null;
    
        // 此power中此user拥有此controller的权限
        if (!$action && $aclList[$power][$user][$controller]) {
            return true;
        }
        // 此power中全部user拥有此controller的权限
        if (!$action && $aclList[$power]['*'][$controller]) {
            return true;
        }
        // 此power中全部user用户全部controller的权限
        if (!$action && $aclList[$power]['*']['*']) {
            return true;
        }
    
        // 此power中此user拥有此controller/action的权限
        if ($aclList[$power][$user][$controller][$action]) {
            return true;
        }
        // 此power中所有user拥有此controller/action的权限
        if ($aclList[$power]['*'][$controller][$action]) {
            return true;
        }
        // 此power中次user拥有此controller下所有权限
        if ($aclList[$power][$user][$controller]['*']) {
            return true;
        }
        // 此power中所有user拥有此controller下所有权限
        if ($aclList[$power]['*'][$controller]['*']) {
            return true;
        }
        // 此power中此user拥有所有权限
        if ($aclList[$power][$user]['*']['*']) {
            return true;
        }
        // 此power中全部user拥有所有权限
        if ($aclList[$power]['*']['*']['*']) {
            return true;
        }
    
        return false;
    }
    
    /**
     * 得到以auth验证数据形式的power权限列表
     * @param unknown $power
     * @return Ambigous <multitype:, number>
     */
    public function getRebulidAuth( $power ){
        $list = $this->getListByPower($power);
       
        $data = array();
        if (!empty($list)) {
            foreach ($list as $val) {
                // array[power][user][controller][action]
                if ( !empty($val['action']) ){
                    $data[$val['power']][$val['user']][$val['controller']][$val['action']] = 1;
                } else {
                    $data[$val['power']][$val['user']][$val['controller']] = 1;
                }
            }
        }
        return $data;
    }
    
    
    /**
     * 获得power下所有的权限列表
     * @param unknown $power
     */
    public function getListByPower( $power ){
        $power = trim($power);
    
        $res = $this->gateway->select("power = '$power'");
        return $res->toArray();
    }
    
    
}
