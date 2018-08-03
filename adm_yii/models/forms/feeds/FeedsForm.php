<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/21
 * Time: 上午11:27
 */

namespace app\models\forms\feeds;


use app\models\forms\BaseValiatorForm;

class FeedsForm extends BaseValiatorForm
{
    public $uid;
    public $cooperate_name;
    public $media_uid;
    public $use_mode;
    public $content_count;
    public $ad_count;
    public $status;


    const USE_MODES = ['api'];
    const STATUS_LIST = ['pause', 'active'];

    public function rules()
    {
        return [
            ['uid', 'required', 'on' => 'modify'],

            [['cooperate_name', 'media_uid', 'use_mode', 'content_count', 'ad_count'], 'required'],

            ['use_mode', 'in', 'range'=>[self::USE_MODES]],

            [['content_count','ad_count'],'integer'],

            ['status', 'default', 'value' => 'active'],
            ['status', 'in', 'range'=>[self::STATUS_LIST]],

        ];
    }


}