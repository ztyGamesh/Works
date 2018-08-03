<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/11/20
 * Time: 下午6:47
 */

namespace app\controllers;

use app\services\AdgroupService;
use app\services\BaseService;
use yii\db\Exception;

class AdgroupController extends BaseController
{
    /**
     * 批量暂停、启用、删除、修改日预算
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
                    $affected= AdgroupService::updateStatus(implode(',',$idArr),$status);
                    break;
                case 'budget':
                    $budget=isset($request['budget'])?$request['budget']:null;
                    $affected= AdgroupService::updateBudget($budget,$idArr);
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
                case 'name':
                    $name=isset($request['name'])?$request['name']:null;
                    $affected= AdgroupService::updateName($name,$id);
                    break;
                case 'budget':
                    $budget=isset($request['budget'])?$request['budget']:null;
                    $affected= AdgroupService::updateBudget($budget,[$id]);
                    break;
                default:
                    throw new Exception("invalid parameter:type={$type}");
            }
            return $affected;

        });
        $this->jsonResponse($data);
    }

    /**
     * 新建计划等获取组结构
     * @return mixed|null
     */
    public function actionGroups(){
        $data=BaseService::ExecuteWithoutTransaction(function (){
            $withPlan=$this->get('plan',null);
            $search=$this->get('search',null);
            $purpose=$this->get('purpose',null);
            return AdgroupService::structure($withPlan,$search,$purpose);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 批量复制广告组
     */
    public function actionBatchCopy(){
        $data=BaseService::Transaction(function (){
            $recurse=$this->post('recurse',false);
            $gid=$this->post('gid',[]);
            AdgroupService::batchCopy($gid,$recurse);
        });
        return $this->jsonResponse($data);
    }

}