<?php
namespace Application\Model;

use Application\Table\CompanyTable;

class CompanyModel
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
     * 获取所有分类数据
     */
    public function getAllCompany()
    {
        $CompanyTbl = new ClientCompanyTable();
        return $CompanyTbl->getAllCompany();
    }

    /**
     * 根据uid获取分类
     * 
     * @param $uid
     */
    public function getByUid($uid)
    {
        $table = new CompanyTable();
        return $item = $table->getRow(array(
            'uid' => $uid
        ));
    }
    
    public function getCompany($uid)
    {
        $table = new CompanyTable();
        $this->items = $table->getRow(array(
            'uid' => $uid
        ));
    }

    /**
     * 根据uid数组获取分类
     * 
     * @param $uid
     */
    public function getByUidArr($uidArr)
    {
        $table = new MediaClassTable();
        return $item = $table->getListByUids($uidArr);
    }


    /**
     * 渠道名称获取渠道
     * @param $name
     */
    public function getCompanyByName($name)
    {

        $table = new CompanyTable();
        return $table->getRow(array(
            'name' => $name
        ));
    }

    /**
     * 获取列表
     */
    public function getList($formGet)
    {
    	$powerWhere = "";
    	if ($formGet['uid']) {
    		$powerWhere = " and c.create_user= '".$formGet['uid']."'";
    	}
        
        $paramArr = array(
            'tblName' => 'company as c,user as u', // 表名
            'cols' => 'c.*,u.name as create_user', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'c.name',
            ), // 搜索的字段
            'whereSql' => " and c.create_user = u.uid". $powerWhere,
            'orderBy' => '  c.create_time desc ',
            'debug' => 0
        );
        
        $table = new CompanyTable();
        $res = $table->getTableList($paramArr);
        
        // 处理时间
        if ($res['rows']) {
            $rows = $rowSub = array();
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);
                $val['type'] = $val['type'] == 'agency' ? '媒介代理商' : '内部分组';
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
     * 保存数据
     * @param $params
     * @return bool
     */
    public function doSave($params)
    {
        $colArr = array(
            'uid' => '',
            'pid' => '',
            'name' => '',
            'type' => '',
            'commision' => '',
            'linkman' => '',
        	'tel' => '',
            'create_time' => '',
            'create_user' => '',
        );
        
        $data = array_intersect_key($params, $colArr);
        $table = new CompanyTable();

        // 更新
        if (isset($data['uid']) && $data['uid']) {
            $res = $table->update($data, array(
                'uid' => $data['uid']
            ));
        } else {
        // 新加
        
        	$user = UserModel::factory()->getCurrentUid();

			$data['create_user'] =  $user ; // 获取用户,等封装
        	$data['create_time'] = time(); // 获取用户,等封装
            $data['uid'] = \Custom\Guid::factory()->create();
            
           
            $data['pid'] = UserModel::factory()->getCurrentPid();
           
            
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
    public function doDel($eidArr)
    {
    	$eid_str = implode('","',$eidArr);
    	$paramArr = array(
           'whereSql' => ' and uid  in ("'.$eid_str.'")',
        );       
        $table = new CompanyTable();

        $res = $table->deleteRow($paramArr);
        return $res ? true : false;
    }

    public static function getMenu($uid="")
    {
        $categoryTbl = new CompanyTable();
        $res = array();

        $paramArr = array(
            'tblName' => 'company', // 表名
            'cols' => '*', // 列名
            //'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'orderBy' => ' create_time desc ',
            'debug' => 0
        );
        $ids = (new UserModel())->GetUserMediaCompany($uid);
        $rows = $categoryTbl->getTableList($paramArr)['rows'];
        foreach ($rows as $val) {
            // 用户所属资源过滤
            if ($uid) {
                if (in_array($val['uid'], $ids)) {
                    $res[$val['uid']] = $val['name'];
                }
            } else {
                $res[$val['uid']] = $val['name'];
            }
        }
        return $res;
    }
    public static function getMenuMedium($uid="")
    {
        $categoryTbl = new CompanyTable();
        $res = array();

        $paramArr = array(
            'tblName' => 'medium', // 表名
            'cols' => '*', // 列名
            //'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'orderBy' => ' create_time desc ',
            'debug' => 0
        );
        $ids = (new UserModel())->GetUserMediaCompany($uid);
        $rows = $categoryTbl->getTableList($paramArr)['rows'];
        foreach ($rows as $val) {
            // 用户所属资源过滤
            if ($uid) {
                if (in_array($val['uid'], $ids)) {
                    $res[$val['uid']] = $val['name'];
                }
            } else {
                $res[$val['uid']] = $val['name'];
            }
        }
        return $res;
    }
    
    // 暂时没用
    public function setItems($arr)
    {	
    	$result=array_intersect_key($arr,$this->item);// 只是取了交集
    	$this->item = $result;	
    }

    public function isValid(&$arr)
    {
    	if (empty($arr['name'])) {
    		$arr['error'] = "请输入渠道名字！";
    		return false;
    	}
        if (strlen($arr['name']) > 50) {
            $arr['error'] = "渠道名称不可超过50各字符！";
            return false;
        }

        $uid = isset($arr['uid']) ? $arr['uid'] : '';
        $user = UserModel::factory()->getCurrentUid();
        $media = (new CompanyTable())->getRow("name = '{$arr['name']}' and create_user = '{$user}' and uid != '{$uid}' ");

        if (!empty($media)) {
            $arr['error'] = "渠道名称已存在！";
            return false;
        }

        return true;
    }
}
