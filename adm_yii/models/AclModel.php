<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/8/18
 * Time: 下午10:08
 */
namespace  app\models;

class AclModel extends BaseModel
{
    protected static $table = 'acl';

    public static function checkPower($power, $controller, $action = null, $user='') {
        $aclList = static::getRebulidAuth($power);
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
        if (!empty($aclList[$power][$user][$controller][$action])) {
            return true;
        }
        // 此power中所有user拥有此controller/action的权限
        if (!empty($aclList[$power]['*'][$controller][$action])) {
            return true;
        }
        // 此power中次user拥有此controller下所有权限
        if (!empty($aclList[$power][$user][$controller]['*'])) {
            return true;
        }
        // 此power中所有user拥有此controller下所有权限
        if (!empty($aclList[$power]['*'][$controller]['*'])) {
            return true;
        }
        // 此power中此user拥有所有权限
        if (!empty($aclList[$power][$user]['*']['*'])) {
            return true;
        }
        // 此power中全部user拥有所有权限
        if (!empty($aclList[$power]['*']['*']['*'])) {
            return true;
        }

        return false;
    }

    /**
     * 得到以auth验证数据形式的power权限列表
     */
    public static function getRebulidAuth( $power ){
        $list = static::getListByPower($power);

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
     * @param $power string
     * @return array
     */
    public static function getListByPower( $power ){
        return static::findAll(['power'=>$power]);
    }


}