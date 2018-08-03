<?php
namespace Application\Model;

use Application\Table\ClientTable;
use Application\Table\ClientCategoryTable;
use Application\Table\AgencyTable;
use Custom\ArrayHandle;

class ClientModel
{
    public $items = array();

    public static function factory()
    {
        return new self();
    }

    public function getClient($uid)
    {
        $table = new ClientTable();
        $this->items = $table->getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 获取代理列表，以html-select样式
     * @return array (key=>val,...) 最后又个新方法，以后可以废掉这个
     */
    public function getAgencySelect($uid = "")
    {
        $table = new AgencyTable();
        $list = $table->getList(array('is_deleted' => 0));
        $arr = array();

        $ids = (new UserModel())->GetUserAgency($uid);

        if ($list) {
            ArrayHandle::SortTwoDimensionArrayByKey($list, 'create_time');
            foreach ($list as $key => $val) {
                if ($uid) {
                    if (in_array($val['uid'], $ids))
                        $arr[$key] = $val;
                } else {
                    $arr[$key] = $val;
                }
            }
        }

        $data = \Custom\Utility::getKv($arr, 'uid', 'name');
        return $data;
    }

    /**
     * 获取广告主分类列表，以html-select形式
     * @return array (key=>val,...)
     */
    public function getCategorySelect()
    {
        $table = new ClientCategoryTable();
        $list = $table->getValidMainList();

        $data = \Custom\Utility::getKv($list, 'uid', 'name');
        return $data;
    }

    /**
     * 获取主分类数据
     */
    public function getMainCategory()
    {
        $categoryTbl = new ClientCategoryTable();
        return $categoryTbl->getMainList();
    }

    /**
     * 获取所有分类数据
     */
    public function getAllCategory()
    {
        $categoryTbl = new ClientCategoryTable();
        return $categoryTbl->getAllCategory();
    }

    /**
     * 根据uid获取分类
     *
     * @param $uid
     */
    public function getCategoryByUid($uid)
    {
        $table = new ClientCategoryTable();
        return $item = $table->getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 根据uid数组获取分类
     *
     * @param $uid
     */
    public function getCategoryByUidArr($uidArr)
    {
        $table = new ClientCategoryTable();
        return $item = $table->getListByUids($uidArr);
    }

    /**
     * 获取客户分类列表
     */
    public function getCategoryList($formGet)
    {
        $paramArr = array(
            'tblName' => 'client_category as c,user as u', // 表名
            'cols' => 'c.*,u.name as createUserName', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'c.name'
            ), // 搜索的字段
            'whereSql' => ' and c.is_deleted=0 and c.create_user = u.uid ',
            'orderBy' => '  c.create_time desc ',
            'debug' => 1
        );
        $table = new ClientCategoryTable();
        $res = $table->getTableList($paramArr);

        // 遍历数据
        if ($res['rows']) {
            $rows = $rowSub = array();
//             
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);

                if (!empty($val['pid'])) {// 二级分类
                    $rowSub[$val['pid']][] = $val;
                } else {

                    $rows[] = $val;
                }
            }

            foreach ($rows as &$val) {
                $val['rows'] = $rowSub[$val['uid']];
            }

//             
//             unset($val);
            $res['rows'] = $rows;
        }
        print_r($res);
        return $res;
    }

    /**
     * 保存数据
     * @param $params
     * @return bool
     */
    public function doSaveCategory($params)
    {
        $colArr = array(
            'uid' => '',
            'name' => '',
            'pid' => '',
            'bes_id' => '',
            'tanx_id' => '',
            'adx_id' => '',
            'create_user' => '',
            'create_time' => '',
            'edit_user' => '',
            'edit_time' => ''
        );
        $data = array_intersect_key($params, $colArr);
        $table = new ClientCategoryTable();
        // 更新
        if (isset($data['uid']) && $data['uid']) {
            $res = $table->update($data, array(
                'uid' => $data['uid']
            ));
        } else {
            $data['uid'] = \Custom\Guid::factory()->create();
            $res = $table->insert($data);
        }
        return $res ? true : false;
    }

    /**
     * 删除数据,软删除
     *
     * @param $uidArr
     * @return bool
     */
    public function doDelCategory($uidArr)
    {
        $table = new ClientCategoryTable();
        $data = array(
            'is_deleted' => 1
        );
        $res = $table->update($data, array(
            'uid' => $uidArr
        ));
        return $res ? true : false;
    }

    /**
     * 获取列表
     */
    public function getAgencyList($formGet)
    {
//    	$powerWhere = "";
//    	if ($formGet['pid']) {
//    		$powerWhere = " and (c.pid= '".$formGet['pid']."' )";
//    	}
        $limit = $formGet['limit'];
        $offset = $formGet['offset'];
        unset($formGet['limit']);
        unset($formGet['offset']);
        $paramArr = array(
            'tblName' => 'agency as c,user as u', // 表名
            'cols' => 'c.*,u.name as createUserName', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'c.name'
            ), // 搜索的字段
            'whereSql' => ' and c.is_deleted=0 and c.create_user = u.uid ',
            'orderBy' => ' c.create_time desc',
            'debug' => 0
        );
        $table = new ClientCategoryTable();
        $res = $table->getTableList($paramArr);

        $ids = (new UserModel())->GetUserAgency($formGet['uid']);

        $rows = array('total' => '', 'rows' => []);
        // 处理时间
        if ($res['rows']) {
            foreach ($res['rows'] as $key => $val) {
                $createTime = date("Y-m-d", $val['create_time']);
                $res['rows'][$key]['create_time'] = $createTime;

                if (in_array($res['rows'][$key]['uid'], $ids))
                    $rows['rows'][] = $res['rows'][$key];
            }
        }
        $rows['total'] = count($rows['rows']);
        $rows['rows'] = array_slice($rows['rows'], $offset, $limit);
        return $rows;
    }

    /**
     * 保存数据
     *
     * @param $params
     * @return bool
     */
    public function doSaveAgency($params)
    {
        $colArr = array(
            'uid' => '',
            'name' => '',
            'url' => '',
            'linkman' => '',
            'tel' => '',
            'create_user' => '',
            'create_time' => ''
        );

        $data = array_intersect_key($params, $colArr);
        $table = new AgencyTable();
        $uid = isset($data['uid']) ? $data['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $agency = $table->getRow("name = '{$data['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        //添加、修改 验证重名
        if (!empty($agency))
            return ['status' => 0, 'msg' => '代理商名称已存在！'];

        // 更新
        if (isset($data['uid']) && $data['uid']) {
            $res = $table->update($data, array(
                'uid' => $data['uid']
            ));
            $res = $res == 0 ? 1 : $res;
        } else {
            $data['uid'] = \Custom\Guid::factory()->create();
            $data['pid'] = UserModel::factory()->getCurrentPid();
            $res = $table->insert($data);
        }
        return $res ? ['status' => 1, 'msg' => ''] : ['status' => 0, 'msg' => '保存失败！'];
    }

    /**
     * 删除数据,软删除
     *
     * @param $uidArr
     * @return bool
     */
    public function doDelAgency($uidArr)
    {
        $table = new AgencyTable();
        $data = array(
            'is_deleted' => 1
        );
        $res = $table->update($data, array(
            'uid' => $uidArr
        ));
        return $res ? true : false;
    }

    /**
     * 获取广告主列表
     */
    public function getClientList($formGet)
    {
        $whereSql = ' and c.is_deleted=0 and c.create_user=u.uid and c.category=cc.uid ';

        $limit = $formGet['limit'];
        $offset = $formGet['offset'];
        unset($formGet['limit']);
        unset($formGet['offset']);

        $paramArr = array(
            'tblName' => 'client c, user u, client_category cc', // 表名
            'cols' => 'c.*, u.name createUserName, cc.name category', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'c.name'
            ), // 搜索的字段
            'whereSql' => $whereSql,
            'orderBy' => ' c.create_time desc',
            'debug' => 0,
        );

        $table = new ClientTable();
        $res = $table->getTableList($paramArr);

        $statesDescArr = array(
            0 => '审核通过',
            1 => '审核中',
            2 => '审核拒绝',
            3 => '资质不全',
        );

        $ids = (new UserModel())->GetUserClient($formGet['uid']);

        $rows = ['total' => 0, 'rows' => []];
        // 处理时间
        if ($res['rows']) {
            $agency_uids = \Custom\Utility::getSubList($res['rows'], 'agency');
            $agencyNames = AgencyTable::factory()->getAgencyNames($agency_uids);

            foreach ($res['rows'] as $key => &$val) {
                if (in_array($val['uid'], $ids)) {
                    if (empty($val['edit_time'])) {
                        $val['edit_time'] = $val['create_time'];
                    }
                    $val['edit_time'] = date("Y-m-d", $val['edit_time']);
                    $val['agency'] = $agencyNames[$val['agency']];
                    $rows['rows'][] = $val;
                }
            }
        }
        $rows['total'] = count($rows['rows']);
        $rows['rows'] = array_slice($rows['rows'], $offset, $limit);
        return $rows;
    }

    /**
     * 保存广告主信息
     * @param array $params
     * @return boolean
     */
    public function doSaveClient($params)
    {
        $table = new ClientTable();
        // use table-fields, need params-key as same as table-field
        $fields = $table->getFields();
        $data = array_intersect_key($params, $fields);

        $user = UserModel::factory()->getCurrentUid();

        if (isset($data['duty_user']))
            unset($data['duty_user']);

        if (isset($data['uid']) && !empty($data['uid'])) {
            $row = $this->getClientInfo($data['uid']);

            $data['edit_user'] = $user;
            $data['edit_time'] = time();
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
            return array(1, '操作成功。');
        }
        return array(0, '可能网络问题导致失败，请稍后重试。');
    }

    /**
     * 获得client详细
     * @param string $uid
     * @return array
     */
    public function getClientInfo($uid)
    {
        if (empty($uid)) {
            return array(false, '参数错误。');
        }
        $table = new ClientTable();
        $row = $table->getRow(array('uid' => $uid));
        if (empty($row)) {
            return array(false, 'uid有误，数据不存在。');
        }
        return $row;
    }

    /**
     * 删除广告主信息
     * @param unknown $uids
     * @return multitype:boolean string
     */
    public function doDelClient($uids)
    {
        if (empty($uids)) {
            return array(false, '参数错误。');
        }
        if (!is_array($uids)) $uids = array($uids);

        $user = UserModel::factory()->getCurrentUid();
        $table = new ClientTable();
        $set = array(
            'is_deleted' => 1,
            'edit_user' => $user,
            'edit_time' => time(),
        );
        $res = $table->update($set, array('uid' => $uids));
        if ($res) {
            return array(1, '操作成功。');
        }
        return array(0, '可能网络问题导致失败，请稍后重试。');
    }

    public static function getMenu($uid = "")
    {
        $categoryTbl = new ClientTable();
        $res = array();
        $data = $categoryTbl->getList();
        $ids = (new UserModel())->GetUserClient($uid);
        if ($data) {
            //降序排序
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($data as $val) {
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

    public static function getMenuWithAgency($uid = "")
    {
        $categoryTbl = new ClientTable();
        $res = array();
        $data = $categoryTbl->getList();
        $ids = (new UserModel())->GetUserClient($uid);
        if ($data) {
            //降序排序
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($data as $val) {
                if ($uid) {
                    if (in_array($val['uid'], $ids)) {
                        $res[$val['uid']] = $val['agency'];
                    }
                } else {
                    $res[$val['uid']] = $val['agency'];
                }
            }
        }
        return $res;
    }

    public static function getMenuAgency($uid = "")
    {
        $categoryTbl = new AgencyTable();
        $res = array();

        $data = $categoryTbl->getList();
        $ids = (new UserModel())->GetUserAgency($uid);

        if ($data) {
            //降序排序
            ArrayHandle::SortTwoDimensionArrayByKey($data, 'create_time');
            foreach ($data as $val) {
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

    public function isAgencyValid(&$arr)
    {
        $table = new AgencyTable();
        $uid = isset($arr['uid']) ? $arr['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $agency = $table->getRow("name = '{$arr['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($agency)) {
            $arr['error']['name'] = "代理商名称重复";
        }
        return !count($arr['error']);
    }

    public function isValid(&$arr)
    {
        // check params
//         if ( empty($data['name']) || empty($data['url']) || empty($data['linkman']) || empty($data['tel'])
//             || empty($data['commission']) ){
//             return array(0, '广告主名称，广告主网址，联系人、电话、服务费费率，不能为空请确认。');
//         }

        $arr['error'] = array();

        if (empty($arr['name'])) {
            $arr['error']['name'] = "请输入广告主名称！";
        }

        if ($arr['category'] == "二级分类" || $arr['category'] == "请选择") {
            $arr['error']['category'] = "请选择媒体所属分类！";
        }

        //广告主网址验证
        if (empty($arr['url']) || !$this->check_url($arr['url'])) {
            $arr['error']['url'] = "广告主网址不合法！";
        }

        $uid = isset($arr['uid']) ? $arr['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $material = (new ClientTable())->getRow("name = '{$arr['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        //验证重名
        if (!empty($material)) {
            $arr['error']['name'] = "广告主名称已存在！";
        }
        return !count($arr['error']);
    }

    /**
     * 获取当前账户今日余额信息
     */
    public function getCurrentClientAccount()
    {
        $user_id = UserModel::factory()->getCurrentUid();

        return ClientTable::factory()->queryRow("SELECT 
                                                  IFNULL(co.name,'') as `name`,
                                                  IFNULL(
                                                    (SELECT 
                                                      round(SUM(rd.`income`),2)
                                                    FROM
                                                      reports_alliance_hourly AS rd,
                                                      `ad_creative` AS cd 
                                                    WHERE cd.id = rd.creative_id 
                                                      AND cd.`create_user` = '{$user_id}' 
                                                      AND rd.`date` >= DATE_FORMAT(NOW(), '%Y%m%d') 
                                                      AND rd.`date` < DATE_FORMAT(
                                                        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
                                                        '%Y%m%d'
                                                      ) 
                                                    GROUP BY cd.`create_user`),
                                                    0
                                                  ) AS today_spend_budget,
                                                  (SELECT 
                                                    IFNULL(truncate(SUM(charge_money),2), 0) 
                                                  FROM
                                                    `charge_log` 
                                                  WHERE `client` = '{$user_id}') - 
                                                  (SELECT 
                                                    IFNULL(truncate(SUM(income),2), 0)
                                                  FROM
                                                    `reports_alliance_hourly` AS h 
                                                    INNER JOIN ad_creative AS c 
                                                      ON h.creative_id = c.id 
                                                      AND c.create_user = '{$user_id}') AS remain_budget 
                                                FROM
                                                  `user` AS u LEFT JOIN `corporation` AS co
                                                  ON u.`corporation_id` = co.id
                                                WHERE u.uid = '{$user_id}' 
                                                GROUP BY u.uid ");
    }
}
