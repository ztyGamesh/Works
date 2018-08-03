<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/11/20
 * Time: 下午6:47
 */

namespace app\controllers;

use app\services\AdcreativeService;
use app\services\BaseService;
use yii\db\Exception;

class AdcreativeController extends BaseController
{
    /**
     * 批量暂停、启用、删除、修改标题/描述【为空则不修改】、url(落地页url、第三方曝光url、第三方点击url)【为空则不修改】
     */
    public function actionBatchUpdate(){
        $data=BaseService::Transaction(function (){
            $request=$this->post();
            $type=isset($request['type'])?$request['type']:null;
            $idArr=isset($request['ids'])?$request['ids']:null;
            if (!is_array($idArr)||empty($idArr)){
                throw new Exception('invalid params:ids');
            }
            $affected=null;
            switch ($type){
                case 'status':
                    $status=isset($request['status'])?$request['status']:null;
                    $affected= AdcreativeService::updateStatus(implode(',',$idArr),$status);
                    break;
                case 'material':
                    $material=isset($request['material'])?$request['material']:null;
                    $affected= AdcreativeService::updateMaterial($material,$idArr);
                    break;
                case 'url':
                    $url=isset($request['url'])?$request['url']:null;
                    $affected= AdcreativeService::updateUrl(implode(',',$idArr),$url);
                    break;  
                default:
                    throw new Exception("invalid parameter:type={$type}");
            }
            return $affected;

        });
        $this->jsonResponse($data);
    }

    public function actionUpdate(){
        $data=BaseService::Transaction(function (){
            $request=$this->post();
            $type=isset($request['type'])?$request['type']:null;
            $id=isset($request['id'])?$request['id']:null;
            $affected=null;
            switch ($type){
                case 'material':
                    $material=isset($request['material'])?$request['material']:null;
                    $affected= AdcreativeService::updateMaterial($material,[$id]);
                    break;
                case 'name':
                    $name=isset($request['name'])?$request['name']:null;
                    $affected= AdcreativeService::updateName($name,$id);
                    break;
                case 'url':
                    $url=isset($request['url'])?$request['url']:null;
                    $affected= AdcreativeService::updateUrl($id,$url);
                    break;
                default:
                    throw new Exception("invalid parameter:type={$type}");
            }
            return $affected;

        });
        $this->jsonResponse($data);
    }

    /**
     * 批量复制多个创意到多个计划下面
     */
    public function actionBatchCopy(){
        $data=BaseService::Transaction(function (){
            $pid=$this->post('pid',[]);
            $cid=$this->post('cid',[]);
           return AdcreativeService::batchCopy($pid,$cid);
        });
        return $this->jsonResponse($data);
    }

    public function actionCreativeUsable(){
        $data=BaseService::Transaction(function (){
            $ids=$this->get('ids','');
            return AdcreativeService::usable($ids);
        });
        return $this->jsonResponse($data);
    }

    public function actionRecommendSize(){
        $data=BaseService::Transaction(function (){
            $template=$this->get('template','');
            return AdcreativeService::recommendSize($template);
        });
        return $this->jsonResponse($data);
    }

}