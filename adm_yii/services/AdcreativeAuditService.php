<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/28
 * Time: 18:26
 */
namespace app\services;


use app\models\AdcreativeAuditModel;

class AdcreativeAuditService
{


    public static function GetLatestAuditCreative($creative_id)
    {
        return AdcreativeAuditModel::queryRow("
        SELECT *
        FROM `ad_creative_audit`
        WHERE `creative_id` = {$creative_id} 
        ORDER BY `id` DESC
        LIMIT 0,1
        ");
    }

    /**
     * 提交新的待审核创意
     * @param array $data
     */
    public static function SubmitAuditCreative(array $data)
    {
        if (!$data)
            throw new \Exception('parameter wrong!');

        $data['edit_user'] = UserService::getCurrentUid();
        $data['edit_time'] = time();

        $data = AdcreativeAuditModel::IntersectKey($data);

        AdcreativeAuditModel::execute("DELETE `ad_creative_audit`
                                                       FROM `ad_creative_audit`
                                                       WHERE creative_id = {$data['creative_id']} AND audit_status = 'audit'");

        $data['audit_status'] = 'audit';

        AdcreativeAuditModel::insertOne($data);
    }
}