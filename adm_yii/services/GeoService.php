<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/7/11
 * Time: 18:37
 */

namespace app\services;


use app\models\GeoModel;

class GeoService
{


    public static function getGeoMenu()
    {
        $categoryTbl = new GeoModel();
        $arr = $categoryTbl::getList();
        $arr2 = array();
        foreach ($arr as $key=> $val) {
            if($val['province'] == '吉林') {
                $arr2[$val['province']] = '1156220000';
                continue;
            }
            if (strstr($val['city'], $val['province']) !== false) {
                $arr2[$val['province']] =$val['code'];
            }
        }


        $res = array();
        foreach ( $arr as $val) {

            if ( strstr($val['city'], $val['province']) !== false) {
                $res[$val['code']]  = array('name'=>$val['city']);
            } else {
                $res[$val['code']]  = array('name'=>$val['city'],'parent'=>$arr2[$val['province']]);
            }

        }
        $res['1156220200'] = ['name' => '吉林市', 'parent' => '1156220000'];
        return $res;
    }
}