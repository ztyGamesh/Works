<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace app\models;


class AdplanModel extends BaseModel
{
    const STATUS_VALUES = ['active','pause','delete'];
    const FREQUENCY_STATUS_VALUES=['on','off'];
    protected static $table = 'ad_plan';


}