<?php

namespace app\controllers;

use app\filters\ResponseFormatter;
use Yii;
use yii\filters\ContentNegotiator;
use yii\web\Response;

/**
 * Class BaseController 控制器基础类，提供获取请求参数get/post,视图渲染等便捷方法
 * @package app\controllers
 */
abstract class BaseController extends \yii\web\Controller
{
    /**
     * @var array 视图数据，与render传递的数据合并到一起
     */
    public $view = [];

    public function behaviors()
    {
        return [
            'contentNegotiator' => [
                'class' => ContentNegotiator::className(),
                'formats' => [
                    'application/json' => Response::FORMAT_JSON,
                    'text/html' => Response::FORMAT_HTML
                ],
            ],
            'responseFormatter'=>[
                'class'=>ResponseFormatter::className(),
            ]

        ];
    }


    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
    }

    /**
     * 不使用视图布局
     * @return $this
     */
    protected function disableLayout()
    {
        $this->layout = false;
        return $this;
    }


    /**
     * 设置json格式的response
     *  jsonResponse([0,'msg','data']) 等价于jsonResponse(0,'msg','data')
     * @param int|array $status
     * @param string $msg
     * @param null $data
     */
    protected function jsonResponse($status = 1, $msg = '操作成功', $data = null)
    {
        if (is_array($status)) {
            list($status, $msg, $data) = $status;
        }
        if (isset($_GET['export_raw_data'])) {//兼容老的，下载报表相关
            return $data;
        }
        $response = Yii::$app->response;
        $response->format = \yii\web\Response::FORMAT_JSON;
        $response->data = compact('msg', 'data', 'status');

    }

    /**
     * 设置OK的ajax响应
     * @param null $data
     * @param string $msg
     */
    protected function jsonResponseOk($data = null, $msg = 'ok')
    {
        return $this->jsonResponse(1, $msg, $data);
    }


    /**
     * 兼容老的 todo delete this
     * @param array $data
     * @return array
     */
//    public function ajax_json(array $data)
//    {
//        if (!isset($_GET['export_raw_data'])) {//? wfk
//            return $this->jsonResponse(...$data);
//        } else {
//            return $data;
//        }
//    }

    /**
     * 获取get输入并strip tags
     * @param string $key
     */
    public function getGet($key = '')
    {
        $params = Yii::$app->request->get();

        if (!empty($params)) {
            foreach ($params as &$val) {
                if (is_array($val)) continue;
                $val = strip_tags(trim($val));
            }
        }
//        $this->_setnavi();//todo test
        if (!empty($key)) {
            return $params[$key];
        }
        return $params;
    }

    /**
     * 获取未经过滤的get参数
     * @param null $name
     * @param null $defaultValue
     * @return array|mixed
     */
    public function get($name=null,$defaultValue=null){
        return Yii::$app->request->get($name,$defaultValue);
    }

    /**
     * 获取未经过滤的post参数
     * @param null $name
     * @param null $defaultValue
     * @return array|mixed
     */
    public function post($name = null, $defaultValue = null){
        return Yii::$app->request->post($name, $defaultValue);
    }

    /**
     * 获取post参数，并strip tag
     * @param string $key
     */
    public function getPost($key = '')
    {
        $params = Yii::$app->request->post();
        if (!empty($params)) {
            foreach ($params as &$val) {
                if (is_array($val)) continue;
                $val = strip_tags(trim($val));
            }
            unset($val);
        }
        if (!empty($key)) {
            return $params[$key];
        }
        return $params;
    }


    /**
     * 解析json类型的输入 用getPost替代，前端所有请求内容为json的需要设置头部contentType:application/json;
     * @return bool|mixed|string
     */
    /* public function raw_decode()
     {
         $data = file_get_contents("php://input");
         $data = $data ? json_decode($data, true) : $data;
         array_walk_recursive($data, function (&$val, $key) {
             $val = is_string($val) ? strip_tags(trim($val)) : $val;
         });
         return $data;
     }*/


    /**
     * 渲染视图,如果为空则根据action_id自动生成
     * @param string $view 视图名，为空则controller/action
     * @param array $params 视图变量
     * @return string
     */
    public function render($view = '', $params = [])
    {
        if (empty($view)) {
            $view = $this->action->id . '.phtml';
        }
        $params = array_merge($this->view, $params);
        $params['controllerName'] = $this->id;
        $params['actionName'] = $this->action->id;

        return parent::render($view, $params);
    }


    public function isPost(){
        return Yii::$app->request->isPost;
    }

    public function isGet(){
        return Yii::$app->request->isGet;
    }

    public function export_csv($filename, $data)
    {
        header("Content-type:text/csv");
        header("Content-Disposition:attachment;filename=" . $filename);
        header('Cache-Control:must-revalidate,post-check=0,pre-check=0');
        header('Expires:0');
        header('Pragma:public');
        echo $data;
        exit();
    }

}