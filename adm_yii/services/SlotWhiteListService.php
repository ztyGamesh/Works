<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2018/1/8
 * Time: 上午11:54
 */

namespace app\services;

use app\models\SlotWhiteListModel;
use yii\base\InvalidParamException;

class SlotWhiteListService extends BaseService
{

    /**
     * 给一个广告位添加n(n>=1)个广告主白名单，或者删除已有的白名单(client_id为空)
     * @param $params array slot_id: client_id
     * @return int
     * @throws \yii\db\Exception
     */
    public static function add(array $params)
    {
        // data check
        if (!isset($params['slot_id'], $params['client_id'])) {
            throw new InvalidParamException('缺少参数:slot_id/client_id');
        }
        $clientId = trim($params['client_id']);
        $slotId = trim($params['slot_id']);
        if(empty($slotId)){
            throw new InvalidParamException('无效参数:slot_id');
        }
        //删除旧数据
        \Yii::$app->db->createCommand('delete from slot_white_list WHERE slot_id =:slot_id',[':slot_id'=>$slotId])->execute();
        if(empty($clientId)){
            return 0;
        }
        $clientIds = explode(',', $clientId);
        // insert to db
        $insertRows=[];
        foreach ($clientIds as $k=>$clientId) {
            $placeHolders[]=":v{$k}";
            $bindValues[":v{$k}"]=$clientId;
            //去重
            $insertRows[$clientId]=[$slotId,$clientId];
        }
        $placeHolder=implode(',',$placeHolders);

        $validIds = \Yii::$app->db->createCommand("SELECT uid FROM user WHERE role ='client' AND uid IN($placeHolder)")
            ->bindValues($bindValues)
            ->queryColumn();
        $invalidIds=array_diff($clientIds,$validIds);
        if (count($invalidIds)>0) {
            throw new InvalidParamException('广告主id：'.implode(',',$invalidIds).'不存在');
        }


        return \Yii::$app->db->createCommand()
            ->batchInsert(
                SlotWhiteListModel::tableName(),
                ['slot_id','client_id'],
                $insertRows
            )->execute();
    }

    /**
     * 查询一个slot对应的白名单设置
     * @param array $get
     * @return array|false
     * @throws \yii\base\InvalidParamException
     * @throws \yii\db\Exception
     */
    public static function get(array $get)
    {
        if (empty($get['slot_id'])) {
            throw new InvalidParamException('lack param slot_id');
        }
        $sql = 'SELECT w.client_id,u.name AS client_name FROM slot_white_list w
JOIN user u ON w.client_id=u.uid
WHERE w.slot_id=:slot_id';

        return \Yii::$app->db
            ->createCommand($sql)
            ->bindValue(':slot_id', $get['slot_id'])
            ->queryAll();
    }


}