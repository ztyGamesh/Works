<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/21
 * Time: 下午2:25
 */

namespace app\controllers;


use app\models\FeedsModel;
use app\models\forms\feeds\FeedsForm;
use app\models\forms\PagingForm;
use app\models\SlotModel;
use app\services\BaseService;
use app\services\custom\ConditionCombineModel;
use app\services\custom\Guid;
use app\services\FeedsService;
use Faker\Provider\Base;
use yii\data\Pagination;
use yii\web\NotFoundHttpException;

class FeedsController extends BaseController
{

    /**
     * 显示新建视图,添加到MediaController下
     */
//    public function actionCreate()
//    {
//
//        return $this->render('');
//    }

    /**
     * 显示查看的视图
     * @param string $id
     * @return string
     */
    public function actionShow($uid)
    {
        FeedsForm::doValidate($this->get());

        return $this->render('');
    }

    /**
     * 编辑视图
     * @return string
     */
    public function actionEdit($uid)
    {
        return $this->render('');
    }

    /**
     * 保存
     */
    public function actionStore()
    {
        if (YII_ENV_DEV && \Yii::$app->request->isGet) {
            return FeedsModel::data();
        }
        $data = BaseService::Transaction(function () {
            return FeedsService::save($this->post());
        });
        return $this->jsonResponse($data);
    }


    /**
     * 更新
     */
    public function actionUpdate($uid)
    {
        return BaseService::ExecuteWithoutTransaction(function () use ($uid) {
            $feeds = new FeedsModel();
            if ($feeds->load($this->post(), '')) {
                return $feeds->update();//更新的时候会自动校验合法性
            }

            throw new \Exception(json_encode($feeds->errors));
        });
    }


    /**
     * 查询信息流 内容合作
     * @param null|string $uid null:查询所有信息流 string:查询某一个信息流
     * @return array
     */
    public function actionGetFeeds($uid = null)
    {
        return BaseService::ExecuteWithoutTransaction(function () use ($uid) {
            return FeedsService::getFeeds($uid, $this->get());
        });
    }

    /**
     * 关联淘宝pid
     */
    public function actionSaveTbPid()
    {
        return BaseService::Transaction(function () {
            return FeedsService::attachTaoBao($this->post());
        });
    }


}