<?php
namespace Application\Model;

use Application\Table\MediaTable;

use Application\Table\CompanyTable;
use Application\Table\SlotTemplateTable;
use Application\Table\UserTable;


use Application\Table\AgencyTable;
use Custom\ArrayHandle;

class MediaModel
{
    public $items=array();

    public static function factory() {
        return new self();
    }

    /**
     * 获取代理列表，以html-select样式
     * @return array (key=>val,...)
     */
    public function getAgencySelect() {
        $table = new AgencyTable();
        $list = $table->getList(array('is_deleted' => 0));

        $data = \Custom\Utility::getKv($list, 'uid', 'name');
        return $data;
    }

    /**
     * 获取广告主分类列表，以html-select形式
     * @return array (key=>val,...)
     */
    public function getCategorySelect() {
        $table = new ClientCategoryTable();
        $list = $table->getValidMainList();

        $data = \Custom\Utility::getKv($list, 'uid', 'name');
        return $data;
    }

    /**
     * 获取媒体分类数据
     */
    public static function getMediaCompany()
    {
        $categoryTbl = new CompanyTable();
        $res = array();
        foreach ($categoryTbl->getList() as $val) {
            $res[$val['uid']]  = $val['name'];
        }
        return $res;
    }

    /**
     * 获取媒体分类数据
     */
    public function getUserList()
    {

        $categoryTbl = new UserTable();
        $res = array();
        foreach ($categoryTbl->getList() as $val) {
            $res[$val['uid']]  = $val['name'];
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
        $table = new MediaTable();
        return $item = $table->getRow(array(
            'uid' => $uid
        ));
    }

    public function getMedia($uid)
    {
        $table = new MediaTable();
        $data = $table->getRow(array(
            'uid' => $uid
        ));
        $this->items = $data;
        return $data;
    }

    /**
     * 根据uid数组获取分类
     *
     * @param $uid
     */
    public function getCategoryByUidArr($uid)
    {
        $table = new MediaTable();
        return $item = $table->getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 获取列表
     */
    public function getMediaList($formGet)
    {
        $paramArr = array(
            'cols' => "m.*,
                        (SELECT `name` FROM client_category WHERE uid = m.`class`) AS class_name,
                        (SELECT `name` FROM user WHERE m.medium = `uid`) AS medium_name,
                        u.name AS createUserName,
                        
                        (SELECT `name` FROM `user` WHERE m.duty_user = `uid`) AS duty_name",
            'tblName' => "`media` AS m,
                           `user` AS u",
            'formGet' => $formGet,
//            'whereSql' => "
//                           AND m.name like '{$formGet['search']}%'
//                           AND u.`uid` = '{$formGet['uid']}'
//                           AND (
//                                m.`uid` IN
//                                (SELECT
//                                    id
//                                 FROM
//                                    resource
//                                 WHERE `type` = 'media'
//                                    AND uid = u.`uid`)
//                                    OR m.`create_user` = u.`uid`
//                               )",
            'whereSql' => "
                           AND m.name like '{$formGet['search']}%'
                           AND u.`uid` = '{$formGet['uid']}'
                           AND (m.medium=u.uid  OR m.`create_user` = u.`uid` OR (SELECT 1 FROM `user` WHERE create_user = '' AND uid ='{$formGet['uid']}'))",
            'orderBy' => ' m.create_time desc'

        );

        $table = new MediaTable();
        $res = $table->getTableList($paramArr);
        // 处理时间
        if ($res['rows']) {
            $rows = $rowSub = array();
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);
                switch ($val['type'])
                {
                    case 1:
                        $val['type'] = '应用/网页';
                        break;
                    case 2:
                        $val['type'] = '网页';
                        break;
                    case 3:
                        $val['type'] = '应用';
                        break;
                    default:
                        $val['type'] = '未知';

                }

                $rows[] = $val;
            }
            foreach ($rows as &$val) {
                $val['rows'] = $rowSub[ $val['uid'] ];
            }
            unset($val);
            $res['rows'] = $rows;
        }
        return $res;
    }

    /**
     * 保存媒体信息
     * @param array $params
     * @return boolean
     */
    public function doSave( $params ) {
        //数据处理
        $table = new MediaTable();
        // use table-fields, need params-key as same as table-field
        $fields = $table->getFields();
        $data = array_intersect_key($params, $fields);

//        type只支持一种，不再是数组了
//        if (count( $data['type']) == 2) {
//            $data['type'] = 1;
//        }  else {
//            $data['type'] = $data['type'][0];
//        }

        $user = UserModel::factory()->getCurrentUid();

        //暂时去掉备注 不存储,
        if (isset($data['info']))
            unset($data['info']);

        if ( isset($data['uid']) && !empty($data['uid']) ) {
            $res = $table->update($data, array('uid'=>$data['uid']));
        } else {
            $data['uid'] = \Custom\Guid::factory()->create();
            $data['create_user'] = $user;
            $data['create_time'] = time();

            $data['pid'] = UserModel::factory()->getCurrentPid();
            $res = $table->insert($data);
            AdcreativeAuditOtherModel::factory()->PushCreativeToOtherWait($data['bundle_id'],$data['medium']);
        }
        if ( $res ) {
            return array(1, '操作成功。');
        }
        return array(0, '可能网络问题导致失败，请稍后重试。');
    }

    /**
     * 删除媒体信息
     * @param unknown $uids
     * @return multitype:boolean string
     */
    public function doDel( $uids ){
        $eid_str = implode('","',$uids);
        $paramArr = array(
            'whereSql' => ' and uid  in ("'.$eid_str.'")',
        );
        $table = new MediaTable();

        $res = $table->deleteRow($paramArr);
        return $res ? true : false;
    }

    /**
     * 获取媒体列表或
     * @param string $uid 当前用户的uid,为空代表所有
     * @param string $type 获取媒体的uid还是bundle_id
     * @return array {'bundle_id'=>'media_name'} | {'media_uid'=>'media_name'}
     */
    public static function getMenu($uid="", $type='uid')
    {
        if (!in_array($type,['uid','bundle_id'])){
            throw new \Exception("invalid param");
        }
        $categoryTbl = new MediaTable();
        $res = array();
        $data = $categoryTbl->getList();
        $ids = (new UserModel)->GetUserMedia($uid);//返回媒体的id
        if($data) {
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time',SORT_ASC);
            foreach ($data as $val) {
                if (in_array($val['uid'],$ids)) {
                    $bundle_id = trim($val['bundle_id']);
                    switch ($type){
                        case 'uid':
                            $res[$val['uid']]=$val['name'];
                            break;
                        case 'bundle_id':
                            if(!empty($bundle_id) &&!isset($res[$bundle_id])){
                                $res[$bundle_id] = $val['name'];
                            }
                            break;
                        default:
                            break;
                    }

                }
            }
        }
        return $res;
    }

    public static function getMenuType()
    {
        $categoryTbl = new MediaTable();
        $res = array();
        foreach ($categoryTbl->getList() as $val) {
            switch ($val['type']) {
                case 1:
                    $res[$val['name']]  = "网站/应用";
                    break;
                case 2:
                    $res[$val['name']]  = "网站";
                    break;
                case 3:
                    $res[$val['name']]  = "应用";
                    break;
                default:
                    $res[$val['name']]  = "未知";
            }
        }
        return json_encode($res);
    }

    public static function getMSTSelect($uid="")
    {

//        $powerWhere = "";
//        if ($pid) {
//            $powerWhere = " and (m.pid= '".$pid."' or m.uid = '".$pid."')";
//        }

        $sql  = "select m.name as media_name,s.name as slot_name,st.template_name,st.uid,s.uid as s_uid,m.uid as m_uid,st.uid as st_uid from `media` as m ";
        $sql .= " left join `slot` as s on s.media=m.uid ";
        $sql .= " left join `slot_template` as st on st.slot = s.uid ";

        $sql .= " where m.name <> '' ";
        $sql .= " ORDER BY m.create_time DESC,s.`create_time` DESC,st.`create_time` DESC ";

        $tableSG= MediaTable::factory();
        $all = $tableSG->queryList($sql);

        //有权下媒体下的相关资源
        $ids = (new UserModel())->GetUserMedia($uid);

        $res = array();
        foreach ($all as $val) {
            $bb = array();
            foreach ($all as $val2) {
                if ($val['m_uid'] == $val2['m_uid']) {
                    $aa = array();
                    foreach ($all as $val3) {
                        if ($val2['s_uid'] == $val3['s_uid']) {

                            $aa[$val3['template_name']] = $val3['uid'];
                        }
                    }
                    $bb[$val2['slot_name']]['template'] = $aa;
                    $bb[$val2['slot_name']]['uid'] = $val2['s_uid'];
                }
            }
            if (in_array($val['m_uid'], $ids))
                $res[$val['media_name']] = (object)$bb;
        }
        return json_encode($res);
    }

    public static function getMenuSlotTemplate($slot_id)
    {
        $sql = "select * from slot_template where slot = '".$slot_id."' order by create_time desc";

        $tableSG= SlotTemplateTable::factory();
        $all = $tableSG->queryList($sql);



        $res = array();
        foreach ($all as $val) {
            $res[$val['uid']]  = $val['template_name'];
        }

        return $res;
    }

    public function check_url($url)
    {
        if ($url) {
            preg_match("/^(http:\/\/|https:\/\/)?(.+)/i", $url, $arr);
            if (!$arr or count($arr) < 3)
                return false;
            if ($arr[1] == '')
                return false;
        }
        return true;
    }

    public function isValid(&$arr)
    {
        $arr['error'] = array();
        if (empty($arr['name'])) {
            $arr['error']['name'] = "请输入媒体名称";
        }

        if (!empty($arr['url']) and !$this->check_url($arr['url'])) {
            $arr['error']['url'] = "媒体地址不合法";
        }
        if (empty($arr['type']) || !in_array($arr['type'],[2,3])) {
            $arr['error']['type'] = "请选择正确的媒体类型";
        }

        $uid = isset($arr['uid']) ? $arr['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $media = (new MediaTable())->getRow("name = '{$arr['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($media)) {
            $arr['error']['name'] = "媒体名称已存在";
        }
//        if (empty($arr['medium'])) {//不能修改媒体账户,前端可不传
//            $arr['error']['medium'] = "缺少媒体账户";
//        }

        if ($arr['class'] == '二级分类' || $arr['class'] == '请选择') {
            $arr['error']['class'] = "请选择正确的媒体分类";
        }

        return !count($arr['error']);
    }

    /**
     * 根据slot_class获取用户的媒体列表
     * @param $slot_class
     * @return array
     */
    public function getUserMediaListBySlotClass($slot_class){
        $userId=UserModel::factory()->getCurrentUid();
        $bundleIds=MediaTable::factory()->queryList("
            SELECT r.id FROM resource r JOIN user u on r.uid=u.uid
            WHERE u.uid='{$userId}' and r.type='bundle_id' and r.platform_role='alliance' ");
        //没有媒体定向
        if (empty($bundleIds)){
            return $this->getMediaListBySlotClass($slot_class);
        }
        //有媒体定向
        $sql="SELECT m.name,m.bundle_id FROM slot s JOIN media m on s.media=m.uid
                WHERE s.class = '{$slot_class}'
                and m.bundle_id IN (SELECT id FROM resource r WHERE r.uid='{$userId}') GROUP BY m.bundle_id";
        return MediaTable::factory()->queryList($sql);
    }

    /**
     * 获取所有slot_class下的媒体列表
     * @param $slot_class
     * @return array
     */
    public function getMediaListBySlotClass($slot_class){
        $sql="SELECT m.name,m.bundle_id FROM slot s JOIN media m on s.media=m.uid 
              WHERE s.class = '$slot_class' and m.bundle_id is not NULL and m.bundle_id !='' GROUP BY m.bundle_id";
        return MediaTable::factory()->queryList($sql);
    }

    /**
     * 获取所有的媒体 媒体定向不选的广告主
     */
    public function getAllMedia(){
        $sql="SELECT m.name,m.bundle_id FROM slot s JOIN media m on s.media=m.uid 
              WHERE  m.bundle_id is not NULL GROUP BY m.bundle_id";
        return MediaTable::factory()->queryList($sql);
    }

    /**
     * 广告主计划的媒体定向，返回所有媒体信息（媒体账户必须处于激活状态）
     */
    public function getMediaBundleid(){
        $sql="SELECT m.name as media_name,m.bundle_id FROM media m JOIN user u on m.medium=u.uid AND u.pause=0 WHERE m.bundle_id !='' GROUP BY m.bundle_id";
        return MediaTable::factory()->queryList($sql);
    }

    /**
     * 根据bundleIds获取媒体名称,按照create_time倒序排
     */
    public function getMediaByBundleIds($ids){
        $sql = "SELECT *
                FROM (SELECT m.name, m.bundle_id FROM media m JOIN user u on m.medium=u.uid AND u.pause=0 WHERE m.bundle_id IN ($ids) ORDER BY m.bundle_id ASC, m.create_time ASC) t1
                GROUP BY bundle_id";
        return MediaTable::factory()->queryList($sql);
    }
}