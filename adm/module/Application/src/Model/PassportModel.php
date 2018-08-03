<?php

namespace Application\Model;

use Application\Table\UserTable;
use Application\Table\LogLoginTable;
use Application\Table\IpGeoTable;
use Zend\Session\Container;

class PassportModel
{
    protected static $SESS_CONTAINER = 'mg';
    protected static $SESS_LOGIN = 'sessLoginUser';
    protected static $SESS_CLIENTS = 'sessUserClients';
    protected static $SESS_LOGIN_CAPTCHA = 'sessLoginCaptcha';
    protected static $SESS_LOGIN_ALIVE = 'sessLoginAlive';
    protected static $_ALIVE_EXPIRE = 3600;
    public static $media_index_url = '/dashboard/mediadashboardview';
    public static $adx_index_url = '/charge/applydrawlistview';
    public static $client_index_url = '/dashboard/clientdashboardview';
    protected static $DOMAIN = '.deepleaper.com';

    public static function factory()
    {
        return new self;
    }

    /**
     * 获取session 里存储的  用户客户信息
     * @return mixed
     */
    public function getSessionClients()
    {
//         $session = new SessionStorage();
        $session = new Container(self::$SESS_CONTAINER);
        $clients = $session->offsetGet(self::$SESS_CLIENTS);
        return $clients;
    }

    /**
     * 设置session里的 客户信息
     * @param $clients
     * @param $currentClientUid
     * @param $currentClientName
     * @return bool
     */
    public function setSessionClients($clients)
    {
        $session = new Container(self::$SESS_CONTAINER);
        $session->offsetSet(self::$SESS_CLIENTS, $clients);
        return true;
    }

    /**
     * get current login user
     * @return array (
     *      'uid' =>
     *      'mail' =>
     *      'power' =>
     *      'time' =>
     *      );
     */
    public function getLoginUser($alive = false)
    {
//         $session = new SessionStorage();
        $session = new Container(self::$SESS_CONTAINER);
        $user = $session->offsetGet(self::$SESS_LOGIN);
        $alivetime = $session->offsetGet(self::$SESS_LOGIN_ALIVE);

        if (empty($user)) {
            return false;
        }
        // check expire
        if (time() - $alivetime > self::$_ALIVE_EXPIRE) {
            return false;
        }

        if ($alive === true) {
            // goon alive time
            $session->offsetSet(self::$SESS_LOGIN_ALIVE, time());
        }

        return $user;
    }

    /**
     * save user into cookie or session
     */
    private function _setLoginCookie($row)
    {
        $session = new Container(self::$SESS_CONTAINER);
        $user = array(
            'uid' => $row['uid'],
            'name' => $row['name'],
            'mail' => $row['mail'],
            'power' => empty($row['create_user']) ? 'admin' : '',
            'pid' => $row['pid'],
            'internal' => $row['internal'],
            'permission' => $row['permission'],
            'role' => $row['role'],
            'platform_role' => $row['platform_role'],
            'create_user' => $row['create_user']
        );
        $session->offsetSet(self::$SESS_LOGIN, $user);
        // login time
        $session->offsetSet(self::$SESS_LOGIN_ALIVE, time());
        //cookie写一年有效期
        setcookie('user', json_encode($user), time() + 60 * 60 * 24 * 30 * 12, '/', self::$DOMAIN);
    }

    /**
     * do login process
     * @param array $paramArr
     * @return multitype:number string
     */
    public function doLogin($paramArr = array())
    {
        $options = array(
            'username' => '',   //mail
            'password' => '',
            'captcha' => '',
            'useCaptcha' => false, //true|false
        );
        if (is_array($options)) $options = array_merge($options, $paramArr);
        extract($options);

        //用户名
        $username = trim($username);
        //登录平台
        if (!$platform_role or !in_array($platform_role, ['alliance'])) {
            return [-1, '平台角色错误！'];// -1 平台角色错误
        }
        //广告主 媒体账户
        if (!$role or !in_array($role, ['media', 'client'])) {
            return [-2, '登录角色错误！'];// -2 登录角色错误
        }
        // check params
        if (empty($username) || empty($password)) {
            return array(-3, '参数错误，用户名、密码为必填项');//-3 参数错误，用户名、密码为必填项
        }
        // check captcha
        if (true === $useCaptcha && empty($captcha)) {
            return array(-4, '参数错误，验证码为必填项');//-4 参数错误，验证码为必填项
        }
        if (true === $useCaptcha) {
            if (strtolower($captcha) != strtolower(self::getCaptch())) {
                return array(-5, '验证码错误，请确认');//-5 验证码错误，请确认
            }
        }

        $dbUser = new UserTable();
        $row = $dbUser->getUserByMail($username);

        if (empty($row) || $row['password'] != md5($password)) {
            return array(-6, 'ID 或密码不正确');//-6 密码不正确
        } elseif ($row['is_deleted'] == 1 || $row['pause'] == 1) {
            return array(-7, '此账号已被禁用');//-7 此账号已被禁用
        } elseif ($row['role'] != $role) {
            return [-8, '登录角色有误！'];//-8 登录角色有误
        } elseif (stripos($row['allow_platform_role'], $platform_role, 0) === false) {
            return [-9, '平台权限未开通！'];//-9 平台权限未开通
        }

        //切换角色
        UserTable::factory()->update(['platform_role' => $platform_role], ['mail' => $username]);
        $row = $dbUser->getUserByMail($username);

        // save login session
        $this->_setLoginCookie($row);

        // update user
        $this->_updateUser($row);

        // save login info
        $this->_saveLoginLog($row);

        return array(1, '操作成功！');
    }


    public static function GetUserIndexPage($params)
    {
        switch ($params['role']) {
            case 'client':
                return PassportModel::$client_index_url;
            case 'media':
                $userId = UserModel::factory()->getCurrentUid();
                if (MediumModel::factory()->isAdx($userId)) {
                    return PassportModel::$adx_index_url;
                }
                return PassportModel::$media_index_url;
        }
    }

    public function getCaptch()
    {
        $session = new Container(self::$SESS_CONTAINER);
        $captch = $Session->{self::$SESS_LOGIN_CAPTCHA};
        return $captch['word'];
    }

    /**
     * update user status
     */
    private function _updateUser($user_row)
    {
        $uid = $user_row['uid'];
        $ip = \Custom\Utility::getIp();

        $data = array(
            'last_time' => $user_row['login_time'],
            'last_ip' => $user_row['login_ip'],
            'login_time' => time(),
            'login_ip' => $ip,
            'login_count' => (int)$user_row['login_count'] + 1,
            'platform_role' => $user_row['platform_role']
        );
        // update user-login
        $dbUser = new UserTable();
        $res = $dbUser->update($data, array('uid =?' => $uid));
//         var_dump( $data, $res );
        return $res ? true : false;
    }

    /**
     * save login info
     */
    private function _saveLoginLog($user_row)
    {

        $uid = $user_row['uid'];
        $ip = \Custom\Utility::getIp();
        //$address = $this->getAddressByIp($ip, true);
        $ismobile = \Custom\Utility::isMobileVisit();

        // save login-log
        $log = array(
            'uid' => $uid,
            'ip' => $ip,
            'address' => '',
            'datetime' => date('Y-m-d H:i:s'),
            'header' => $_SERVER['HTTP_USER_AGENT'],
            'ismobile' => ($ismobile ? 1 : 0),
        );
        $dbLog = new LogLoginTable();
        $res = $dbLog->insert($log);
//         var_dump( $log, $res );
        return $res ? true : false;
    }

    /**
     * 通过ip获得地址信息
     * @param string $ip
     * @param boolean $update
     */
    public function getAddressByIp($ip, $update = false)
    {

        if (empty($ip) || ip2long($ip) < 0) {
            return "";
        }
        if ($ip == '127.0.0.1') {
            return '内网ip';
        }
        //        $ip = "118.67.207.255";
        $dbIpGeo = new IpGeoTable();
        $row = $dbIpGeo->getAddressByEip($ip);
        if (!empty($row)) {
            return implode(" ", $row);
        }

        if ($update == true) {
            $ipInfo = \Custom\api\IpTaobaoApi::getAddress($ip, " ");
            return $ipInfo;
        }

        return "";
    }

    public function doLogout()
    {
        $session = new Container(self::$SESS_CONTAINER);
//        $current = $this->getLoginUser();
//        if(isset($_COOKIE["uid"]) and $current and $current['uid'] != $_COOKIE["uid"]){
//            return array(1, '操作成功！');
//        }else {
        $session->offsetSet(self::$SESS_LOGIN, null);
//         $session->clear( self::$SESS_LOGIN );
        return array(1, '操作成功！');
        // }
    }
}
