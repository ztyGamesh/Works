<?php

namespace app\controllers;
use app\services\BaseService;

/**
 * Created by PhpStorm.
 *
 * 管理员对应操作
 *
 * User: xueleixi
 * Date: 2017/9/7
 * Time: 下午3:04
 */

class AdminController extends BaseController
{

    private $links = [
        ['url' => '/admin/conf', 'content' => '服务器信息查看'],
        ['url' => '/slot/slotPriceView', 'content' => '广告位价格调整'],
        ['url' => '/promotion/updatetag', 'content' => '标签添加-更新'],
        ['url' => '/promotion/updatetag?debug=1', 'content' => '标签添加-更新-调试'],
        ['url' => '/audit/resetOppo?mail=', 'content' => 'oppo审核状态修改（需提供邮箱）'],
//
//        ['url'=>'/index/robot?task=compute_media_total_income','content'=>'计算媒体总收入'],
//        ['url'=>'/index/robot?task=template_push','content'=>'模板更新'],
        ['url'=>'/slot/modifyOppoSlotSetting','content'=>'oppo广告位setting pic_scale字段数组改成字符串'],

    ];



    /**
     * 展示所有的隐藏页面链接
     * @return string
     */
    public function actionIndex()
    {
        return $this->render(null, ['links' => $this->links]);
    }


    public function actionConf(){
        phpinfo();
        exit();
    }


}