<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2018/1/15
 * Time: 上午11:43
 * 健康检查
 */

namespace app\controllers;

use yii\web\UnauthorizedHttpException;

class ChkController extends BaseController
{
    private $token="tdeepleaper99xxenn";

    public function actionIndex(){
        return 'ok';
    }

    /**
     * @return array
     * @throws \yii\db\Exception
     * @throws UnauthorizedHttpException
     */
    public function actionMysql(){
        $reqToken=$this->get('token',null);
        if ($reqToken!==$this->token){
            throw new UnauthorizedHttpException('仅限内部使用');
        }
        $version=\Yii::$app->db->createCommand("SELECT version()")->queryScalar();
        if($version){
            echo 'ok';
        }
    }

    /**
     * @return string
     * @throws UnauthorizedHttpException
     */
    public function actionRedis(){
        $reqToken=$this->get('token',null);
        if ($reqToken!==$this->token){
            throw new UnauthorizedHttpException('仅限内部使用');
        }
        $ret=\Yii::$app->redis->select(0);
        if($ret){
            return 'ok';
        }
    }
}