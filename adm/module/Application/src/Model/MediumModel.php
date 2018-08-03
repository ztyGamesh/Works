<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/31
 * Time: 19:59
 */
namespace Application\Model;

use Application\Table\MediumTable;

class MediumModel
{
    public static function factory()
    {
        return new self();
    }

    public function ReplaceMeidumInfo(array $data)
    {
        if(!$data)
            throw new \Exception('parameter wrong!');

        if (!isset($data['uid']) or !isset($data['bank']) or !isset($data['bank_account']) or !isset($data['account_name']))
            throw new \Exception('银行账户信息不完整！');

        if (!isset($data['media_type'])){
            throw new \Exception('缺少参数：媒体类型');
        }
        if (! isset($data['audit_type'])){
            throw new \Exception('缺少参数：是否需要审核');
        }

        if ($data['media_type']==1){//media
            $data['setting']=null;
        }else{//adx
            if (!(isset($data['setting']))){
                throw new \Exception('缺少参数：setting');
            }
        }

        $data['attach'] = json_encode($data['attach']);
        $data['edit_user'] = UserModel::factory()->getCurrentUid();
        $data['edit_time'] = time();

        MediumTable::factory()->execute("
        REPLACE INTO `medium`(`uid`,`bank`,`bank_account`,`account_name`,`attach`,`edit_time`,`edit_user`,`media_type`,`audit_type`,`setting`)
        VALUES('{$data['uid']}','{$data['bank']}','{$data['bank_account']}','{$data['account_name']}','{$data['attach']}'
        ,{$data['edit_time']},'{$data['edit_user']}','{$data['media_type']}','{$data['audit_type']}','{$data['setting']}')");

        return true;
    }

    /**
     * 返回媒体列表 添加媒体，查询媒体所属媒体账户
     */
    public function getMediumUserList($uid=null){
        $sql="SELECT u.name,u.uid as id FROM medium mm left join user u  on mm.uid=u.uid";
        $data = MediumTable::factory()->queryList($sql);

        if (!empty($uid)){
            $sql2 ="select u.uid as id from media m left join user u on m.medium=u.uid where m.uid='{$uid}'";
            $data2=MediumTable::factory()->queryRow($sql2);
            return ['list'=>$data,'selected'=>$data2];
        }else{
            return $data;
        }
    }

    /**
     * 通过审核状态返回媒体账户
     * @param $audit_type
     */
    public function getMediumByAuditType($audit_type)
    {
        if(!$audit_type or !in_array($audit_type,['self', 'self_other']))
            throw new \Exception('parameter wrong');

        return MediumTable::factory()->getList(['audit_type'=>$audit_type]);
    }

    /**
     * 返回全量媒体账户
     */
    public function getAllMedium()
    {
        return MediumTable::factory()->queryList("
        SELECT 
        u.`uid`,
        concat(u.`name`,'(',me.audit_type,')') as name
        FROM `medium` AS me INNER JOIN `user` AS u
        ON me.`uid` = u.`uid`
        ");
    }

    /**
     * 根据用户id判断是否是adx账户
     * @param $uid
     */
    public function isAdx($uid){
        $row= MediumTable::factory()->queryRow("select media_type from medium where media_type='adx' and uid='{$uid}'");
        return !empty($row);
    }

}