<?php
/**
 * Created by PhpStorm.
 * User: gaosiyuan
 * Date: 2016/11/25
 * Time: 18:53
 */

namespace Application\Model;


class ConfigModel
{
    private $config = null;
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self;
        return self::$instance;
    }

    private function __construct()
    {
        $this->config = include  $_SERVER['DOCUMENT_ROOT'].'/../config/autoload/global.php';
    }

    public function Get($name = null)
    {
        return isset($this->config[$name]) ? $this->config[$name] : '';
    }

    public function GetUploadPath()
    {
        return $this->Get('adm_upload_path');
    }

    public function GetSplitWordUrl()
    {
        return $this->Get('split_path');
    }

    public function GetBatchSplitWordUrl()
    {
        return $this->Get('batch_split_path');
    }

    public function GetStaticServerUrl()
    {
        return $this->Get('static_server');
    }

    public function GetTemplatePath()
    {
        return $this->Get('template_path');
    }

    /**
     * @return string|array
     */
    public function GetTagConf(){
        return $this->Get('tag');
    }
}