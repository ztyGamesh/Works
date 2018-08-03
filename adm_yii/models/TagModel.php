<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 *
 */

namespace app\models;

/**
 * Class TagModel 标签字典
 * @package app\models
 */
class TagModel extends BaseModel
{
    protected static $table = 'tag';

    const DICT_ADS_INDUSTRY=100;//广告行业标签字典
    const DICT_CONTENT=101;//内容分类字典
    const DICT_DEFAULT=100;


}