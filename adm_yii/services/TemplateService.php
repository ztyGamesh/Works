<?php
namespace app\services;


use app\models\TemplateModel;

class TemplateService
{

    
    /**
     * 根据uid获取分类
     * 
     * @param $uid
     */
    public static function getByUid($uid)
    {
        $table = new TemplateModel();
        return $item = $table::getRow(array(
            'uid' => $uid
        ));
    }
    
     public static function getBySlotClass($clssStr)
    {
        $table = new TemplateModel();
        return $item = $table::getRow(array(
            'slot_class' => $clssStr
        ));
    }

    /**
     * 获取列表
     */
    public static function getList($formGet)
    {
		$paramArr = array(
            'tblName' => '`template` as t', // 表名
            'cols' => 't.*', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                't.name'
            ), // 搜索的字段
            //'whereSql' => ' and ad.order=o.uid  ',
            'orderBy' => '  t.create_time desc ',
            'debug' => 0
        );
      
        $table = new TemplateModel();
        $res = $table::getTableList($paramArr);
        
        // 处理时间
        if ($res['rows']) {
            $rows = $rowSub = array();
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);
                $user_arr = UserService::getMenu();
                $val['create_user'] =  $user_arr[$val['create_user']];
                
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
    
    public static function doSave( $params ) {
    	
    	
    	$params['code'] = $_POST['code'];
        $table = new TemplateModel();
        // use table-fields, need params-key as same as table-field
        $fields = $table::getFields();
        $data = array_intersect_key($params, $fields);

        // check params
        if ( empty($data['name']) )
        {
            return array(0, '请填写必填信息。');
        }
    
        $user = UserService::getCurrentUid();
    
        if ( isset($data['uid']) && !empty($data['uid']) ) {
        	
        	
            $data['edit_user'] = $user;
            $data['edit_time'] = time();
            
           
            
            $res = $table::updateAll($data, array('uid'=>$data['uid']));
    
        } else {
           
            $data['uid'] = Guid::factory()->create();
            $data['create_user'] = $user;
            $data['create_time'] = time();
            $res = $table::insertOne($data);
        }
        if ( $res ) {
            return array(1, '操作成功。');
        }
        return array(0, '可能网络问题导致失败，请稍后重试。');
    }

    public static function doDel( $uids ){
        $eid_str = implode('","',$uids);
    	$paramArr = array(
           'whereSql' => ' and uid  in ("'.$eid_str.'")',
        );       
        $table = new TemplateModel();

        $res = $table::deleteRow($paramArr);
        return $res ? true : false;
    }
    
    public static function getMenu()
    {
        $categoryTbl = new TemplateModel();
        $res = array();
        foreach ($categoryTbl::getList() as $val) {
        	$res[$val['uid']]  = $val['name'];
        }   
        return $res;
    }
    
    public static function getTemplateMenu()
    {
        $categoryTbl = new TemplateModel();
        $res = array();
        foreach ($categoryTbl::getList() as $val) {
        	$res[$val['uid']]  = $val['name'];
        }   
        return $res;
    }
    
    public static function getTemplateCodeMenu()
    {
        $categoryTbl = new TemplateModel();
        $res = array();
        $validTemplateId = array("5db87273-fe0f-42e2-b259-abed8c9cd5fd",
            "b0bad561-c370-44fe-bb25-2ed0f9a5a9d3",
            "b0bad561-c370-44fe-bb25-2ed0f9a5a9f2",
            "400b7843-c675-492e-b3a2-44fba4103a92",
            "400b7843-c675-492e-b3a2-54fbd5803b41"
            );
        //"54f1524c-8902-4038-8af9-3dadef8f4742","fa67b05c-a8b7-458e-a9d7-1eef77d9544b");
        //
        /*
        foreach ($categoryTbl->getList() as $val) {
        	if (!empty($val['type']) || !empty($val['scope'])) {
        		//$res[$val['type']."_".$val['scope']]  = $val['code'];
        		$res[$val['scope']]  = $val['code'];
        	}
        }   
        */
        
        // 先写死吧，只允许出三个类型的模板：app_banner, web_banner, app_splash -- meow
        foreach ($categoryTbl::getList() as $val) {
            if (in_array($val['uid'], $validTemplateId)) {
                $res[$val['scope']] = $val['code'];
            }
        }
        
        return $res;
    }

    public static function getVideoTemplateCodeMenu()
    {
        $categoryTbl = new TemplateModel();
        $res = array();
        $validTemplateId = array("54f1524c-8902-4038-8af9-3dadef8f4742","fa67b05c-a8b7-458e-a9d7-1eef77d9544b");
        // 楼上3个 这里两个视频的
        foreach ($categoryTbl::getList() as $val) {
            if (in_array($val['uid'], $validTemplateId)) {
                $res[$val['uid']] = $val['code'];
            }
        }
        return $res;
    }

    public static function getHalfTemplateCodeMenu()
    {
        $categoryTbl = new TemplateModel();
        $res = array();
        $validTemplateId = array("400b7843-c675-492e-b3a2-54fbd5602a20");
        // 楼上3个 这里两个视频的
        foreach ($categoryTbl::getList() as $val) {
            if (in_array($val['uid'], $validTemplateId)) {
                $res[$val['uid']] = $val['code'];
            }
        }
        return $res;
    }

    /**
     * 查询可用模板 报表用
     * @return array
     */
    public static function getTemplates(){
        $sql="
SELECT distinct t.name,t.uid from slot_class sc
  JOIN template t on sc.uid=t.slot_class
WHERE sc.enabled=0";

        $rows = TemplateModel::queryList($sql);
        array_walk($rows, function (&$row) {
            //todo 确认无影响，数据库直接改
            $row['name']=str_replace('模板','样式',$row['name']);
        });
        return $rows;
    }
}
