<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/6
 * Time: 15:46
 */

namespace app\services;

use function app\commands\log_info;
use app\models\AdcreativeAuditOtherModel;
use app\models\AdplanModel;
use app\models\MediumModel;
use app\services\custom\ArrayHandle;
use app\services\custom\ConditionCombineModel;


class AdcreativeAuditOtherService
{


    /**
     * 获取外部审核列表  返回媒体的审核状态(非媒体账户)
     * @param $params
     * @return array|null
     */
    public static function getAuditList($params)
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
          JOIN ad_creative c on ao.creative_id=c.id  and c.status!='delete' {$condition->Condition()}
          JOIN user u on ao.uid=u.uid 
          JOIN user u2 on c.create_user=u2.uid 
          JOIN ad_plan p on c.plan_id=p.id
          JOIN ad_group g on c.group_id=g.id and p.status!='delete' and g.status!='delete'
          JOIN media m on m.medium=u.uid 
         {$order_condition}
            ";
        return BaseService::Paging($sql, $params['limit'], $params['offset']);
    }

    /**
     * 推送计划下审核通过的创意给第三方用于审核（目前没有自动审核 只用于线下审核）
     * 计划修改时调用
     * 创意审核通过时调用
     * @param $plan_id
     */
    public static function PushCreativeToOthersWait($plan_id)
    {
        if (!$plan_id)
            throw new \Exception('parameter wrong');

        $user_id = UserService::getCurrentUid();

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

        AdcreativeAuditOtherModel::execute($sql);
        return true;
    }

    /**
     * 账户新增媒体时调用 定投到这个媒体上的计划下的创意都要送审这个账户
     * @param $bundle_id
     * @param $medium
     */
    public static function PushCreativeToOtherWait($bundle_id, $medium)
    {
        if (!$bundle_id or !$medium)
            throw new \Exception("parameter wrong. bundle_id:{$bundle_id}-medium{$medium};");

        $user_id = UserService::getCurrentUid();

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

        AdcreativeAuditOtherModel::execute($sql);
        return true;
    }

    /**
     * 创意修改时调用。用于重审已修改的创意
     * @param array $ids
     * @throws \Exception
     */
    public static function ModifyCreativeToWait($ids)
    {
        if (!$ids)
            throw new \Exception('parameter wrong');

        $user_id = UserService::getCurrentUid();
        $ids = ArrayHandle::SplitByComma($ids);

        $sql = "UPDATE `ad_creative_audit_other`
                SET `audit_status` = 'wait',edit_user = '{$user_id}'
                WHERE `creative_id` IN ({$ids})
            ";

        AdcreativeAuditOtherModel::execute($sql);
        return true;
    }

    /**
     * 批量修改第三方审核状态
     * @param $ids
     * @param $audit_status
     * @throws \Exception
     */
    public static function UpdateOtherStatus($ids, $medium, $audit_status, $comment)
    {
        if (!$ids or !in_array($audit_status, ['pass', 'wait', 'reject', 'audit']) or !$medium)
            throw new \Exception('parameter wrong');

        $user_id = UserService::getCurrentUid();

        $ids = ArrayHandle::SplitByComma($ids);

        $sql = "UPDATE `ad_creative_audit_other` ao
                JOIN ad_creative c on ao.creative_id=c.id
                SET ao.`audit_status` = '{$audit_status}',ao.edit_user = '{$user_id}',ao.edit_time = UNIX_TIMESTAMP(),ao.`comment` = '{$comment}',c.edit_time=unix_timestamp()
                WHERE ao.`creative_id` IN ({$ids}) AND ao.`uid` = '{$medium}'
            ";

        AdcreativeAuditOtherModel::execute($sql);
        return true;
    }

    /**
     * 自动化审核通过不需要外审的账户(且这个创意的状体要是审核中 否则保留原始审核状态)
     * @param $creative_ids
     */
    public static function AutoPassCreatives($creative_ids)
    {
        if (!$creative_ids)
            return;

        $creative_ids = ArrayHandle::SplitByComma($creative_ids);

        $mediums = MediumService::getMediumByAuditType('self');
        $uids = ArrayHandle::FetchMultipleArrayLeafWithKey($mediums, 'uid');
        $uids = ArrayHandle::SplitByComma($uids);

        $sql = "
        UPDATE `ad_creative_audit_other` ao
          JOIN ad_creative_audit a on ao.creative_id=a.creative_id and a.audit_status='pass'
        SET ao. `audit_status` = 'pass'
        WHERE ao.creative_id IN ({$creative_ids}) AND (ao.`audit_status` = 'audit' or ao.`audit_status` = 'wait') AND ao.`uid` IN ({$uids})
        ";

        AdcreativeAuditOtherModel::execute($sql);
        return true;
    }

    /**
     * 全量计划审核初始化(第三方审核功能冷启动时调用一次即可)
     */
    public static function AllPlanInit()
    {
        $plans = AdplanModel::queryList("SELECT id,plan_id FROM ad_creative");

        $plan_ids = ArrayHandle::FetchMultipleArrayLeafWithKey($plans, 'plan_id');
        $plan_ids = array_unique($plan_ids);

        foreach ($plan_ids as $id) {
            self::PushCreativeToOthersWait($id);
        }

        $ids = ArrayHandle::FetchMultipleArrayLeafWithKey($plans, 'id');
        //不需要外审的则自动化通过
        AdcreativeAuditOtherService::AutoPassCreatives($ids);
        return true;
    }

    /**
     * 创意创建时推送到媒体账户
     * 媒体账户下面必须有"符合条件"的媒体
     * "条件"：
     *  1. 计划定向 m.bundle_id in p.media_target 或者 p.media_target=''
     */
    public static function PushNewCreative($creative_id)
    {
        $sql = "
SELECT DISTINCT
  mm.uid
FROM ad_creative c
  JOIN ad_plan p on c.plan_id=p.id
  JOIN user u on c.create_user=u.uid
  JOIN media m ON  m.bundle_id != '' and m.status='active' and (find_in_set(m.bundle_id,p.media_target)>0 or p.media_target='')
  JOIN medium mm ON m.medium = mm.uid
  JOIN user audit_user on audit_user.uid=mm.uid and audit_user.pause=0
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

  )";
        $rows = AdcreativeAuditOtherModel::queryList($sql);

        $current_uid = UserService::getCurrentUid();
        $edit_time = time();
        $status = 'wait';
        foreach ($rows as $row) {
            AdcreativeAuditOtherModel::execute(
                "INSERT IGNORE INTO `ad_creative_audit_other` (`uid`,`creative_id`,`audit_status`,`edit_time`,`edit_user`)
                            VALUES ('{$row['uid']}','{$creative_id}','{$status}','{$edit_time}','{$current_uid}')
                    ");
        }

    }


    /**
     * 广告主看到的媒体审核状态 1.媒体账户激活 2.媒体激活
     */
    public static function CreativeAuditStatusForClient($creative)
    {
        $creative = (int)$creative;

        $sql = "
SELECT
  ao.creative_id,
  ao.uid,
  ao.audit_status,
  ao.comment,
  mn.bundle_id,
  mn.name
FROM ad_creative_audit_other ao
  JOIN (
         SELECT
           max(edit_time) AS edit_time,
           uid
         FROM ad_creative_audit_other
         WHERE creative_id = {$creative}
         GROUP BY uid
       ) AS t1 ON t1.uid = ao.uid AND t1.edit_time = ao.edit_time
  -- @1
  JOIN media m ON m.medium = ao.uid
  -- @2
  JOIN (
         SELECT
           m.bundle_id,
           m.name
         FROM media m
           JOIN (SELECT
                   min(create_time) AS create_time,
                   bundle_id
                 FROM media
                 WHERE bundle_id != \"\"
                 GROUP BY bundle_id) AS t1 ON t1.bundle_id = m.bundle_id AND t1.create_time = m.create_time
         WHERE m.bundle_id != \"\"
       ) AS mn ON mn.bundle_id = m.bundle_id -- @4
  JOIN ad_creative c on c.id=ao.creative_id
  JOIN ad_plan p on c.plan_id=p.id

WHERE ao.creative_id = {$creative}
and (
    not exists(select 1 from resource r WHERE r.uid=c.create_user)
    or (
      find_in_set(mn.bundle_id,p.media_target)>0 or (p.media_target='' and (
         not exists(SELECT 1 FROM resource r WHERE r.uid = c.create_user and r.platform_role='alliance' and r.type='bundle_id')
         or exists(SELECT 1 FROM resource r WHERE r.uid = c.create_user and r.platform_role='alliance' and r.type='bundle_id' and r.id=mn.bundle_id)
       ))
    )
)

";
        $rows = AdcreativeAuditOtherModel::queryList($sql);
        return self::processAuditStatus($rows);
    }

    /**
     * 审核状态处理
     *  bundle_id对应多个媒体的多个审核状态，只要有一个媒体审核通过就是pass,所有的都是reject才是reject否则wait
     * @param $rows
     * @return array
     */
    protected static function processAuditStatus($rows)
    {
        $results = [];
        $groups = [];//以bundle_id为key进行分类
        foreach ($rows as $row) {
            $bundle = $row['bundle_id'];
            $groups[$bundle][] = $row;
        }
        foreach ($groups as $bundle => $group) {
            $result = $group[0];
            $len = count($group);//同一个bundle对应的媒体数量
            $audit_cnt = 0;
            $pass_cnt = 0;
            $reject_cnt = 0;
            foreach ($group as $row) {
                switch ($row['audit_status']) {
                    case 'reject':
                        $reject_cnt++;
                        break;
                    case 'audit':
                        $audit_cnt++;
                        break;
                    case 'pass':
                        $pass_cnt++;
                        break;
                    case 'wait':
                        break;
                }
            }
            if ($pass_cnt > 0) {
                $status = 'pass';
            } else if ($len == $reject_cnt) {
                $status = 'reject';
            } else if ($audit_cnt > 0) {
                $status = 'audit';
            } else {
                $status = 'wait';
            }
            $result['audit_status'] = $status;
            $results[] = $result;
        }
        return $results;
    }

    /**
     * media由暂停变为启用时进行推送 '196e3d63-8239-a11a-9a07-969b4ec8a7d5'
     * @param $mId
     * @throws \Exception
     * @return int affected
     */
    public static function addAuditStatusForMedia($mId)
    {
        $sql1 = "SELECT DISTINCT c.id
	from media m 
	JOIN ad_creative c on(
		exists(
			select 1 from ad_plan p
				join user u on p.create_user=u.uid and u.pause=0
				join ad_group g on p.group_id=g.id and g.status='active'
			WHERE p.id=c.plan_id and p.status='active' and find_in_set(m.bundle_id,p.media_target)>0
		)
		or exists(
			select 1 from ad_plan p
				join user u on p.create_user=u.uid and u.pause=0
				join ad_group g on p.group_id=g.id and g.status='active'
			WHERE p.id=c.plan_id and p.media_target='' and 
                                                         (not exists(SELECT 1 FROM resource r WHERE p.create_user=r.uid and r.platform_role='alliance' and r.type='bundle_id')
                                                          or exists(SELECT 1 FROM resource r WHERE p.create_user=r.uid and r.platform_role='alliance' and r.type='bundle_id' and r.id=m.bundle_id)
                                                        )
	)
	)
	JOIN user u on m.medium=u.uid and u.pause=0
WHERE m.uid='{$mId}'";
        $cIds = \Yii::$app->db->createCommand($sql1)->queryColumn();
        if (empty($cIds)) {
            return 0;
        }
        $sql2 = "SELECT m.medium from media m WHERE m.uid='{$mId}'";
        $medium = \Yii::$app->db->createCommand($sql2)->queryScalar();
        if (empty($medium)) {
            throw new \Exception("no medium for media:{$mId}");
        }
        $uid = $medium;
        $timeStamp = time();
        $editUser = UserService::getCurrentUid();
        $auditStatus = 'wait';
        $affected = 0;
        foreach ($cIds as $cId) {
            $sql3 = "INSERT IGNORE INTO ad_creative_audit_other(uid, creative_id, audit_status, edit_time, edit_user) 
VALUES ('$uid','$cId','$auditStatus',$timeStamp,'$editUser')";
            $affected += \Yii::$app->db->createCommand($sql3)->execute();
        }
        return $affected;
    }

    /**
     * 计划修改时进行审核推送
     * @param $pId
     * @return int
     */
    public static function addAuditStatusForPlan($pId){
        $adminUid=ConfigService::getAdminUid();
        $sql1="SELECT media_target from ad_plan WHERE id=$pId";
        //plan.media_target=''
        $sql2="
INSERT IGNORE into ad_creative_audit_other (uid, creative_id, audit_status, edit_time, edit_user) 
  SELECT t1.medium,c.id,'wait',unix_timestamp(),'edit_user'
  FROM ad_creative c
    CROSS JOIN (
      SELECT DISTINCT m.medium
      FROM resource r
        JOIN media m on m.bundle_id=r.id
      WHERE r.type='bundle_id' and r.platform_role='alliance' and r.id!=''
      ) as t1
  WHERE c.plan_id=$pId";
        //plan.media_target!=''
        $sql3="
INSERT IGNORE into ad_creative_audit_other (uid, creative_id, audit_status, edit_time, edit_user)
  SELECT t1.medium,c.id,'wait',unix_timestamp(),'$adminUid'
  FROM ad_creative c
    CROSS JOIN (
      SELECT DISTINCT m.medium
      FROM ad_plan p
        JOIN media m on find_in_set(m.bundle_id,p.media_target)>0
      WHERE p.id=$pId
      ) as t1
  WHERE c.plan_id=$pId";

        $mediaTarget=\Yii::$app->db->createCommand($sql1)->queryScalar();
        if (empty($mediaTarget)){
            $affected=\Yii::$app->db->createCommand($sql2)->execute();
        }else{
            $affected=\Yii::$app->db->createCommand($sql3)->execute();
        }
        return $affected;
    }

}