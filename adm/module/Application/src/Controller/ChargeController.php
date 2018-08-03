<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/28
 * Time: 18:07
 */

namespace Application\Controller;

use Application\Model\BaseModel;
use Application\Model\ChargeModel;
use Application\Model\DrawLogModel;

class ChargeController extends BaseController
{
    /**
     * 充值列表界面
     * @return \Zend\View\Model\ViewModela
     */
    public function chargelistviewAction()
    {
        return $this->render();
    }

    /**
     * 充值列表数据接口
     */
    public function chargelistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return ChargeModel::factory()->ChargeList($params);
        });
        self::ajax_json($data);
    }

    public function addchargeviewAction()
    {
        return $this->render();
    }

    public function clientlistAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return ChargeModel::factory()->GetClientList();
        });
        self::ajax_json($data);
    }

    /**
     * 添加充值记录
     */
    public function adchargeAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return ChargeModel::factory()->Save($params);
        });
        self::ajax_json($data);
    }

    #region 媒体财务

    /**
     * 媒体提现列表界面
     */
    public function drawlistviewAction()
    {
        return $this->render();
    }

    /**
     * 媒体提现列表数据接口
     */
    public function drawlistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DrawLogModel::factory()->getlist($params);
        });
        self::ajax_json($data);
    }

    /**
     * 媒体提现详情界面
     */
    public function drawdetailviewAction()
    {
        return $this->render();
    }

    /**
     * 媒体提现详情
     */
    public function drawdetailAction()
    {
        $params = $this->_getGet();

        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return DrawLogModel::factory()->drawdetail($params);
        });
        self::ajax_json($data);
    }

    /**
     * 付款操作
     */
    public function paytomediaAction()
    {
        $params = $this->raw_decode();

        $data = BaseModel::Transaction(function () use ($params) {
            return DrawLogModel::factory()->paytomedia($params);
        });
        self::ajax_json($data);
    }

    /**
     * 媒体申请提现列表页
     */
    public function applydrawlistviewAction()
    {
        return $this->render();
    }

    /**
     * 媒体申请提现列表数据
     */
    public function applydrawlistAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return DrawLogModel::factory()->getmediadrawlist();
        });
        self::ajax_json($data);
    }

        /**
     * 申请提现页面
     * @return \Zend\View\Model\ViewModel
     */
    public function applydrawviewAction()
    {
        return $this->render();
    }

    /**
     * 媒体查看提现详情页面
     * @return \Zend\View\Model\ViewModel
     */
    public function applydrawdetailviewAction()
    {
        return $this->render();
    }

    /**
     * 检查申请提现按钮是否合法
     */
    public function checkdrawAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return DrawLogModel::factory()->checkdraw();
        });
        self::ajax_json($data);
    }

    /**
     * 申请提现
     */
    public function applydrawAction()
    {
        $params = $this->raw_decode();

        $data = BaseModel::Transaction(function () use ($params) {
            return DrawLogModel::factory()->applydraw($params);
        });
        self::ajax_json($data);
    }

    /**
     * 获取当前账户累计收入、账户余额、可提现余额
     */
    public function getaccountfinanceinfoAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return DrawLogModel::factory()->getaccountfinanceinfo();
        });
        self::ajax_json($data);
    }

    #endregion
}