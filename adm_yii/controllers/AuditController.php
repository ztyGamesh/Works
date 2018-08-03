<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/29
 * Time: 18:05
 */

namespace app\controllers;

use app\services\BaseService;
use app\services\AdcreativeService;
use app\services\AdcreativeAuditOtherService;
use app\services\UserService;


class AuditController extends BaseController
{
    /**
     * 创意审核列表界面
     *
     */
    public function actionAdcreativeauditlistview()
    {
        return $this->render();
    }

    /**
     * 创意审核列表数据接口
     */
    public function actionAdcreativeauditlist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeService::getAuditList($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 创意第三方审核状态查询
     */
    public function actionAdcreativeauditotherlist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeAuditOtherService::getAuditList($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 创意审核状态更改接口
     */
    public function actionAdcreativeupdateauditstatus()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return AdcreativeService::updateAuditStatus($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 批量更新创意外部审核状态
     */
    public function actionAdcreativeupdateauditstatusothers()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return AdcreativeAuditOtherService::UpdateOtherStatus($params['ids'], $params['medium'], $params['audit_status'], $params['comment']);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 全量初始化计划下所有创意的审核状态
     * 1.根据每个计划的定向 送审相应账户
     * 2.自动通过不需要送审的账户下创意
     */
    public function actionAdcreativeotherstatusinit()
    {
        $data = BaseService::Transaction(function () {
            return AdcreativeAuditOtherService::AllPlanInit();
        });
        return $this->jsonResponse($data);
    }

    /**
     * oppo审核通过的设置为wait（用于oppo程序化送审的初始化，只执行一次）
     */
    public function actionResetOppo($mail)
    {
        if (!UserService::IsAdminUser()) {
            exit('只有管理员可执行此操作');
        }
        if(!$mail=filter_var($mail,FILTER_VALIDATE_EMAIL)){
            exit('缺少mail参数');
        }

        $data = BaseService::Transaction(function () use ($mail){
            $sql = "UPDATE ad_creative_audit_other SET audit_status = 'wait' WHERE  audit_status='pass' and  
uid =(SELECT uid FROM user WHERE mail = '{$mail}')";
            return \Yii::$app->db->createCommand($sql)->execute();
        });
        return $this->jsonResponse($data);
    }
}