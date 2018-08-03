<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/12
 * Time: 16:53
 */

namespace app\controllers;

use app\services\BaseService;
use app\services\custom\ArrayHandle;
use app\services\ReportService;

/**
 * 联盟报表
 * Class AllianceReportController
 * @package app\controllers
 */
class AlliancereportController extends BaseController
{
    private $array_chinese =
        [
            'group_name' => '广告组',
            'plan_name' => '广告计划',
            'creative_name' => '广告创意',
            'slot_name' => '广告位',
            'media_name' => '媒体',
            'slot_class_name' => '广告位类型',
            'template_name' => '模板',
            'province_name' => '省份',
            'city_name' => '市',

            'word' => '关键词',

            'period_date' => '日期',
            'imp' => '展示量',
            'clk' => '点击量',
            'ctr' => '点击率',
            'income' => '总花费',
            'ecpm' => '平均千次展示费用',
            'ecpc' => '平均点击单价',
            'rpm' => 'RPM',
            'fr' => '填充率'
        ];

    private function params_format()
    {
        $params = $this->getGet();
        $final = [];
        $condition = json_decode($params['condition'], true);
        unset($params['condition']);
        foreach ($condition as $item) {
            $final[] = array_merge($item, $params);
        }
        array_walk_recursive($final, function (&$val, $key) {
            $val = is_string($val) ? strip_tags(trim($val)) : $val;
        });
        return $final;
    }

    #region 联盟广告主报表

    /**
     * 联盟账户报表界面
     */
    public function actionAllianceclientview()
    {
        return $this->render();
    }

    /**
     * 账户报表数据接口
     */
    public function actionClientreport()
    {
        $dailyCallback = function ($item) {
            return ReportService::AllianceClientDailyReport($item);
        };
        $hourlyCallback = function ($item) {
            return ReportService::AllianceClientHourlyReport($item);
        };
        $processReportReq = $this->processReportReq($dailyCallback, $hourlyCallback);
        return $this->jsonResponse($processReportReq);
    }

    /**
     * 格式化clientReport数据{chart:[],report:[]}
     * @param $data array 旧格式的数据
     */
    private function formatClientReportData(&$data, $reportType, &$times, $reportData,$dimension)
    {
        /**
         * 转换对比数据
         */
        if (count($data) == 2) {
            $timeDiff = $times[0] - $times[1];
            $data['chart'][] = $data[0]['chart'];
            $data['chart'][] = $data[1]['chart'];
            $data['report']['total'] = ('contrast' == $reportData) ? $data[1]['report']['total']: $data[0]['report']['total'];
            if ('date'==$dimension){
                foreach ($data[0]['report']['rows'] as $key => $row) {
                    foreach ($row as $fieldName => $fieldVal) {
                        /**
                         * 获取查询数据
                         */
                        if (('query' === $reportData) || ('all' === $reportData)) {
                            $data['report']['rows'][$key][$fieldName][] = $fieldVal;
                        }
                        /**
                         * 获取对比数据
                         */
                        if (('contrast' === $reportData) || ('all' === $reportData)) {

                            // 排序的需要 如果按小时对比只需要hour相等即可，按天则+n天相等即可
                            if ('daily' == $reportType) {
                                $cData = $data[1]['report']['rows'];
                                foreach ($cData as $cDatum) {
                                    //有日期的总计行
                                    if (is_array($cDatum['period_date'])) {
                                        if (is_array($row['period_date']) &&
                                            (strtotime($cDatum['period_date'][0]) + $timeDiff == strtotime($row['period_date'][0]))
                                        ) {

                                            $data['report']['rows'][$key][$fieldName][] = $cDatum[$fieldName];
                                            break;
                                        }
                                        continue;
                                    }
                                    if (isset($cDatum['date'])){
                                        //非总计行
                                        if (strtotime($cDatum['date']) + $timeDiff == strtotime($row['date'])) {
                                            $data['report']['rows'][$key][$fieldName][] = $cDatum[$fieldName];
                                            break;
                                        }
                                    }

                                }
                            } else if ('hourly' == $reportType) {
                                $cData = $data[1]['report']['rows'];
                                foreach ($cData as $cDatum) {
                                    if ($cDatum['hour'] == $row['hour']) {
                                        $data['report']['rows'][$key][$fieldName][] = $cDatum[$fieldName];
                                        break;
                                    }
                                }
                            }
                        }

                    }
                }

            }
            else if ('unlimited'===$dimension){
                //广告组报表-不限
                switch ($reportData){
                    case 'contrast':
                        $data['report']['rows']=$data[1]['report']['rows'];
                        break;
                    case 'query':
                        $data['report']['rows']=$data[0]['report']['rows'];
                        break;
                    case 'all':
//                        unset($data[1]['report']['rows'][0],$data[0]['report']['rows'][0]);//删除总计行
                        $sum0=array_shift($data[0]['report']['rows']);
                        $sum1=array_shift($data[1]['report']['rows']);
                        array_unshift($data[0]['report']['rows'],$sum0,$sum1);
                        $data['report']['rows']=array_merge($data[0]['report']['rows'],$data[1]['report']['rows']);
                        $data['report']['total'] = count($data['report']['rows'])-1;
                        break;
                    default:
                        throw new \Exception('invalid parameter:report_data='.$reportData);
                }
            }
            else{
                $data['report']['rows']=('contrast' == $reportData) ? $data[1]['report']['rows']: $data[0]['report']['rows'];
            }
            unset($data[0], $data[1]);

        } else {
            $data = [
                'chart' => [$data[0]['chart']],
                'report' => $data[0]['report'],
            ];
        }
    }

    /**
     * 联盟广告组报表界面
     */
    public function actionAllianceadgroupview()
    {
        return $this->render();
    }

    /**
     * 广告组报表数据接口
     */
    public function actionAdgroupreport()
    {
        $dailyCallback = function ($item) {
            return ReportService::AllianceAdgroupDailyReport($item);
        };
        $hourlyCallback = function ($item) {
            return ReportService::AllianceAdgroupHourlyReport($item);
        };
        return $this->jsonResponse($this->processReportReq($dailyCallback, $hourlyCallback));
    }

    /**
     * 联盟广告计划报表界面
     */
    public function actionAllianceadplanview()
    {
        return $this->render();
    }

    /**
     * 广告组报表数据接口
     */
    public function actionAdplanreport()
    {
        $dailyFunc = function ($item) {
            return ReportService::AllianceAdplanDailyReport($item);
        };
        $hourlyFunc = function ($item) {
            return ReportService::AllianceAdplanHourlyReport($item);
        };

        return $this->jsonResponse($this->processReportReq($dailyFunc, $hourlyFunc));
    }

    /**
     * 联盟广告创意报表界面
     */
    public function actionAllianceadcreativeview()
    {
        return $this->render();
    }

    /**
     * 广告创意报表数据接口
     */
    public function actionAdcreativereport()
    {
        $dailyCallback = function ($item) {
            return ReportService::AllianceAdcreativeDailyReport($item);
        };
        $hourlyCallback = function ($item) {
            return ReportService::AllianceAdcreativeHourlyReport($item);
        };
        return $this->jsonResponse($this->processReportReq($dailyCallback, $hourlyCallback));
    }

    /**
     * 联盟关键词报表界面
     */
    public function actionAlliancewordview()
    {
        return $this->render();
    }

    /**
     * 广告关键词报表数据接口
     */
    public function actionWordreport()
    {
        $dailyCallback = function ($item) {
            return ReportService::AllianceWordDailyReport($item);
        };
        $hourlyCallback = function ($item) {
            return ReportService::AllianceWordHourlyReport($item);
        };
        return $this->jsonResponse($this->processReportReq($dailyCallback, $hourlyCallback));
    }

    /**
     * 联盟广告地域报表界面
     */
    public function actionAlliancegeoview()
    {
        return $this->render();
    }

    /**
     * 广告关键词报表数据接口
     */
    public function actionGeoreport()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return ReportService::AllianceGeoDailyReport($params);
        });
        return $this->jsonResponse($data);
    }
    #endregion

    #region 联盟媒体报表
    /**
     * 媒体账户报表
     */
    public function actionAllianceaccountview()
    {
        return $this->render();
    }

    /**
     * 媒体账户数据接口
     */
    public function actionAllianceaccount()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return ReportService::AllianceMediaAccountDailyReport($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体报表
     *
     */
    public function actionAlliancemediaview()
    {
        return $this->render();
    }

    /**
     * 媒体数据接口
     */
    public function actionAlliancemedia()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return ReportService::AllianceMediaDailyReport($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体广告位报表
     *
     */
    public function actionAllianceslotview()
    {
        return $this->render();
    }

    /**
     * 媒体广告位数据接口
     */
    public function actionAllianceslot()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return ReportService::AllianceSlotDailyReport($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体模板报表
     *
     */
    public function actionAlliancetemplateview()
    {
        return $this->render();
    }

    /**
     * 媒体模板数据接口
     */
    public function actionAlliancetemplate()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return ReportService::AllianceTemplateDailyReport($params);
        });
        return $this->jsonResponse($data);
    }

    #endregion

    /**
     * 输出csv
     */
    public function actionExportcsv()
    {
        $_GET['export_raw_data'] = 1;
        $params = $this->getGet();
        $action = $params['action_name'];
//        clientreportAction
        $action= 'action'.ucwords(str_replace('Action','',$action));
        $data = $this->$action();
        $filename = $this->combine_name($params);

        if (!$data) {
            echo '无数据！';
            exit;
        }
        $data = ArrayHandle::FetchMultipleArrayLeafWithKey($data, "report");
        $result = ArrayHandle::FetchMultipleArrayLeafWithKey($data, "rows");
        $result = $result ? $result[0] : null;
        if ($result) {
            $keys = ArrayHandle::FetchArrayKeys($result);
            $keys = array_unique($keys);
            $keys = array_intersect(array_keys($this->array_chinese),$keys);
            $str = '';
            foreach ($keys as $key){
                $val=$this->array_chinese[$key];
                $str .= ($str == '') ? $val : ",{$val}";
            }

            $str .= "\n";
            $str = iconv('utf-8', 'gb2312', $str);
            foreach ($result as $row) {
                $row_str = '';
                foreach ($keys as $key){
                    //总计行日期有两个
                    $fieldVal = is_array($row[$key]) ? implode(' ',$row[$key]) : $row[$key];
                    $val = iconv('utf-8', 'gb2312', $fieldVal); //中文转码
                    $row_str .= ($row_str == '') ? ($val) : (',' . $val);
                }
                $str .= $row_str . "\n";
            }
            $this->export_csv($filename, $str); //导出
        } else {
            echo '无数据！';
            exit;
        }
    }


    public function combine_name($params)
    {
        $names = [
            "clientreportAction" => "账户",
            "adgroupreportAction" => "广告组",
            "adplanreportAction" => "广告计划",
            "adcreativereportAction" => "广告创意",
            "wordreportAction" => "关键词",
            "georeportAction" => "地域",

            "allianceaccountAction" => "账户",
            "alliancemediaAction" => "媒体",
            "allianceslotAction" => "广告位",
            "alliancetemplateAction" => "广告位模板",
        ];
        $now = date('Y-m-d_H:i:s');
        if (isset($params['condition'])) {
            $params['condition'] = json_decode($params['condition'], true);
            if (count($params['condition']) == 2) {
                $begin = date('Y-m-d', strtotime($params['condition'][0]['begin']));
                $end = date('Y-m-d', strtotime($params['condition'][0]['end']));

                $begin_compare = date('Y-m-d', strtotime($params['condition'][1]['begin']));
                $end_compare = date('Y-m-d', strtotime($params['condition'][1]['end']));

                return "{$begin} 至 {$end} {$names[$params['action_name']]} {$now} 对比 {$begin_compare} 至 {$end_compare} {$names[$params['action_name']]} {$now}.csv"; //设置文件名
            } else {
                $begin = date('Y-m-d', strtotime($params['condition'][0]['begin']));
                $end = date('Y-m-d', strtotime($params['condition'][0]['end']));

                return "{$begin} 至 {$end} {$names[$params['action_name']]} {$now}.csv";
            }
        } else {
            $begin = date('Y-m-d', strtotime($params['begin']));
            $end = date('Y-m-d', strtotime($params['end']));

            return "{$begin} 至 {$end} {$names[$params['action_name']]} {$now}.csv";
        }
    }

    /**
     * @param $dailyCallback
     * @param $hourlyCallback
     * @return array
     */
    private function processReportReq($dailyCallback, $hourlyCallback)
    {
        $params = $this->params_format();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params, $dailyCallback, $hourlyCallback) {
            $data = [];
            $reportType = '';
            $reportData = 'all';//默认返回所有(查询，对比)数据
            $dimension='date';
            foreach ($params as $item) {
                $times[] = strtotime($item['begin']);
                $reportData = isset($item['report_data']) ? $item['report_data'] : $reportData;
                $dimension = isset($item['dimension']) ? $item['dimension'] : $dimension;
                if ($item['report_type'] == 'daily') {
                    $reportType = 'daily';
                    $data[] = $dailyCallback($item);
                } else if ($item['report_type'] == 'hourly') {
                    $reportType = 'hourly';
                    $data[] = $hourlyCallback($item);
                }
            }
            $this->formatClientReportData($data, $reportType, $times, $reportData,$dimension);

            return $data;
        });
        return $data;
    }
}

