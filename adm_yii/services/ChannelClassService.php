<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/27
 * Time: 15:20
 */

namespace app\services;
use app\models\ChannelClassModel;


/**
 * 渠道分类
 * Class ChannelClassModel
 * @package Application\Model
 */
class ChannelClassService
{


    public static function GetList()
    {
        $data = ChannelClassModel::getList();
        $final = [];
        foreach ($data as $item) {
            if ($item['pid'] != 0) {
                $final[$item['id']] = ['name' => $item['class_name'], 'parent' => $item['pid']];
            } else {
                $final[$item['id']] = ['name' => $item['class_name']];
            }
        }
        return $final;
    }

    public static function GetFormattedList()
    {
        $data = ChannelClassModel::queryList("SELECT 
                                                        id,
                                                        class_name AS `name`,
                                                        (SELECT GROUP_CONCAT(`id`,'|',`class_name`) FROM `channel_class` WHERE pid = c.id GROUP BY pid) AS child
                                                        FROM `channel_class` AS c
                                                        WHERE pid = 0
                                                        GROUP BY id");
        if ($data) {
            foreach ($data as &$item) {
                $child = [];
                foreach (explode(',', $item['child']) as $sub_item) {
                    list($id, $name) = explode('|', $sub_item);
                    $child[] = ['id' => $id, 'name' => $name];
                }
                $item['child'] = $child;
            }
            return $data;
        }
    }
}