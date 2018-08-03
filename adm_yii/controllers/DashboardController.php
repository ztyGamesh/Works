<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/24
 * Time: 11:11
 */

namespace app\controllers;
use app\services\BaseService;
use app\services\DashboardService;
use Yii;


/**
 * 账户
 * Class AccountController
 * @package app\controllers
 */
class DashboardController extends BaseController
{
    /**
     * 媒体数据概览
     */
    public function actionMediadashboardview()
    {
        return $this->render();
    }

    /**
     * 广告主数据概览
     */
    public function actionClientdashboardview()
    {
        return $this->render();
    }

    #region 广告主接口
    /**
     * 广告主统计信息
     */
    public function actionClientsum()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::ClientSumReport($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionClientdashboarddaily()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::ClientDashboardDaily($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionClientdashboardhourly()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::ClientDashboardHourly($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionAdgrouptop()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::AdgroupTopReport($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionAdplantop()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::AdplanTopReport($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionWordtop()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::WordTopReport($params);
        });
        return $this->jsonResponse($data);
    }

    #endregion

    #region 媒体接口

    /**
     * 媒体统计信息
     * @return array
     */
    public function actionMediasum()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::MediaSumReport($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体dashboard日报接口
     * @return array
     */
    public function actionMediadashboarddaily()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::MediaDashboardDaily($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体dashboard小时报接口
     * @return array
     */
    public function actionMediadashboardhourly()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::MediaDashboardHourly($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体收入报表
     * @return array
     */
    public function actionMediaincomereport()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::MediaIncomeReport($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体收入占比
     * @return array
     */
    public function actionMediaincomeoccupy()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::MediaIncomeOccupy($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 广告位收入报表
     * @return array
     */
    public function actionSlotincomereport()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::SlotIncomeReport($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 广告位收入占比
     * @return array
     */
    public function actionSlotincomeoccupy()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::SlotIncomeOccupy($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 基础模板收入排行
     * @return array
     */
    public function actionBasetemplateincometop()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::BaseTemplateIncomeTop($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 基础模板ctr排行
     * @return array
     */
    public function actionBasetemplatectr()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardService::BaseTemplateCtrTop($params);
        });
        return $this->jsonResponse($data);
    }
    #endregion

    /**
     * 返回媒体报表中当前用户数据的最新的日期 imp>0
     * 如果是管理员则返回所有记录中最新的日期
     * {"status":1,"msg":"","data":{"date":"2017-06-05"}}
     */
    public function actionMediaReportRecentDate(){
        $data = BaseService::ExecuteWithoutTransaction(function ()  {
            return  DashboardService::MediaReportRecentDate();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 内容合作报表页面
     * @return string
     */
    public function actionContentview(){
        return $this->render();
    }



}