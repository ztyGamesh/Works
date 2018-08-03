<?php

namespace app\services;


use app\models\MediaModel;
use app\models\SlotClassModel;
use app\models\SlotModel;
use app\models\SlotPriceHistoryModel;
use app\models\SlotTemplateModel;
use app\models\UserModel;
use app\services\custom\ArrayHandle;
use app\services\custom\ConditionCombineModel;
use app\services\custom\Email;
use app\services\custom\Guid;
use app\services\custom\Utility;
use yii\base\InvalidParamException;
use yii\db\Exception;

class SlotService
{
    public static $uid;

    public static $items = array();

    public static $supportedAdType = [
        ['slot_class' => '29076f0d-a923-47d4-bfef-2e3cf28fc099', 'name' => '动态信息流'],
        ['slot_class' => 'c96089f7-9cff-4149-997f-bb03d617cda0', 'name' => '固定信息流'],
        ['slot_class' => '5b3e416f-d93a-4632-87de-5d4fbcc942fb', 'name' => '插屏'],
        ['slot_class' => '7b62026a-23aa-4592-836a-f4ee78f7ea2e', 'name' => '横幅'],
    ];


    /**
     * 获取媒体分类数据
     */
    public static function getUserList()
    {

        $res = array();
        foreach (UserModel::getList() as $val) {
            $res[$val['uid']] = $val['name'];
        }
        return $res;
    }

    /**
     * 根据uid获取分类
     *
     * @param $uid
     */
    public static function getByUid($uid)
    {

        return SlotModel::getRow(array(
            'uid' => $uid
        ));
    }

    public static function getSlot($uid)
    {

        self::$items = SlotModel::getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 获取列表
     */
    public static function getList($formGet)
    {
        $where = '';
        if ($formGet['media'] != '全部' && !empty($formGet['media']))
            $where .= " and m.name = '" . $formGet['media'] . "'";

        //     if ($formGet['status'] != '全部' && !empty($formGet['status']))
//         	$where .= " and s.status = '".$formGet['status']."'";

        if ($formGet['slotclass'] != '全部' && !empty($formGet['slotclass']))
            $where .= " and sc.name = '" . $formGet['slotclass'] . "'";

        $role = UserService::getCurrentPlatformRole();
        //查询当前登录角色下的广告位
        $where .= " and s.`platform_role`='{$role}'";

        // 由于后面要做数据过滤，所以不能传offset和limit，只能先取所有的数据出来再进行截取
        $offset = $formGet['offset'];
        $limit = $formGet['limit'];
        unset($formGet['offset']);
        unset($formGet['limit']);

        $paramArr = array(

            'tblName' => 'slot as s,slot_class as sc,media as m', // 表名
            'cols' => 's.*,sc.name as slot_class_name,sc.name as media_class_name,m.name as media_name,m.type as media_type, (select count(1) from `slot_template` where slot = s.`uid` and status = "active") as template_count  ', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                's.name'
            ), // 搜索的字段
            'whereSql' => ' and s.class=sc.uid and s.media=m.uid ' . $where,
            'orderBy' => '  s.create_time desc ',
            'debug' => 0
        );


        $res = MediaModel::getTableList($paramArr);

        $ids = UserService::GetUserSlot();

        // 处理时间
        if ($res['rows']) {
            $rows = $rowSub = array();
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);
                switch ($val['media_type']) {
                    case 1:
                        $val['media_type'] = "网站/应用";
                        break;
                    case 2:
                        $val['media_type'] = "网站";
                        break;
                    case 3:
                        $val['media_type'] = "应用";
                        break;
                    default:
                        $val['media_type'] = "未知";
                }
                if (in_array($val['uid'], $ids))
                    $rows[] = $val;
            }
            foreach ($rows as &$val) {
//                $val['rows'] = $rowSub[$val['uid']];//todo fuck
                $val['rows'] = null;
            }
            unset($val);
            $res['rows'] = $rows;
        }
        $res['total'] = count($res['rows']);
        $res['rows'] = array_slice($res['rows'], $offset, $limit);
        return $res;
    }

    /**
     * 保存广告位
     * @param array $params
     * @return boolean
     */
    public static function doSave($params)
    {
        $table = new SlotModel();
        // use table-fields, need params-key as same as table-field
        $fields = $table::getFields();
        $data = array_intersect_key($params, $fields);

        // check params
        if (empty($data['name'])) {
            return array(0, '广告位名称不能为空请确认。');
        }

        $user = UserService::getCurrentUid();

        //投放端轮播次数无论cpd 还是 轮播 都会读取 lunbo字段读取次数
        $data['lunbo'] = $data['sell_type'] == 1 ? 1 : $data['lunbo'];
        $role = UserService::getCurrentPlatformRole();
        $data['platform_role'] = $role;

        if (isset($data['uid']) && !empty($data['uid'])) {
            $data['edit_user'] = $user;
            $data['edit_time'] = time();

            // $data['template_count'] = $data['template_count'] + $params['template_add_num'];

            $res = $table::updateAll($data, array('uid' => $data['uid']));

        } else {

            $data['nid'] = Utility::getNid();
            $data['uid'] = Guid::factory()->create();
            $data['create_user'] = $user;
            $data['create_time'] = time();

            $data['pid'] = UserService::getCurrentPid();
            $res = $table::insertOne($data);
        }
        if ($res) {
            self::$uid = $data['uid'];
            return array(1, '保存成功');
        }
        return array(0, '可能网络问题导致失败，请稍后重试。');
    }

    /**
     * 删除媒体信息
     * @param unknown $uids
     * @return multitype:boolean string
     */
    public static function doDel($uids)
    {
        $eid_str = implode('","', $uids);
        $paramArr = array(
            'whereSql' => ' and uid  in ("' . $eid_str . '")',
        );
        $res = SlotModel::deleteRow($paramArr);

        $paramArr = array(
            'whereSql' => ' and slot  in ("' . $eid_str . '")',
        );
        $res = SlotTemplateModel::deleteRow($paramArr);

        return $res ? true : false;
    }

    public static function getMenu($uid = "")
    {
        $categoryTbl = new SlotModel();
        $res = array();
        $data = $categoryTbl::getList();

        $ids = UserService::GetUserSlot();

        if ($data) {
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($categoryTbl::getList() as $val) {
                if ($uid) {
                    if (in_array($val['uid'], $ids)) {
                        $res[$val['uid']] = $val['name'];
                    }
                } else {
                    $res[$val['uid']] = $val['name'];
                }
            }
        }

        return $res;
    }

    public static function getClassMenu()
    {
        $table = new SlotClassModel();

        $data = $table::getList();
        $uids = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'uid');

        $dynamic = '29076f0d-a923-47d4-bfef-2e3cf28fc099';

        if (UserService::getCurrentPlatformRole() == 'alliance') {
//            $uids = [$dynamic];
            $uids = array_map(function ($arr) {
                return $arr['slot_class'];
            }, self::$supportedAdType);
        } else {
            unset($uids[array_search($dynamic, $uids)]);
        }

        $res = [];
        foreach ($uids as $index => $val) {
            $item = ArrayHandle::FindFirstArrayItemWithKeyValue($data, 'uid', $val);
            $res = array_merge($res, [$item['uid'] => $item['name']]);
        }

        return $res;
    }

    public static function getSellMenu()
    {
        $categoryTbl = new SlotModel();
        $res = array();
        $data = $categoryTbl::getList();
        if ($data) {
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($data as $val) {
                $res[$val['name']] = $val['sell_type'];
            }
        }
        return json_encode($res);
    }

    public static function getSellUidMenu()
    {
        $categoryTbl = new SlotModel();
        $res = array();
        $data = $categoryTbl::getList();
        if ($data) {
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($data as $val) {
                $res[$val['uid']] = $val['sell_type'];
            }
        }
        return json_encode($res);
    }

    /**
     * 媒体名称获取媒体
     * @param $name
     */
    public static function getSlotByName($name)
    {
        return SlotModel::getRow(array(
            'name' => $name
        ));
    }

    public static function isValid(&$arr)
    {
        if (empty($arr['name'])) {
            $arr['error'] = "请输入广告位名称！";
            return false;
        }

        $uid = isset($arr['uid']) ? $arr['uid'] : '';
        $user = UserService::getCurrentUid();
        $media = SlotModel::getRow("name = '{$arr['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($media)) {
            $arr['error'] = "广告位名称已存在！";
            return false;
        }

        //模板名称账户内不可重复
        foreach ($arr as $key => $val) {
            if (preg_match("/template_name_[0-9]+/i", $key)) {
                $names = $val;
                if ($names) {
                    //同一个广告位下不可模板重复
                    $template = SlotTemplateModel::getRow("template_name = \"{$names}\" and uid = '{$uid}' ");
                    if (!empty($template)) {
                        $arr['error'] = "模板名称已存在！";
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public static function Valid($data)
    {
        if (empty($data['name'])) {
            return [0, '请输入广告位名称！'];
        }

        $uid = isset($data['uid']) ? $data['uid'] : '';
        $user = UserService::getCurrentUid();
        $media = SlotModel::getRow("name = '{$data['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($media)) {
            return [0, '广告位名称已存在！'];
        }

        return [1, ''];
    }

    /**
     * 保存广告位
     * @param $params array
     * @param $isSlotNew boolean 广告位是否为新增
     * @return boolean
     */
    public static function Save(&$params,$isSlotNew)
    {
        $result = self::Valid($params);
        if (0 == $result[0])
            throw new \Exception($result[1]);

        $fields = SlotModel::getFields();
        $data = array_intersect_key($params, $fields);

        $role = UserService::getCurrentPlatformRole();
        $data['platform_role'] = $role;
        $data['template_count'] = count($params['templates']);
        $data['edit_user'] = UserService::getCurrentUid();
        $data['edit_time'] = time();

        if (!empty($data['uid'])) {
            SlotModel::updateAll($data, array('uid' => $data['uid']));
        } else {
            $data['uid'] = $params['uid'] = Guid::factory()->create();

            if (UserService::IsAdminUser()) {//管理员创建广告位
                $mediaInfo = MediaModel::findOne($data['media']);
                $data['create_user'] = $mediaInfo['medium'];
            } else {
                $data['create_user'] = UserService::getCurrentUid();
            }
            if (MediumService::isAdx($data['create_user'])) {
                $data['cooperate_mode'] = SlotModel::COOPERATE_MODE['公开竞价'];
                $data['price'] = 10;
                $data['media_share'] = 0;
                $data['profit_rate'] = 2000;
                $data['profit_price'] = SlotService::computeAdCost($data['price'], $data['profit_rate'] / 100);
            } else {
                $data['cooperate_mode'] = SlotModel::COOPERATE_MODE['固定价格'];
                $data['price'] = 5;
                $data['media_share'] = 0;
                $data['profit_rate'] = 2000;
                $data['profit_price'] = SlotService::computeAdCost($data['price'], $data['profit_rate'] / 100);
            }
            $data['create_time'] = time();
            SlotModel::insertOne($data);
            $isSlotNew = true;
            $priceHistoryData = array_intersect_key($data, SlotPriceHistoryModel::getFields());
            $priceHistoryData['slot'] = $data['uid'];
            SlotPriceHistoryModel::insertOne($priceHistoryData);
        }
        //模板的广告位id赋值
        if (isset($params['templates'])) {
            array_walk_recursive($params['templates'], function (&$val, $index) use ($data) {
                if ($index === 'slot')
                    $val = $data['uid'];
            });
        }

        return true;
    }

    /**
     * 查询广告位信息(广告位编辑的时候所有广告位类型都用这个)
     * @param $uid
     */
    public static function FetchSlot($uid)
    {
        $data = SlotModel::queryList("SELECT
                                                s.*,
                                                st.`uid` AS st_uid,
                                                st.`status` AS st_status,
                                                st.slot,
                                                st.template,
                                                st.template_class,
                                                st.template_name,
                                                st.slot_screen,
                                                st.material_type,
                                                st.is_click,
                                                st.splash_time,
                                                st.slot_w,
                                                st.slot_h,
                                                st.price,
                                                st.profit_rate,
                                                st.profit_price,
                                                st.s_1242_375,
                                                st.setting
                                                FROM `slot` AS s
                                                LEFT JOIN `slot_template` AS st
                                                ON s.`uid` = st.`slot`
                                                WHERE s.`uid` = '{$uid}'");

        if (!empty($data)) {
            $items = ArrayHandle::UniqueArray($data, 'st_uid,st_status,slot,template,template_class,template_name,setting,slot_screen,material_type,is_click,splash_time,slot_w,slot_h,price,profit_rate,profit_price,s_1242_375');
            array_walk_recursive($items, function (&$val, $key) {
                if ($key == 'setting') {
                    $val = json_decode($val, true);
                }
            });
            $final = $data[0];
            unset($final['st_uid']);
            unset($final['st_status']);
            unset($final['slot']);
            unset($final['template']);
            unset($final['template_class']);
            unset($final['template_name']);
            unset($final['setting']);
            return array_merge($final, ['templates' => $items]);
        }
    }

    // [{"pid":null,"id":"","name":""}] bug
    private static function find_child($array, $pid = null)
    {
        $final = [];
        foreach ($array as $item) {
            $new_item = [];
            if ($item['pid'] == $pid) {
                if (empty($item['id'])) {//无效数据
                    continue;
                }
                $new_item['id'] = $item['id'];
                $new_item['name'] = $item['name'];
                $new_item['child'] = self::find_child($array, $item['id']);
                $final[] = $new_item;
            }
        }
        return $final;
    }

    /**
     * 媒体、广告位、模板三层结构
     */
    public static function slotstruct()
    {
        $media = UserService::GetUserMedia(UserService::getCurrentUid());
        $media = implode("','", $media);
        $role = UserService::getCurrentPlatformRole();
        $slot = UserService::GetUserSlot();
        $slot = implode("','", $slot);
        $sql = "SELECT 
                                                      `slot` AS `pid`,
                                                      `uid` AS id,
                                                      `template_name` AS `name` 
                                                    FROM
                                                      `slot_template` 
                                                    WHERE slot IN 
                                                      (SELECT 
                                                        uid 
                                                      FROM
                                                        `slot` 
                                                      WHERE `platform_role` = '{$role}' AND uid IN ('{$slot}')) 
                                                      UNION ALL 
                                                      SELECT 
                                                        media AS `pid`,
                                                        uid AS id,
                                                        `name` 
                                                      FROM
                                                        `slot` 
                                                      WHERE  `platform_role` = '{$role}' AND uid IN ('{$slot}')
                                                      UNION ALL 
                                                      SELECT 
                                                        NULL AS `pid`,
                                                        uid AS id,
                                                        `name` 
                                                      FROM
                                                        `media` 
                                                      WHERE `uid` IN (
                                                          '{$media}'
                                                        )";
        $data = SlotModel::queryList($sql);
        return self::find_child($data, NULL);
    }

    /**
     * 根据bundle_id获取对应的广告类型
     * @param $bundle_id string 'id1,id2'
     */
    public static function adType($bundle_id)
    {
        if (empty($bundle_id)) {
            return self::$supportedAdType;
        }

        $bundle_ids = explode(',', $bundle_id);
        $bundle_id = array_reduce($bundle_ids, function ($old, $new) {
            return $old . "'$new',";
        }, '');
        $bundle_id = trim($bundle_id, ',');
        $sql = "SELECT m.bundle_id,group_concat(sl.uid) as slot_class from media m
  JOIN slot s on s.media=m.uid
  JOIN slot_class sl on s.class=sl.uid
WHERE bundle_id IN ($bundle_id)
GROUP BY m.bundle_id";

        $data = SlotModel::queryList($sql);
        if (!empty($data)) {
            foreach ($data as &$datum) {
                $sl = explode(',', $datum['slot_class']);
                $datum['slot_class'] = array_values(array_unique($sl));
            }
        }
        return $data;
    }

    /**
     *  广告位是否是固定信息流形式
     * @param $slotId
     */
    public static function isSlotFixedFeeds($slotId)
    {
        $sql = "SELECT sl.name from slot s JOIN slot_class sl on s.class=sl.uid where sl.name='固定信息流' and s.uid='{$slotId}'";
        $data = SlotModel::queryRow($sql);
        return !empty($data);
    }

    public static function updateName($formPost)
    {
        if (!isset($formPost['name']) || !isset($formPost['uid'])) {
            throw new \Exception('参数不全,name or uid is missing');
        }
        return SlotModel::updateAll(['name' => $formPost['name']], ['uid' => $formPost['uid']]);
    }

    /**
     * 获取广告位配置
     * @param $params array
     *
     *  slot_name
     *  media_name
     *  status：active：开启 pause:暂停
     *  cooperate_mode:6种方式(0-5)：固定价格、分成、底价+分成、技术服务费、公开竞价、CPM合约
     *  base_price：
     *  media_share：int eg. 60
     *  profit_rate: int eg.20
     *  slot_cost:小数 计算公式：广告成本=（底价/（1-最低利润率））
     *  slot_link：
     */
    public static function fetchSlotStatusAndPriceConf($params)
    {
        $condition = new ConditionCombineModel();
        $condition->AndCondition($params['search'], "(m.`name` LIKE '{$params['search']}%' OR s.`name` LIKE '{$params['search']}%')");
        $condition->AndCondition($params['status'], "s.status ='{$params['status']}'");
        $order_condition = $condition->OrderCondition($params['sort'], $params['order'], "ORDER BY s.`{$params['sort']}` {$params['order']}");

        $sql = "SELECT DISTINCT 
                  s.uid,
                  s.`name` AS `slot_name`,
                  m.`name` AS `media_name`,
                  s.status,
                  s.cooperate_mode,
                  s.price,
                  s.media_share,
                  round(s.profit_rate/100,2) as profit_rate,
                  s.profit_price,
                  from_unixtime(s.create_time,'%Y-%m-%d') as create_time,
                  concat('/slot/view?uid=',s.uid) as slot_link,
                  case  WHEN w.client_id is NULL then 0 ELSE 1 END as has_white_list
                FROM slot s
                  JOIN media m ON s.media = m.uid
                  LEFT JOIN slot_white_list w on w.slot_id=s.uid
                {$condition->Condition()}
                {$order_condition}";

        return BaseService::Paging($sql, $params['limit'], $params['offset']);
    }

    /**
     * 广告位价格调整
     * @param $data array
     * @return
     */
    public static function saveSlotPriceConf(&$data)
    {
        SlotModel::updateAll($data, array('uid' => $data['uid']));
        $data['create_time'] = time();
        $data['slot'] = $data['uid'];
        unset($data['status'], $data['uid']);//status在slot表
        return SlotPriceHistoryModel::insertOne($data);
    }

    public static function saveStatus(array &$input)
    {
        return SlotModel::updateAll(['status' => $input['status']], ['uid' => $input['uid']]);
    }

    /**
     * 获取广告位形式
     */
    public static function getAdFormats()
    {
        return SlotModel::$formats;
    }

    /**
     * 新建广告位后给运营人员发送邮件通知
     * @param $params
     * @return bool
     */
    public static function sendEmail(&$params)
    {
        $slotParams = \Yii::$app->params['email']['slot'];
        $to = $slotParams['to'];
        $title = $slotParams['title'];
        $slotId = $params['uid'];
        $sql = "SELECT s.name as slot_name,m.name as media_name,u.mail as mail,sc.name as slot_type
              FROM slot s JOIN media m on s.media=m.uid JOIN user u on s.create_user=u.uid JOIN slot_class sc on sc.uid=s.class
              WHERE s.uid='{$slotId}'";
        $row = SlotModel::queryRow($sql);
        $name = $row['slot_name'];
        $media_name = $row['media_name'];
        $mail = $row['mail'];
        $slot_type = $row['slot_type'];
        $date = date('Y-m-d');

        $content = <<<HTML
        广告位管理地址&nbsp;&nbsp;
<a href="http://adm.deepleaper.com/user/templateprofitrateview">http://adm.deepleaper.com/user/templateprofitrateview</a>
<table border="1">
    <tr>
        <th>广告位名称</th>
        <th>媒体名称</th>
        <th>所属账户</th>
        <th>广告位类型</th>
        <th>创建时间</th>
    </tr>
    <tr>
        <td>$name</td>
        <td>$media_name</td>
        <td>$mail</td>
        <td>$slot_type</td>
        <td>$date</td>
    </tr>
</table>
HTML;

//        return Email::send_email($to, $title, $content);
        return Email::addMailToQueue($to, $title, $content);
    }

    /**
     * 计算广告成本
     * @param $price
     * @param $profit_rate
     * @return float|int
     */
    public static function computeAdCost($price, $profit_rate)
    {
        $profit_price = $price / (1 - $profit_rate / 100);
        $profit_price = round($profit_price, 2);
        return $profit_price;
    }


    /**
     * 是否是有效广告位
     * @param $param array {slot_id:'',bundle_id:'a,b,c'}
     * @return array
     * @throws \yii\base\InvalidParamException
     */
    public static function validateAndGetSlotNames(array $param)
    {
        if (!isset($param['slot_id'])) {
            throw new InvalidParamException('缺少slot_id参数');
        }

        $valid = [];
        $invalid = [];
        $slotIds = explode(',', $param['slot_id']);
        foreach ($slotIds as $slotId) {
            try {
                if (isset($param['bundle_id'])) {
                    $slotName = static::getSlotNameByIdAndBundle($param['bundle_id'], $slotId);
                } else {
                    $slotName = static::getSlotNameById($slotId);
                }
                $valid[] = ['slot_id' => $slotId, 'name' => $slotName];
            } catch (\Exception $e) {
                $invalid[] = ['slot_id' => $slotId, 'error' => $e->getMessage()];
            }
        }
        return compact('valid', 'invalid');
    }

    /**
     * @param $slotId
     * @return bool
     * @throws \yii\base\InvalidParamException
     * @throws Exception
     */
    protected static function getSlotNameById($slotId)
    {
        $sql = '
SELECT
       s.name,
       s.status AS slot_status,
       m.status AS media_status,
       if(u.pause=0,"active","pause") AS user_status
  FROM slot s
  JOIN media m ON s.media=m.uid
  JOIN user u ON m.medium=u.uid 
WHERE s.uid=:slot_id';
        $row = \Yii::$app->db->createCommand($sql, [':slot_id' => $slotId])->queryOne();
        self::checkSlotExist($row);
        return $row['name'];
    }

    /**
     * @param $bundleId
     * @param $slotId
     * @return bool
     * @throws \yii\base\InvalidParamException
     * @throws Exception
     */
    protected static function getSlotNameByIdAndBundle($bundleId, $slotId)
    {
        $sql = '
SELECT 
    s.name,
    s.status AS slot_status,
    m.status AS media_status,
    if(u.pause=0,"active","pause") AS user_status
 FROM slot s
 JOIN media m ON s.media=m.uid
 JOIN user u ON m.medium=u.uid 
 WHERE s.uid=:slot_id AND m.bundle_id=:bundle_id ';

        $row = \Yii::$app->db->createCommand($sql, [':slot_id' => $slotId, ':bundle_id' => $bundleId])->queryOne();
        self::checkSlotExist($row);
        return $row['name'];
    }

    /**
     * @param $row array
     * @return bool
     * @throws \yii\base\InvalidParamException
     */
    protected static function checkSlotExist($row)
    {
        if (empty($row)) {
            throw new InvalidParamException('广告位不存在');
        }
        if ($row['slot_status'] === 'active'
            && $row['media_status'] === 'active'
            && $row['user_status'] === 'active'
        ) {
            return true;
        }
        throw new InvalidParamException('广告位已失效');
    }
}
