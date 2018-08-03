<?php

namespace Application\Model;

use Application\Table\MediaTable;


use Application\Table\SlotTable;
use Application\Table\SlotTemplateTable;
use Application\Table\TemplateTable;

use Custom\ArrayHandle;


class SlotTemplateModel
{
    private $dynamic_ids = ['b2826850-b106-4cde-8a7c-d1d08dfaec7a', 'c0bb62fe-fc21-4b0b-a5c7-d547db667032'];
    private $dynamic_class = '29076f0d-a923-47d4-bfef-2e3cf28fc099';

    public static function factory()
    {
        return new self();
    }

    /**
     * 根据uid获取分类
     *
     * @param $uid
     */
    public function getByUid($uid)
    {
        $table = new SlotTemplateTable();

        return $item = $table->getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 获取列表
     */
    public function getList($formGet)
    {
        $paramArr = array(
            //'tblName' => 'slot as m,media_class as mc,company as c,user as u,user as u2', // 表名
            'tblName' => 'slot_template as s', // 表名
            //'cols' => 'm.*,mc.name as class_name,c.name as company_name,u.name as createUserName,u2.name as duty_name', // 列名
            'cols' => 's.*', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'm.name'
            ), // 搜索的字段
            'whereSql' => ' and s.slot = "' . $formGet["slot"] . '"',
            'orderBy' => '  s.create_time desc ',
            'debug' => 0
        );

        $table = new SlotTemplateTable();

        $res = $table->getTableList($paramArr);

        // 处理时间
        if ($res['rows']) {
            $rows = $rowSub = array();
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);
                $rows[] = $val;
            }
            foreach ($rows as &$val) {
                $val['rows'] = $rowSub[$val['uid']];
            }
            unset($val);
            $res['rows'] = $rows;
        }
        return $res;
    }

    public static function getSlotTemplatePrice()
    {
        $data = (new SlotTemplateTable())->queryList("SELECT
                                                            uid,price
                                                            FROM `slot_template`");
        if ($data) {
            $uids = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'uid');
            $prices = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'price');
            return array_combine($uids, $prices);
        }
        return null;
    }

    /**
     * 是否显示落地页
     * @return array|null
     */
    public static function isDisplayLinkUrl()
    {
        $data = (new SlotTemplateTable())->queryList("SELECT 
                                                              uid,
                                                            CASE class
                                                            WHEN '3e2bbd3f-3e8a-4ddc-892a-12070890543c' THEN is_click
                                                            ELSE 1
                                                            END AS is_click 
                                                            FROM
                                                              `slot_template` ");
        if ($data) {
            $uids = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'uid');
            $clicks = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'is_click');
            return array_combine($uids, $clicks);
        }
        return null;
    }

    /**
     * 保存广告主信息
     * @param array $params
     * @return boolean
     */
    public function doSave($params, $k)
    {
        //根据字段设定推断template_class
        if ($params['class'] == '3b8930a2-84cb-11e6-a656-008cfaf6f0c0') //mobi_横幅
        {
            if (strpos($params['material_type_' . $k], '视频') === false) {
                $params['template_class'] = '5db87273-fe0f-42e2-b259-abed8c9cd5fd';
            } else {
                $params['template_class'] = '54f1524c-8902-4038-8af9-3dadef8f4742';
            }
        }
        if ($params['class'] == '6e77385f-7834-11e6-a656-008cfaf6f0c0') //app_横幅
        {
            if (strpos($params['material_type_' . $k], '视频') === false) {
                $params['template_class'] = 'b0bad561-c370-44fe-bb25-2ed0f9a5a9f2';
            } else {
                $params['template_class'] = 'fa67b05c-a8b7-458e-a9d7-1eef77d9544b';
            }
        }
        if ($params['class'] == '3e2bbd3f-3e8a-4ddc-892a-12070890543c') //app_开屏
        {
            if ($params['slot_screen_' . $k] != 'full') {
                $params['template_class'] = '400b7843-c675-492e-b3a2-54fbd5602a20';
            } else {
                $params['template_class'] = 'b0bad561-c370-44fe-bb25-2ed0f9a5a9d3';
            }
        }
        if ($params['class'] == '44a1e8c4-d660-4ef2-bde7-84d3bc605880') //pc_固定位
        {
            $params['template_class'] = '400b7843-c675-492e-b3a2-54fbd5803b41';
        }
        if ($params['class'] == 'ec7c2e0a-c3e2-46fe-af98-662e1b350d84') //pc_浮层弹窗
        {
            $params['template_class'] = '400b7843-c675-492e-b3a2-44fba4103a92';
        }

        // 第一版的模板是在这里赋值的，在这里保留这个逻辑。
        $params['base_template'] = $_POST['base_template_' . $k];
        $params['template'] = $_POST['base_template_' . $k];

        $table = new SlotTemplateTable();
        // use table-fields, need params-key as same as table-field
        $fields = $table->getFields();
        $data = array_intersect_key($params, $fields);

        $user = UserModel::factory()->getCurrentUid();

        if (isset($data['uid']) && !empty($data['uid'])) {
            $res = $table->update($data, array('uid' => $data['uid']));
        } else {
            // $data['nid'] = \Custom\Utility::getNid();
            $data['uid'] = \Custom\Guid::factory()->create();
            $data['create_user'] = $user;
            $data['create_time'] = time();
            $res = $table->insert($data);
        }
        if ($res) {
            return array(1, '操作成功。');
        }
        return array(0, 'net problem可能网络问题导致失败，请稍后重试。');
    }

    /**
     * 删除媒体信息
     * @param unknown $uids
     * @return multitype:boolean string
     */
    public function doDel($uids)
    {
        $eid_str = implode('","', $uids);
        $paramArr = array(
            'whereSql' => ' and uid  in ("' . $eid_str . '")',
        );
        $table = new MediaTable();

        $res = $table->deleteRow($paramArr);
        return $res ? true : false;
    }

    public function Valid($data)
    {
        //模板名称广告位内不可重复
        foreach ($data as $item) {
            $uid = isset($item['uid']) ? $item['uid'] : '';

            if (empty($item['template_name'])) {
                return [0, '请输入模板名称！'];
            }
            $template = (new SlotTemplateTable())->getRow("template_name = \"{$item['template_name']}\" and slot = \"{$item['slot']}\" and uid != '{$uid}' ");
            if (!empty($template)) {
                return [0, '模板名称已存在！'];
            }
        }

        return [1, ''];
    }

    /**
     * 使用setting替换基础模板占位符
     * @param $base_template ,$setting
     */
    private function ReplaceTemplate($base_template, $setting)
    {
        if (!$setting)
            return $setting;

        $search_sign =
            [
                '[:TITLECOLOR:]',
                '[:TITLEFONTSIZE:]',
                '[:TITLEFONTFAMILY:]',
                '[:ALIGN:]',

                '[:DESCOLOR:]',
                '[:DESFONTSIZE:]',
                '[:DESFONTFAMILY:]',

                '[:SCALE:]',
                '[:POSITION:]'
            ];

        $replace_val[] = isset($setting['title_setting']['font-color']) ? $setting['title_setting']['font-color'] : '';
        $replace_val[] = isset($setting['title_setting']['font-size']) ? $setting['title_setting']['font-size'] : '';
        $replace_val[] = isset($setting['title_setting']['font']) ? $setting['title_setting']['font'] : '';
        $replace_val[] = isset($setting['title_setting']['align']) ? $setting['title_setting']['align'] : '';

        $replace_val[] = isset($setting['description_setting']['font-color']) ? $setting['description_setting']['font-color'] : '';
        $replace_val[] = isset($setting['description_setting']['font-size']) ? $setting['description_setting']['font-size'] : '';
        $replace_val[] = isset($setting['description_setting']['font']) ? $setting['description_setting']['font'] : '';

        $replace_val[] = isset($setting['pic_setting']['scale']) ? $setting['pic_setting']['scale'] : '';
        $replace_val[] = isset($setting['pic_setting']['position']) ? $setting['pic_setting']['position'] : '';

        return str_replace($search_sign, $replace_val, $base_template);
    }

    public function Save($params)
    {
        $result = SlotTemplateModel::factory()->Valid($params);
        if (0 == $result[0])
            throw new \Exception($result[1]);

        foreach ($params as $item) {
            $fields = SlotTemplateTable::factory()->getFields();
            $data = array_intersect_key($item, $fields);

            $base_template = TemplateTable::factory()->getRow(['uid' => $data['template_class']]);
            $data['template'] = $base_template['code'];
            $data['base_template'] = $base_template['code'];

            //如果是信息流广告、动态广告 模板则替换占位符
            if ($data['setting']) {
                $data['template'] = $this->ReplaceTemplate($base_template['code'], $data['setting']);
            }

            $data['setting'] = json_encode($data['setting']);

            //动态广告保存提价
            if (isset($data['class']) and $data['class'] == $this->dynamic_class) {
                if (!empty($data['uid'])) {
                    $slot_template = SlotTemplateTable::factory()->getRow(['uid' => $data['uid']]);
                    $data['profit_rate'] = $slot_template ? $slot_template['profit_rate'] : 50;
                } else {
                    $data['profit_rate'] = 50;
                }
                $data['profit_price'] = $this->profit_price($data['price'], $data['profit_rate']);
            }

            if (empty($data['uid'])) {
                $data['uid'] = \Custom\Guid::factory()->create();
            }

            $data['create_user'] = UserModel::factory()->getCurrentUid();
            $data['create_time'] = time();

            SlotTemplateTable::factory()->deleteRow(["whereSql" => " and uid = '{$data['uid']}'"]);
            SlotTemplateTable::factory()->insert($data);
        }
    }

    public function DeleteSlotTemplate($uid)
    {
        $paramArr = array(
            'whereSql' => " and uid = '{$uid}'",
        );

        $table = new SlotTemplateTable();
        $res = $table->deleteRow($paramArr);

        return $res ? true : false;
    }

    public function UpdateSlotTemplateStatus($uid, $status)
    {
        if (!$uid or !in_array($status, ['pause', 'active'])) {
            throw new \Exception('参数错误！');
        }

        SlotTemplateTable::factory()->update(['status' => $status], ['uid' => $uid]);
        return true;
    }

    /**
     * 底价 = 结算价+结算价*rate
     * @param $public_price $rate
     * @return mixed
     */
    function profit_price($public_price, $rate)
    {
        return $public_price + $public_price * ($rate / 100);
    }

    public function FetchSlotTemplate($uid)
    {
        $data = SlotTable::factory()->queryRow("SELECT
                                                st.*
                                                FROM `slot_template` AS st
                                                WHERE st.`uid` = '{$uid}'");

        if (!empty($data)) {
            array_walk_recursive($data, function (&$val, $key) {
                if ($key == 'setting') {
                    $val = json_decode($val, true);
                }
            });
            return $data;
        }
    }

    /**
     * 提取所有模板上浮比率和目标价
     */
    public function FetchTemplateProfitRateAndPrice($params)
    {
        $params['limit'] = $params['limit'] ? $params['limit'] : 10;
        $params['offset'] = $params['offset'] ? $params['offset'] : 0;
        $condition = new ConditionCombineModel();

        $condition->AndCondition($params['search'], "(m.`name` LIKE '{$params['search']}%' OR s.`name` LIKE '{$params['search']}%')");

        $sql = "
                                                    SELECT 
                                                    st.`uid`,
                                                    st.`template_name`,
                                                    m.`name` AS `media_name`,
                                                    s.`name` AS `slot_name`,
                                                    st.`price`,
                                                    st.`profit_rate`,
                                                    st.`profit_price`
                                                    FROM `slot_template` AS st 
                                                    INNER JOIN `slot` AS s
                                                    ON st.`slot` = s.`uid`
                                                    INNER JOIN `media` AS m
                                                    ON s.`media` = m.`uid`
                                                    WHERE st.`class`  in ('29076f0d-a923-47d4-bfef-2e3cf28fc099','c96089f7-9cff-4149-997f-bb03d617cda0') -- 只有动态-固定广告位
                                                    {$condition->Condition()}                                                    
                                                    ";

        return BaseModel::Paging($sql, $params['limit'], $params['offset']);
    }

    /**
     * 保存模板上浮比率和目标价
     */
    public function SaveTemplateProfitRateAndPrice($params)
    {
        $data = SlotTemplateTable::factory()->IntersectKey($params);

        if (!isset($data['profit_price']) or !isset($data['uid']))
            return;

        SlotTemplateTable::factory()->update($data, array('uid' => $data['uid']));
    }

    // TODO: 先这么验证，但是这么验证可能会导致用户交换两个模板的名字提交上来过不了验证。
    public function isValid($params)
    {
        if (empty($params['template_name'])) {
            return array('res' => 0, 'error' => '模板名为空');
        }

        $uid = isset($params['uid']) ? $params['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $template = (new SlotTemplateTable())->getRow("template_name = '{$params['template_name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($template)) {
            return array('res' => 0, 'error' => '模板名已存在');
        }

        return array('res' => 1, 'error' => '');

    }

    /**
     * 将最新模板代码推送模板到template表
     */
    public function PushTemplate()
    {
        $path = ConfigModel::factory()->GetTemplatePath();
        $result = [];
        $this->FeatchDirFiles($path, $result, '/.*\.html/');
        foreach ($result as $path) {
            $name_array = explode('/', $path);
            $file_name = $name_array[count($name_array) - 1];
            $name_array = explode('.', $file_name);
            $code = file_get_contents($path);
            $code = htmlspecialchars($code,ENT_QUOTES);
            $code = preg_replace('/(\r\n|\n|\r)/', '\r\n', $code);
            if ($code and $name_array[0]) {
                TemplateTable::factory()->execute("UPDATE template SET code = '{$code}' WHERE uid = '{$name_array[0]}'");
            }
        }
    }

    public function FeatchDirFiles($path, array &$data, $pattern)
    {
        $array = scandir($path);
        array_walk_recursive($array, function ($val, $key) use ($path, &$data, $pattern) {
            if (in_array($val, ['.', '..'])) {
                return;
            }
            if (is_dir("{$path}/{$val}")) {
                $this->FeatchDirFiles("{$path}/{$val}", $data, $pattern);
            } else {
                if (preg_match($pattern, $val))
                    $data[] = "{$path}/{$val}";
            }
        });
    }
}
