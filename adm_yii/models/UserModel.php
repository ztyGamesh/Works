<?php

namespace app\models;


class UserModel extends BaseModel
{
    protected static $table = 'user';

    // system has power list
    public static $powerArr = array(
        'guest',
        'admin',
        'operation',
        'media_director',
        'client',
        'media_specialist',
        'site',
        'company',
        'agency',
        'finace',
    );

    public static $permissionArr = array(
        'readonly' => '只读',
        'full' => '自助权限',
    );

    /**
     * 根据用户邮箱获取用户
     * @param $mail
     * @return bool
     */
    public static function getUserByMail($mail)
    {
//        $mail = trim($mail);
//        $rowset = $this->gateway->select(array('mail' => $mail));
//        $row = $rowset->current();
//        return $row ?: false;
        return static::findOne(['mail' => $mail]);
    }

    /**
     * 根据用户id获取用户
     * @param $uid
     * @return bool
     */
    public static function getUserByUid($uid)
    {
//        $rowset = $this->gateway->select(array('uid' => $uid));
//        $row = $rowset->current();
//        return $row ?: false;
        return static::findOne(['uid' => $uid]);
    }

    /**
     * 根据用户权限获取用户
     * @param $power
     * @return bool
     */
    public static function getUsersByPower($powerArr = array())
    {
//        $rowset = $this->gateway->select(array('power' => $powerArr));
//        $row = $rowset->toArray();
//        return $row ?: false;
        return self::findAll(['power' => $powerArr]);
    }

    /**
     * 获取所有内部用户
     * @param $power
     * @return bool
     */
    public static function getInternalUsers()
    {
//        $rowset = $this->gateway->select(array('internal' => 1));
//        $row = $rowset->toArray();
//        return $row ?: false;
        return self::findAll(['internal' => 1]);
    }
}
