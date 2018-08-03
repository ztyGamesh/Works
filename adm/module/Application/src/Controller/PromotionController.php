<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/13
 * Time: 15:55
 */

namespace Application\Controller;

use Application\Model\AdcreativeModel;
use Application\Model\AdgroupModel;
use Application\Model\ConfigModel;
use Application\Model\GeoModel;
use Application\Model\SlotModel;
use Application\Model\PassportModel;
use Application\Model\BaseModel;
use Application\Model\AdplanModel;
use Application\Model\TagModel;
use Application\Model\UserModel;
use Application\Model\WordModel;

class PromotionController extends BaseController
{
    private $userPower = null;// 保存登录用户权限信息

    public function __construct()
    {
        $this->userPower = PassportModel::factory()->getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly )
    }

    #region group
    public function adgroupaddviewAction()
    {
        return $this->render();
    }

    public function adgroupeditviewAction()
    {
        return $this->render();
    }

    public function adgroupviewAction()
    {
        return $this->render();
    }

    public function adgrouplistviewAction()
    {

        return $this->render();
    }

    /**
     * 查看单个广告组
     */
    public function fetchadgroupAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdgroupModel::factory()->fetchOne($params['id']);
        });
        self::ajax_json($data);
    }

    public function adgrouplistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdgroupModel::factory()->getList($params);
        });
        self::ajax_json($data);
    }

    public function adgroupsaveAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return AdgroupModel::factory()->Save($params);
        });
        self::ajax_json($data);
    }

    /**
     * 更新广告组状态
     */
    public function adgroupupdatestatusAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return AdgroupModel::factory()->updateStatus($params['ids'], $params['status']);
        });
        self::ajax_json($data);
    }
    #endregion

    #region plan
    public function adplanaddviewAction()
    {
        #指定地域投放数据
        $viewData = ['geos' => GeoModel::getGeoMenu(), 'geoValues' => array()];
        return $viewData;
    }

    public function adplaneditviewAction()
    {

        return $this->render();
    }

    public function adplanviewAction()
    {
        return $this->render();
    }

    public function adplanlistviewAction()
    {

        return $this->render();
    }

    /**
     * 查看单个计划
     */
    public function fetchadplanAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdplanModel::factory()->fetchOne($params['id']);
        });
        self::ajax_json($data);
    }

    public function adplanlistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdplanModel::factory()->getList($params);
        });
        self::ajax_json($data);
    }

    /**
     * 保存计划
     */
    public function adplansaveAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            $id = AdplanModel::factory()->Save($params);
            $keyWord=isset($params['key_word']) ? (array)$params['key_word'] : [];
            WordModel::factory()->SavePlanWord($keyWord, $id);
            return $id;
        });
        self::ajax_json($data);
    }

    /**
     * 更新广告计划状态
     */
    public function adplanupdatestatusAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return AdplanModel::factory()->updateStatus($params['ids'], $params['status']);
        });
        self::ajax_json($data);
    }
    #endregion

    #region creative
    public function adcreativeaddviewAction()
    {

        return $this->render();
    }

    public function adcreativefixedaddviewAction()
    {

        return $this->render();
    }

    public function adcreativefixededitviewAction()
    {

        return $this->render();
    }

    public function adcreativeeditviewAction()
    {

        return $this->render();
    }

    public function adcreativeviewAction()
    {
        return $this->render();
    }

    public function adcreativelistviewAction()
    {
        return $this->render();
    }

    /**
     * 创意列表数据接口
     */
    public function adcreativelistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeModel::factory()->getList($params);
        });
        self::ajax_json($data);
    }

    public function fetchcreativeAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeModel::factory()->fetchOne($params['id']);
        });
        self::ajax_json($data);
    }

    public function adcreativesaveAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            $ids = [];
            foreach ($params as $item) {
                $ids[] = AdcreativeModel::factory()->Save($item);
            }
            return $ids;
        });
        self::ajax_json($data);
    }

    public function adcreativeupdatestatusAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return AdcreativeModel::factory()->updateStatus($params['ids'], $params['status']);
        });
        self::ajax_json($data);
    }

    #endregion

    /**
     * 当前用户权限下广告组、计划、创意三层结构接口
     */
    public function fetchuseradstructAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return AdcreativeModel::factory()->useradstruct();
        });
        self::ajax_json($data);
    }

    /**
     * 提取用户权限的媒体定向列表
     */
    public function fetchusermediatargetAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return AdplanModel::factory()->FetchUserMediaTarget();
        });
        self::ajax_json($data);
    }

    /**
     * 获取计划下的媒体定向，同时返回用户的媒体定向
     */
    public function fetchplanmediatargetAction()
    {
        $userTarget = AdplanModel::factory()->FetchUserMediaTarget();
        $planTarget = AdplanModel::factory()->FetchPlanMediaTarget($this->_getGet());
        self::ajax_json([1, 'OK', ['user' => $userTarget, 'plan' => $planTarget]]);
    }

    /**
     * 查询计划下的关键词设定
     */
    public function fetchplanwordAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return WordModel::factory()->FetchPlanWord($params['id']);
        });
        self::ajax_json($data);
    }

    /**
     * 获取用户权限下的指定基础模板的创意
     */
    public function fetchusertemplateadsAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeModel::factory()->useradstructbytemplate($params);
        });
        self::ajax_json($data);
    }

    /**
     * geo信息
     */
    public function geoAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return GeoModel::getGeoMenu();
        });
        self::ajax_json($data);
    }

    /**
     * 重跑所有分词
     */
    public function syncwordAction()
    {

    }

    /**
     * 获取计划（展现形式为固定信息流）下的模板信息
     */
    public function fetchplantemplatesAction()
    {
        $planId = $this->_getGet('id');
        if (empty($planId)) {
            self::ajax_json([0, '没有计划id', '']);
        }
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($planId) {
            return AdplanModel::factory()->fetchplantemplatesSetting($planId);
        });
        self::ajax_json($data);

    }

    /**
     * 根据计划id判断是否是计划的广告形式是否是固定信息流
     */
    public function isPlanFixedFeedsAction()
    {
        $planId = $this->_getGet('id');
        if (empty($planId)) {
            self::ajax_json([0, '没有计划id', '']);
        }
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($planId) {
            return AdplanModel::factory()->isPlanFixedFeeds($planId);
        });

        self::ajax_json($data);
    }

    public function isCreativeFixedFeedsAction()
    {
        $creativeId = $this->_getGet('id');
        if (empty($creativeId)) {
            self::ajax_json([0, '没有创意id', '']);
        }
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($creativeId) {
            return AdplanModel::factory()->isCreativeFixedFeeds($creativeId);
        });

        self::ajax_json($data);
    }

    public function adcreativefixedviewAction()
    {
        return $this->render();
    }

    /**
     * 返回树形结构的标签
     */
    public function tagAction()
    {
        /**
         * @var $level 标签的最大分级
         */
        $level = $this->_getGet('level');
        /**
         * @var $removeAll 是否去掉分类下的"全部"伪分类
         */
        $removeAll = $this->_getGet('remove_all');
        $level = empty($level) ? TagModel::DEFAULT_LEVEL : $level;
        $addAll = empty($removeAll) ? true : false;

        $data = BaseModel::ExecuteWithoutTransaction(function () use ($level, $addAll) {
            return TagModel::factory()->tagTree($level, $addAll);
        });
        self::ajax_json($data);
    }

    /**
     * 标签上传更新,只有管理员可以执行
     *
     */
    public function updateTagAction()
    {
        if (!UserModel::factory()->IsAdminUser()){
            self::ajax_json([0,'unAuthorized']);
        }
        $tagConf=ConfigModel::factory()->GetTagConf();
        $debug=$this->_getGet('debug');
        $data=BaseModel::Transaction(function () use ($tagConf,$debug) {
            return TagModel::factory()->updateTag($tagConf,$debug);
        });
        self::ajax_json($data);
    }

}