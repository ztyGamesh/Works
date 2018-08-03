
# 根据bundle_id查询媒体名称
# 1. 一个bundle_id对应多个media
# 2. media 名称以最早创建的媒体为准

SELECT *
FROM
  (
  SELECT m.bundle_id,m.name
  FROM media m
    JOIN  (SELECT min(create_time) as create_time,bundle_id
           FROM media WHERE bundle_id!=""
           GROUP BY bundle_id) as t1 on t1.bundle_id=m.bundle_id and t1.create_time=m.create_time
  WHERE m.bundle_id!=""
)as mn;