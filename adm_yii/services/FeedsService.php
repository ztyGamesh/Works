<?php
/**
 * Created by PhpStorm.
 * User=>xueleixi
 * Date=>2017/9/21
 * Time=>下午4=>53
 */

namespace app\services;

use app\models\FeedsModel;
use app\models\forms\PagingForm;
use app\models\SlotClassModel;
use app\models\TemplateModel;
use app\services\custom\ConditionCombineModel;
use app\services\custom\Guid;
use yii\db\Exception;

class FeedsService extends BaseService
{

    public static function getFeeds($uid, $params)
    {
        // 查询一个
        $cond = new ConditionCombineModel();
        $cond->AndCondition($pid = 1, "f.pid=''");
        $sql = "
SELECT f.uid,cooperate_name,use_mode,content_count,ad_count,from_unixtime(f.create_time) AS create_time,
    m.name AS media_name,
    m.uid AS media_uid,
   f.tb_pid,
   f.tb_media,
   f.tb_app_key,
   f.tb_app_secret
FROM feeds f 
JOIN media m ON f.media_uid=m.uid
WHERE 1";

        if ($uid) {
            $cond->AndCondition($uid, "f.uid='{$uid}'");
            $sql = "$sql {$cond->Condition()}";
            return FeedsModel::queryRow($sql);

        }

        $cond->AndCondition($params['search'], "f.`cooperate_name` LIKE '%{$params['search']}%'");
        $order_condition = $cond->OrderCondition($params['sort'], $params['order'], "ORDER BY f.`{$params['sort']}` {$params['order']}");
        // 查询分页数据
        $form = PagingForm::doValidate($params);
        $sql = "$sql {$cond->Condition()} {$order_condition}";
        return BaseService::Paging($sql, $form['limit'], $form['offset']);
    }


    /**
     * 新增智荐id,自动生成两个广告位id,1个子智荐id
     * @param $data
     * @throws \Exception
     */
    public static function save($data)
    {
        $data['uid'] = Guid::factory()->create();
        $mainFeeds = new FeedsModel();
        if (!$mainFeeds->load($data, '')) {
            throw new \Exception('no data');
        }

        $subFeeds = new FeedsModel($mainFeeds->toArray());
        $subFeeds->uid = Guid::factory()->create();
        $subFeeds->pid = $mainFeeds->uid;
        $subFeeds->ad_count = 0;
        $subFeeds->content_count = 5;

        $mainFeeds->slots = self::addSlots($mainFeeds);
        $subFeeds->slots = self::addSlots($subFeeds);

        if (!$mainFeeds->insert()) {
            throw new \Exception(json_encode($mainFeeds->errors));
        }
        if (!$subFeeds->insert()) {
            throw new \Exception('subFeeds insert error!' . json_encode($subFeeds->errors));
        }
        return $mainFeeds->uid;
    }


    /**
     * 关联淘宝pid
     */
    public static function attachTaoBao($params)
    {
        if (empty($params['tb_pid']) || empty($params['tb_media']) || empty($params['uid'])
            || empty($params['tb_app_key']) || empty($params['tb_app_secret'])
        ) {
            throw new Exception('缺少参数 tb_pid/tb_media/uid/tb_app_key/tb_app_secret');
        }
        $pidExists = FeedsModel::queryRow("SELECT 1 from feeds WHERE `tb_pid`='{$params['tb_pid']}' and uid!='{$params['uid']}'");
        if ($pidExists) {
            throw new Exception("淘宝pid已存在");
        }
        $params = array_intersect_key($params, [
            'tb_pid' => 1,
            'tb_media'=>1,
            'tb_app_key' => 1,
            'tb_app_secret' => 1,
            'uid' => 1,
        ]);
        return FeedsModel::updateAll($params, "uid='{$params['uid']}'");
    }


    /**
     * @param $feeds FeedsModel
     * @return string
     */
    protected static function addSlots($feeds)
    {
        $templates = [
            '大图+文字模板' => [
                'uid' => '',
                'slot' => '',
                'class' => SlotClassModel::FIXED_FEEDS_UID,
                'template' => '',
                'template_name' => '大图+文字模板',
                'template_class' => TemplateModel::FEEDS_STYLES['大图+文字模板'],
                'setting' => [
                    "pic_setting" => ["scale" => "16_9", "position" => "left", "format" => ["static_pic", "dynamic_pic"]],
                    "title_setting" => ["font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "21"],
                    "description_setting" => ["font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "23"]
                ]
            ],
            '图文模板' => [
                'uid' => '',
                'slot' => '',
                'class' => SlotClassModel::FIXED_FEEDS_UID,
                'template' => '',
                'template_name' => '图文模板',
                'template_class' => TemplateModel::FEEDS_STYLES['图文模板'],
                'setting' => [
                    "pic_setting" => ["scale" => "3_2", "position" => "left", "format" => ["static_pic", "dynamic_pic"]],
                    "title_setting" => ["align" => "top", "font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "21"],
                    "description_setting" => ["font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "23"]
                ]
            ],
            '组图模板' => [
                'uid' => '',
                'slot' => '',
                'class' => SlotClassModel::FIXED_FEEDS_UID,
                'template' => '',
                'template_name' => '组图模板',
                'template_class' => TemplateModel::FEEDS_STYLES['组图模板'],
                'setting' => [
                    "pic_setting" => ["scale" => "3_2", "format" => ["static_pic", "dynamic_pic"]],
                    "title_setting" => ["font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "21"],
                    "description_setting" => ["font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "23"]
                ]
            ],
            '文字链模板' => [
                'uid' => '',
                'slot' => '',
                'class' => SlotClassModel::FIXED_FEEDS_UID,
                'template' => '',
                'template_name' => '文字链模板',
                'template_class' => TemplateModel::FEEDS_STYLES['文字链模板'],
                'setting' => [
                    "title_setting" => ["font" => "", "font-size" => "14", "font-color" => "#000000", "length" => "21"],
                ]
            ],
        ];

        $templates_list = $templates;
        $templates_detail = [
            $templates['大图+文字模板'],
        ];
        $slot = [
            'uid' => '',
            'name' => '内容合作-' . time(),
            'media' => $feeds->media_uid,
            'class' => SlotClassModel::FIXED_FEEDS_UID,
            'slot_channel' => '45,46',
            'sell_type' => '3',
            'templates' => empty($feeds->pid) ? $templates_list : $templates_detail,
            'feeds_id' => $feeds->uid,
        ];


        SlotService::Save($slot, $isNew = true);
        SlotTemplateService::Save($slot['templates']);
        //发邮件
        SlotService::sendEmail($slot);
        return $slot['uid'];
    }
}