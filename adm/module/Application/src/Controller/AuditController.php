<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/29
 * Time: 18:05
 */

namespace Application\Controller;

use Application\Model\BaseModel;
use Application\Model\AdcreativeModel;
use Application\Model\AdcreativeAuditOtherModel;

class AuditController extends BaseController
{
    /**
     * 创意审核列表界面
     * @return \Zend\View\Model\ViewModel
     */
    public function adcreativeauditlistviewAction()
    {
        return $this->render();
    }

    /**
     * 创意审核列表数据接口
     */
    public function adcreativeauditlistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function ()use ($params) {
            return AdcreativeModel::factory()->getAuditList($params);
        });
        self::ajax_json($data);
    }

    /**
     * 创意第三方审核状态查询
     */
    public function adcreativeauditotherlistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function ()use ($params) {
            return AdcreativeAuditOtherModel::factory()->getAuditList($params);
        });
        self::ajax_json($data);
    }

    /**
     * 创意审核状态更改接口
     */
    public function adcreativeupdateauditstatusAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return AdcreativeModel::factory()->updateAuditStatus($params);
        });
        self::ajax_json($data);
    }

    /**
     * 批量更新创意外部审核状态
     */
    public function adcreativeupdateauditstatusothersAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return AdcreativeAuditOtherModel::factory()->UpdateOtherStatus ($params['ids'],$params['medium'],$params['audit_status'],$params['comment']);
        });
        self::ajax_json($data);
    }

    /**
     * 全量初始化计划下所有创意的审核状态
     * 1.根据每个计划的定向 送审相应账户
     * 2.自动通过不需要送审的账户下创意
     */
    public function adcreativeotherstatusinitAction()
    {
        $data = BaseModel::Transaction(function ()  {
            return AdcreativeAuditOtherModel::factory()->AllPlanInit();
        });
        self::ajax_json($data);
    }
}