<?php
namespace Custom;

class Utility {

    /**
     * 以指定键值生成kv对应数据
     */
    public static function getKv($data, $key, $main = false)
    {
        if (empty($data)) return false;
        $outData = array();
        foreach ($data as $value) {
            if ($main) {
                $outData[$value[$key]] = $value[$main];
            } else {
                $outData[$value[$key]] = $value;
            }
        }
        return $outData;
    }

    /**
     * 获取数组中的子集
     * @return string
     * @return array(v1, v2,...)
     */
    public static function getSubList($data, $sub)
    {
        if (empty($data))
            return false;

        $outData = array();
        foreach ($data as $val) {
            $outData[] = $val[$sub];
        }
        return $outData;
    }

    /**
     * 以$sort的key对$data的子数组进行排序
     */
    public static function sortByArr($data, $sort)
    {
        foreach ($data as &$val) {
//            var_dump( $val, $sort );
            $new = array();
            foreach ($sort as $ks => $vs) {
                $new[$ks] = $val[$ks];
            }
            $val = $new;
//            var_dump( $val ); exit;
        }
        unset($val);
        return $data;
    }

    /**
     * 获得客户端Ip
     */
    public static function getIp()
    {
        $realip = NULL;
        if (isset($_SERVER)) {
            if (isset($_SERVER["HTTP_X_FORWARDED_FOR"])) {
                $realip = $_SERVER["HTTP_X_FORWARDED_FOR"];
            } elseif (isset($_SERVER["HTTP_CLIENT_IP"])) {
                $realip = $_SERVER["HTTP_CLIENT_IP"];
            } else {
                $realip = $_SERVER["REMOTE_ADDR"];
            }
        } else {
            if (getenv('HTTP_X_FORWARDED_FOR')) {
                $realip = getenv('HTTP_X_FORWARDED_FOR');
            } elseif (getenv('HTTP_CLIENT_IP')) {
                $realip = getenv('HTTP_CLIENT_IP');
            } else {
                $realip = getenv('REMOTE_ADDR');
            }
        }
        return $realip;
    }

    /**
     * 判断访客是否是移动端
     */
    public static function isMobileVisit()
    {
        $agent = strtolower($_SERVER['HTTP_USER_AGENT']);
        $is_pc = (strpos($agent, 'windows nt')) ? true : false;
        $is_mac = (strpos($agent, 'mac os')) ? true : false;
        $is_iphone = (strpos($agent, 'iphone')) ? true : false;
        $is_android = (strpos($agent, 'android')) ? true : false;
        $is_ipad = (strpos($agent, 'ipad')) ? true : false;
        if ($is_iphone) {
            return true;
        }
        if ($is_android) {
            return true;
        }
        if ($is_ipad) {
            return false;
        }
        if ($is_pc) {
            return false;
        }
        if ($is_mac) {
            return false;
        }
    }

    /**
     * 得到bid
     */
    public static function getBid()
    {
        return date('YmdHis') . rand(10, 99);
    }

    /**
     * 得到nid
     * @version 1.0
     */
    public static function getNid()
    {
        return rand(10000000, 99999999);
    }

    /**
     * @param $cityGeos 城市数据
     * @param array $selectedArr 已选城市
     */
    public static function getCityGeosData($cityGeos, $selectedArr = array())
    {
        $arr = $cityGeos;
        $returnArr = array();

        //组织省份信息
        $index = 0; //用于html id
        foreach ($arr as $key => $row) {
            if ($row['province'] == $row['city']) {
                $code = $row['code'] / 10000;
                $row['checked'] = 0;
                if (!empty($selectedArr) && in_array($code, $selectedArr)) {
                    $row['checked'] = 1;
                }
                $returnArr[$code]['code'] = $code;
                $returnArr[$code]['privince'] = $row['province'];
                $returnArr[$code]['city_level'] = $row['city_level'];
                $returnArr[$code]['checked'] = $row['checked'];
                $returnArr[$code]['index'] = $index;
                $index ++;
            }
        }
        foreach ($arr as $key => $row) {
            if ($row['province'] != $row['city']) {
                $provinceCode = substr($row['code'], 0, 6);
                $row['checked'] = 0;
                if (!empty($selectedArr) && (in_array($row['code'], $selectedArr) || in_array($provinceCode, $selectedArr))) {
                    //已选，或者 所在省份已选，则都算选上了
                    $row['checked'] = 1;
                }
                $returnArr[$provinceCode]['city'][] = array(
                    'code' => $row['code'],
                    'city' => $row['city'],
                    'city_level' => $row['city_level'],
                    'checked' => $row['checked'],
                );
            }
        }
        return $returnArr;
    }

    /**
     * 获取 下载包 文件大小
     * @param $uri
     * @return int
     */
    public static function getRemoteFilesize($url)
    {
        if (!$url)  return 0;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: */*',
            'User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)',
            'Connection: Keep-Alive'));
        $header = curl_exec($ch);
        curl_close($ch);
        $regex = '/Content-Length:\s([0-9].+?)\s/';
        preg_match_all($regex, $header, $matches);

        // if there was a Content-Length field, its value
        // will now be in $matches[1]
        if (isset($matches[1])) {
            $size = array_pop($matches[1]);
        } else {
            $size = 0;
        }
        //$last=round($size/(1024*1024),3);
        //return $last.' MB';
        return $size;
    }

    /**
     * 导出报表.csv格式的 
     * @param array $res = array('title'=>, 'total'=> '', 'rows',)
     */
    public static function exportCsv($filename, $res)
    {
        header("Content-type:  application/octet-stream; charset=utf-8");
        header("Accept-Ranges:  bytes ");
        header("Content-Disposition:  attachment;  filename={$filename}.csv");
        echo "\357\273\277";
        if (!empty($res['title'])) {
            echo implode(',', $res['title']) . "\r\n";
        }
        if (count($res['rows']) > 0) {
            foreach ($res['rows'] as $val) {
                echo implode(',', $val) . "\r\n";
            }
        }
        exit;
    }

    /**
     * 导出报表用excel插件
     * @param array $res (title=>array(),rows=>array(array() ,
     * extraInfo=>array('desc1','desc2') 二维数组,增加
     */
    public static function exprotExcel($filename, $res, $extraInfo = array())
    {
        if (!$filename) $filename = date('YmdHis');
        $title = empty($res['title']) ? $res['rows'][0] : $res['title'];
        $list = !empty($res['title']) ? array_merge(array($res['title']), $res['rows']) : $res['rows'];

        require ROOT . '/vendor/Libs/PHPExcel.php';
        $objPHPExcel = new \PHPExcel();

        $objPHPExcel->getProperties()->setTitle($filename);
        // Add some data
        $objPHPExcel->setActiveSheetIndex(0);

        $cells = \Custom\Utility::setExcelCells($title);
        $row = 1;
        #如果有附加信息,添加在报表数据前
        if ($extraInfo) {
            foreach ($extraInfo as $desc) {
                $objPHPExcel->getActiveSheet()->setCellValue("{$cells[0]}{$row}", $desc);
                $row += 1;
            }
        }
        #添加报表数据
        foreach ($list as $key => $val) {
            $i = 0;
            foreach ($val as $v) {
                $objPHPExcel->getActiveSheet()->setCellValue("{$cells[$i]}{$row}", $v);
                $i++;
            }
            $row += 1;
        }

        $objPHPExcel->getActiveSheet()->setTitle('Sheet1');

        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);

        // Redirect output to a client’s web browser (Excel2007)
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment;filename={$filename}.xlsx");
        header('Cache-Control: max-age=0');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
        header('Cache-Control: cache, must-revalidate'); // HTTP/1.1

        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save('php://output');
        exit;
    }

    /**
     * 根据数据栏目，生成excel的title列
     */
    public static function setExcelCells($title = array())
    {
        $cells = array();
        $count = count($title);
        for ($i = 0; $i < $count; $i++) {
            if ($i > 25) {
                // 栏目多于A-Z,26个字母,A的ASCII=65
                $multiple = floor($i / 26);
                if ($multiple > 26) {
                    // @todo, 栏目多于AA~ZZ,
                    trigger_error("excel column more than AA~ZZ!", E_USER_ERROR);
                    break;
                }
                $abc = chr(65 + $multiple - 1) . chr(65 + ($i - $multiple * 26));
            } else {
                $abc = chr(65 + $i);
            }
            $cells[] = $abc;
        }
        return $cells;
    }

    public static function parseDate($sdate, $edate)
    {
        $modeArr = array(
            'minute' => '分',
            'hour' => '小时',
            'day' => '天',
            'week' => '周',
            'month' => '月',
        );

        $diff = $edate - $sdate;
//        var_dump( date('Y-m-d H:i:s', $sdate), date('Y-m-d H:i:s', $edate), $diff );
        if ($diff < 0) {
            return '未知';
        }

        $date = array();
        $month = floor($diff / (86400 * 30));
        if ($month > 0) {
            $date[] = $month . $modeArr['month'];
            $diff = $diff - $month * (86400 * 30);
        }

        $week = floor($diff / (86400 * 7));
        if ($week > 0) {
            $date[] = $week . $modeArr['week'];
            $diff = $diff - $week * (86400 * 7);
        }

        $day = floor($diff / 86400);
        if ($day > 0) {
            $date[] = $day . $modeArr['day'];
            $diff = $diff - $day * 86400;
        }

        $hour = floor($diff / 3600);
        if ($hour > 0) {
            $date[] = $hour . $modeArr['hour'];
            $diff = $diff - $hour * 3600;
        }

        $minute = floor($diff / 60);
        if ($minute > 0) {
            $date[] = $minute . $modeArr['minute'];
        }
        return $date;
    }

}
