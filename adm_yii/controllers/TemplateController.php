<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/10/25
 * Time: 下午4:01
 */

namespace app\controllers;


use app\services\BaseService;
use app\services\TemplateService;

class TemplateController extends BaseController
{
    /**
     * 获取可用的模板样式 报表
     * @return mixed|null [{name:'',uid:''}]
     */
    public function actionTemplates()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return TemplateService::getTemplates();
        });

        return $this->jsonResponse($data);
    }

}