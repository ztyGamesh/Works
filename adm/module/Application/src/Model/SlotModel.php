<?php
namespace Application\Model;

use Application\Table\MediaTable;
use Application\Table\SlotTable;
use Application\Table\SlotTemplateTable;
use Application\Table\UserTable;
use Application\Table\SlotClassTable;
use Custom\ArrayHandle;

class SlotModel
{
    public $uid;

    public $items = array();

    public static $supportedAdType = [
        ['slot_class' => '29076f0d-a923-47d4-bfef-2e3cf28fc099', 'name' => '动态信息流'],
        ['slot_class' => 'c96089f7-9cff-4149-997f-bb03d617cda0', 'name' => '固定信息流'],
    ];

    public static function factory()
    {
        return new self();
    }

    /**
     * 获取媒体分类数据
     */
    public function getUserList()
    {

        $categoryTbl = new UserTable();
        $res = array();
        foreach ($categoryTbl->getList() as $val) {
            $res[$val['uid']] = $val['name'];
        }
        return $res;
    }

    /**
     * 根据uid获取分类
     *
     * @param $uid
     */
    public function getByUid($uid)
    {
        $table = new SlotTable();

        return $item = $table->getRow(array(
            'uid' => $uid
        ));
    }

    public function getSlot($uid)
    {
        $table = new SlotTable();

        $this->items = $table->getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 获取列表
     */
    public function getList($formGet)
    {
        $where = '';
        if ($formGet['media'] != '全部' && !empty($formGet['media']))
            $where .= " and m.name = '" . $formGet['media'] . "'";

        //     if ($formGet['status'] != '全部' && !empty($formGet['status']))
//         	$where .= " and s.status = '".$formGet['status']."'";

        if ($formGet['slotclass'] != '全部' && !empty($formGet['slotclass']))
            $where .= " and sc.name = '" . $formGet['slotclass'] . "'";

        $role = UserModel::factory()->getCurrentPlatformRole();
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

        $table = new MediaTable();

        $res = $table->getTableList($paramArr);

        $ids = (new UserModel())->GetUserSlot();

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
                $val['rows'] = $rowSub[$val['uid']];
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
    public function doSave($params)
    {
        $table = new SlotTable();
        // use table-fields, need params-key as same as table-field
        $fields = $table->getFields();
        $data = array_intersect_key($params, $fields);

        // check params
        if (empty($data['name'])) {
            return array(0, '广告位名称不能为空请确认。');
        }

        $user = UserModel::factory()->getCurrentUid();

        //投放端轮播次数无论cpd 还是 轮播 都会读取 lunbo字段读取次数
        $data['lunbo'] = $data['sell_type'] == 1 ? 1 : $data['lunbo'];
        $role = UserModel::factory()->getCurrentPlatformRole();
        $data['platform_role'] = $role;

        if (isset($data['uid']) && !empty($data['uid'])) {
            $data['edit_user'] = $user;
            $data['edit_time'] = time();

            // $data['template_count'] = $data['template_count'] + $params['template_add_num'];

            $res = $table->update($data, array('uid' => $data['uid']));

        } else {

            $data['nid'] = \Custom\Utility::getNid();
            $data['uid'] = \Custom\Guid::factory()->create();
            $data['create_user'] = $user;
            $data['create_time'] = time();

            $data['pid'] = UserModel::factory()->getCurrentPid();
            $res = $table->insert($data);
        }
        if ($res) {
            $this->uid = $data['uid'];
            return array(1, '保存成功');
        }
        return array(0, '可能网络问题导致失败，请稍后重试。');
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
        $table = new SlotTable();
        $res = $table->deleteRow($paramArr);

        $paramArr = array(
            'whereSql' => ' and slot  in ("' . $eid_str . '")',
        );
        $table = new SlotTemplateTable();
        $res = $table->deleteRow($paramArr);

        return $res ? true : false;
    }

    public static function getMenu($uid = "")
    {
        $categoryTbl = new SlotTable();
        $res = array();
        $data = $categoryTbl->getList();

        $ids = (new UserModel())->GetUserSlot();

        if ($data) {
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($categoryTbl->getList() as $val) {
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
        $table = new SlotClassTable();

        $data = $table->getList();
        $uids = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'uid');

        $dynamic = '29076f0d-a923-47d4-bfef-2e3cf28fc099';

        if (UserModel::factory()->getCurrentPlatformRole() == 'alliance') {
//            $uids = [$dynamic];
            $uids = array_map(function($arr){
                return $arr['slot_class'];
            },self::$supportedAdType);
        } else {
            unset($uids[array_search($dynamic, $uids)]);
        }

        $res = [];
        foreach ($uids as $index => $val) {
            $item = ArrayHandle::FindFirstArrayItemWithKeyValue($data,'uid',$val);
            $res = array_merge($res, [$item['uid'] => $item['name']]);
        }

        return $res;
    }

    public static function getSellMenu()
    {
        $categoryTbl = new SlotTable();
        $res = array();
        $data = $categoryTbl->getList();
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
        $categoryTbl = new SlotTable();
        $res = array();
        $data = $categoryTbl->getList();
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
    public function getSlotByName($name)
    {
        $table = new SlotTable();
        return $table->getRow(array(
            'name' => $name
        ));
    }

    public function isValid(&$arr)
    {
        if (empty($arr['name'])) {
            $arr['error'] = "请输入广告位名称！";
            return false;
        }

        $uid = isset($arr['uid']) ? $arr['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $media = (new SlotTable())->getRow("name = '{$arr['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

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
                    $template = (new SlotTemplateTable())->getRow("template_name = \"{$names}\" and uid = '{$uid}' ");
                    if (!empty($template)) {
                        $arr['error'] = "模板名称已存在！";
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public function Valid($data)
    {
        if (empty($data['name'])) {
            return [0, '请输入广告位名称！'];
        }

        $uid = isset($data['uid']) ? $data['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $media = (new SlotTable())->getRow("name = '{$data['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($media)) {
            return [0, '广告位名称已存在！'];
        }

        return [1, ''];
    }

    /**
     * 保存广告位
     * @param $params
     * @return array
     */
    public function Save(&$params)
    {
        $result = SlotModel::factory()->Valid($params);
        if (0 == $result[0])
            throw new \Exception($result[1]);

        $fields = SlotTable::factory()->getFields();
        $data = array_intersect_key($params, $fields);

        $role = UserModel::factory()->getCurrentPlatformRole();
        $data['platform_role'] = $role;
        $data['template_count'] = count($params['templates']);
        $data['edit_user'] = UserModel::factory()->getCurrentUid();
        $data['edit_time'] = time();

        if (!empty($data['uid'])) {
            SlotTable::factory()->update($data, array('uid' => $data['uid']));
        } else {
            $data['uid'] = \Custom\Guid::factory()->create();
            $data['create_user'] = UserModel::factory()->getCurrentUid();
            $data['create_time'] = time();
            SlotTable::factory()->insert($data);
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
    public function FetchSlot($uid)
    {
        $data = SlotTable::factory()->queryList("SELECT
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

    private function find_child($array, $pid = null)
    {
        $final = [];
        foreach ($array as $item) {
            $new_item = [];
            if ($item['pid'] == $pid) {
                $new_item['id'] = $item['id'];
                $new_item['name'] = $item['name'];
                $new_item['child'] = $this->find_child($array, $item['id']);
                $final[] = $new_item;
            }
        }
        return $final;
    }

    /**
     * 媒体、广告位、模板三层结构
     */
    public function slotstruct()
    {
        $media = UserModel::factory()->GetUserMedia(UserModel::factory()->getCurrentUid());
        $media= implode("','",$media);
        $role = UserModel::factory()->getCurrentPlatformRole();
        $slot = UserModel::factory()->GetUserSlot();
        $slot= implode("','",$slot);
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
        $data = SlotTable::factory()->queryList($sql);

        $data = $this->find_child($data, NULL);

        return $data;
    }

    /**
     * 根据bundle_id获取对应的广告类型
     * @param $bundle_id string 'id1,id2'
     */
    public function adType($bundle_id){
        if (empty($bundle_id)){
            return self::$supportedAdType;
        }

        $bundle_ids=explode(',',$bundle_id);
        $bundle_id=array_reduce($bundle_ids,function($old,$new){
            return $old."'$new',";
        },'');
        $bundle_id=trim($bundle_id,',');
        $sql="SELECT m.bundle_id,group_concat(sl.uid) as slot_class from media m
  JOIN slot s on s.media=m.uid
  JOIN slot_class sl on s.class=sl.uid
WHERE bundle_id IN ($bundle_id)
GROUP BY m.bundle_id";

        $data = SlotTable::factory()->queryList($sql);
        if (!empty($data)){
            foreach ($data as &$datum){
                $sl = explode(',', $datum['slot_class']);
                $datum['slot_class']= array_values(array_unique($sl));
            }
        }
        return $data;
    }

    /**
     *  广告位是否是固定信息流形式
     * @param $slotId
     */
    public function isSlotFixedFeeds($slotId)
    {
        $sql="SELECT sl.name from slot s JOIN slot_class sl on s.class=sl.uid where sl.name='固定信息流' and s.uid='{$slotId}'";
        $data = SlotTable::factory()->queryRow($sql);
        return !empty($data);
    }

    public function updateName($formPost){
        if (!isset($formPost['name']) || !isset($formPost['uid'])){
            throw new \Exception('参数不全,name or uid is missing');
        }
        return SlotTable::factory()->update(['name'=>$formPost['name']],['uid'=>$formPost['uid']]);
    }
}
