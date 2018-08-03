<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/11/15
 * Time: 下午6:42
 */

namespace app\services;

use function app\commands\log_info;
use function app\commands\log_warn;
use function app\commands\log_error;
use app\models\AdcreativeAuditModel;
use Exception;
use yii\db\Connection;
use yii\helpers\ArrayHelper;



class OppoAuditService
{
    /**
     * oppo 接口状态码
     */
    const RESP_OK = 0;
    const RESP_ERR = 1;

    /**
     * oppo 审核状态码
     */
    const STATUS_AUDIT = 0;
    const STATUS_PASS = 1;
    const STATUS_REJECT = 2;
    const STATUS_INVALID = -1;// 创意提交审核后15分钟内查询或者创意生效时间已结束

    /**
     * oppo审核状态和dl审核状态映射
     * @var array
     */
    protected static $statusMap = [
        0 => 'audit',
        1 => 'pass',
        2 => 'reject',
    ];

    public static $tpl_maps = [
        /**
         * 信息流 1 2 3
         */
        '7c44a357-ecd0-4c5b-80d0-db8bd5100149' => [
            'oppo信息流大图' => '信息流大图+文字模板',
            'pic_bytes' => 50 * 1024,
            'pic_size' => '640_320',// 图片真实宽高
            'title' => 17,          // 标题最大字符数
            'ad_source' => 8,              // 创意来源最大字符数
            'format' => 'JPG/JPEG/PNG',
        ],
        '7e1199fd-de4d-469f-8778-5de1268cddea' => [
            'oppo信息流小图' => '信息流图文',
            'pic_bytes' => 50 * 1024,
            'pic_size' => '320_210',// 图片真实宽高
            'title' => 17,
            'ad_source' => 8,
            'format' => 'JPG/JPEG/PNG',
        ],
        '6684515c-3b6d-40f5-969c-d137c3913aab' => [
            'oppo信息流组图' => '信息流组图',
            'pic1_bytes' => 50 * 1024,
            'pic2_bytes' => 50 * 1024,
            'pic3_bytes' => 50 * 1024,
            'pic_size' => '320_210',// 图片真实宽高
            'title' => 17,
            'ad_source' => 8,
            'format' => 'JPG/JPEG/PNG',
        ],
        /**
         * 开屏 目前我们没有
         */
        /**
         * 横幅
         */
        '3fc13471-36a1-4dfc-abde-98c364e78e2e' => [
            'oppo横幅图文' => '横幅图文',
            'pic_bytes' => 30 * 1024,
            'pic_size' => '72_72',// 图片真实宽高
            'title' => 14,
            'description' => 14,
            'format' => 'JPG/JPEG/PNG',
        ],
        'b62e5dfa-a628-4ddc-a2ef-c43e62feb318' => [
            'oppo横幅图片' => '横幅纯图',
            'pic_bytes' => 30 * 1024,
            'pic_size' => '340_100',// 图片真实宽高
            'format' => 'JPG/JPEG/PNG',
        ],
        /**
         * 插屏
         */
        '5e0e3da8-e3cc-4330-a409-ee7263a08711' => [
            'oppo插屏图片' => '插屏纯图',
            'pic_bytes' => 80 * 1024,
            'pic_size' => '600_500',// 图片真实宽高
            'format' => 'JPG/JPEG/PNG',
        ],

    ];


    /**
     * submit creative audit to using oppo api
     */
    public static function submit()
    {
        $creatives = static::queryCreatives();
        log_info("queryCreatives:\t" . json_encode($creatives, JSON_UNESCAPED_UNICODE));
        $pushCreatives = static::filterCreatives($creatives);
        log_info("filterCreatives:\t".json_encode($pushCreatives,JSON_UNESCAPED_UNICODE));
        $oppoFmtCtvs = static::convertToOppoFormat($pushCreatives);
        log_info("convertToOppoFormat:\t".json_encode($oppoFmtCtvs,JSON_UNESCAPED_UNICODE));
        static::pushCtvsToOppo($oppoFmtCtvs);
    }

    /**
     * query audit status using oppo api
     * ad_creative_audit_other 查询条件：审核状态处于audit，更新：edit_time,audit_status(audit/pass/reject),comment
     */
    public static function query()
    {
        $oppoUid = self::getOppoUid();
        $sql = "
SELECT group_concat(ocm.cr_id) FROM ad_creative_audit_other ao 
	JOIN oppo_ctv_map ocm on ocm.creative_id=ao.creative_id
WHERE ao.uid='{$oppoUid}' and ao.audit_status='audit'";
        $crIds = \Yii::$app->db->createCommand($sql)->queryScalar();
        log_info("oppo creative query:crIds=$crIds");
        if (empty($crIds)) {
            return;
        }

        $ret = static::queryCtvStatus(explode(',', $crIds));
        log_info("oppo creative query ret:$ret");
        $response = json_decode($ret, true);
        if ($response['ret'] == static::RESP_ERR) {
            log_error("opp创意查询失败:$ret");
        } else {
            $audits = $response['data'];
            if(empty($audits)){
                return;
            }
            $updateTs = time();
            $affected = 0;
            foreach ($audits as $audit) {
                $crId = $audit['crId'];
                $status = $audit['status'];
                $remark = $audit['remark'];
                $dlStatus = '';
                $update = true;
                switch ($status) {
                    case static::STATUS_AUDIT:
                    case static::STATUS_PASS:
                    case static::STATUS_REJECT:
                        $dlStatus = static::$statusMap[$status];
                        break;
                    case static::STATUS_INVALID:
                    default:
                        $update = false;
                        break;
                }
                if ($update) {
                    $sql = "
update ad_creative_audit_other ao JOIN oppo_ctv_map oc on ao.creative_id=oc.creative_id and ao.uid='$oppoUid' and oc.cr_id ={$crId}
set ao.audit_status='{$dlStatus}',ao.comment='{$remark}',ao.edit_time={$updateTs}";
                    $affected += AdcreativeAuditModel::execute($sql);
                }
            }
            log_info("ad_creative_audit_other updated cnt=$affected");
        }

    }


    /**
     * @param array $oppoFmtCtvs oppo审核格式的创意
     */
    protected static function pushCtvsToOppo(array $oppoFmtCtvs)
    {
        if (empty($oppoFmtCtvs)){
            log_info('没有需要送审的创意');
            return;
        }
        $url = \Yii::$app->params['oppo']['creative_submit_url'];
        $token = static::createToken();
        $headers = [
            'Content-Type: application/json',
            "Authorization: Bearer $token",
        ];
        try {
            //送审每次最多100个
            $trunks=array_chunk($oppoFmtCtvs,100);
            foreach ($trunks as $k=>$trunk){
                $response = self::curlRequest($url, $trunk, $headers);
                log_info("pushCtvsToOppo ret-{$k}:\t $response");
                $oppoResp = json_decode($response, true);
                if ($oppoResp['ret'] == static::RESP_OK) {
                    $idMaps = [];//crId=>creative_id
                    $cIds = [];//creative_ids
                    $hasError = false;
                    $timeStamp = time();
                    foreach ($oppoResp['data'] as $auditInfo) {
                        $crId = $auditInfo['crId'];//int
                        $externalId = $auditInfo['externalId'];//cid
                        $msg = $auditInfo['msg'];//生成crId失败原因
                        if ($msg) {
                            //生成crId失败原因
                            $hasError = true;
                            log_error("生成crId失败:{$msg},creative_id:{$externalId}");
                            continue;
                        }
                        $idMaps[] = [$crId, $externalId, $timeStamp];
                        $cIds[] = $externalId;
                    }
                    /**
                     * 如果失败则整体失败
                     */
//                    if ($hasError) {
//                        log_error("生成crId有失败");
//                        return;
//                    }
                    if (!empty($idMaps)) {
                        $oppoUid = self::getOppoUid();
//                    $fields=['uid','creative_id','audit_status','edit_time','edit_user'];
                        $ctvRows = [];//ad_creative_audit_other
                        foreach ($cIds as $cId) {
                            $ctvRows[] = ['uid' => $oppoUid, 'creative_id' => $cId, 'audit_status' => 'audit', 'edit_time' => $timeStamp];
                        }
                        log_info('ctvRows: ' . json_encode($ctvRows));
                        log_info('idMaps: ' . json_encode($idMaps));
                        \Yii::$app->db->transaction(function ($db) use ($idMaps, $ctvRows) {
                            /**
                             * @var $db Connection
                             */
                            $affectedOcm = $db->createCommand()->batchInsert(
                                'oppo_ctv_map',
                                ['cr_id', 'creative_id', 'create_time'],
                                $idMaps
                            )->execute();
                            $affectedAo = 0;
                            foreach ($ctvRows as $ctvRow) {
                                $affectedAo += $db->createCommand()->update(
                                    'ad_creative_audit_other',
                                    ['audit_status' => $ctvRow['audit_status'], 'edit_time' => $ctvRow['edit_time']],
                                    ['uid' => $ctvRow['uid'], 'creative_id' => $ctvRow['creative_id']]
                                )->execute();
                            }
                            log_info("creative submit db result:oppo_ctv_map=$affectedOcm,ad_creative_audit_other=$affectedAo");
                        });
                    }
                } else {
                    log_error('oppo创意送审error:');
                }
            }
        } catch (Exception $exception) {
            log_error("oppo创意审核失败," . $exception->getMessage());
        }


    }


    /**
     * @param $creativeIds array [int] oppo crId
     */
    protected static function queryCtvStatus($creativeIds)
    {

        $url = \Yii::$app->params['oppo']['creative_query_url'];
        $token = static::createToken();
        $headers = [
            'Content-Type: application/json',
            "Authorization: Bearer $token",
//            'Content-Encoding:gzip',
            'Accept-Encoding:gzip'
        ];
        return static::curlRequest($url, $creativeIds, $headers);

    }

    /**
     * oppo请求 post gzip
     * @param $url
     * @param $data
     * @param $headers
     * @return mixed
     * @throws Exception
     */
    public static function curlRequest($url, $data, $headers)
    {
        $ch = curl_init();
        if (!$ch) {
            throw new Exception("curl init error");
        }
        $postBody = json_encode($data);
        if (strlen($postBody) > 1000) {
            $headers[] = "Content-Encoding:gzip";
            $postBody = gzencode($postBody);
        }

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);
        curl_setopt($ch, CURLOPT_TIMEOUT, 90);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_ENCODING, 'gzip');//Accept-Encoding:gzip

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postBody);

        $response = curl_exec($ch);
        if (false === $response) {
            throw new Exception("curl exec error:" . curl_error($ch));
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode >= 200 && $httpCode < 300) {
            return $response;
        }
        throw new Exception("response error,code:" . $httpCode);

    }

    /**
     * 转换为oppo的物料审核请求格式
     * @param $creatives
     * @return array
     */
    protected static function convertToOppoFormat($creatives)
    {
        /*
         * $oppoCtvTpl = [//ooppo创意审核请求模板
            "fmtSpec" => 1,//素材规则 1:信息流大图 2：信息流小图 3：信息流组图
            "contentType" => 1,//推广类型：  1 链接推广 2 应用推广
            "landingPage" => "xxxx",//落地页必填 landing
            "appPkg" => "asdfasas07asf",//应用推广必填
            "title" => "这是广告标题",
            "bdName" => "这是品牌名称",
            "desc" => "这是广告描述",
            "beginTime" => 1501143422,
            "endTime" => 1501419600,
            "externalId" => "342",//dsp方创意映射id <=32位
            "fileUrls" => [//图片/视频的 url 地址
                "http=>//xxxxxxxx/a.jpg",
                "http://xxxxxxxx/b.jpg",
            ]
        ];*/

        static $fmtSpecMap = [
            '7c44a357-ecd0-4c5b-80d0-db8bd5100149' => 1,
            '7e1199fd-de4d-469f-8778-5de1268cddea' => 2,
            '6684515c-3b6d-40f5-969c-d137c3913aab' => 3,
            '3fc13471-36a1-4dfc-abde-98c364e78e2e' => 9,
            'b62e5dfa-a628-4ddc-a2ef-c43e62feb318' => 10,
            '5e0e3da8-e3cc-4330-a409-ee7263a08711' => 11,

        ];
        static $contentMap = [
            'landing' => 1,
            'download' => 2
        ];

        static $possiblePics = ['pic' => 0, 'pic1' => 1, 'pic2' => 2, 'pic3' => 3];
        $static_server = \Yii::$app->params['static_server'];

        $oppoCtvs = [];//oppo 创意
        foreach ($creatives as $creative) {
            $oppoCtv = [];
            $fmtSpec = ArrayHelper::getValue($fmtSpecMap, $creative['template_class'], -1);

            if ($fmtSpec == -1) {
                log_warn("fmtSpec error:template_class {$creative['template_class']} has no mapping");
            }
            $oppoCtv['fmtSpec'] = $fmtSpec;
            $oppoCtv['contentType'] = ArrayHelper::getValue($contentMap, $creative['purpose'], -1);
            $oppoCtv['landingPage'] = isset($creative['landing']) ? $creative['landing'] : '';
            $oppoCtv['appPkg'] = isset($creative['app_pkg']) ? $creative['app_pkg'] : '';
            $oppoCtv['externalId'] = "{$creative['id']}";//创意id为字符串
            $oppoCtv['bdName'] = $creative['ad_source'];
            $oppoCtv['beginTime'] = $creative['start_time'];
            $oppoCtv['endTime'] = $creative['end_time'] + 15552000;//结束时间=开始时间+半年

            $oppoCtv['title'] = isset($creative['material']['title']) ? $creative['material']['title'] : '';
            $oppoCtv['desc'] = isset($creative['material']['description']) ? $creative['material']['description'] : '';
            $oppoCtv['fileUrls'] = [];
            $pics = array_intersect_key($creative['material'], $possiblePics);
            $picsArr = array_values($pics);

            array_walk($picsArr, function (&$picSrc) use ($static_server) {
                $picSrc = $static_server . $picSrc;
            });

            $oppoCtv['fileUrls'] = $picsArr;
            $oppoCtvs[] = $oppoCtv;
        }

        return $oppoCtvs;
    }


    /**
     * 查定向到oppo需要去审核的创意
     * 定向oppo(计划定向或者计划定向为空但用户定向了)的符合条件的（计划开启状态、内审通过,oppo外审待审核）创意
     * @return array
     */
    protected static function queryCreatives()
    {
        $uid = static::getOppoUid();
        $sql = "
SELECT  DISTINCT c.id,c.template_class,c.material,c.ad_source,
  c.link as landing,
  g.purpose,
  p.app_pkg,
  p.s as start_time,
  p.e as end_time
FROM ad_creative c
  join ad_plan p on c.plan_id=p.id and p.e+86400 > unix_timestamp()
  JOIN ad_group g on c.group_id=g.id
  JOIN media m on find_in_set(m.bundle_id, p.media_target) > 0 or (  p.media_target =''
        and (not exists(SELECT 1 FROM resource r WHERE p.create_user=r.uid and r.platform_role='alliance' and r.type='bundle_id')
              or exists(SELECT 1 FROM resource r WHERE p.create_user=r.uid and r.platform_role='alliance' and r.type='bundle_id' and r.id=m.bundle_id)
            )
        )
  JOIN ad_creative_audit_other ao on ao.creative_id=c.id and ao.uid='{$uid}' and ao.audit_status='wait'
  JOIN user u on m.medium=u.uid and u.pause=0
WHERE 1
  and p.status='active' and g.status='active'
   and  m.create_user='{$uid}' and c.audit_status='pass'
  ";
        return \Yii::$app->db->createCommand($sql)->queryAll();
    }

    /**
     * @param $creatives
     */
    protected static function filterCreatives($creatives)
    {
        $pushCreatives = [];
        foreach ($creatives as $creative) {
            $cid = $creative['id'];
            if (isset(static::$tpl_maps[$creative['template_class']])) {
                $material = $creative['material'] = json_decode($creative['material'], true);
                if (!$material) {
                    continue;
                }
                $push = true;
                foreach (static::$tpl_maps[$creative['template_class']] as $k => $v) {
                    switch ($k) {
                        case 'pic_bytes':
                        case 'pic1_bytes':
                        case 'pic2_bytes':
                        case 'pic3_bytes':
                            $pic_bytes = ArrayHelper::getValue($material, $k, 0);
                            if ($pic_bytes == 0) {
                                log_warn("material $cid lack $k");
                                $push = false;
                            } else if ($pic_bytes > $v) {
                                log_warn("material $cid $k mismatch: $pic_bytes>$v");
                                $push = false;
                            }
                            break;
                        case 'pic_size':
                            $pic_size = ArrayHelper::getValue($material, $k, 0);
                            if ($pic_size != $v) {
                                log_warn("material $cid $k mismatch: $pic_size!=$v");
                                $push = false;
                            }
                            break;
                        case 'title':
                        case 'ad_source':
                        case 'description':
                            $content = ArrayHelper::getValue($material, $k, '');
                            $len = mb_strlen($content);
                            if ($len > $v) {
                                $push = false;
                                log_warn("material $cid $k mismatch: $len>$v");
                            }
                            break;
                        case 'format':
                            $pics = ['pic', 'pic1', 'pic2', 'pic3'];
                            $formats = explode('/', $v);
                            foreach ($pics as $pic) {
                                $picName = ArrayHelper::getValue($material, $pic, 'a.png');
                                $picFormat = substr($picName, strrpos($picName, '.') + 1);
                                if (!in_array(strtoupper($picFormat), $formats)) {
                                    log_warn("material $cid $k mismatch: $picName not in $v");
                                    $push = false;
                                    break;
                                }

                            }

                            break;
                        default:
                            break;

                    }
                    if (!$push) {
                        break;
                    }
                }

                if ($push) {
                    $pushCreatives[] = $creative;
                }
            } else {
                log_warn("template no match : cid=$cid tid={$creative['template_class']}");
            }
        }
        return $pushCreatives;
    }


    /**
     * oppo request token
     * @return string
     */
    public static function createToken()
    {
        $dspId = \Yii::$app->params['oppo']['dspId'];
        $key = \Yii::$app->params['oppo']['key'];
        $timeStamp = time();
        $sign = sha1($dspId . $key . $timeStamp);
        return base64_encode($dspId . "," . $timeStamp . "," . $sign);
    }

    /**
     * ut
     */
    public static function testFilterCreatives()
    {

        $creatives = [
            [
                'id' => '71',
                'template_class' => '7c44a357-ecd0-4c5b-80d0-db8bd5100149',
                'ad_source' => '信息流大图',
                'purpose' => 'landing',//落地页还是下载
                'app_pkg' => '',//推广目的为下载时必不可少
                'start_time' => time() - 3600,//推广开始时间
                'landing' => 'http://land.com',
            ],
            [
                'id' => '72',
                'template_class' => '7e1199fd-de4d-469f-8778-5de1268cddea',
                'ad_source' => '信息流小图',
                'purpose' => 'download',//落地页还是下载
                'app_pkg' => 'com.包名',//推广目的为下载时必不可少
                'start_time' => time() - 3600,//推广开始时间
                'landing' => 'http://land.com',
            ],
            [
                'id' => '73',
                'template_class' => '6684515c-3b6d-40f5-969c-d137c3913aab',
                'ad_source' => '信息流组图',
                'purpose' => 'landing',
                'app_pkg' => '',
                'start_time' => time() - 3600,
                'landing' => 'http://land.com',
            ],
            [
                'id' => '81',
                'template_class' => '3fc13471-36a1-4dfc-abde-98c364e78e2e',
                'ad_source' => '横幅图文',
                'purpose' => 'landing',
                'app_pkg' => '',
                'start_time' => time() - 3600,
                'landing' => 'http://land.com',
            ],
            [
                'id' => '82',
                'template_class' => 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318',
                'ad_source' => '横幅纯图',
                'purpose' => 'landing',
                'app_pkg' => '',
                'start_time' => time() - 3600,
                'landing' => 'http://land.com',
            ],
            [
                'id' => '91',
                'template_class' => '5e0e3da8-e3cc-4330-a409-ee7263a08711',
                'ad_source' => '插屏纯图',
                'purpose' => 'landing',
                'app_pkg' => '',
                'start_time' => time() - 3600,
                'landing' => 'http://land.com',
            ],

        ];

        $materials = [
            [//信息流大图
                'pic_bytes' => 40 * 1024,//'pic_bytes' => 50 * 1024,
                'pic_size' => '640_320',// 'pic_size' => '640_320',// 图片真实宽高
                'title' => "一二三四五六七八九十一二三四五六七",//'title' => 17,
                'pic' => 'abc.jpg',//'format' => 'JPG/JPEG/PNG',
                'pic_scale' => '32_21',
                "ad_source" => "abcdef中国",//'ad_source' => 8,
                "description" => "描述"
            ],
            [//小图
                'pic_bytes' => 40 * 1024,//'pic_bytes' => 50 * 1024,
                'pic_size' => '320_210',// 'pic_size' => '320_210',// 图片真实宽高
                'title' => "一二三四五六七八九十一二三四五六七",//'title' => 17,
                'pic' => 'abc.jpg',//'format' => 'JPG/JPEG/PNG',
                'pic_scale' => '32_21',
                "ad_source" => "abcdef中国",//'ad_source' => 8,
                "description" => "描述"
            ],
            [//组图
                'pic1_bytes' => 50 * 1024,
                'pic2_bytes' => 50 * 1024,
                'pic3_bytes' => 50 * 1024,
                'pic_size' => '320_210',// 图片真实宽高
                'title' => "一二三四五六七八九十一二三四五六七",//'title' => 17,
                'pic1' => 'abc.jpg',//'format' => 'JPG/JPEG/PNG',
                'pic2' => 'png.png',//'format' => 'JPG/JPEG/PNG',
                'pic3' => 'jpeg.jpeg',//'format' => 'JPG/JPEG/PNG',
                "ad_source" => "abcdef中国",//'ad_source' => 8,
                "description" => "描述"
            ],
            [//横幅图文
                'pic_bytes' => 30 * 1024,//'pic_bytes' => 30 * 1024,
                'pic_size' => '72_72',// 'pic_size' => '640_320',// 图片真实宽高
                'title' => "一二三四五六七八九十一二三四",//'title' => 14,
                'pic' => 'abc.jpg',//'format' => 'JPG/JPEG/PNG',
                "description" => "描述"//14
            ],
            [//横幅纯图
                'pic_bytes' => 30 * 1024,//'pic_bytes' => 30 * 1024,
                'pic_size' => '340_100',// 'pic_size' => '640_320',// 图片真实宽高
                'pic' => 'abc.jpg',//'format' => 'JPG/JPEG/PNG',
            ],
            [//插屏纯图
                'pic_bytes' => 80 * 1024,//'pic_bytes' => 80 * 1024,
                'pic_size' => '600_500',// 'pic_size' => '640_320',// 图片真实宽高
                'pic' => 'abc.jpg',//'format' => 'JPG/JPEG/PNG',
            ],
        ];


        $len = count($creatives);
        for ($i = 0; $i < $len; $i++) {
            $creatives[$i]['material'] = json_encode($materials[$i]);
        }

        $pushCreatives = static::filterCreatives($creatives);
        echo "count=" . count($pushCreatives) . PHP_EOL;

        $oppoCtvs = static::convertToOppoFormat($pushCreatives);
        print_r($oppoCtvs);

        static::pushCtvsToOppo($oppoCtvs);

    }

    /**
     * @return mixed
     */
    protected static function getOppoUid()
    {
        return \Yii::$app->params['oppo']['uid'];
    }


}