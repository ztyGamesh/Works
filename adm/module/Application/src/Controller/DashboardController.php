<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/24
 * Time: 11:11
 */

namespace Application\Controller;

use Application\Model\BaseModel;

use Application\Model\DashboardModel;

/**
 * 账户
 * Class AccountController
 * @package Application\Controller
 */
class DashboardController extends BaseController
{
    /**
     * 媒体数据概览
     * @return \Zend\View\Model\ViewModel
     */
    public function mediadashboardviewAction()
    {
        return $this->render();
    }

    /**
     * 广告主数据概览
     * @return \Zend\View\Model\ViewModel
     */
    public function clientdashboardviewAction()
    {
        return $this->render();
    }

    #region 广告主接口
    /**
     * 广告主统计信息
     */
    public function clientsumAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->ClientSumReport($params);
        });
        return self::ajax_json($data);
    }

    public function clientdashboarddailyAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->ClientDashboardDaily($params);
        });
        return self::ajax_json($data);
    }

    public function clientdashboardhourlyAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->ClientDashboardHourly($params);
        });
        return self::ajax_json($data);
    }

    public function adgrouptopAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->AdgroupTopReport($params);
        });
        return self::ajax_json($data);
    }

    public function adplantopAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->AdplanTopReport($params);
        });
        return self::ajax_json($data);
    }

    public function wordtopAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->WordTopReport($params);
        });
        return self::ajax_json($data);
    }

    #endregion

    #region 媒体接口

    /**
     * 媒体统计信息
     * @return array
     */
    public function mediasumAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->MediaSumReport($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 媒体dashboard日报接口
     * @return array
     */
    public function mediadashboarddailyAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->MediaDashboardDaily($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 媒体dashboard小时报接口
     * @return array
     */
    public function mediadashboardhourlyAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->MediaDashboardHourly($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 媒体收入报表
     * @return array
     */
    public function mediaincomereportAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->MediaIncomeReport($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 媒体收入占比
     * @return array
     */
    public function mediaincomeoccupyAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->MediaIncomeOccupy($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 广告位收入报表
     * @return array
     */
    public function slotincomereportAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->SlotIncomeReport($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 广告位收入占比
     * @return array
     */
    public function slotincomeoccupyAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->SlotIncomeOccupy($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 基础模板收入排行
     * @return array
     */
    public function basetemplateincometopAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->BaseTemplateIncomeTop($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 基础模板ctr排行
     * @return array
     */
    public function basetemplatectrAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DashboardModel::factory()->BaseTemplateCtrTop($params);
        });
        return self::ajax_json($data);
    }
    #endregion

    /**
     * 返回媒体报表中当前用户数据的最新的日期 imp>0
     * 如果是管理员则返回所有记录中最新的日期
     * {"status":1,"msg":"","data":{"date":"2017-06-05"}}
     */
    public function MediaReportRecentDateAction(){
        $data = BaseModel::ExecuteWithoutTransaction(function ()  {
            return  DashboardModel::factory()->MediaReportRecentDate();
        });
        return self::ajax_json($data);
    }


}