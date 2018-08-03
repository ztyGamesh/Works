<?php

namespace app\controllers;

use app\services\BaseService;
use app\services\DrawLogService;
use app\services\PassportService;
use app\services\SlotTemplateService;
use app\services\UserService;
use Yii;

class IndexController extends BaseController
{

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [//todo
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function actionForbidden()
    {
        return $this->render();
    }

    /**
     * 首页
     * @return string
     */
    public function actionIndex()
    {
        if ($user=PassportService::getLoginUser()){
            $defaultPage=PassportService::GetUserIndexPage($user);
            return $this->redirect($defaultPage);
        }
        $this->disableLayout();
        return $this->render();
    }

    /**
     * 验证登录表单
     * 请求参数
     *      {
     *      	"role": "client",
     *      	"platform_role": "alliance",
     *      	"username": "xxx@139.com",
     *      	"password": "xxx"
     *      }
     *
     * 响应：
     *  1、密码错误
     *  2、登录成功，返回重定向url
     */
    public function actionLogin()
    {
        $post=Yii::$app->request->post();
        $post['useCaptcha']=false;
        //todo 模型校验数据
        $res = PassportService::doLogin($post);

        if ($res[0] == 1) {
            $res[2] = PassportService::GetUserIndexPage($post);
        }

        return $this->jsonResponse(...$res);
    }



    public function actionLogout()
    {
        $ajax = $this->getPost('ajax');

        $res = PassportService::doLogout();
        if ($ajax == 1) {
            return $this->jsonResponse(1, $res[1]);
        }

        return $this->redirect('/');
    }

    public function actionNotfound()
    {
        return $this->render();
    }

    public function actionRobot()
    {
        set_time_limit(0);
        $params = $this->getGet();

        switch ($params['task']) {
            case 'compute_media_total_income':
                DrawLogService::ComputeAllianceMediaTotalIncome($params);
                break;
            case 'compute_alliance_last_month_media_bill':
                DrawLogService::ComputeAllianceLastMonthMediaBill();
                break;
            case 'compute_alliance_whole_media_bill':
                DrawLogService::ComputeAllianceWholeMediaBill();
                break;
            case 'template_push':
                SlotTemplateService::PushTemplate();
                break;
        }
        echo 'Done!';
        exit;
    }

    public function actionSendemail()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return UserService::SendEmail($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * adx权限修改
     */
    public function actionModifyAuthForAdx(){
        $uid=$this->getGet('uid');
        if (!$uid){
            exit('缺少参数:uid');
        }
        $alliance_authority = UserService::DefaultAllianceMediaAuthority();
        UserService::SaveRawAuthority($uid, $alliance_authority);
        exit('ok');
    }

}
