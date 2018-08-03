<?php

namespace app\commands;

use app\models\AdcreativeAuditOtherModel;
use app\services\AdcreativeAuditOtherService;
use app\services\AdplanService;
use app\services\OppoAuditService;
use Exception;
use yii\console\Controller;

function log($msg,$level='default')
{
    echo sprintf("%s\t%s\t%s\n",date('Y-m-d H:i:s'),$level,$msg);
}
function log_info($msg)
{
    log($msg,'info');
}

function log_warn($msg)
{
    log($msg,'warn');
}

function log_error($msg)
{
    log($msg,'error');
}

/**
 * 第三方创意送审 目前只有oppo
 *
 */
class OppoAuditController extends Controller
{
    /*
     * 送审
     */
    public function actionAudit()
    {
        //把所有外审wait内审pass的oppo定向的创意送审,然后更新外审状态为audit
        try{
            OppoAuditService::submit();
        }catch (Exception $exception){
            log_error($exception->getMessage());
        }
    }

    /**
     * 查询审核状态
     */
    public function actionQuery(){
        try{
            OppoAuditService::query();
        }catch (Exception $exception){
            log_error($exception->getMessage());
        }
    }

    public function actionTest()
    {
//        OppoAuditService::testFilterCreatives();
        AdcreativeAuditOtherService::addAuditStatusForMedia('196e3d63-8239-a11a-9a07-969b4ec8a7d5');
    }

    /**
     *
     */
    public function actionTmp()
    {
        $maps = OppoAuditService::$tpl_maps;
        print_r(array_keys($maps));
    }

    public function actionToken()
    {
        echo OppoAuditService::createToken();
    }

    public function actionLog(){
        \Yii::error("xlx");//控制台应用日志无效
    }

    public function actionTest1(){
        AdcreativeAuditOtherService::addAuditStatusForPlan(95);
    }

    public function actionPlan(){
        $r=AdplanService::availableCreativeFormats(95);
        print_r($r);
    }


}
