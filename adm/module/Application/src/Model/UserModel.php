<?php

namespace Application\Model;

use Application\Table\AdplanTable;
use Application\Table\AuthorityTable;

use Application\Table\ClientTable;
use Application\Table\CorporationTable;
use Application\Table\MediumTable;
use Application\Table\SlotTable;
use Application\Table\MediaTable;
use Application\Table\ResourceTable;
use Application\Table\UserTable;
use Application\Table\DrawLogTable;
use Custom\ArrayHandle;
use Custom\Email;
use Custom\Utility;
use Custom\Guid;

class UserModel
{
    public static $powerTypeArr = array(
        'admin' => array(
            'name' => '系统管理员',
            'value' => 'admin',
            'allowAdd' => false,
            'internal' => 1,
        ),
        'director' => array(
            'name' => '运行媒体总监',
            'value' => 'director',
            'allowAdd' => false,
            'internal' => 1,
        ),
        'manager' => array(
            'name' => '媒体运营专员',
            'value' => 'manager',
            'allowAdd' => false,
            'internal' => 1,
        ),
        'planner' => array(
            'name' => '媒介专员',
            'value' => 'planner',
            'allowAdd' => true,
            'internal' => 1,
        ),

        // 'default' => array(
//             'name' => '访客',
//             'value' => '',
//             'allowAdd' => false,
//             'internal' => 0,
//         ),
    );
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

    /**
     * 获取允许添加的内部用户类型
     * @return array
     * 获取用户权限配置数组
     */
    public function getInternalAddConf()
    {
        $powerList = array();

        foreach (self::$powerTypeArr as $key => $val) {
            if ($val['internal']) {
                $powerList[$key] = $val['name'];
            }
        }

        return $powerList;
    }

    /**
     * check has login
     * @return boolean has login true, otherwise false
     */
    public function checkLogin()
    {
        $user = PassportModel::factory()->getLoginUser();
        return !empty($user) ? $user : false;
    }

    /**
     * get current user-uid
     * @return string $uid
     */
    public function getCurrentUid()
    {
        return $this->getCurrentUser('uid');
    }

    public function getCurrentPlatformRole()
    {
        return $this->getCurrentUser('platform_role');
    }

    /**
     * get current user-pid
     * @return string $pid
     */
    public function getCurrentPid()
    {
        return $this->getCurrentUser('pid');
    }

    /**
     * get current user-info
     * @param string $attr
     * @return boolean|Array <false>|array(uid,mail,power,time)
     */
    public function getCurrentUser($attr = '')
    {
        $user = PassportModel::factory()->getLoginUser();

        if (empty($user)) {
            return false;
        }

        $power = self::$powerTypeArr[$user['power']];

        // set mapping
        $mapping = array(
            'uid' => $user['uid'],
            'name' => $user['name'],
            'mail' => $user['mail'],
            'power' => $user['power'],
            'power_name' => $power['name'],
            'time' => $user['time'],
            'pid' => $user['pid'],
            'internal' => $user['internal'],
            'permission' => $user['permission'],
            'role' => $user['role'],
            'platform_role' => $user['platform_role'],
        );
        if (!empty($attr)) {
            return $mapping[$attr];
        }
        return $mapping;
    }

    /**
     * 当前账户是否为管理员账户
     * @return bool
     */
    public function IsAdminUser()
    {
        $user = PassportModel::factory()->getLoginUser();

        if (empty($user)) {
            return false;
        }

        return empty($user['create_user']) ? true : false;
    }

    public function IsClientRole()
    {
        return $this->getCurrentUser('role') == 'client';
    }

    /**
     * 获取用户管理的客户
     * @param $user
     */
    public function getUserClients($paramArr)
    {
        $options = array(
            'user' => '', //用户id
            'power' => '', //用户power
            'pid' => '', //关联id
        );
        if (is_array($paramArr)) {
            $options = array_intersect_key($paramArr, $options);
        }
        extract($options);
        $hasClientPower = array(
            'agency', 'admin'
        );
        if (!in_array($power, $hasClientPower)) {
            return array();
        }

        $agencyTable = new \Application\Table\AgencyTable();
        $clientTable = new \Application\Table\ClientTable();
        #可能要根据不同的用户类型区分数据,后期要考虑的时候记得留意
        if ('client' == $power) {
            #客户账户,直接取关联客户
            $data = $clientTable->getRows(array(
                'cols' => 'uid,name', #列名
                'offset' => 0, #offset
                'limit' => '', #条数
                'whereSql' => ' and is_deleted=0  and uid="' . $pid . '"', #where条件
                'groupBy' => '', #group by
                'orderSql' => '', #where条件
                'debug' => 0, #显示sql
            ));
        } else {
            #其他账户,通过 agency 关联,agency 不只是 agency,里面有各种用户类型,比如运营什么的,若再区分,再说
            $data = $clientTable->getRows(array(
                'cols' => 'uid,name', #列名
                'offset' => 0, #offset
                'limit' => '', #条数
                'whereSql' => ' and is_deleted=0  and agency="' . $pid . '"', #where条件
                'groupBy' => '', #group by
                'orderSql' => '', #where条件
                'debug' => 0, #显示sql
            ));
        }

        if ($data) {
            $data = Utility::getKv($data, 'uid', 'name');
        }
        return $data;
    }

    /**
     * get current user-info
     * @param string $attr
     * @return boolean|Array <false>|array(uid,mail,power,time)
     */
    public function getCurrentUserClients()
    {
        $mapping = PassportModel::factory()->getSessionClients();
        if ($mapping) {
            return $mapping;
        }

        $user = PassportModel::factory()->getLoginUser();
        if (empty($user)) {
            return false;
        }

        //session 里没有,重新获取
        $clients = $this->getUserClients(array(
            'user' => $user['uid'], //用户id
            'power' => $user['power'], //用户power
            'pid' => $user['pid'], //关联id
        ));

        //当未选择客户时,默认选择第一个客户
        // 当前选择的client信息
        $mapping['currentClientUid'] = '';
        $mapping['currentClientName'] = '';
        if ($clients) {
            foreach ($clients as $key => $val) {
                $mapping['currentClientUid'] = $key;
                $mapping['currentClientName'] = $val;
                break;
            }
        }
        // set mapping
        $mapping['clients'] = $clients;
        PassportModel::factory()->setSessionClients($mapping);
        return $mapping;
    }

    /**
     * 获取用户类型
     */
    public function getPowerSelect($power)
    {
        $select = array();
        foreach (self::$powerTypeArr as $val) {
            $selected = '';
            if ($power && $power == $val['value']) {
                $selected = 'selected';
            }
            $select[] = array(
                'name' => $val['name'],
                'value' => $val['value'],
                'selected' => $selected,
            );
        }
        return $select;
    }

    /**
     * 获取用户权限
     */
    public function getPermissionSelect($default)
    {
        $select = array();
        $permissionArr = UserTable::$permissionArr;
        foreach ($permissionArr as $key => $val) {
            $selected = '';
            if ($default && $default == $key) {
                $selected = 'selected';
            }
            $select[] = array(
                'name' => $val,
                'value' => $key,
                'selected' => $selected,
            );
        }
        return $select;
    }

    /**
     * 获取当前被管理的 client 以后封装
     */
    public function getCurrentClient()
    {
        $user = PassportModel::factory()->getSessionClients();
        if (isset($user['currentClientUid']) && $user['currentClientUid']) {
            return $user['currentClientUid'];
        }
        return '';
    }

    /**
     * 以html-select形式返回内部用户
     */
    public function getInternalUserSelect()
    {
        $table = new UserTable();
        $list = $table->getInternalUsers();

        $data = array();
        if (!empty($list)) {
            foreach ($list as $val) {
                $data[$val['uid']] = $val['name'];
            }
        }
        return $data;
    }

    /**
     * 获取用户name列表，
     * @param array $uids
     * @return array (uid=>name,...);
     */
    public function getUsernameList($uids)
    {
        if (empty($uids)) {
            return false;
        }
        if (!is_array($uids)) $uids = array($uids);
        $uids = array_unique($uids);

        $table = new UserTable();
        $list = $table->getList(array('uid' => $uids));

        $data = \Custom\Utility::getKv($list, 'uid', 'name');
        return $data;
    }

    /**
     * 获取 客户选择的 uid  =>  name  数组
     */
    public function getClientSelect()
    {
        $data = array();
        $table = new UserTable();
        $res = $table->getRows(array(
            'cols' => 'uid,name', #列名
            'tblName' => 'client', #表名
            'offset' => 0, #offset
            'limit' => '', #条数
            'whereSql' => ' and is_deleted=0 ', #where条件
            'groupBy' => '', #group by
            'orderSql' => '', #where条件
            'debug' => 0, #显示sql
        ));
        if ($res) {
            $data = Utility::getKv($res, 'uid', 'name');
        }
        return $data;
    }

    /**
     * 获取agency列表，以html-select形式
     */
    public function getAgencySelect()
    {
        $table = BaseModel::getModel('agency');
        $list = $table->getList(array('is_deleted' => 0));
        return Utility::getKv($list, 'uid', 'name');
    }

    /**
     * 获取 用户选择的 uid  =>  name  数组
     */
    public function getUserSelect()
    {
        $data = array();
        $table = new UserTable();
        $res = $table->getRows(array(
            'cols' => 'uid,name', #列名
            'tblName' => 'user', #表名
            'offset' => 0, #offset
            'limit' => '', #条数
            'whereSql' => ' and is_deleted=0 ', #where条件
            'groupBy' => '', #group by
            'orderSql' => '', #where条件
            'debug' => 0, #显示sql
        ));
        if ($res) {
            $data = Utility::getKv($res, 'uid', 'name');
        }
        return $data;
    }

    /**
     * 获取用户列表
     */
    public function getList($formGet)
    {
//        $whereSql = ' and u.is_deleted=0 ';
        $tblName = ' user u ';
        $cols = ' u.* ';

        if ($formGet['power']) {
            $whereSql .= ' and u.power="' . $formGet['power'] . '"';
        }
        if ($formGet['internal']) {
            $whereSql .= ' and u.internal="' . $formGet['internal'] . '"';
        }
        $paramArr = array(
            'tblName' => $tblName, // 表名
            'cols' => $cols, // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'u.name'
            ), // 搜索的字段
            'whereSql' => $whereSql,
            'orderBy' => 'u.is_deleted ASC, u.create_time desc',
            'debug' => 0,
        );

        $table = new UserTable();
        $res = $table->getTableList($paramArr);
        if ($res['rows']) {
            $powerArr = self::$powerTypeArr;
            foreach ($res['rows'] as $key => $val) {
                $createTime = date("Y-m-d", $val['create_time']);
                $res['rows'][$key]['create_time'] = $createTime;
                $res['rows'][$key]['powerTitle'] = $powerArr[$val['power']]['name'];
            }
        }
        return $res;
    }

    /**
     * 获取广告主用户列表
     */
    public function getClientList($formGet)
    {

        $paramArr = array(
            'tblName' => "user u LEFT JOIN client c ON u.pid=c.uid", // 表名
            'cols' => "u.*, c.name as belong", // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'u.name'
            ), // 搜索的字段
            'whereSql' => " and u.is_deleted = 0 and (power = 'client' or power = 'agency')",
            'orderBy' => ' u.create_time desc',
            'debug' => 0,
        );
        $table = new UserTable();
        $res = $table->getTableList($paramArr);
        if ($res['total']) {
            $powerArr = self::$powerTypeArr;
            foreach ($res['rows'] as &$val) {
                $createTime = date("Y-m-d", $val['create_time']);
                $val['create_time'] = $createTime;
                $val['powerTitle'] = $powerArr[$val['power']]['name'];
            }
            unset($val);
        }
        return $res;
    }

    /**
     * 获取代理商用户列表
     */
    public function getAgencyList($formGet)
    {

        $paramArr = array(
            'tblName' => "user u LEFT JOIN agency a ON u.pid=a.uid", // 表名
            'cols' => "u.*, a.name as belong", // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'u.name'
            ), // 搜索的字段
            'whereSql' => " and u.is_deleted = 0 and (u.power = 'agency' or u.power = 'client')",
            'orderBy' => ' u.create_time desc',
            'debug' => 0,
        );
        $table = new UserTable();
        $res = $table->getTableList($paramArr);
        if ($res['total']) {
            $powerArr = self::$powerTypeArr;
            foreach ($res['rows'] as &$val) {
                $createTime = date("Y-m-d", $val['create_time']);
                $val['create_time'] = $createTime;
                $val['powerTitle'] = $powerArr[$val['power']]['name'];
            }
            unset($val);
        }
        return $res;
    }

    /**
     * 获取媒体用户列表
     */
    public function getSiteList($formGet)
    {
        $paramArr = array(
            'tblName' => "user u LEFT JOIN site s ON u.pid=s.uid", // 表名
            'cols' => "u.*, s.name as belong", // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'u.name'
            ), // 搜索的字段
            'whereSql' => " and u.is_deleted = 0 and (u.create_user = '{$formGet['uid']}')",
            'orderBy' => ' u.create_time desc',
            'debug' => 0,
        );
        $table = new UserTable();
        $res = $table->getTableList($paramArr);
        if ($res['total']) {
            $powerArr = self::$powerTypeArr;
            foreach ($res['rows'] as &$val) {
                $createTime = date("Y-m-d", $val['create_time']);
                $val['create_time'] = $createTime;
                $val['powerTitle'] = $powerArr[$val['power']]['name'];
            }
            unset($val);
        }
        return $res;
    }

    /**
     * 通过id获取用户
     */
    public function getUserByUid($uid)
    {
        $table = new UserTable();
        $row = $table->getUserByUid($uid);

        $power = self::$powerTypeArr[$row['power']];
        $row['power_name'] = $power['name'];

        return $row;
    }

    /**
     * 校验保存的数据
     * @param $params
     */
    public function doCheckSave($data)
    {
        $table = new UserTable();
        $status = 1;
        $msg = '';
        #密码
        if (($data['password']) || ($data['password2'])) {
            if ($data['password'] != $data['password2']) {
                $msg = '密码不一致';
            }
            if (strlen($data['password']) < 6) {
                $msg = '密码长度必须大于6位';
            }
            #加密用户账户
            if (!$msg && $data['password']) {
                $data['password'] = md5($data['password']);
                unset($data['password2']);
            }
        } else {
            unset($data['password']);
            unset($data['password2']);
        }

        if (!$msg) {
            //验证邮箱
            if ($data['uid']) {
                unset($data['mail']);
            } else {
                $pattern = "/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i";
                if (preg_match($pattern, $data['mail'])) {
                    #判断邮箱是否存
                    $exist = $table->getUserByMail($data['mail']);
                    if ($exist) {
                        $msg = '该邮箱已经存在';
                    }
                } else {
                    $msg = '邮箱地址不正确';
                }
            }
        }

        if ($msg) $status = 0;
        return array(
            'status' => $status,
            'msg' => $msg,
            'data' => $data,
        );
    }

    /**
     * 保存数据
     * @param $params
     * @return bool
     */
    public function doSave($params)
    {

        $table = new UserTable();
        $colArr = $table->getFields();
        $data = array_intersect_key($params, $colArr);

        $user = $this->getCurrentUid();
        #更新
        if (isset($data['uid']) && $data['uid']) {
            $data['edit_user'] = $user; //获取用户,等封装
            $data['edit_time'] = time();
            $res = $table->update($data, array('uid' => $data['uid']));

        } else {
            $data['uid'] = Guid::factory()->create();
            $data['create_user'] = $user; //获取用户,等封装
            $data['create_time'] = time();
            $res = $table->insert($data);
        }
        return $res ? $data['uid'] : false;
    }

    /**
     * 删除数据,软删除
     * @param $uidArr
     * @return bool
     */
    public function doDel($uidArr)
    {
        $table = new UserTable();
        $data = array('is_deleted' => 1);
        $res = $table->update($data, array('uid' => $uidArr));

        return $res ? true : false;
    }

    /**
     * 修改密码
     */
    public function doModifyPasswd($params, $uid)
    {
        $options = array(
            'oldpasswd' => '',
            'newpasswd' => '',
            'newpasswd2' => '',
        );
        if (is_array($params)) {
            $options = array_intersect_key($params, $options);
        }
        extract($options);

        if (empty($oldpasswd) || empty($newpasswd) || empty($newpasswd2)) {
            return array(0, '请输入旧密码、新密码是否已输入。');
        }
        if ($newpasswd != $newpasswd2) {
            return array(0, '新密码2次输入不一致。');
        }

        $table = new UserTable();
        $row = $table->getUserByUid($uid);
        if ($row['password'] != md5($oldpasswd)) {
            return array(0, '旧密码输入不正确。');
        }
        $res = $table->update(array('password' => md5($newpasswd)), array('uid' => $uid));
        if (!$res) {
            return array(0, '密码修改失败，请检查输入的信息。');
        }
        return array(1, '密码修改成功。');
    }

    public static function getMenu($uid = "")
    {
        $categoryTbl = new UserTable();
        $res = array();

        $ids = (new UserModel())->GetUserClient($uid);

        foreach ($categoryTbl->getList() as $val) {
            // 所属资源过滤
            if ($uid) {
                if (in_array($val['uid'], $ids)) {
                    $res[$val['uid']] = $val['name'];
                }
            } else {
                $res[$val['uid']] = $val['name'];
            }
        }
        return $res;
    }

    public static function NavigationTree()
    {
        return
            [
                ['url' => '/media', 'name' => '媒体管理', 'pid' => '/'],
                ['url' => '/client', 'name' => '广告主管理', 'pid' => '/'],
                ['url' => '/user', 'name' => '权限管理', 'pid' => '/'],
                ['url' => '/promotion', 'name' => '推广管理', 'pid' => '/'],
                ['url' => '/audit', 'name' => '审核管理', 'pid' => '/'],
                ['url' => '/alliancereport', 'name' => '数据报表', 'pid' => '/'],
                ['url' => '/charge', 'name' => '财务', 'pid' => '/'],
                ['url' => '/account', 'name' => '账户', 'pid' => '/'],
                ['url' => '/dashboard', 'name' => '数据概览', 'pid' => '/'],

                ['url' => '/media/company', 'name' => '媒介渠道', 'pid' => '/media'],
                ['url' => '/media/media', 'name' => '媒体列表', 'pid' => '/media'],
                ['url' => '/media/slot', 'name' => '广告位配置', 'pid' => '/media'],
                ['url' => '/media/download', 'name' => 'SDK下载', 'pid' => '/media'],
                ['url' => '/media/allianceslotaddview', 'name' => '广告位配置', 'pid' => '/media'],

                ['url' => '/client/agency', 'name' => '广告代理列表', 'pid' => '/client'],
                ['url' => '/client/client', 'name' => '广告主列表', 'pid' => '/client'],

                ['url' => '/promotion/adgrouplistview', 'name' => '广告组', 'pid' => '/promotion'],
                ['url' => '/promotion/adplanistview', 'name' => '广告计划', 'pid' => '/promotion'],
                ['url' => '/promotion/adcreativelistview', 'name' => '广告创意', 'pid' => '/promotion'],

                ['url' => '/user/userpermissionview', 'name' => '媒体账户', 'pid' => '/user'],
                ['url' => '/user/clientuserlistview', 'name' => '广告主账户', 'pid' => '/user'],

                ['url' => '/audit/adcreativeauditlistview', 'name' => '创意审核', 'pid' => '/audit'],

                //广告主维度联盟报表
                ['url' => '/alliancereport/allianceclientview', 'name' => '账户报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/allianceadgroupview', 'name' => '推广组报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/allianceadplanview', 'name' => '推广计划报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/allianceadcreativeview', 'name' => '推广创意报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/alliancewordview', 'name' => '关键词报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/alliancegeoview', 'name' => '地域报表', 'pid' => '/alliancereport'],

                //媒体维度联盟报表
                ['url' => '/alliancereport/allianceaccountview', 'name' => '账户报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/alliancemediaview', 'name' => '媒体报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/allianceslotview', 'name' => '广告位报表', 'pid' => '/alliancereport'],
                ['url' => '/alliancereport/alliancetemplateview', 'name' => '模板报表', 'pid' => '/alliancereport'],

                ['url' => '/charge/chargelistview', 'name' => '充值记录', 'pid' => '/charge'],
                ['url' => '/charge/drawlistview', 'name' => '媒体提现', 'pid' => '/charge'],
                ['url' => '/charge/applydrawlistview', 'name' => '财务', 'pid' => '/charge'],

                ['url' => '/account/mediaaccountview', 'name' => '账户信息', 'pid' => '/account'],

                ['url' => '/dashboard/mediadashboardview', 'name' => '数据概览', 'pid' => '/dashboard'],
                ['url' => '/dashboard/clientdashboardview', 'name' => '数据概览', 'pid' => '/dashboard'],
            ];
    }

    #region json 版本权限

    public function createAuth($uid, $auth, $resource)
    {
        $auth_default = array(
            "media_slot" => "write",// or read
            "client" => "write",
            "order" => "write",
            "bill" => "write",
            "user" => "write",
        );

        foreach ($auth_default as $key => $val) {
            $auth[$key] = $auth[$key] ? $auth[$key] : $val;
        }

        $resource_default = array(
            "client" => array(),
            "media" => array()
        );
        if (!isset($resource["client"]) || !is_array($resource["client"])) {
            $resource["client"] = $resource_default["client"];
        }
        if (!isset($resource["media"]) || !is_array($resource["media"])) {
            $resource["media"] = $resource_default["media"];
        }

        $params['uid'] = $uid;
        $params['authority'] = json_encode($auth);
        $params['resource'] = json_encode($resource);

        // 插入数据行并返回插入的行数
        $table = new UserTable();
        $colArr = $table->getFields();
        $data = array_intersect_key($params, $colArr);

        $res = $table->update($data, array('uid' => $data['uid']));

        return $res ? true : false;
    }

    public function addResource($uid, $type, $rid)
    {
        $table = new UserTable();
        $row = $table->getUserByUid($uid);

        $resource = json_decode($row['resource']);
        $media = $resource->media;
        $client = $resource->client;

        if ($type == "client") {
            array_push($client, $rid);
        }

        if ($type == "media") {
            array_push($media, $rid);
        }
        $resource['media'] = $media;
        $resource['client'] = $client;

        $params['uid'] = $uid;
        $params['authority'] = $row['authority'];
        $params['resource'] = json_encode($resource);

        $res = $table->update($data, array('uid' => $data['uid']));

        return $res ? true : false;
    }

    public function checkPower($uid, $auth, $do)
    {
        $table = new UserTable();
        $row = $table->getUserByUid($uid);

        $authority = json_decode($row['authority']);

        if ($do == "none") {
            return false;
        }
        if ($do == "read") {
            if ($authority->$auth == 'read' || $authority->$auth == 'write') {
                return true;
            }
        }
        if ($do == "write") {
            if ($authority->$auth == 'write') {
                return true;
            }
        }
        return false;
    }

    public function getPowerSlot($uid)
    {
        $table = new UserTable();
        $row = $table->getUserByUid($uid);

        $resource = json_decode($row['resource']);
        $my_media = $resource->media;
        $my_client = $resource->client;

        $where = " in ('" . implode("','", $my_media) . "')";
        $sql = "select o.client from ad as ad left join `order` as o on ad.order = o.uid  where ad.uid " . $where;

        $res = $table->query($sql);
        foreach ($res as $val) {
            array_push($my_media, $val);
        }

        return $my_client;
    }

    public function getPowerMedia($uid)
    {
        $table = new UserTable();
        $row = $table->getUserByUid($uid);

        $resource = json_decode($row['resource']);
        $my_media = $resource->media;
        $my_client = $resource->client;


        // 投放表里的广告住投放的媒体
        $where = " in ('" . implode("','", $my_client) . "')";
        $sql = "select ad.media from ad as ad left join `order` as o on ad.order = o.uid  where o.uid " . $where;

        $res = $table->query($sql);
        foreach ($res as $val) {
            array_push($my_media, $val);
        }

        return $my_media;
    }

    public function getPowerClient($uid)
    {
        $table = new UserTable();
        $row = $table->getUserByUid($uid);

        $resource = json_decode($row['resource']);
    }

    #endregion

    #region 表版本 权限

    public function SaveAuthority($uid, $data)
    {
        if ($data) {
            $data = json_decode($data, true);
            $table = new AuthorityTable();
            $colArr = $table->getFields();
            foreach ($data as $item) {
                $item_date = array_intersect_key($item, $colArr);
                $item_date['uid'] = $uid;
                $table->insert($item_date);
            }
        }
    }


    /**
     * 保存媒体用户的资源 以前存resource表，现在设置media.medium=user.uid
     * @param $uid 用户id
     * @param $data 资源数据
     */
    public function SaveResource($uid, $data)
    {
        if ($data) {
            $data = json_decode($data, true);
            /**
             * 先清空，再设置
             */
            MediaTable::factory()->update(['medium'=>''],['medium'=>$uid]);
            foreach ($data as $item){
                MediaTable::factory()->update(['medium'=>$uid],['uid'=>$item['id']]);
            }
        }
    }

    /**
     * 权限保存
     * @param $uid
     * @param $data
     */
    public function SaveRawAuthority($uid, $data)
    {
        if ($data) {
            $table = new AuthorityTable();
            $colArr = $table->getFields();
            foreach ($data as $item) {
                $item_date = array_intersect_key($item, $colArr);
                $item_date['uid'] = $uid;
                $table->insert($item_date);
            }
        }
    }

    public function SaveClientResource($uid, $data)
    {
        if ($data) {
            $table = new ResourceTable();
            $colArr = $table->getFields();
            foreach ($data as $item) {
                $item_date = array_intersect_key($item, $colArr);
                $item_date['platform_role'] = 'alliance';
                $item_date['uid'] = $uid;
                $item_date['type'] = 'bundle_id';//@xlx
                $table->insert($item_date);
            }
        }
    }

    /**
     * 获取用户可使用广告位uid
     * @param $uid
     */
    public function GetUserSlot()
    {
        if (UserModel::factory()->IsAdminUser()) {
            //管理员返回所有广告位id
            $sql = "SELECT 
                    s.`uid`
                    FROM
                      `media` AS m,
                      `slot` AS s
                    WHERE
                    s.`media` = m.`uid`
                   ";
            $data = (new SlotTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        } else {
            $uid = UserModel::factory()->getCurrentUid();
            $role = UserModel::factory()->getCurrentPlatformRole();
            //其他角色返回当前角色下支持的媒体的广告位id
//            $sql = "SELECT
//                      s.`uid`
//                    FROM
//                      `media` AS m,
//                      `slot` AS s
//                    WHERE s.`media` = m.`uid`
//                      AND (
//                        m.`uid` IN
//                        (SELECT
//                          id
//                        FROM
//                          resource AS r
//                          INNER JOIN `user` AS u
//                            ON u.`platform_role` = r.`platform_role`
//                        WHERE r.`type` = 'media'
//                          AND r.uid = '{$uid}')
//                        OR s.create_user = '{$uid}'
//                      )
//                      AND s.`platform_role` = '{$role}'
//                   ";
            $sql = " SELECT s.uid
                    FROM slot s
                      JOIN user u ON s.create_user = u.uid
                    WHERE u.uid = '{$uid}'";
            $data = (new SlotTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        }
    }

    /**
     * 获取用户可使用的媒体uid 广告主根据资源返回；媒体根据media.medium=user.uid返回；管理员返回所有的数据
     * + 媒体的bundle_id不能为空
     * + 媒体状态为激活
     * @param $uid 用户id
     */
    public function GetUserMedia($uid = '')
    {
        if (UserModel::factory()->IsClientRole()) {//广告主
            $sql = "
                    SELECT
                      m.uid
                    FROM
                      `media` AS m,
                      `user` AS u
                    WHERE u.`uid` = '{$uid}' and u.pause='0'
                      AND
                      (m.`bundle_id` IN
                      (SELECT
                        id
                      FROM
                        resource AS r
                      WHERE r.`type` = 'bundle_id' and r.`platform_role` = u.`platform_role`
                    AND r.uid = u.`uid` and r.id!=''
                       ) OR m.`create_user` = u.`uid`)
                     ";
            $data = (new MediaTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        } else {//媒体
            $sql = " SELECT m.uid FROM `media` AS m JOIN user u ON u.uid = m.medium WHERE u.pause='0'";
            if (!UserModel::factory()->IsAdminUser()) {
                $sql .= " and u.uid='$uid'";
            }
            $data = (new MediaTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        }
    }

    /**
     * 获取可以使用的广告主uid
     * @param $uid
     */
    public function GetUserClient($uid)
    {
        if (!UserModel::factory()->IsAdminUser()) {
            $sql = "SELECT 
                      m.uid
                    FROM
                      `client` AS m,
                      `user` AS u 
                    WHERE u.`uid` = '{$uid}' 
                      AND (
                      m.`uid` IN 
                      (SELECT 
                        r.id 
                      FROM
                        resource AS r
                      WHERE r.`type` = 'client' AND r.`platform_role` = u.`platform_role`
                        AND r.uid = u.`uid`)
                        OR
                        m.`create_user` = u.`uid`
                        )
                    ";
            $data = (new UserTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        } else {
            $sql = "SELECT 
                      m.uid
                    FROM
                      `client` AS m";
            $data = (new UserTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        }
    }

    /**
     * 获取用户媒介渠道
     * @param $uid
     * @return array|null
     */
    public function GetUserMediaCompany($uid)
    {
        if ($uid) {
//            $sql = "
//                    SELECT
//                    DISTINCT
//                      m.company
//                    FROM
//                      `media` AS m,
//                      `user` AS u
//                    WHERE u.`uid` = '{$uid}'
//                      AND
//                      (m.`uid` IN
//                      (SELECT
//                        id
//                      FROM
//                        resource
//                      WHERE `type` = 'media'
//                    AND uid = u.`uid`
//                       ) OR m.`create_user` = u.`uid`)
//                     ";
            $sql = "            
                    SELECT 
                    uid
                    FROM `company`
                    WHERE create_user = '{$uid}'
                                ";
            $data = (new MediaTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        }
        return null;
    }

    public function GetUserAgency($uid)
    {
        if ($uid) {
//            $sql = "SELECT
//                      DISTINCT
//                      m.agency
//                    FROM
//                      `client` AS m,
//                      `agency` as a,
//                      `user` AS u
//                    WHERE u.`uid` = '{$uid}'
//                    AND m.agency != ''
//                      AND (
//                      m.`uid` IN
//                      (SELECT
//                        id
//                      FROM
//                        resource
//                      WHERE `type` = 'client'
//                        AND uid = u.`uid`)
//                        OR
//                        m.`create_user` = u.`uid`
//                        )
//                    ";
            $sql = "SELECT 
                      a.uid
                    FROM                    
                      `agency` as a
                    WHERE a.create_user = '{$uid}'
                    ";
            $data = (new UserTable())->queryList($sql);
            return ArrayHandle::FetchMultipleArrayLeaf($data);
        }
        return null;
    }

    #endregion

    /**
     * 获取指定用户id下属所有子用户
     * @param $uid
     * @return array
     */
    public function getChildUser($params)
    {
        $columns = ['name', 'link_name', 'uid', 'mail', 'tel', 'pause', 'platform_role', 'allow_platform_role'];
        $columnsStr = array_reduce($columns, function ($old, $val) {
            return $old ? "$old,u.$val" : "u.$val";
        });
        $condition = "";
        if ($params['search']) {
            $condition = " and u.name like '{$params['search']}%'";
        }
        if (!empty($params['media_type'])) {
            $condition .= " and m.media_type= '{$params['media_type']}'";
        }
        $pause = isset($params['pause']) ? trim($params['pause']) : '';
        if ($pause !== '') {
            $condition .= " and u.pause= '$pause'";
        }

//        $columnsStr="u.*";
        $params['cols'] = "$columnsStr,m.media_type, (SELECT uu.name FROM `user` AS uu WHERE uu.uid = u.create_user) AS parent_name";
        $params['tblName'] = "`user` AS u left JOIN `medium` AS m on m.uid=u.uid";
        $params['whereSql'] = " AND u.`role` = 'media' AND u.is_deleted = 0 AND  FIND_IN_SET(u.uid ,get_child_user('" . $params['uid'] . "'))" . $condition;
        $params['orderBy'] = $params['sort'] ? $params['sort'] . ' ' . $params['order'] : "create_time DESC";

        $data = (new UserTable())->getTableList($params);

        array_walk_recursive($data, function (&$val, $key) {
            $val = $key == 'create_time' ? date('Y-m-d', $val) : $val;
        });
        return $data;
    }

    /**
     * 更改用户状态
     * @param $uid
     */
    public function changeUserStatus($uid, $status = 0)
    {
        $sql = "UPDATE `user`
                SET pause = {$status}
                WHERE uid = '{$uid}'";
        return (new UserTable())->execute($sql);
    }

    /**
     * 提取需要减少的资源uid
     * @param $uid
     * @param $data
     */
    public function ExtractDiffResource($uid, $data)
    {
        if (!$uid or !$data)
            return null;

        $ids = ArrayHandle::FetchMultipleArrayLeafWithKey($data, "id");
        $table = new ResourceTable();
        $base_ids = $table->getList(['uid' => $uid]);
        $base_ids = ArrayHandle::FetchMultipleArrayLeafWithKey($base_ids, 'id');
        $diff = array_diff($ids, $base_ids);
        return array_intersect($base_ids, $diff);
    }

    /**
     * 提取需要降低的权限
     * @param $uid
     * @param $data
     */
    public function ExtractDiffAuthority($uid, $data)
    {
        if (!$uid or !$data)
            return null;

        $authoritys = [];
        foreach ($data as $item) {
            $authoritys[] = $item['url'] . '_' . $item['authority'];
        }

        $table = new AuthorityTable();
        $base_authoritys = $table->queryList("SELECT 
                                        CONCAT(url,'_',authority) AS authority
                                        FROM `authority`
                                        WHERE uid = '{$uid}'");

        $base_authoritys = ArrayHandle::FetchMultipleArrayLeaf($base_authoritys);

        $diff = array_diff($authoritys, $base_authoritys);
        $reduce = array_intersect($authoritys, $diff);

        $final = [];
        foreach ($reduce as $item) {
            foreach ($base_authoritys as $base_item) {
                $r_item = explode('_', $item);
                $b_item = explode('_', $base_item);
                if ($r_item[0] == $b_item[0] and $r_item[1] < $b_item[1]) {
                    $final[] = ['url' => $r_item[0], 'authority' => $r_item[1]];
                }
            }
        }
        return $final;
    }

    public function ReduceChildResource($parent_id, array $reduce_id)
    {
//        if ($parent_id and $reduce_id) {
//            $sql = "UPDATE `user` SET resource = REPLACE(resource,',\"{$reduce_id}\"', \"\")  WHERE  FIND_IN_SET(uid,get_child_user('{$parent_id}')) > 0; ";
//            (new UserTable())->execute($sql);
//            $sql = "UPDATE `user` SET resource = REPLACE(resource,'\"{$reduce_id}\"', \"\")  WHERE  FIND_IN_SET(uid,get_child_user('{$parent_id}')) > 0; ";
//            (new UserTable())->execute($sql);
//        }
        if ($parent_id and $reduce_id) {
            $ids = "'" + implode("','", $reduce_id) + "'";
            $sql = "DELETE *
                    FROM `resource` AS r
                    WHERE r.id IN ({$ids}) AND FIND_IN_SET(r.`uid`,get_child_user('{$parent_id}')) > 0";
            (new ResourceTable())->execute($sql);
        }
    }

    public function ReduceChildAuth($parent_id, array $reduce_items)
    {
//        if ($parent_id and $url and $power) {
//            $sql = "UPDATE `user` SET resource = REPLACE(resource,',\"{$reduce_id}\"', \"\")  WHERE  FIND_IN_SET(uid,get_child_user('{$parent_id}')) > 0; ";
//            (new UserTable())->execute($sql);
//        }
        if ($parent_id and $reduce_items) {
            foreach ($reduce_items as $tiem) {
                $sql = "UPDATE `authority` 
                        SET authority = {$tiem['authority']}
                        WHERE url = '{$tiem['url']}' AND FIND_IN_SET(uid,get_child_user('{$parent_id}')) > 0";
                (new UserTable())->execute($sql);
            }
        }
    }

    /**
     * 默认的媒体联盟权限生成方法
     * @param $uid
     */
    public function DefaultAllianceMediaAuthority()
    {
        $array =
            [
                ['url' => '/media', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/charge', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/account', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/dashboard', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/media/media', 'platform_role' => 'alliance', 'authority' => '1'],
                ['url' => '/media/slot', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/media/download', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/alliancereport/allianceaccountview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/alliancemediaview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/allianceslotview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/alliancetemplateview', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/charge/applydrawlistview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/account/mediaaccountview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/dashboard/mediadashboardview', 'platform_role' => 'alliance', 'authority' => '2'],

            ];

        return $array;
    }

    /**
     * adx 账户默认权限 只有财务、账户
     * @return array
     */
    public function DefaultAdxMediaAuthority()
    {
        $array =
            [
                ['url' => '/charge', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/charge/applydrawlistview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/account', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/account/mediaaccountview', 'platform_role' => 'alliance', 'authority' => '2'],

            ];

        return $array;
    }

    public function TruncateResource($uid)
    {
        (new ResourceTable())->execute("DELETE resource FROM resource WHERE uid = '{$uid}'");
    }

    public function TruncateAuthority($uid)
    {
        (new AuthorityTable())->execute("DELETE authority FROM authority WHERE uid = '{$uid}'");
    }

    /**
     * 保存(更新)用户
     * @param $params
     * @return array
     */
    public function SaveMediaUser($params)
    {
        $table = new UserTable();
        $colArr = $table->getFields();
        $data = array_intersect_key($params, $colArr);
        $user_id = $this->getCurrentUid();

        $data['role'] = 'media';
        $data['platform_role'] = 'alliance';
        $data['allow_platform_role'] = 'alliance';

        //保存公司
        $corporation_id = CorporationModel::factory()->Save($params['corporation_name']);
        $data['corporation_id'] = $corporation_id;

        if (isset($data['uid']) && !empty($data['uid'])) {
            $data['edit_user'] = $user_id; //获取用户,等封装
            $data['edit_time'] = time();

            if (!isset($data['password']) or empty($data['password']))
                unset($data['password']);
            else
                $data['password'] = md5($data['password']);

            $table->update($data, array('uid' => $data['uid']));
        } else {
            $data['uid'] = Guid::factory()->create();
            $data['create_user'] = $user_id; //获取用户,等封装
            $data['create_time'] = time();
            $data['password'] = md5($data['password']);
            $table->insert($data);
        }

        //清空之前这个uid的权限 资源表
        $this->TruncateAuthority($data['uid']);

        //只有自营账户后应该只有媒体可以作为资源保存。（以后会去掉）
        $resources = isset($params['resource']) ? $params['resource'] : '';
        $this->SaveResource($data['uid'], $resources);

        if (!empty($params['media_type']) && $params['media_type'] == "adx") {
            //adx authority:只有账户、财务
            $alliance_authority = $this->DefaultAdxMediaAuthority();
        } else {
            //媒体管理、报表功能
            $alliance_authority = $this->DefaultAllianceMediaAuthority();
        }
        $this->SaveRawAuthority($data['uid'], $alliance_authority);

        $params['uid'] = $data['uid'];

        //保存媒体账户独有的信息
        MediumModel::factory()->ReplaceMeidumInfo($params);

        return $data['uid'];
    }

    public function DefaultClientAuthority()
    {
        return
            [
                ['url' => '/promotion', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/promotion/adgrouplistview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/promotion/adplanlistview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/promotion/adcreativelistview', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/alliancereport', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/alliancereport/allianceclientview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/allianceadgroupview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/allianceadplanview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/allianceadcreativeview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/alliancewordview', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/alliancereport/alliancegeoview', 'platform_role' => 'alliance', 'authority' => '2'],

                ['url' => '/charge', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/charge/chargelistview', 'platform_role' => 'alliance', 'authority' => '1'],

                ['url' => '/dashboard', 'platform_role' => 'alliance', 'authority' => '2'],
                ['url' => '/dashboard/clientdashboardview', 'platform_role' => 'alliance', 'authority' => '2'],
            ];
    }

    private function CheckClientUserRepeat($params)
    {
        if ($params) {
            $result = UserTable::factory()->queryRow("SELECT 1 FROM `user` WHERE `mail` = '{$params['mail']}' AND uid != '{$params['uid']}'");
            if (isset($result))
                throw new \Exception('邮箱重复！');
        }
    }

    /**
     * 添加广告主用户
     * @param $params
     */
    public function SaveClientUser($params)
    {
        $data = UserTable::factory()->IntersectKey($params);
        $user_id = $this->getCurrentUid();

        if (!$data)
            throw new \Exception('数据有误！');

        $data['role'] = 'client';
        $data['platform_role'] = 'alliance';
        $data['edit_user'] = $user_id; //获取用户,等封装
        $data['edit_time'] = time();
        $data['allow_platform_role'] = 'alliance';

        $corporation_id = CorporationModel::factory()->Save($params['corporation_name']);
        $data['corporation_id'] = $corporation_id;

        //检查广告主账户是否重名
        $this->CheckClientUserRepeat($params);

        //保存账户数据
        if (isset($data['uid']) && !empty($data['uid'])) {

            if (!isset($data['password']) or empty($data['password']))
                unset($data['password']);
            else
                $data['password'] = md5($data['password']);

            UserTable::factory()->update($data, array('uid' => $data['uid']));

            $this->TruncateResource($data['uid']);
            //广告主资源由用户添加
            $this->SaveClientResource($data['uid'], $params['resource']);

            //用户曾经创建过得广告计划的媒体定向需要强制刷新为新的 取其交集
            $media_ids = ArrayHandle::FetchMultipleArrayLeafWithKey($params['resource'], 'id');
            $media_ids = implode(',', $media_ids);
            //定向所有媒体，则保持原有的媒体定向
            //不是定向所有媒体，则取其交集
            if ($media_ids) {
                $rows = AdplanTable::factory()->queryList("
                SELECT
                  group_concat(r.id) as media_target,p.id
                FROM ad_plan p
                  JOIN user u ON p.create_user = u.uid
                  JOIN resource r
                    ON r.uid = u.uid AND r.type = 'bundle_id' AND r.platform_role = 'alliance' AND find_in_set(r.id, p.media_target) > 0
                WHERE p.create_user='{$data['uid']}'
                GROUP BY p.id  ");
                foreach ($rows as $row) {
                    AdplanTable::factory()->execute("UPDATE `ad_plan` SET `media_target` = '{$row['media_target']}' WHERE id = '{$row['id']}'");
                }
            }

        } else {
            $data['uid'] = Guid::factory()->create();
            $data['create_user'] = $user_id; //获取用户,等封装
            $data['create_time'] = time();
            $data['password'] = md5($data['password']);
            UserTable::factory()->insert($data);

            $this->TruncateResource($data['uid']);
            //广告主资源由用户添加 目前只有bundleid可以作为资源添加
            $this->SaveClientResource($data['uid'], $params['resource']);
        }

        //广告主账户目前只有 联盟角色
        $this->TruncateAuthority($data['uid']);
        //广告主的权限目前写死
        $authority = $this->DefaultClientAuthority();
        $this->SaveRawAuthority($data['uid'], $authority);
        return $data['uid'];
    }

    /**
     * 广告主账户列表数据接口 （目前该接口不与权限挂钩 返回所有广告主）
     */
    public function ClientUserList($params)
    {
        $params['sort'] = isset($params['sort']) ? $params['sort'] : 'create_time';
        $condition = new ConditionCombineModel();

        $condition->AndCondition($params['search'], "u.`name` LIKE '{$params['search']}%'");

        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "SELECT 
                  u.*,
                  c.`name` AS 'corporation_name',
                  GROUP_CONCAT(m.`name`) AS 'media_name' 
                FROM
                  `user` AS u 
                  LEFT JOIN `corporation` AS c
                    ON c.`id` = u.`corporation_id`
                  LEFT JOIN `resource` AS r 
                    ON u.`uid` = r.`uid`
                    AND r.`platform_role` = 'alliance'
                    AND r.`type` = 'media' 
                  LEFT JOIN `media` AS m 
                    ON m.`uid` = r.`id` 
                    WHERE u.`role` = 'client' 
                    {$condition->Condition()} 
                     GROUP BY u.`uid` 
                    {$order_condition}
               ";

        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    public function UpdateClientUser($ids, $status)
    {
        $ids = explode("','", $ids);
        if (!$ids or !in_array($status, [0, 1]))
            throw new \Exception('参数错误！');

        UserTable::factory()->execute(" UPDATE `user`
                                        SET is_deleted = {$status}
                                        WHERE uid INT ('{$ids}')");
    }

    /**
     * 用户数据
     * @param $uid
     */
    public function userdetail($uid)
    {
        $user_table = new UserTable();
        //$uid = 'acc75479-2491-4723-84d5-12987c4dc320';
        $data = $user_table->getRow(array(
            'uid' => $uid
        ));


        //公司名称
        $corporation = CorporationTable::factory()->getRow(['id' => $data['corporation_id']]);
        $data['corporation_name'] = $corporation ? $corporation['name'] : '';

        $authority = new AuthorityTable();
        $authority_data = $authority->getList(['uid' => $uid]);

        //前端需要的数据结构 完整的广告主、媒体、权限树
        if ($data['create_user'] == '') {//超级管理员返回所有的媒体

            $final_tree = [];
            //权限树整理
            $tree_data = self::NavigationTree();
            foreach ($tree_data as $item) {
                $item['authority'] = "2";
                $item['platform_role'] = 'alliance';
                $final_tree[] = $item;
            }

            $final_media = [];
            //媒体整理
            $media_data = (new MediaTable())->queryList("SELECT uid,name FROM `media`");
            foreach ($media_data as $item) {
                $item['platform_role'] = 'alliance';
                $final_media[] = $item;
            }

            $final_client = [];
            //广告主整理
            $client_data = (new ClientTable())->queryList("SELECT uid,name FROM `client`");
            foreach ($client_data as $item) {
                $item['platform_role'] = 'alliance';
                $final_client[] = $item;
            }

            $data['authority'] = $final_tree;
            $data['client'] = $final_client;
            $data['media'] = $final_media;
        } else {
            //媒体账户根据media.medium=uid选取数据
            //广告主根据resource.uid,type=bundle_id返回数据

            //权限树整理
            $tree_data = self::NavigationTree();

            //分别返回自营 联盟下的资源和权限
            if ($authority_data) {
                foreach ($authority_data as &$item) {
                    unset($item['uid']);
                    $tree_item = ArrayHandle::FindFirstArrayItemWithKeyValue($tree_data, 'url', $item['url']);
                    if (isset($tree_item))
                        $item = array_merge($item, $tree_item);
                    else
                        $item['authority'] = "0";
                }
            } else {
                $authority_data = [];
                foreach ($tree_data as $item) {
                    $item['authority'] = "0";
                    $item['platform_role'] = "alliance";
                    $authority_data[] = $item;
                }
            }

            //管辖媒体
            if ($data['role'] == 'client') {
                $sql = "SELECT
                      r.`platform_role`,
                      r.`id` AS uid,
                      c.`name`
                    FROM `resource` AS r
                      INNER JOIN `media` AS c ON r.id = c.`bundle_id` AND r.`type` = 'bundle_id' AND r.`platform_role` = 'alliance'
                    WHERE r.uid = '{$uid}' OR c.`create_user` = '{$uid}'
                    GROUP BY c.bundle_id";
            } else if ($data['role'] == 'media') {
                $sql = "SELECT u.platform_role,m.uid,m.name FROM media m JOIN user u on u.uid=m.medium WHERE m.medium='{$uid}'";
            }

            $media_data = (new MediaTable())->queryList($sql);

            //管辖广告主
            $client_data = (new ClientTable())->queryList("                                                      
                                                        SELECT 
                                                        r.`platform_role`,
                                                        r.`id` AS uid,
                                                        c.`name`
                                                        FROM `resource` AS r INNER JOIN `client` AS c
                                                        ON r.id = c.`uid` AND r.`type` = 'client'
                                                        WHERE r.uid = '{$uid}' 
                                                        OR c.`create_user` = '{$uid}'
                                                            ");

            $data['authority'] = $authority_data;
            $data['client'] = $client_data;
            $data['media'] = $media_data;
        }

        $alliance = ArrayHandle::FindArrayItemsWithKeyValue($data['authority'], 'platform_role', 'alliance');

        $data['authority'] = ['alliance' => $alliance];

        $medium = MediumTable::factory()->queryRow("
                                                        SELECT
                                                        *
                                                        FROM `medium`
                                                        WHERE `uid` = '{$uid}'
            ");

        $medium['attach'] = json_decode($medium['attach'], true);
        $data['medium'] = $medium;

        return $data;
    }

    public function checkEmailDuplicated($mail)
    {
        $table = new UserTable();
        $data = $table->getUserByMail($mail);
        return array('res' => boolval($data));
    }

    /**
     * 查看媒体账户信息
     * @param $params
     */
    public function mediaaccountdetail()
    {
        $uid = $this->getCurrentUid();
        $condition = new ConditionCombineModel();
        $condition->AndCondition($uid, "u.`uid` = '{$uid}'");

        $sql = "
                SELECT 
                u.`name`,
                c.`name` AS corporation_name,
                u.`mail`,
                u.`link_name`,
                u.`tel`,                
                f.`bank`,
                f.`bank_account`,
                f.`account_name`,
                f.`attach`
                FROM `user` AS u
                LEFT JOIN `corporation` AS c
                ON c.`id` = u.`corporation_id`
                LEFT JOIN `medium` AS f
                ON u.`uid` = f.`uid`
                WHERE 1
                {$condition->Condition()}
                ";

        $data = DrawLogTable::factory()->queryRow($sql);
        isset($data['attach']) ? ($data['attach'] = json_decode($data['attach'], true)) : '';
        return $data;
    }

    public function CurrentRoleSlotClass()
    {
        return SlotModel::getClassMenu();
    }

    public function SendEmail($params)
    {
        UserTable::factory()->execute(
            "
                                    INSERT INTO return_visit(`email`,`phone`,`company`,`kind`) 
                                    VALUES ('{$params['email']}','{$params['phone']}','{$params['company']}','{$params['kind']}')");
        $to = "info@deepleaper.com";
        $title = "新客户留言";
        $content = "收到新的回访客户信息，邮箱：{$params['email']},电话：{$params['phone']},公司：{$params['company']},公司性质:{$params['kind']}";
        return Email::send_email($to, $title, $content);
    }
}
