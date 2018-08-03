<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/28
 * Time: 18:07
 */

namespace app\controllers;

use app\services\BaseService;
use app\services\ChargeService;
use app\services\DrawLogService;

class ChargeController extends BaseController
{
    /**
     * 充值列表界面
     * a
     */
    public function actionChargelistview()
    {
        return $this->render();
    }

    /**
     * 充值列表数据接口
     */
    public function actionChargelist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return ChargeService::ChargeList($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionAddchargeview()
    {
        return $this->render();
    }

    public function actionClientlist()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ChargeService::GetClientList();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 添加充值记录
     */
    public function actionAdcharge()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return ChargeService::Save($params);
        });
        return $this->jsonResponse($data);
    }

    #region 媒体财务

    /**
     * 媒体提现列表界面
     */
    public function actionDrawlistview()
    {
        return $this->render();
    }

    /**
     * 媒体提现列表数据接口
     */
    public function actionDrawlist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DrawLogService::getlist($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体提现详情界面
     */
    public function actionDrawdetailview()
    {
        return $this->render();
    }

    /**
     * 媒体提现详情
     */
    public function actionDrawdetail()
    {
        $params = $this->getGet();

        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DrawLogService::drawdetail($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 付款操作
     */
    public function actionPaytomedia()
    {
        $params = $this->getPost();

        $data = BaseService::Transaction(function () use ($params) {
            return DrawLogService::paytomedia($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体申请提现列表页
     */
    public function actionApplydrawlistview()
    {
        return $this->render();
    }

    /**
     * 媒体申请提现列表数据
     */
    public function actionApplydrawlist()
    {

        $data = BaseService::ExecuteWithoutTransaction(function () {
            return DrawLogService::getmediadrawlist($this->getGet());
        });
        return $this->jsonResponse($data);
    }

        /**
     * 申请提现页面
     *
     */
    public function actionApplydrawview()
    {
        return $this->render();
    }

    /**
     * 媒体查看提现详情页面
     *
     */
    public function actionApplydrawdetailview()
    {
        return $this->render();
    }

    /**
     * 检查申请提现按钮是否合法
     */
    public function actionCheckdraw()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return DrawLogService::checkdraw();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 申请提现
     */
    public function actionApplydraw()
    {
        $params = $this->getPost();

        $data = BaseService::Transaction(function () use ($params) {
            return DrawLogService::applydraw($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 获取当前账户累计收入、账户余额、可提现余额
     */
    public function actionGetaccountfinanceinfo()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return DrawLogService::getaccountfinanceinfo();
        });
        return $this->jsonResponse($data);
    }

    #endregion
}