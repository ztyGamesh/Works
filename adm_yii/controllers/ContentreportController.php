<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/10/12
 * Time: 下午2:06
 */

namespace app\controllers;

use app\models\ArticleReportModel;
use app\services\ArticleReportService;
use app\services\BaseService;
use app\services\ContentReportService;
use app\services\GoodsReportService;
use yii\db\Exception;

/**
 * Class ContentReportController 内容报表
 * @package app\controllers
 */
class ContentreportController extends BaseController
{

    /**
     * 汇总对比数据
     *  ?begin=20171011&end=20171011&begin_cmp=20171010&end_cmp=20171010&uid=
     * uid=a,b,
     */
    public function actionSum()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ContentReportService::getSummaryReportByDateAndUser($this->get());
        });
        return $this->jsonResponse($data);
    }

    /**
     * 折线图对比数据
     * ?begin=20171011&end=20171011&begin_cmp=20171010&end_cmp=20171010&uid=
     */
    public function actionChart()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ContentReportService::getChartReportByDateAndUser($this->get());
        });
        return $this->jsonResponse($data);
    }

    /**
     * 下载内容报表 ?type=content
     */
    public function actionDownload($type)
    {

        $data = BaseService::ExecuteWithoutTransaction(function () use ($type) {
            switch ($type) {
                case "content":
                    list($filename, $data) = ContentReportService::getDataForDownload($this->get());
                    $this->export_csv($filename, $data);
                    break;
                case "article":
                    list($filename, $data) = ArticleReportService::getDataForDownload($this->get());
                    $this->export_csv($filename, $data);
                    break;
                case "goods":
                    list($filename, $data) = GoodsReportService::getDataForDownload($this->get());
                    $this->export_csv($filename, $data);
                    break;
                default:
                    throw new Exception("not supported type:{$type}");

            }
        });
        return $this->jsonResponse($data);

    }



    /**
     * 热门文章报表
     */
    public function actionArticle()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ArticleReportService::getData($this->get());
        });
        return $this->jsonResponse($data);
    }

    /**
     * 热门商品报表
     * @return mixed|null
     */
    public function actionGoods()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return GoodsReportService::getData($this->get());
        });
        return $this->jsonResponse($data);
    }

    /**SUM
     * 获取热门文章的分类 ?top=50&begin=20171001&end=20171013
     * @return mixed|null
     */
    public function actionArticleTags(){
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ArticleReportService::getTags($this->get());
        });
        return $this->jsonResponse($data);
    }

    public function actionMedia(){
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ContentReportService::getMedia();
        });
        return $this->jsonResponse($data);
    }


}