<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/10/12
 * Time: 下午2:13
 */

namespace app\services;

use app\models\ContentReportModel;
use app\services\custom\ConditionCombineModel;
use yii\db\Exception;

class ContentReportService extends BaseService
{
    public static $reportHeaders = [
        'date'=>'日期',
        'media_id' => '媒体ID',
        'media_name' => '媒体名称',
        'user_mail' => '媒体账户',
        'cost' => '消费',
        'media_income' => '媒体收入',
        'list_pv' => '列表页pv',
        'dau' => '媒体dau',
        'avg_refresh_cnt' => '用户平均刷新次数',
//        'list_content_pv' => '列表页内容条数',
        'list_content_imp' => '列表页内容曝光',
        'list_content_clk' => '列表页内容点击',
        'list_content_ctr' => '列表页内容CTR',
        'list_ad_pv' => '列表页广告展示',
        'list_ad_clk' => '列表页广告点击',
        'list_ad_ctr' => '列表页广告ctr',
        'list_ad_cost' => '列表页广告消费',
        'list_ad_ecpm' => '列表页广告ecpm',
        'list_ad_cpm' => '列表页广告cpm',
        'list_ad_fill_rate' => '列表页广告填充率',
//        'detail_goods_pv' => '详情页商品展示',
        'detail_pv' => '详情页展示',
        'detail_goods_clk' => '详情页商品点击',
        'detail_goods_ctr' => '详情页商品ctr',
        'detail_ad_pv' => '详情页广告pv',
        'detail_ad_clk' => '详情页广告点击',
        'detail_ad_cost' => '详情页广告消费',
        'detail_ad_ctr' => '详情页广告CTR',
        'detail_ad_ecpm' => '详情页广告ecpm',
        'detail_ad_cpm' => '详情页广告cpm',
        'avg_read_time' => '平均阅读时长',
        'readover_rate' => '阅读完成率',
        'ref_rec_ctr' => '相关推荐ctr',
        'tb_vol' => '商品成交量',
        'tb_payment' => '佣金',

    ];

    public static $emptyContentReportRow=[
        'date'=> '',
        'media_id'=> 0,
        'media_name'=> 0,
        'user_mail'=> '',
        'cost'=> 0,
        'media_income'=> 0,
        'list_pv'=> 0,
        'dau'=> 0,
        'avg_refresh_cnt'=> 0,
        'list_content_pv'=> 0,
        'list_content_imp'=> 0,
        'list_content_clk'=> 0,
        'list_content_ctr'=> 0,
        'list_ad_pv'=> 0,
        'list_ad_clk'=> 0,
        'list_ad_ctr'=> 0,
        'list_ad_cost'=> 0,
        'list_ad_cpm'=> 0,
        'list_ad_ecpm'=> 0,
        'detail_pv'=> 0,
        'detail_goods_clk'=> 0,
        'detail_goods_ctr'=> 0,
        'detail_ad_pv'=> 0,
        'detail_ad_clk'=> 0,
        'detail_ad_cost'=> 0,
        'detail_ad_ctr'=> 0,
        'detail_ad_cpm'=> 0,
        'detail_ad_ecpm'=> 0,
        'tb_vol'=> 0,
        'tb_payment'=> 0,
        'list_ad_fill_rate'=> 0,
        'avg_read_time'=> 0,
        'readover_rate'=> 0,
        'ref_rec_ctr'=> 0,
    ];
    
    /**
     * 根据 日期-用户维度 获取汇总报表
     * @param $condition array
     * begin:
     * end:
     * begin_cmp:
     * end_cmp:
     * uid: a|a,b,c|''|
     */
    # 开始日期 结束日期 消费 媒体收入 列表页pv 列表页内容ctr 列表页广告ctr 详情页pv 详情页广告ctr 商品ctr 商品成交量 佣金
    public static function getSummaryReportByDateAndUser($cond)
    {
        if (!isset($cond['begin'], $cond['end'], $cond['begin_cmp'], $cond['end_cmp'], $cond['uid'])) {
            throw new Exception('缺少参数:begin/end/begin_cmp/end_cmp/uid必不可少');
        }

        $data[] = static::getSumDataByDateAndUser($cond['begin'], $cond['end'], $cond['uid']);
        $data[] = static::getSumDataByDateAndUser($cond['begin_cmp'], $cond['end_cmp'], $cond['uid']);
        return $data;
    }

    /**
     * @param $beginDate
     * @param $endDate
     * @param null $uid user.uid
     * @return array|null
     */
    protected static function getSumDataByDateAndUser($beginDate, $endDate, $uid = null)
    {
        list($where_date, $where_user) = self::formatQueryCondition($beginDate, $endDate, $uid);
        $sql = "
SELECT
  '{$beginDate}' as begin,
  '{$endDate}'  as end,
  round(sum(ifnull(list_ad_cost,0)+ifnull(detail_ad_cost,0)+ifnull(tb_payment,0)),2) as cost,
  round(sum(media_income),2) as media_income,
  sum(list_pv) as list_pv,
  round(sum(list_content_clk)/sum(list_content_imp),4) as list_content_ctr,
  round(sum(list_ad_clk)/sum(list_ad_pv),4) as list_ad_ctr,
  sum(detail_pv) as detail_pv,
  round(sum(detail_ad_clk)/sum(detail_ad_pv),4) as detail_ad_ctr,
  round(sum(detail_goods_clk)/sum(detail_goods_pv),4) as goods_ctr,
  sum(tb_vol) as goods_vol,
  round(sum(tb_payment),2) as payment
FROM reports_content_daily rc
WHERE 1 {$where_date} {$where_user}";
        return ContentReportModel::queryRow($sql);

    }

    /**
     * 根据 日期-用户维度 获取每天对比数据
     * @param $condition array
     * begin:
     * end:
     * begin_cmp:
     * end_cmp:
     * uid: a|a,b,c|''|
     */
    # 日期 消费 媒体收入 列表页pv 列表页内容ctr 列表页广告ctr 详情页pv 详情页广告ctr 商品ctr 商品成交量 佣金
    public static function getChartReportByDateAndUser($cond)
    {
        if (!isset($cond['begin'], $cond['end'], $cond['begin_cmp'], $cond['end_cmp'], $cond['uid'])) {
            throw new Exception('缺少参数:begin/end/begin_cmp/end_cmp/uid必不可少');
        }

        $data[] = static::getChartDataByDateAndUser($cond['begin'], $cond['end'], $cond['uid']);
        $data[] = static::getChartDataByDateAndUser($cond['begin_cmp'], $cond['end_cmp'], $cond['uid']);
        return $data;
    }

    protected static function getChartDataByDateAndUser($beginDate, $endDate, $uid = null)
    {
        list($where_date, $where_user) = self::formatQueryCondition($beginDate, $endDate, $uid);

        $sql = "
SELECT
  d.date,
  round(sum(list_ad_cost+detail_ad_cost+tb_payment),2) as cost,
  round(sum(media_income),2) as media_income,
  sum(list_pv) as list_pv,
  round(sum(list_content_clk)/sum(list_content_imp),4) as list_content_ctr,
  round(sum(list_ad_clk)/sum(list_ad_pv),4) AS list_ad_ctr,
  sum(detail_pv) as detail_pv,
  round(sum(detail_ad_clk)/sum(detail_ad_pv),4) AS detail_ad_ctr,
  round(sum(detail_goods_clk)/sum(detail_goods_pv),4) as goods_ctr,
  sum(tb_vol) as goods_vol,
  round(sum(tb_payment),2) as payment
FROM reports_content_daily rc
  RIGHT JOIN dic_date d  on d.date=rc.date {$where_user}
WHERE 1 {$where_date}
GROUP BY d.date;";
        return ContentReportModel::queryList($sql);
    }

    /**
     * @param $beginDate
     * @param $endDate
     * @param $uid
     * @return array
     */
    protected static function formatQueryCondition($beginDate, $endDate, $uid)
    {
        $date_cond = new ConditionCombineModel();
        $date_cond->AndCondition($beginDate, "rc.`date` >= '{$beginDate}'");
        $date_cond->AndCondition($endDate, "rc.`date` <= '{$endDate}'");
        $where_date = $date_cond->Condition();

        $user_cond = new ConditionCombineModel();
        if (!empty($uid)) {
            /**
             * escape string
             */
            $ids = explode(',', $uid);
            $uid = '';
            for ($i = 0, $iMax = count($ids); $i < $iMax; $i++) {
                $uid .= "'$ids[$i]'";
                if ($i < $iMax - 1) {
                    $uid .= ',';
                }
            }
        }

        $user_cond->AndCondition($uid, "user_id in ($uid)");
        $where_user = $user_cond->Condition();
        return array($where_date, $where_user);
    }


    /**
     * 获取下载的内容报表数据
     * @var array $cond
     * @return
     */
    public static function getDataForDownload($cond)
    {
        if (!isset($cond['begin'], $cond['end'])) {
            throw new \Exception('缺少参数:begin/end');
        }

        $beginDate = $cond['begin'];
        $endDate = $cond['end'];
        $condition = new ConditionCombineModel();
        $condition->AndCondition($beginDate, "d.`date`>= '{$beginDate}'");
        $condition->AndCondition($beginDate, "d.`date`<= '{$endDate}'");
        $where_date = $condition->Condition();

        $sql_r = "SELECT
  d.date,
  media_id,
  media_name,
  user_mail,
  /* 消费 */ round(sum(list_ad_cost+detail_ad_cost+tb_payment),2) AS cost,
  /* 媒体收入 */ round(sum(media_income),2) AS media_income,
  /* 列表页pv */ sum(list_pv) AS list_pv,
  /* 媒体dau */ sum(dau) AS dau,
  /* 用户平均刷新次数 */ round(sum(list_pv)/sum(dau),2) AS avg_refresh_cnt,
  /* 列表页内容条数 */ sum(list_content_pv) AS list_content_pv,
  /* 列表页内容imp */ sum(list_content_imp) AS list_content_imp,
  /* 列表页内容点击 */ sum(list_content_clk) AS list_content_clk,
  /* 列表页内容CTR */ round(sum(list_content_clk)/sum(list_content_imp),4) AS list_content_ctr,

  /* 列表页广告展示 */ sum(list_ad_pv) AS list_ad_pv,
  /* 列表页广告点击 */ sum(list_ad_clk) AS list_ad_clk,
  /* 列表页广告ctr */ round(sum(list_ad_clk)/sum(list_ad_pv),4) AS list_ad_ctr,
  /* 列表页广告消费 */ sum(list_ad_cost) AS list_ad_cost,
  /* 列表页广告cpm */ round(sum(list_ad_cost)/sum(list_ad_pv)*1000,2) AS list_ad_cpm,
  /* 列表页广告ecpm */ round(sum(list_ad_income)/sum(list_ad_pv)*1000,2) AS list_ad_ecpm,

  /* 详情页展示  */ sum(detail_pv) AS detail_pv,
  /* 详情页商品点击  */ sum(detail_goods_clk) AS detail_goods_clk,
  /* 详情页商品ctr  */ round(sum(detail_goods_clk)/sum(detail_pv),4) AS detail_goods_ctr,

  /* 详情页广告pv */ sum(detail_ad_pv) AS detail_ad_pv,
  /* 详情页广告点击 */ sum(detail_ad_clk) AS detail_ad_clk,
  /* 详情页广告消费 */ sum(detail_ad_cost) AS detail_ad_cost,
  /* 详情页广告CTR */ round(sum(detail_ad_clk)/sum(detail_ad_pv),4) AS detail_ad_ctr,
  /* 详情页广告cpm */ round(sum(detail_ad_cost)/sum(detail_ad_pv)*1000,2) AS detail_ad_cpm,
  /* 详情页广告ecpm */ round(sum(detail_ad_income)/sum(detail_ad_pv)*1000,2) AS detail_ad_ecpm,

  /* 商品成交量 */ sum(tb_vol) AS tb_vol,
  /* 佣金 */ round(sum(tb_payment),2) AS tb_payment,
  round(sum(list_ad_ret)/sum(list_ad_req),4) as list_ad_fill_rate,
  round(sum(detail_time_length)/sum(dau)/1000) as avg_read_time,
  round(sum(detail_readover)/sum(detail_pv),4) as readover_rate,
  round(sum(ref_rec_clk)/sum(ref_rec_pv),4) as ref_rec_ctr
FROM reports_content_daily rc
  RIGHT JOIN dic_date d on d.date=rc.date
WHERE 1   {$where_date}
  GROUP BY  rc.media_id,d.date
ORDER BY d.date";
        $sql_m = 'SELECT m.uid as media_id,m.name as media_name,u.mail as user_mail
FROM media m
  JOIN (SELECT DISTINCT media_uid FROM feeds) as t on t.media_uid=m.uid
JOIN user u on m.medium=u.uid';


        $rRows = ContentReportModel::queryList($sql_r);
        $mRows = ContentReportModel::queryList($sql_m);
        $validReports = [];
        foreach ($rRows as $rRow) {
            if (isset($rRow['media_id'])) {
                $key = strtotime($rRow['date']) . $rRow['media_id'];
                array_walk($rRow, function (&$v) {
                    if ($v === null) {
                        $v = '0';
                    }
                });
                $validReports[$key] = $rRow;
            }
        }
        //填充空数据
        $fullRows = [];
        $beginDateTs = strtotime($beginDate);
        $endDateTs = strtotime($endDate);
        for ($date = $beginDateTs; $date <= $endDateTs; $date += 86400) {
            foreach ($mRows as $mRow) {
                $dmKey = $date . $mRow['media_id'];
                if (isset($validReports[$dmKey])){
                    $fullRow=$validReports[$dmKey];
                }else{
                    $fullRow = self::$emptyContentReportRow;
                    $fullRow['media_id']=$mRow['media_id'];
                    $fullRow['media_name']=$mRow['media_name'];
                    $fullRow['user_mail']=$mRow['user_mail'];
                    $fullRow['date']=date('Y-m-d',$date);
                }
                $fullRows[]= $fullRow;
            }
        }

        $csvData = self::generateCsvData($fullRows, static::$reportHeaders);
        $filename = "{$beginDate} 至 {$endDate} 内容合作.csv";
        return [$filename, $csvData];

    }

    /**
     * 获取内容合作的媒体账户的uid,name
     */
    public static function getMedia()
    {
        $sql = "
SELECT DISTINCT u.uid,u.name
FROM feeds f
  JOIN media m ON f.media_uid=m.uid
  JOIN user u ON u.uid= m.medium
WHERE f.pid =''";
        return ContentReportModel::queryList($sql);
    }


}