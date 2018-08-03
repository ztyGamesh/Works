<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2018/1/5
 * Time: 下午1:04
 */

namespace app\services;


use app\models\SlotModel;
use app\models\SlotTargetModel;
use Yii;
use yii\base\InvalidParamException;

class SlotTargetService extends BaseService
{
    /**
     * 保存一个计划的广告位定向
     * @param $planId
     * @param $slotMap array $slots {bundle_id1:'slotId1,slotId2',bundle_id1:''}
     * @param bool $deleteBeforeSave
     * @return int
     * @throws \yii\base\InvalidParamException
     * @throws \yii\db\Exception
     */
    public static function save($planId, $slotMap, $deleteBeforeSave = true)
    {
        if ($deleteBeforeSave) {
            self::delete($planId);
        }
        $insertRows = [];
        $slotIds = [];
        foreach ($slotMap as $bundleId => $slotStr) {
            if (empty($slotStr)) {
                continue;
            }
            $slots = explode(',', $slotStr);
            foreach ($slots as $slot) {
                $insertRows[] = [$planId, $slot];
                $slotIds[$slot] = "'{$slot}'";
            }
            $sqlSlotIds = 'SELECT s.uid FROM media m JOIN slot s ON s.media=m.uid WHERE m.bundle_id =:bundleId';
            $validSlotIds = Yii::$app->db->createCommand($sqlSlotIds, [':bundleId' => $bundleId])->queryColumn();
            $invalidSlotIds = array_diff($slots, $validSlotIds);
            if (count($invalidSlotIds) > 0) {
                throw new InvalidParamException('输入错误，广告位不属于所选媒体');
            }
        }
        if (empty($slotIds)) {
            return 0;
        }

        return Yii::$app->db->createCommand()->batchInsert(
            SlotTargetModel::tableName(),
            ['plan_id','slot_id'],
            $insertRows
        )->execute();

    }

    public static function delete($planId)
    {
        SlotTargetModel::deleteAll('plan_id=:id', [':id' => $planId]);
    }

}