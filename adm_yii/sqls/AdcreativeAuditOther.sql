
# PushNewCreative 新建创意时推送给该创意给媒体账户（用户定向+计划定向）

SELECT DISTINCT
  mm.uid
#   ,
#   mm.audit_type,
#   m.bundle_id,
#   m.name
FROM ad_creative c
  JOIN ad_plan p on c.plan_id=p.id
  JOIN user u on c.create_user=u.uid
  JOIN media m ON  m.bundle_id != '' and (find_in_set(m.bundle_id,p.media_target)>0 or p.media_target='')
  JOIN medium mm ON m.medium = mm.uid
WHERE
  c.id = 421
  AND (
    not exists(SELECT 1  -- 用户定向所有媒体
               FROM resource r
               WHERE r.uid = u.uid AND r.type = 'bundle_id' AND r.platform_role = 'alliance')
    OR
    exists(SELECT 1  -- 该媒体属于用户定向的媒体
           FROM resource r
           WHERE r.uid = u.uid AND r.type = 'bundle_id' AND r.platform_role = 'alliance' and r.id=m.bundle_id)

  );

# CreativeAuditStatusForClient
# 广告主看到的媒体审核状态流程
#  1.媒体账户的审核状态
#  2.转化为媒体的审核状态
#  3.广告主看到的媒体审核状态(只要有一个审核通过就视为通过，有一个没审核就是待审核，全部拒绝才是拒绝 [sql没法处理，程序处理]
#  4.广告主看到的媒体名称以media_name表为准

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
         WHERE creative_id = 431
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
                 WHERE bundle_id != ""
                 GROUP BY bundle_id) AS t1 ON t1.bundle_id = m.bundle_id AND t1.create_time = m.create_time
         WHERE m.bundle_id != ""
       ) AS mn ON mn.bundle_id = m.bundle_id -- @4
WHERE ao.creative_id = 431

# 查询媒体名称

SELECT DISTINCT mn.bundle_id,mn.name as media_name
FROM user u
  JOIN media m on m.medium=u.uid and m.status='active'
  JOIN (
         SELECT
           m.bundle_id,
           m.name
         FROM media m
           JOIN (SELECT
                   min(create_time) AS create_time,
                   bundle_id
                 FROM media
                 WHERE bundle_id != ""
                 GROUP BY bundle_id) AS t1 ON t1.bundle_id = m.bundle_id AND t1.create_time = m.create_time
         WHERE m.bundle_id != ""
       ) AS mn on mn.bundle_id=m.bundle_id
WHERE u.pause=0;

