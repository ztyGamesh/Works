<?php

namespace app\models;

class CompanyModel extends BaseModel
{
    protected static $table = 'company';


    /**
     * 获取有效的主分类
     * @return array|false
     */
    public static function getValidMainList()
    {
//        $list = $this->getList(array('pid' => '', 'is_deleted' => 0));
//        return $list ?: false;
        return static::findAll(['pid' => '', 'is_deleted' => 0]);
    }

    /**
     * 获取主指定分类
     * @return array
     */
    public static function getListByUids($uidArr)
    {

//        $rowset = $this->gateway->select(array('uid' => $uidArr));
//        $row = $rowset->toArray();
//        return $row ?: false;
        return static::findAll(['uid' => $uidArr]);
    }

    /**
     * 获取所有分类
     * @return array
     */
    public static function getAllCategory()
    {
//        $rowset = $this->gateway->select();
//        $row = $rowset->toArray();
//
//        return $row ?: false;
        return self::findAll();
    }

}
