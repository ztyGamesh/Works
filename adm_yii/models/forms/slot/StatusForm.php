<?php

namespace app\models\forms\slot;

use app\models\forms\BaseValiatorForm;

/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/19
 * Time: 上午6:52
 */

class StatusForm extends BaseValiatorForm
{

    public $uid;//slot.uid
    public $status;

    public function rules()
    {
        return [
            [['uid', 'status'], 'required'],
            ['status', 'in', 'range' => ['pause', 'active']]
        ];
    }

    /**
     * @inheritdoc
     * @return array
     */
    public static function forkData()
    {
        return [
            'uid' => '056eac0a-89a4-4919-814c-c75ce4aa4108',
            'status' => 'pause'
        ];
    }


}