<?php
namespace app\models;

class MediaClassModel extends BaseModel
{
    protected static $table = 'media_class';

    /**
     * 获取主指定分类
     * @return array
     */
    public static function getListByUids($uidArr) {
        return static::findAll(['uid' => $uidArr]);
    }
    
    /**
     * 获取所有分类
     * @return array
     */
    public static function getAllCategory() {
        return static::findAll();
    }
    
}
