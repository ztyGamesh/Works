<?php
/**
 * Created by PhpStorm.
 * User: gaosiyuan
 * Date: 2016/11/25
 * Time: 18:53
 */

namespace app\services;


use yii\helpers\VarDumper;

class ConfigService
{
    private static $config = null;
    private static $instance = null;


    public static function Get($name = null)
    {
        if (empty(self::$instance)){
            self::$config = \Yii::$app->params;
        }
        return isset(self::$config[$name]) ? self::$config[$name] : '';
    }

    public static function GetUploadPath()
    {
        return self::Get('adm_upload_path');
    }

    public static function GetSplitWordUrl()
    {
        return self::Get('split_path');
    }

    public static function GetBatchSplitWordUrl()
    {
        return self::Get('batch_split_path');
    }

    public static function GetStaticServerUrl()
    {
        return self::Get('static_server');
    }

    public static function GetTemplatePath()
    {
        return self::Get('template_path');
    }

    /**
     * @return string|array
     */
    public static function GetTagConf(){
        return self::Get('tag');
    }

    public static function getAdminUid()
    {
        return \Yii::$app->params['admin_uid'];
    }
}