<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace app\models;


class AdgroupModel extends BaseModel
{
    const statusValues = ['active','pause','delete'];
    protected static $table = 'ad_group';



}