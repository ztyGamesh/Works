<?php

namespace app\models\forms\Slot;

use app\models\forms\BaseValiatorForm;
use app\services\SlotService;
use yii\base\Model;

/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/18
 * Time: 下午8:28
 *
 */

/**
 * Class PriceConfForm
 * @package app\models\forms\Slot
 *      * uid:广告位id
 * cooperate_mode:0:固定价格 1：分成,2:底价+分城，3:技术服务费，4：公开竞价，5：cpm合约';
 * price：小数 底价
 * media_share：int 0-100 def:60
 * profit_rate: double >=0 def:20
 * profit_price：double 广告成本
 */
class PriceConfForm extends BaseValiatorForm
{

    public $uid;//广告位uid
    public $cooperate_mode;
    public $price;
    public $media_share;
    public $profit_rate;
    public $profit_price;//跟前端交互是两位小数的形式，数据库是整数形式*100

    public function rules()
    {
        return [
            [['uid', 'cooperate_mode', 'price', 'media_share', 'profit_rate'], 'required'],
            ['cooperate_mode', 'in', 'range' => [0, 1, 2, 3, 4, 5]],
            [['price', 'profit_price'], 'number'],
//            ['profit_price','validateProfitPrice'],
            [['media_share'], 'integer'],
            ['profit_rate', 'number','min'=>-100,'max'=>100],

        ];
    }

    public function afterValidate()
    {
//        广告成本（底价/（1-最低利润率））
        $profit_price=SlotService::computeAdCost($this->price,$this->profit_rate);
        if ($this->profit_price != $profit_price) {
            $this->addError('profit_price', "广告成本计算错误,应为{$profit_price} 实为{$this->profit_price}");
        }
        // 入库时，利润率*100
        $this->profit_rate=(int)(100*$this->profit_rate);
    }


    /**
     * @inheritdoc
     */
    public static function forkData()
    {
        return [
            'uid' => '056eac0a-89a4-4919-814c-c75ce4aa4108',
            'cooperate_mode' => 0,
            'price' => 10,
            'media_share' => 60,
            'profit_rate' => 20,
            'profit_price' => 40
        ];
    }

}