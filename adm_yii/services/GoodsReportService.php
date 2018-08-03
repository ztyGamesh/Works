<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/10/12
 * Time: 下午2:13
 */

namespace app\services;

use app\models\GoodsReportModel;
use yii\db\Exception;

class GoodsReportService extends BaseService
{

    protected static $reportHeaders = [
        'goods_id' => '商品id',
        'name' => '商品名称',
        'price' => '商品价格',
        'rato' => '收入比率',
        'clk' => '点击量',
    ];

    /**
     * @param $params
     * @return array
     * @throws Exception
     */
    public static function getData($params, $download = false,$rank=true)
    {
        //参数验证
        list($limit, $offset) = static::checkPageParam($params);
        list($begin, $end) = self::checkDateParam($params);

        $sql = "
SELECT
  goods_id,
  name,
  ROUND(price,2) as price,
  ROUND(rato/10000,4) as rato,
  sum(clk) as clk
FROM reports_goods_daily
WHERE date >= '{$begin}' AND date <= '{$end}'
GROUP BY goods_id
ORDER BY clk DESC
";
        if ($download) {
            $sql .= " LIMIT $offset,$limit";
            return GoodsReportModel::queryList($sql);
        }

        return BaseService::Paging($sql, $limit, $offset,$rank);
    }


    /**
     * 热门商品下载数据
     * @param $params
     * @return array
     */
    public static function getDataForDownload($params)
    {
        $rows = static::getData($params, true,false);
        $beginDate = $params['begin'];
        $endDate = $params['end'];
        $csvData = static::generateCsvData($rows, static::$reportHeaders);

        $fileName = "{$beginDate} 至 {$endDate} top商品.csv";
        return [$fileName, $csvData];
    }


}