<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/28
 * Time: 18:26
 */
namespace Application\Model;

use Application\Table\AdcreativeAuditTable;

class AdcreativeAuditModel
{
    public static function factory()
    {
        return new self();
    }

    public function GetLatestAuditCreative($creative_id)
    {
        return AdcreativeAuditTable::factory()->queryRow("
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
    public function SubmitAuditCreative(array $data)
    {
        if (!$data)
            throw new \Exception('parameter wrong!');

        $data['edit_user'] = UserModel::factory()->getCurrentUid();
        $data['edit_time'] = time();

        $data = AdcreativeAuditTable::factory()->IntersectKey($data);

        AdcreativeAuditTable::factory()->execute("DELETE `ad_creative_audit`
                                                       FROM `ad_creative_audit`
                                                       WHERE creative_id = {$data['creative_id']} AND audit_status = 'audit'");

        $data['audit_status'] = 'audit';

        AdcreativeAuditTable::factory()->insert($data);
    }
}