<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/13
 * Time: 15:55
 */

namespace app\controllers;

use app\models\ArticleCategoryModel;
use app\models\TagModel;
use app\services\AdcreativeService;
use app\services\AdgroupService;
use app\services\AdplanService;
use app\services\ArticleCategoryService;
use app\services\ConfigService;
use app\services\GeoService;
use app\services\SlotService;
use app\services\PassportService;
use app\services\BaseService;
use app\services\TagService;
use app\services\WordService;
use app\services\UserService;

class PromotionController extends BaseController
{
    private $userPower = null;// 保存登录用户权限信息

    public function init()
    {
        parent::init();
        $this->userPower = PassportService::getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly )
    }

    #region group
    public function actionAdgroupaddview()
    {
        return $this->render();
    }

    public function actionAdgroupeditview()
    {
        return $this->render();
    }

    public function actionAdgroupview()
    {
        return $this->render();
    }

    public function actionAdgrouplistview()
    {

        return $this->render();
    }

    /**
     * 查看单个广告组
     */
    public function actionFetchadgroup()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdgroupService::fetchOne($params['id']);
        });
        return $this->jsonResponse($data);
    }

    public function actionAdgrouplist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdgroupService::getList($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionAdgroupsave()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return AdgroupService::Save($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 更新广告组状态
     */
    public function actionAdgroupupdatestatus()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return AdgroupService::updateStatus($params['ids'], $params['status']);
        });
        return $this->jsonResponse($data);
    }
    #endregion

    #region plan
    public function actionAdplanaddview()
    {
        #指定地域投放数据
        $viewData = ['geos' => GeoService::getGeoMenu(), 'geoValues' => array()];
        return $this->render('', $viewData);
    }

    public function actionAdplaneditview()
    {

        return $this->render();
    }

    public function actionAdplanview()
    {
        return $this->render();
    }

    public function actionAdplanlistview()
    {

        return $this->render();
    }

    /**
     * 查看单个计划
     */
    public function actionFetchadplan()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdplanService::fetchOne($params['id']);
        });
        return $this->jsonResponse($data);
    }

    public function actionAdplanlist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdplanService::getList($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 保存计划
     */
    public function actionAdplansave()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            $id = AdplanService::Save($params);
            $keyWord = isset($params['key_word']) ? (array)$params['key_word'] : [];
            WordService::SavePlanWord($keyWord, $id);
            return $id;
        });
        return $this->jsonResponse($data);
    }

    /**
     * 更新广告计划状态
     */
    public function actionAdplanupdatestatus()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return AdplanService::updateStatus($params['ids'], $params['status']);
        });
        return $this->jsonResponse($data);
    }
    #endregion

    #region creative
    public function actionAdcreativeaddview()
    {

        return $this->render();
    }

    public function actionAdcreativefixedaddview()
    {

        return $this->render();
    }

    public function actionAdcreativefixededitview()
    {

        return $this->render();
    }

    public function actionAdcreativeeditview()
    {

        return $this->render();
    }

    public function actionAdcreativeview()
    {
        return $this->render();
    }

    public function actionAdcreativelistview()
    {
        return $this->render();
    }

    /**
     * 创意列表数据接口
     */
    public function actionAdcreativelist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeService::getList($params);
        });
        return $this->jsonResponse($data);
    }

    public function actionFetchcreative()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return AdcreativeService::fetchOne($params['id']);
        });
        return $this->jsonResponse($data);
    }

    public function actionAdcreativesave()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            $ids = [];
            foreach ($params as $item) {
                $ids[] = AdcreativeService::Save($item);
            }
            return $ids;
        });
        return $this->jsonResponse($data);
    }

    public function actionAdcreativeupdatestatus()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return AdcreativeService::updateStatus($params['ids'], $params['status']);
        });
        return $this->jsonResponse($data);
    }

    #endregion

    /**
     * 当前用户权限下广告组、计划、创意三层结构接口
     */
    public function actionFetchuseradstruct()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return AdcreativeService::useradstruct($this->get());
        });
        return $this->jsonResponse($data);
    }

    /**
     * 提取用户权限的媒体定向列表
     */
    public function actionFetchusermediatarget()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return AdplanService::FetchUserMediaTarget();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 获取计划下的媒体定向，同时返回用户的媒体定向
     */
    public function actionFetchplanmediatarget()
    {
        $userTarget = AdplanService::FetchUserMediaTarget();
        $planTarget = AdplanService::FetchPlanMediaTarget($this->getGet());
        return $this->jsonResponse([1, 'OK', ['user' => $userTarget, 'plan' => $planTarget]]);
    }

    /**
     * 查询计划下的关键词设定
     */
    public function actionFetchplanword()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return WordService::FetchPlanWord($params['id']);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 获取用户权限下的指定基础模板的创意
     */
    public function actionFetchusertemplateads()
    {
        $data = BaseService::ExecuteWithoutTransaction(function ()  {
            return AdcreativeService::useradstructbytemplate($this->getGet());
        });
        return $this->jsonResponse($data);
    }

    /**
     * geo信息
     */
    public function actionGeo()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return GeoService::getGeoMenu();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 重跑所有分词
     */
    public function actionSyncword()
    {

    }

    /**
     * 获取计划（展现形式为固定信息流）下的模板信息
     */
    public function actionFetchplantemplates()
    {
        $planId = $this->getGet('id');
        if (empty($planId)) {
            return $this->jsonResponse([0, '没有计划id', '']);
        }
        $data = BaseService::ExecuteWithoutTransaction(function () use ($planId) {
            return AdplanService::fetchplantemplatesSetting($planId);
        });
        return $this->jsonResponse($data);

    }

    /**
     * 根据计划id判断是否是计划的广告形式是否是固定信息流
     */
    public function actionIsPlanFixedFeeds()
    {
        $planId = $this->getGet('id');
        if (empty($planId)) {
            return $this->jsonResponse([0, '没有计划id', '']);
        }
        $data = BaseService::ExecuteWithoutTransaction(function () use ($planId) {
            return AdplanService::isPlanFixedFeeds($planId);
        });

        return $this->jsonResponse($data);
    }

    public function actionIsCreativeFixedFeeds()
    {
        $creativeId = $this->getGet('id');
        if (empty($creativeId)) {
            return $this->jsonResponse([0, '没有创意id', '']);
        }
        $data = BaseService::ExecuteWithoutTransaction(function () use ($creativeId) {
            return AdplanService::isCreativeFixedFeeds($creativeId);
        });

        return $this->jsonResponse($data);
    }

    public function actionAdcreativefixedview()
    {
        return $this->render();
    }

    /**
     * 返回树形结构的标签 返回广告行业标签 字典id=100
     */
    public function actionTag()
    {
        /**
         * @var $level int 标签的最大分级
         */
        $level = $this->getGet('level');
        /**
         * @var $removeAll 是否去掉分类下的"全部"伪分类
         */
        $removeAll = $this->getGet('remove_all');
        $level = empty($level) ? TagService::DEFAULT_LEVEL : $level;
        $addAll = empty($removeAll) ? true : false;
        $dictId = \Yii::$app->request->get('dict_id',TagModel::DICT_DEFAULT);
        $data = BaseService::ExecuteWithoutTransaction(function () use ($level, $addAll, $dictId) {
            return TagService::tagTree($level, $addAll, $dictId);
        });
        return $data;
    }

    public function actionArticleCategory()
    {
        $level = $this->getGet('level');
        /**
         * @var $removeAll 是否去掉分类下的"全部"伪分类
         */
        $removeAll = $this->getGet('remove_all');
        $level = empty($level) ? ArticleCategoryService::DEFAULT_LEVEL : $level;
        $addAll = empty($removeAll) ? true : false;
        $data = BaseService::ExecuteWithoutTransaction(function () use ($level, $addAll) {
            return ArticleCategoryService::categoryTree($level, $addAll);
        });
        return $data;
    }

    /**
     * 标签上传更新,只有管理员可以执行
     *
     */
    public function actionUpdatetag()
    {
        if (!UserService::IsAdminUser()) {
            return $this->jsonResponse([0, 'unAuthorized']);
        }
        $tagConf = ConfigService::GetTagConf();
        $debug = $this->getGet('debug');
        $data = BaseService::Transaction(function () use ($tagConf, $debug) {
            return TagService::updateTag($tagConf, $debug);
        });
        return $this->jsonResponse($data);
    }

}