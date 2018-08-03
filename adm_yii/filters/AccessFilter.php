<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/8/20
 * Time: 下午9:48
 */

namespace app\filters;

use app\models\LogModel;
use app\services\custom\Utility;
use app\services\PassportService;
use app\services\UserService;
use Yii;
use yii\base\ActionFilter;
use yii\web\Response;

class AccessFilter extends ActionFilter
{

    public $loginUrl = '/';
    public $rules = [];

    public function beforeAction($action)
    {
        $controller = $action->controller->id;
        $action = $action->id;
        $uri = Yii::$app->request->url;

        $allowActions = isset($this->rules[$controller]) ? $this->rules[$controller] : [];
        if (in_array($action, $allowActions) || $allowActions === '*') {
            return true;
        }
        $user = PassportService::getLoginUser(true);
        if (!$user) {
            return $this->handleGuest('未登录', null, -1);
        }

        //todo 加上权限
        /*$power = $user['power'];// 角色
        $uid = $user['uid'];//
        $permission = $user['permission'];//用户表里记录的
        // auth 没用到
        $hasPower=AclModel::checkPower($power, $controller, $action, $uid);
        if (!$hasPower){
             $this->handleGuest('无权限', null, -1);
             return false;
        }*/


        LogModel::info('访问页面/' . $uri, $this->setExtra());
        return true;
    }

    private function setExtra()
    {
        $user = UserService::getCurrentUser();
        return array(
            'time' => time(),
            'ip' => Utility::getIp(),
            'uid' => $user['uid'] ?: '',
            'mail' => $user['mail'] ?: '',
            'power' => $user['power'] ?: '',
        );

    }

    /**
     * @param $msg
     * @param $data
     * @param $status
     * @return bool
     */
    private function handleGuest($msg, $data, $status)
    {
        if (Yii::$app->request->isAjax) {
            $response = Yii::$app->response;
            $response->format = Response::FORMAT_JSON;
            $response->data = compact('msg', 'data', 'status');
        } else {
            Yii::$app->response->redirect($this->loginUrl);
        }
        return false;
    }

}
