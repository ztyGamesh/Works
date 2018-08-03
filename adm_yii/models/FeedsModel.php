<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/21
 * Time: 下午4:53
 */

namespace app\models;


use app\services\UserService;

/**
 * @property $uid string
 * @property $pid string 父id
 * @property $media_uid string 媒体uid
 * @property $cooperate_name string
 * @property $use_mode string 合作模式
 * @property $content_count int 内容条数
 * @property $ad_count int 广告条数
 * @property $status string 状态
 *
 */
class FeedsModel extends BaseModel
{
    const USE_MODES = ['api'];
    const STATUS_LIST = ['pause', 'active'];

    const SCENARIO_SUBFEEDS='subFeeds';


    //示例数据
    public static function data(){
        return [
            'media_uid'=>'2f927c49-bdbe-4a9e-a171-5938c73dca7f',
            'cooperate_name'=>'媒体合作-'.date('m-d'),
            'use_mode'=>'api',
            'content_count'=>6,
            'ad_count'=>1,
        ];
    }

    public static function tableName()
    {
        return "feeds";
    }



    public function rules()
    {
        return [
            ['uid', 'required'],
            ['pid', 'default', 'value' => ''],

            [['cooperate_name', 'media_uid', 'use_mode', 'content_count', 'ad_count'], 'required'],
//            [['tb_app_key','tb_app_secret'],'required','except'=>['subFeeds']],

            ['use_mode', 'in', 'range' => self::USE_MODES],

            [['content_count', 'ad_count'], 'integer'],

            ['status', 'default', 'value' => 'active'],
            ['status', 'in', 'range' => self::STATUS_LIST],

        ];
    }

    /**
     * @inheritdoc
     */
    public function fields()
    {
        $fields= parent::fields();
        unset($fields['pid'],$fields['slots'],$fields['edit_time'],$fields['tb_app_key'],$fields['tb_app_secret']);
        $fields['create_time']=function ($model){
            return date('Y-m-d',$model->create_time);
        };
        return $fields;
    }

    // 订单和客户通过 Customer.id -> customer_id 关联建立一对一关系
    public function getMedia()
    {
        return $this->hasOne(MediaModel::className(), ['uid' => 'media_uid']);
    }


    public function beforeSave($insert)
    {
        if (!parent::beforeSave($insert)) {
            return false;
        }

        if ($this->isNewRecord) {
            $this->create_time = time();
            if (UserService::IsAdminUser()){
                $this->create_user = MediaModel::getAttr(['uid'=>$this->media_uid],'medium');
            }else{
                $this->create_user = UserService::getCurrentUid();
            }
        } else {
            $this->edit_time = time();
        }
        return true;
    }


}