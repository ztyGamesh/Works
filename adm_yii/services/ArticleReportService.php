<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/10/12
 * Time: 下午2:13
 */

namespace app\services;

use app\models\ArticleReportModel;
use app\services\custom\ConditionCombineModel;
use Exception;
use yii\helpers\ArrayHelper;

class ArticleReportService extends BaseService
{

    protected static $reportHeaders = [
        'article_id' => '文章id',
        'title' => '标题',
        'tag_name' => '分类',
        'clk' => '阅读量'
    ];

    /**
     * 文章列表
     * @param $params
     * @param $download boolean 是否下载
     * @param $rank boolean 是否生成排名序号
     * @return array
     */
    public static function getData($params, $download = false,$rank=true)
    {
        //参数验证
        list($limit, $offset) = self::checkPageParam($params);
        list($begin, $end) = self::checkDateParam($params);

        $condModel = new ConditionCombineModel();
        $condModel->AndCondition($begin, "date >= '{$begin}' AND date <= '{$end}'");

        $tag_code = ArrayHelper::getValue($params, 'tag_code');
        if ($tag_code) {
            $str = self::escapeDottedStr($tag_code);
            $condModel->AndCondition($tag_code, "tag_code in ({$str})");
        }

        //avg_time_length 数据库ms,传给前端s
        $sql="
SELECT
  article_id,
  title,
  type,
  round(ifnull(sum(read_time_length)/sum(pv)/1000,0),4) as avg_time_length,
  round(ifnull(sum(readover)/sum(pv),0),4) as avg_readover,
  sum(clk) AS clk,
  concat(t.level1,'/',t.level2) as tag_name,
  tag_code
FROM reports_article_daily r
  JOIN tag t on r.tag_code=t.code
WHERE 1 {$condModel->Condition()}
GROUP BY article_id
ORDER BY clk DESC
        ";

        if ($download) {
            $sql .= " LIMIT $offset,$limit";
            return ArticleReportModel::queryList($sql);
        }
        return BaseService::Paging($sql, $limit, $offset,$rank);

    }

    /**
     * 获取下载文章列表的数据
     * @param $params
     * @return string gbk编码的csv数据
     */
    public static function getDataForDownload($params)
    {
        $rows = static::getData($params, true,false);
        $beginDate = $params['begin'];
        $endDate = $params['end'];
        $csvData = static::generateCsvData($rows, static::$reportHeaders);

        $fileName = "{$beginDate} 至 {$endDate} top文章.csv";
        return [$fileName, $csvData];
    }

    /**
     * 获取top50文章分类
     * @param $params array: top begin end
     */
    public static function getTags($params)
    {
        list($begin,$end) =static::checkDateParam($params);
        $top=(int)ArrayHelper::getValue($params,'top',50);
        if (!is_int($top)){
            throw new \Exception("参数无效：top");
        }

        $sql="
SELECT DISTINCT tag_code,tag_name
FROM (
       SELECT
         r.tag_code,
         concat(t.level1,\"/\",t.level2) as tag_name,
         sum(clk) as clk
       FROM reports_article_daily r
          JOIN tag t on r.tag_code=t.code
       WHERE date>='{$begin}' and date<='{$end}'
       GROUP BY article_id
       ORDER BY clk DESC
       LIMIT 0,{$top}
     ) as t1";

        return ArticleReportModel::queryList($sql);
    }

}