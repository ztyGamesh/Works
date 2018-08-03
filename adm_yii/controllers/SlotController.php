<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/5
 * Time: 下午2:47
 */

namespace app\controllers;


use app\models\forms\PagingForm;
use app\models\forms\slot\PriceConfForm;
use app\models\forms\slot\StatusForm;
use app\services\BaseService;
use app\services\SlotService;
use app\services\SlotWhiteListService;
use app\services\UserService;
use yii\web\NotFoundHttpException;
use yii\web\UnauthorizedHttpException;

class SlotController extends BaseController
{
    /**
     * 修改slot状态
     */
    public function actionSaveStatus()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            $form = StatusForm::doValidate($this->post());
            return SlotService::saveStatus($form);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 保存模板价格接口
     * 相关参数说明如下
     * uid:广告位id
     * cooperate_mode:0:固定价格 1：分成,2:底价+分城，3:技术服务费，4：公开竞价，5：cpm合约';
     * price：小数 底价
     * media_share：int 0-100 def:60
     * profit_rate: int >=0 def:20
     * profit_price：double 广告成本
     */
    public function actionSavePriceConf()
    {
        $data = BaseService::Transaction(function () {
            $form = PriceConfForm::doValidate($this->post());
            return SlotService::saveSlotPriceConf($form);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 获取广告位状态以及分成等价格配置
     * @return mixed|null
     */
    public function actionGetStatusAndPriceConf()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            $form = PagingForm::doValidate($this->get());
            return SlotService::fetchSlotStatusAndPriceConf($form);
        });
        return $this->jsonResponse($data);
    }


    /**
     * 查看广告位信息
     */
    public function actionView()
    {
        return $this->render();
    }

    /**
     * 模板调价界面
     */
    public function actionSlotPriceView()
    {
        if (UserService::IsAdminUser()){
            return $this->render();
        }
        throw new UnauthorizedHttpException('无权访问');
    }

    public function actionGetAdFormats()
    {
        return $this->jsonResponseOk(SlotService::getAdFormats());
    }

    /**
     * 添加白名单
     */
    public function actionAddWhiteList()
    {
        $ret = BaseService::Transaction(function () {
            return SlotWhiteListService::add($this->post());
        });
        return $this->jsonResponse($ret);
    }

    public function actionGetWhiteList()
    {
        $ret = BaseService::ExecuteWithoutTransaction(function () {
            return SlotWhiteListService::get($this->get());
        });
        return $this->jsonResponse($ret);
    }

    /*
     * 修改广告位模板设置 pic_setting.scale 统一成字符串
     */
    public function actionModifyOppoSlotSetting()
    {
        $sql = "
        SELECT setting,st.uid
FROM slot_template st
  JOIN slot s ON st.slot = s.uid
  JOIN user u ON s.create_user = u.uid
WHERE 1 AND 
 (st.setting LIKE '%\"scale\":[%' OR st.setting LIKE '%\"pic_size\":[%') 
ORDER BY st.create_time DESC";

        $rows = \Yii::$app->db->createCommand($sql)->queryAll();
        $updateRows = [];
        foreach ($rows as &$row) {
            $setting = json_decode($row['setting'], true);
            echo "old setting:{$row['setting']} <br>";
            $picSetting = $setting['pic_setting'];
            $picSetting['scale'] = $picSetting['scale'][0];
            if (!empty($picSetting['pic_size'])) {
                $picSetting['pic_size'] = $picSetting['pic_size'][0];
            }

            $setting['pic_setting'] = $picSetting;
            $newSetting = json_encode($setting);
            echo "new setting:{$newSetting} <br>";
            $updateRows[] = [':uid' => $row['uid'], ':setting' => $newSetting];
        }

        $sqlUpdate = 'UPDATE slot_template SET setting=:setting WHERE uid=:uid';
        $affected = 0;
        foreach ($updateRows as $updateRow) {
            $affected += \Yii::$app->db->createCommand($sqlUpdate)->bindValues($updateRow)->execute();
        }
        return $affected;
    }

    //获取广告位名称(同时判断多个广告位是否是有效广告位)
    public function actionGetSlotNames(){
        $data= BaseService::ExecuteWithoutTransaction(function ()  {
            return SlotService::validateAndGetSlotNames($this->get());
        });
        return $this->jsonResponse($data);
    }

}