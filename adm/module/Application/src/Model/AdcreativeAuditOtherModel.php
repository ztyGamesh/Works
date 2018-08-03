<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/6
 * Time: 15:46
 */

namespace Application\Model;

use Application\Table\AdcreativeAuditOtherTable;

use Application\Table\AdplanTable;
use Application\Table\MediumTable;
use Custom\ArrayHandle;

class AdcreativeAuditOtherModel
{
    public static function factory()
    {
        return new self();
    }

    /**
     * 获取外部审核列表  返回媒体的审核状态(非媒体账户)
     * @param $params
     * @return array|null
     */
    public function getAuditList($params)
    {
        $params['limit'] = $params['limit'] ? $params['limit'] : 100;
        $params['offset'] = $params['offset'] ? $params['offset'] : 0;

        $condition = new ConditionCombineModel();

        $params['ids'] = ArrayHandle::SplitByComma($params['ids']);

        $condition->AndCondition($params['ids'], "ao.`creative_id` IN ({$params['ids']})");

        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY `{$params['sort']}` {$params['order']}");

        $sql = "
        SELECT
          ao.`uid`,
          m.`name`,
          ao.`creative_id`,
          ao.`audit_status`,
          ao.`comment`
        FROM ad_creative_audit_other ao
          JOIN ad_creative c on ao.creative_id=c.id  {$condition->Condition()}
          JOIN user u on ao.uid=u.uid -- 媒体用户
          JOIN user u2 on c.create_user=u2.uid -- 创意所属用户,广告主
          JOIN ad_plan p on c.plan_id=p.id
          JOIN media m on m.medium=u.uid AND exists(SELECT 1  -- 媒体支持广告位类型
                                                  FROM ad_creative c1
                                                    JOIN template t1 ON c1.template_class = t1.uid
                                                    JOIN slot_class sc1 ON t1.slot_class = sc1.uid
                                                    JOIN slot s1 ON s1.class = sc1.uid
                                                    JOIN media m1 ON s1.media = m1.uid AND m1.bundle_id != ''
                                                    JOIN medium mm1 ON m1.medium = mm1.uid
                                                  WHERE c1.id = c.id AND m1.uid = m.uid)
          WHERE (not exists(select 1 from resource r where r.uid=u2.uid and r.type='bundle_id' and r.platform_role='alliance')  -- 用户定向所有媒体
                  and (find_in_set(m.bundle_id,p.media_target)>0 or p.media_target='') -- 计划定向到这个媒体或计划定向为空
          )
           or
            exists( -- 用户定向到这个媒体并且计划定向到这个媒体或者计划定向所有
                select 1 from resource r where r.uid=u2.uid and r.type='bundle_id' and r.platform_role='alliance'
                 and (find_in_set(r.id,p.media_target)>0 or p.media_target='') and (find_in_set(m.bundle_id,p.media_target)>0 or p.media_target='')
                 )
                 
         {$order_condition}
            ";

        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    /**
     * 推送计划下审核通过的创意给第三方用于审核（目前没有自动审核 只用于线下审核）
     * 计划修改时调用
     * 创意审核通过时调用
     * @param $plan_id
     */
    public function PushCreativeToOthersWait($plan_id)
    {
        if (!$plan_id)
            throw new \Exception('parameter wrong');

        $user_id = UserModel::factory()->getCurrentUid();

        $sql = "INSERT IGNORE INTO `ad_creative_audit_other`(`uid`,`creative_id`,`audit_status`,`comment`,`edit_time`,`edit_user`)
                 SELECT `medium`,`creative_id`,'wait' AS `audit_status`,'' as comment,UNIX_TIMESTAMP() AS edit_time,'{$user_id}' AS edit_user
                 FROM
                 (SELECT `creative_id`
                 FROM `ad_creative_audit`
                 WHERE audit_status = 'pass' AND plan_id = {$plan_id} -- 被修改计划id
                 AND id IN (
                 SELECT MAX(id)
                 FROM `ad_creative_audit`
                 GROUP BY `creative_id`
                 )
                 ) AS c -- 当前这个计划下审核通过的创意
                 CROSS JOIN
                 (
                SELECT
                DISTINCT `medium`
                FROM `media` m
                        JOIN slot s on s.media=m.uid
                        left JOIN ad_plan p on p.id={$plan_id}
                WHERE
                        s.class=p.class and
                FIND_IN_SET(bundle_id,
                (
                SELECT
                CASE media_target
                WHEN '' THEN (SELECT GROUP_CONCAT(`bundle_id`) FROM `media` WHERE `bundle_id` != '')
                ELSE media_target
                END AS media_target
                FROM `ad_plan`
                WHERE id = {$plan_id} -- 被修改计划id
                )
                )
                AND bundle_id != '' AND `medium` != ''
                -- AND `medium` IN (SELECT `uid` FROM `medium` WHERE `audit_type` = 'self_other')
                 ) AS m
            ";

        AdcreativeAuditOtherTable::factory()->execute($sql);
        return true;
    }

    /**
     * 账户新增媒体时调用 定投到这个媒体上的计划下的创意都要送审这个账户
     * @param $bundle_id
     * @param $medium
     */
    public function PushCreativeToOtherWait($bundle_id, $medium)
    {
        if (!$bundle_id or !$medium)
            throw new \Exception("parameter wrong. bundle_id:{$bundle_id}-medium{$medium};");

        $user_id = UserModel::factory()->getCurrentUid();

        $sql = "INSERT IGNORE INTO `ad_creative_audit_other`(`uid`,`creative_id`,`audit_status`,`comment`,`edit_time`,`edit_user`)
                SELECT `medium`,`creative_id`,'wait' AS `audit_status`,'' as comment,UNIX_TIMESTAMP() AS edit_time,'{$user_id}' AS edit_user
                FROM
                (SELECT `creative_id`
                 FROM `ad_creative_audit` AS c INNER JOIN ad_plan AS p
                 ON c.plan_id = p.id
                 WHERE c.audit_status = 'pass'
                 AND c.id IN (
                 SELECT MAX(id)
                 FROM `ad_creative_audit`
                 GROUP BY `creative_id`
                 )
                 AND
                 (
                  p.`media_target` = '' OR FIND_IN_SET('{$bundle_id}',p.`media_target`) -- bundleid
                 )
                
                 ) AS l -- 当前这个计划下审核通过的创意
                 CROSS JOIN
                  (
                  SELECT '{$medium}' AS `medium`
                -- SELECT DISTINCT '{$medium}' AS `medium` -- 要送审的账号
                -- FROM `medium`
                -- WHERE '{$medium}' IN (SELECT `uid` FROM `medium` WHERE `audit_type` = 'self_other')
                 ) AS r
            ";

        AdcreativeAuditOtherTable::factory()->execute($sql);
        return true;
    }

    /**
     * 创意修改时调用。用于重审已修改的创意
     * @param array $ids
     * @throws \Exception
     */
    public function ModifyCreativeToWait($ids)
    {
        if (!$ids)
            throw new \Exception('parameter wrong');

        $user_id = UserModel::factory()->getCurrentUid();
        $ids = ArrayHandle::SplitByComma($ids);

        $sql = "UPDATE `ad_creative_audit_other`
                SET `audit_status` = 'wait',edit_user = '{$user_id}'
                WHERE `creative_id` IN ({$ids})
            ";

        AdcreativeAuditOtherTable::factory()->execute($sql);
        return true;
    }

    /**
     * 批量修改第三方审核状态
     * @param $ids
     * @param $audit_status
     * @throws \Exception
     */
    public function UpdateOtherStatus($ids, $medium, $audit_status, $comment)
    {
        if (!$ids or !in_array($audit_status, ['pass', 'wait', 'reject', 'audit']) or !$medium)
            throw new \Exception('parameter wrong');

        $user_id = UserModel::factory()->getCurrentUid();

        $ids = ArrayHandle::SplitByComma($ids);

        $sql = "UPDATE `ad_creative_audit_other`
                SET `audit_status` = '{$audit_status}',edit_user = '{$user_id}',edit_time = UNIX_TIMESTAMP(),`comment` = '{$comment}'
                WHERE `creative_id` IN ({$ids}) AND `uid` = '{$medium}'
            ";

        AdcreativeAuditOtherTable::factory()->execute($sql);
        return true;
    }

    /**
     * 自动化审核通过不需要外审的账户(且这个创意的状体要是审核中 否则保留原始审核状态)
     * @param $creative_ids
     */
    public function AutoPassCreatives($creative_ids)
    {
        if (!$creative_ids)
            return;

        $creative_ids = ArrayHandle::SplitByComma($creative_ids);

        $mediums = MediumModel::factory()->getMediumByAuditType('self');
        $uids = ArrayHandle::FetchMultipleArrayLeafWithKey($mediums, 'uid');
        $uids = ArrayHandle::SplitByComma($uids);

        AdcreativeAuditOtherTable::factory()->execute("
        UPDATE `ad_creative_audit_other`
        SET `audit_status` = 'pass'
        WHERE creative_id IN ({$creative_ids}) AND (`audit_status` = 'audit' or `audit_status` = 'wait') AND `uid` IN ({$uids})
        ");
        return true;
    }

    /**
     * 全量计划审核初始化(第三方审核功能冷启动时调用一次即可)
     */
    public function AllPlanInit()
    {
        $plans = AdplanTable::factory()->queryList("SELECT id,plan_id FROM ad_creative");

        $plan_ids = ArrayHandle::FetchMultipleArrayLeafWithKey($plans, 'plan_id');
        $plan_ids = array_unique($plan_ids);

        foreach ($plan_ids as $id) {
            $this->PushCreativeToOthersWait($id);
        }

        $ids = ArrayHandle::FetchMultipleArrayLeafWithKey($plans, 'id');
        //不需要外审的则自动化通过
        AdcreativeAuditOtherModel::factory()->AutoPassCreatives($ids);
        return true;
    }

    /**
     * 创意创建时推送到媒体账户
     * 媒体账户下面必须有"符合条件"的媒体
     * "条件"：
     *  1- 用户定向了这个媒体或定向所有媒体
     *  2- 计划定向 m.bundle_id in p.media_target 或者 p.media_target=''
     *  3- 媒体拥有广告位=》广告位的slot_class与创意的template对应的slot_class相同
     */
    public function PushNewCreative($creative_id)
    {
        $current_uid = UserModel::factory()->getCurrentUid();
        //筛选符合该创意广告形式（slot_class:动态/固态）的用户定向的媒体
        $sql_s = "SELECT
                      mm.uid,
                      mm.audit_type,
                      m.bundle_id,
                      m.name
                    FROM ad_creative c
                      JOIN user u on c.create_user=u.uid
                      JOIN template t ON c.template_class = t.uid
                      JOIN slot_class sc ON t.slot_class = sc.uid
                      JOIN slot s ON s.class = sc.uid
                      JOIN media m ON s.media = m.uid AND m.bundle_id != ''
                      JOIN medium mm ON m.medium = mm.uid
                    WHERE
                      c.id = {$creative_id}
                      AND (
                        not exists(SELECT 1  -- 用户定向所有媒体
                                      FROM resource r
                                      WHERE r.uid = u.uid AND r.type = 'bundle_id' AND r.platform_role = 'alliance')
                        OR
                      exists(SELECT 1  -- 该媒体属于用户定向的媒体
                                      FROM resource r
                                      WHERE r.uid = u.uid AND r.type = 'bundle_id' AND r.platform_role = 'alliance' and r.id=m.bundle_id)
                    
                      ) 
                  ";

        $rows = MediumTable::factory()->queryList($sql_s);
        // 根据计划的媒体定向进行媒体筛选
        $media_target = MediumTable::factory()->queryRow("SELECT p.media_target  from ad_creative c JOIN ad_plan p on c.plan_id=p.id WHERE c.id='{$creative_id}'");
        $media_targets = empty($media_target['media_target']) ? '' : explode(',', $media_target['media_target']);
        $edit_time = time();
        if (!empty($rows)) {
            foreach ($rows as $row) {
                //计划定向了这个媒体或者计划为普投
                if (in_array($row['bundle_id'], $media_targets) or empty($media_targets)) {
                    $status = 'wait' ;
                    //以前有审核状态则不更新，使用老的
                    AdcreativeAuditOtherTable::factory()->execute(
                        "INSERT IGNORE INTO `ad_creative_audit_other` (`uid`,`creative_id`,`audit_status`,`edit_time`,`edit_user`)
                            VALUES ('{$row['uid']}','{$creative_id}','{$status}','{$edit_time}','{$current_uid}')
                    ");
                }
            }
        }
    }
}