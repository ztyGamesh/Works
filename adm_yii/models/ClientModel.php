<?php

namespace app\models;

class ClientModel extends BaseModel
{
    protected static $table = 'client';


    protected static $valid = 'is_deleted';


    /**
     * 获取有效的列表
     */
    public static function getValidList()
    {
//        $list = $this->getList(array($this->valid => 0));
//        return $list;
        return static::findAll([static::$valid => 0]);
    }

    /**
     * 获取客户名称列表
     * @param array $uids
     */
    public static function getClientNames(array $uids)
    {
//        if (empty($uids) || !is_array($uids)) return false;
//        $uids = array_unique($uids);
//        $list = $this->getList(array('uid'=>$uids));
//
//        $data = array();
//        if (!empty($list)) {
//            foreach ($list as $val) {
//                $data[ $val['uid'] ] = $val['name'];
//            }
//        }
//        return $data;

        if (empty($uids)) {
            return [];
        }
        $rows = static::findAll(['uid' => $uids], ['uid', 'name']);
        $data = [];
        if (!empty($rows)) {
            foreach ($rows as $row) {
                $data[$row['uid']] = $row['name'];
            }
        }
        return $data;
    }

    public static function getListByAgency($agency)
    {
//        $list = $this->getList(array(
//            $this->valid => 0,
//            'agency' => $agency,
//        ));
//        return $list;

        return static::findAll([self::$valid => 0, 'agency' => $agency,]);
    }


}
