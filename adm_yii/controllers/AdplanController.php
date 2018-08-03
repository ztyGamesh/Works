<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/11/20
 * Time: 下午6:47
 */

namespace app\controllers;

use app\services\AdplanService;
use app\services\BaseService;
use app\services\WordService;
use Exception;
use Faker\Provider\Base;

class AdplanController extends BaseController
{
    /**
     * 获取计划新建创意时可用的样式、模板、尺寸、大小等
     * @param $id int|string plan_id
     * @return mixed|null
     */
    public function actionCreativeFormats($id)
    {
        $data = BaseService::ExecuteWithoutTransaction(function () use ($id) {
            return AdplanService::availableCreativeFormats($id);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 保存计划
     */
    public function actionAdplansave()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            $id = AdplanService::Save($params);
            $keyWord = isset($params['key_word']) ? (array)$params['key_word'] : [];
            WordService::SavePlanWord($keyWord, $id);
            return $id;
        });
        return $this->jsonResponse($data);
    }

    /**
     * 批量修改 启用、暂停、删除、日预算、出价、添加关键词
     */
    public function actionBatchUpdate()
    {
        $data = BaseService::Transaction(function () {
            $request = $this->post();
            $type = isset($request['type']) ? $request['type'] : null;
            $idArr = isset($request['ids']) ? $request['ids'] : null;

            $affected = null;
            switch ($type) {
                case 'status':
                    $status = isset($request['status']) ? $request['status'] : null;
                    $affected = AdplanService::updateStatus(implode(',', $idArr), $status);
                    break;
                case 'budget':
                    $budget = isset($request['budget']) ? $request['budget'] : null;
                    $affected = AdplanService::updateBudget($budget, $idArr);
                    break;
                case 'price':
                    $price = isset($request['price']) ? $request['price'] : null;
                    $affected = AdplanService::updatePrice($price, $idArr);
                    break;
                case 'word':
                    $plan_words = isset($request['plans']) ? $request['plans'] : null;
                    $affected = AdplanService::updateWord($plan_words);
                    break;
                default:
                    throw new Exception("invalid parameter:type={$type}");
            }
            return $affected;

        });
        $this->jsonResponse($data);
    }

    /**
     * 单一修改：计划名称、出价、日预算
     */
    public function actionUpdate()
    {
        $data = BaseService::Transaction(function () {
            $request = $this->post();
            $type = isset($request['type']) ? $request['type'] : null;
            $id = isset($request['id']) ? $request['id'] : null;
            $affected = null;
            switch ($type) {
                case 'name':
                    $name = isset($request['name']) ? $request['name'] : null;
                    $affected = AdplanService::updateName($name, $id);
                    break;
                case 'budget':
                    $budget = isset($request['budget']) ? $request['budget'] : null;
                    $affected = AdplanService::updateBudget($budget, $id);
                    break;
                case 'price':
                    $price = isset($request['price']) ? $request['price'] : null;
                    $affected = AdplanService::updatePrice($price, $id);
                    break;
                default:
                    throw new Exception("invalid parameter:type={$type}");
            }
            return $affected;

        });
        $this->jsonResponse($data);
    }


    /**
     * 下载关键词
     */
    public function actionDownloadWord()
    {

        $data = BaseService::ExecuteWithoutTransaction(function () {
            $plan_id = $this->get('plan_id');
            $target_type = $this->get('target_type');
            $planName=\Yii::$app->db->createCommand('select name from ad_plan WHERE id=:id')
                ->bindValue(':id',$plan_id)
                ->queryScalar();
            $data = AdplanService::exportWord($plan_id, $target_type);
            $filename = sprintf('%s%s.csv', $planName, date('YmdHis'));
            $this->export_csv($filename, $data);
        });
        return $this->jsonResponse($data);
    }

    public function actionDownloadWordExample()
    {
        $data=AdplanService::exportWordExample();
        $this->export_csv('关键词上传下载模板.csv', $data);
    }

    /**
     * 批量复制计划
     */
    public function actionBatchCopy()
    {
        $data = BaseService::Transaction(function () {
            $recurse = $this->post('recurse', 0);
            $gid = $this->post('gid', []);
            $pid = $this->post('pid', []);
            AdplanService::batchCopy($pid, $gid, $recurse);
        });
        return $this->jsonResponse($data);
    }

    public function actionKeywords()
    {
        $data = BaseService::Transaction(function () {
            $plan_ids = $this->get('ids', '');
            $target_type = $this->get('target_type', '');
            return AdplanService::getPlanKeyWords($plan_ids, $target_type);
        });
        return $this->jsonResponse($data);
    }


}