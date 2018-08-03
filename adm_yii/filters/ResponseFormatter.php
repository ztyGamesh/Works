<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/21
 * Time: 下午8:20
 */

namespace app\filters;


use yii\base\ActionFilter;

class ResponseFormatter extends ActionFilter
{
    public function afterAction($action, $result)
    {
        if (is_array($result) && count($result)==3) {
            return array_combine(['status', 'msg', 'data'], $result);
        }


        return parent::afterAction($action, $result);
    }


}