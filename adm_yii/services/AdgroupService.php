<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:46
 */

namespace app\services;


use app\models\AdgroupModel;
use app\services\custom\Email;
use Yii;

class AdgroupService
{


    public static function CheckAdgroupRepeat($name, $id = null)
    {
        if (!$name)
            return false;

        $uid = UserService::getCurrentUid();
        if ($id != null)
            $exists = AdgroupModel::queryRow("SELECT
                                            1
                                            FROM `corporation` AS c,
                                            `ad_group` AS g,
                                            `user` AS u
                                            WHERE
                                            c.`id` = u.`corporation_id` 
                                            AND g.`create_user` = u.`uid`
                                            AND g.id != {$id} and g.status!='delete'
                                            AND g.`name` = '{$name}'
                                            AND g.`create_user` = '{$uid}'");
        else
            $exists = AdgroupModel::queryRow("SELECT
                                            1
                                            FROM `corporation` AS c,
                                            `ad_group` AS g,
                                            `user` AS u
                                            WHERE
                                            c.`id` = u.`corporation_id` 
                                            AND g.`create_user` = u.`uid` and g.status!='delete'
                                            AND g.`name` = '{$name}'
                                            AND g.`create_user` = '{$uid}'");
        return $exists ? true : false;
    }

    /**
     * 保存
     * @param $params
     */
    public static function Save($params)
    {
        $data = AdgroupModel::IntersectKey($params);

        if (empty($data['name'])) {
            throw new \Exception('请填写必填信息。');
        }

//        if($data['budget'] < 50 or $data['budget'] > 1000000000)
//            throw new \Exception('日预算必须在50 到 1000000000之间！');

        $user = UserService::getCurrentUid();

        //目前的强制设定
        $data['budget_type'] = 'daily_budget';
        $data['edit_user'] = $user;
        $data['edit_time'] = time();

        if (isset($data['id']) && !empty($data['id'])) {
            if (self::CheckAdgroupRepeat($data['name'], $data['id']))
                throw new \Exception('广告组名称重复！');
            AdgroupModel::updateAll($data, array('id' => $data['id']));
            return $data['id'];
        } else {
            if (self::CheckAdgroupRepeat($data['name'], null))
                throw new \Exception('广告组名称重复！');

            $data['status'] = 'active';
            $data['create_user'] = $user;
            $data['create_time'] = time();

            AdgroupModel::insertOne($data);
            return AdgroupModel::getLastInsertValue();
        }
    }

    public static function fetchOne($id)
    {
        return AdgroupModel::getRow(['id' => $id]);
    }

    /**
     * 查询接口
     * @param $params
     */
    public static function getList($params)
    {
        $params['begin'] = !$params['begin'] ? date('Ymd') : date('Ymd', strtotime($params['begin']));
        $params['end'] = !$params['end'] ? date('Ymd', strtotime('+1 day')) : date('Ymd', strtotime($params['end']) + 86400);

        $user_id = UserService::getCurrentUid();
        $where = "g.create_user = '{$user_id}' and g.status !='delete' ";

        if (isset($params['status']) and !empty($params['status']))
            $where .= " AND g.`status` = '{$params['status']}'";
        if (isset($params['purpose']) and !empty($params['purpose']))
            $where .= " AND g.`purpose` = '{$params['purpose']}'";
        if (isset($params['search']) and strlen($params['search']=trim($params['search']))>0)
            $where .= " AND g.`name` LIKE  '%{$params['search']}%'";

        $limit = " LIMIT {$params['offset']},{$params['limit']}";

        $sql = "SELECT 
                g.id,
                g.`name`,
                g.`status`,
                g.`purpose`,
                g.`budget_type`,
                g.`budget`,
                SUM(r.`imp`) AS imp,
                SUM(r.`clk`) AS clk,
                round(SUM(r.`clk`) / SUM(r.`imp`),4) AS ctr,
                round(SUM(r.`income`),2) AS spend_budget
                FROM
                `ad_group` AS g LEFT JOIN 
                `ad_creative` AS c ON c.`group_id` = g.`id`  LEFT JOIN
                `reports_alliance_hourly` AS r ON c.`id` = r.`creative_id` 
                AND r.`date` >= '{$params['begin']}' 
                AND r.`date` < '{$params['end']}' 
                WHERE {$where}" . " GROUP BY g.`id` ORDER BY g.create_time DESC,g.name asc " . $limit;

        $data = AdgroupModel::queryList($sql);
        $total = AdgroupModel::queryRow("
                SELECT 
                COUNT(*) as `total`
                FROM
                `ad_group` AS g 
                WHERE {$where}");

        return ['rows' => $data, 'total' => $total['total']];
    }

    /**
     * 批量更新广告组状态
     * @param $ids string
     * @param $status string
     * @return bool
     * @throws \Exception
     */
    public static function updateStatus($ids, $status)
    {

        if (!$status or !$ids)
            throw new \Exception('参数错误！');

        if (!in_array($status, AdgroupModel::statusValues)) {
            throw new \Exception("invalid status value:{$status}");
        }
        if($status==='delete'){
            $sql="
UPDATE ad_group g
  LEFT JOIN ad_plan p ON g.id = p.group_id
  LEFT JOIN ad_creative c ON c.group_id = g.id
    SET g.status='delete',p.status='delete',c.status='delete',g.delete_time=unix_timestamp(),p.delete_time=unix_timestamp(),c.delete_time =unix_timestamp()
    ,g.edit_time=unix_timestamp(),p.edit_time=unix_timestamp(),c.edit_time=unix_timestamp()
WHERE g.id in({$ids})";
            return AdgroupModel::execute($sql);
        }
        return AdgroupModel::execute("UPDATE `ad_group` SET `status` = '{$status}',edit_time=unix_timestamp() WHERE id IN ({$ids})");
    }


    /**
     * 批量修改预算
     * @param $budget double
     * @param $gid string ids
     * @return int
     * @throws \Exception
     */
    public static function updateBudget($budget, $gid)
    {
        if (!is_numeric($budget)) {//empty($budget)
            throw new \Exception("invalid params:budget={$budget}");
        }

        $gid = is_array($gid) ? implode(',', $gid) : $gid;
        $update = Yii::$app->db->createCommand()->update(
            AdgroupModel::tableName(),
            ['budget' => $budget,'edit_time'=>time()],
            "id in ({$gid})"
        );
        return $update->execute();
    }

    /**
     * 修改单个广告组名字
     * @param $name
     * @param $id int
     * @throws \Exception
     */
    public static function updateName($name, $id)
    {
        if (empty($name)) {
            throw new \Exception("invalid parameter:name={$name}");
        }
        if (self::CheckAdgroupRepeat($name, $id)) {
            throw new \Exception('广告组名称重复！');
        }
        return Yii::$app->db->createCommand()->update(
            AdgroupModel::tableName(),
            ['name' => $name,'edit_time'=>time()],
            'id = :id',
            ['id' => $id]
        )->execute();
    }

    /**
     * name,purpose
     * @var $withPlan boolean 是否包含计划信息
     * @var $search string 组名称
     * @var $purpose string|null 推广目的
     */
    public static function structure($withPlan = false, $search = null,$purpose=null)
    {
        $arr = [];
        $userId=UserService::getCurrentUid();

        if ($withPlan) {//计划
            $sql = "
SELECT g.id AS group_id,g.name AS group_name,g.purpose,p.id AS plan_id,p.name AS plan_name,g.status as group_status,p.status as plan_status
FROM ad_group g LEFT JOIN ad_plan p ON p.group_id=g.id 
WHERE  g.status!='delete' AND p.status!='delete' and g.create_user='{$userId}'";
            if (strlen($search=trim($search))>0) {
                $sql .= " AND p.name like '%$search%'";
            }
            if ($purpose){
                $sql .= " AND g.purpose ='{$purpose}'";
            }
            $rows = Yii::$app->db->createCommand($sql)->queryAll();
            $groupKeys = ['group_id'=>0, 'group_name'=>1, 'purpose'=>2];
            $planKeys = ['plan_id'=>0,'plan_name'=>1];
            foreach ($rows as $row) {
                if (!isset($arr[$row['group_id']])) {
                    $arr[$row['group_id']] = array_intersect_key($row, $groupKeys);
                }
                $arr[$row['group_id']]['child'][] = array_intersect_key($row, $planKeys);
            }
            $arr=array_values($arr);

        } else {//组
            $sql = "SELECT id AS group_id,name AS group_name,purpose,g.status as group_status FROM ad_group g WHERE g.status!='delete' and g.create_user='{$userId}' ";
            if ($search) {
                $sql .= " AND g.name like '%$search%'";
            }
            if ($purpose){
                $sql .= " AND g.purpose ='{$purpose}'";
            }

            $arr = Yii::$app->db->createCommand($sql)->queryAll();

        }
        return $arr;
    }

    /**
     * 批量拷贝广告组，返回新广告组的id
     * @param $gidArr
     * @param bool $recurse
     * @return array
     */
    public static function batchCopy($gidArr, $recurse=false)
    {
        if (empty($gidArr)){
            throw new \Exception('invalid parameter:gid empty');
        }
        $newIds=[];
        foreach ($gidArr as $gid){
            $newIds[]=self::copy($gid,$recurse);
        }
        $idStr=implode(',',$newIds);
        \Yii::$app->db->createCommand("UPDATE ad_group set edit_time=unix_timestamp() WHERE id in({$idStr})")->execute();
        return $newIds;
    }

    /**
     * 拷贝单个广告组，返回新生成的广告组的id
     * @param $gid
     * @param bool $recurse
     * @return string
     */
    public static function copy($gid, $recurse=false)
    {
        $timeStamp=microtime(true);
        $currentUserId=UserService::getCurrentUid();

        $sql1="insert into ad_group (name, purpose, status, budget_type, budget, create_time, create_user, edit_time, edit_user)
  SELECT concat(name,'(复制)-',$timeStamp), purpose, status, budget_type, budget, unix_timestamp(), create_user, unix_timestamp(), '$currentUserId'
  from ad_group WHERE id=$gid";
        Yii::$app->db->createCommand($sql1)->execute();
        $newId=Yii::$app->db->getLastInsertID();
        if ($recurse){//递归复制计划到新建的广告组
            $sql2="SELECT id FROM ad_plan WHERE group_id={$gid} and status!='delete'";
            $pidArr=Yii::$app->db->createCommand($sql2)->queryColumn();
            if (!empty($pidArr)){
                AdplanService::batchCopy($pidArr,[$newId],$recurse);
            }
        }
        return $newId;
    }


}