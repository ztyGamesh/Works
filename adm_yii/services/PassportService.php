<?php

namespace app\services;

use app\models\IpGeoModel;
use app\models\LogLoginModel;
use app\models\UserModel;
use app\services\api\IpTaobaoApi;
use app\services\custom\Utility;
use Yii;
use yii\helpers\VarDumper;
use yii\web\Cookie;

class PassportService
{
    protected static $SESS_CONTAINER = 'mg';
    protected static $SESS_LOGIN = 'sessLoginUser';
    protected static $SESS_CLIENTS = 'sessUserClients';
    protected static $SESS_LOGIN_CAPTCHA = 'sessLoginCaptcha';
    protected static $SESS_LOGIN_ALIVE = 'sessLoginAlive';
    protected static $_ALIVE_EXPIRE = 3600*5;
    public static $media_index_url = '/dashboard/mediadashboardview';
//    public static $adx_index_url = '/charge/applydrawlistview';
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
    public static function getSessionClients()
    {
//        $session = new Container(self::$SESS_CONTAINER);
//        $clients = $session->offsetGet(self::$SESS_CLIENTS);
//        return $clients;
        return Yii::$app->session[self::$SESS_CLIENTS];
    }

    /**
     * 设置session里的 客户信息
     * @param $clients
     * @param $currentClientUid
     * @param $currentClientName
     * @return bool
     */
    public static function setSessionClients($clients)
    {
//        $session = new Container(self::$SESS_CONTAINER);
//        $session->offsetSet(self::$SESS_CLIENTS, $clients);
//        return true;
        Yii::$app->session[self::$SESS_CLIENTS] = $clients;
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
    public static function getLoginUser($alive = false)
    {
////         $session = new SessionStorage();
//        $session = new Container(self::$SESS_CONTAINER);
//        $user = $session->offsetGet(self::$SESS_LOGIN);
//        $alivetime = $session->offsetGet(self::$SESS_LOGIN_ALIVE);
//
//        if (empty($user)) {
//            return false;
//        }
//        // check expire
//        if (time() - $alivetime > self::$_ALIVE_EXPIRE) {
//            return false;
//        }
//
//        if ($alive === true) {
//            // goon alive time
//            $session->offsetSet(self::$SESS_LOGIN_ALIVE, time());
//        }
//
//        return $user;

        $session = Yii::$app->session;
        $user = $session[self::$SESS_LOGIN];
        $aliveTime = $session[self::$SESS_LOGIN_ALIVE];
        if (empty($user) || (time() - $aliveTime > self::$_ALIVE_EXPIRE)) {
            return null;
        }

        if ($alive === true) {
            // goon alive time
            $session->set(self::$SESS_LOGIN_ALIVE, time());
        }

        return $user;


    }

    /**
     * save user into cookie or session
     */
    private static function _setLoginCookie($row)
    {
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
        $session = Yii::$app->session;

        $session[self::$SESS_LOGIN] = $user;
        $session[self::$SESS_LOGIN_ALIVE] = time();
        $cookie = new Cookie([
            'name' => 'user',
            'value' => json_encode($user),
            'expire' => time() + 3600 * 24 * 30 * 12,
            'path' => '/',
            'httpOnly' => false,
        ]);
        Yii::$app->response->cookies->add($cookie);

    }

    /**
     * do login process
     * @param array $paramArr
     */
    public static function doLogin($paramArr = array())
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

        $user = UserModel::getUserByMail($username);

        if (empty($user) || $user['password'] != md5($password)) {
            return array(-6, 'ID 或密码不正确');//-6 密码不正确
        } elseif ($user['is_deleted'] == 1 || $user['pause'] == 1) {
            return array(-7, '此账号已被禁用');//-7 此账号已被禁用
        } elseif ($user['role'] != $role) {
            return [-8, '登录角色有误！'];//-8 登录角色有误
        } elseif (stripos($user['allow_platform_role'], $platform_role, 0) === false) {
            return [-9, '平台权限未开通！'];//-9 平台权限未开通
        }

        //切换角色
        $user['platform_role'] = $platform_role;

        // save login session
        self::_setLoginCookie($user);

        // update user
        self::_updateUser($user);

        // save login info
        self::_saveLoginLog($user);

        return array(1, '操作成功！');
    }


    public static function GetUserIndexPage($params)
    {
        switch ($params['role']) {
            case 'client':
                return PassportService::$client_index_url;
            case 'media':
//                $userId = UserService::getCurrentUid();
//                if (MediumService::isAdx($userId)) {
//                    return PassportService::$adx_index_url;
//                }
                return PassportService::$media_index_url;
        }
    }

    public static function getCaptch()
    {
//        $session = new Container(self::$SESS_CONTAINER);
//        $captch = $Session->{self::$SESS_LOGIN_CAPTCHA};
//        return $captch['word'];
        return 'not supported';
    }

    /**
     * update user status
     */
    private static function _updateUser(array $user)
    {
//        $uid = $user['uid'];
//        $ip = \Custom\Utility::getIp();
        $ip = Yii::$app->request->getUserIP();

        $data = array(
            'last_time' => $user['login_time'],
            'last_ip' => $user['login_ip'],
            'login_time' => time(),
            'login_ip' => $ip,
            'login_count' => (int)$user['login_count'] + 1,
            'platform_role' => $user['platform_role']
        );
        // update user-login
//        $dbUser = new UserModel();
//        $res = $dbUser->update($data, array('uid =?' => $uid));
//
//        return $res ? true : false;
        return UserModel::updateAll($data, ['uid' => $user['uid']]) ? true : false;


    }

    /**
     * save login info
     */
    private static function _saveLoginLog($user)
    {

//        $uid = $user['uid'];
//        $ip = \Custom\Utility::getIp();
        //$address = $this->getAddressByIp($ip, true);
        $ip = Utility::getIp();
        $ismobile = Utility::isMobileVisit();

        $log = array(
            'uid' => $user['uid'],
            'ip' => $ip,
            'address' => '',
            'datetime' => date('Y-m-d H:i:s'),
            'header' => $_SERVER['HTTP_USER_AGENT'],
            'ismobile' => ($ismobile ? 1 : 0),
        );
//        $dbLog = new LogLoginModel();
//        $res = $dbLog->insert($log);
//        return $res ? true : false;
        return LogLoginModel::insertOne($log) ? true : false;
    }

    /**
     * 通过ip获得地址信息
     * @param string $ip
     * @param boolean $update
     */
    public static function getAddressByIp($ip, $update = false)
    {

        if (empty($ip) || ip2long($ip) < 0) {
            return "";
        }
        if ($ip === '127.0.0.1') {
            return '内网ip';
        }
        $row = IpGeoModel::getAddressByEip($ip);
        if (!empty($row)) {
            return implode(" ", $row);
        }

        if ($update == true) {
            return IpTaobaoApi::getAddress($ip, " ");
        }

        return "";
    }

    public static function doLogout()
    {
//        $session = new Container(self::$SESS_CONTAINER);
////        $current = $this->getLoginUser();
////        if(isset($_COOKIE["uid"]) and $current and $current['uid'] != $_COOKIE["uid"]){
////            return array(1, '操作成功！');
////        }else {
//        $session->offsetSet(self::$SESS_LOGIN, null);

        Yii::$app->session->remove(self::$SESS_LOGIN);
        return array(1, '操作成功！');
    }
}
