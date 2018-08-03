<?php

namespace app\models;

class AgencyModel extends BaseModel
{
    protected static $table = 'agency';


    protected static $valid = 'is_deleted';


    /**
     * 获取有效的列表
     */
    public static function getValidList()
    {
//        $list = $this->getList(array($this->valid => 0));
//        return $list;
        return static::findAll([self::$valid => 0]);
    }

    /**
     * 获取代理名称通过uid
     * @param array $uids
     */
    public static function getAgencyNames(array $uids)
    {
//        if (empty($uids) || !is_array($uids)) return false;
//        $uids = array_unique($uids);
//        $list = $this->getList(array('uid' => $uids));
//
//        $data = array();
//        if (!empty($list)) {
//            foreach ($list as $val) {
//                $data[$val['uid']] = $val['name'];
//            }
//        }
//        return $data;

        if (empty($uids)) {
            return null;
        }
        $uids = array_unique($uids);
        $agencies = static::findAll(['uid' => $uids]);
        $data = [];
        if (!empty($agencies)) {
            foreach ($agencies as $agency) {
                $data[$agency['uid']] = $agency['name'];
            }
        }
        return $data;
    }

}
