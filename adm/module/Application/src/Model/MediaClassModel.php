<?php
namespace Application\Model;


use Application\Table\MediaClassTable;
use Application\Table\ClientCategoryTable;


class MediaClassModel
{
    public static function factory() {
        return new self();
    }   

    /**
     * 获取主分类数据
     */
    public function getMainCategory()
    {
        $categoryTbl = new MediaClassTable();
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
    public function getByUid($uid)
    {
        $table = new MediaClassTable();
       
        return $item = $table->getRow(array('uid' => $uid));
    }

    /**
     * 根据uid数组获取分类
     * 
     * @param $uid
     */
    public function getCategoryByUidArr($uidArr)
    {
        $table = new MediaClassTable();
        return $item = $table->getListByUids($uidArr);
    }

    /**
     * 获取列表
     */
    public function getList($formGet)
    {
        $paramArr = array(
            'tblName' => 'media_class as c', // 表名
            'cols' => 'c.*', // 列名
            'formGet' => $formGet, // limit ,offset,search,order 等变量都从这获取
            'searchCols' => array(
                'c.name',
                
            ), // 搜索的字段
          
            'orderBy' => '  c.create_time desc ',
            'debug' => 0
        );
        $table = new MediaClassTable();
        $res = $table->getTableList($paramArr);
       
        // 处理时间
        if ($res['rows']) {
            $rows = $rowSub = array();
            foreach ($res['rows'] as $val) {
                $val['create_time'] = date("Y-m-d", $val['create_time']);
                if ( $val['pid'] ){
                    $rowSub[ $val['pid'] ][] = $val;
                } else {
                    $rows[] = $val;
                }
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
    public function doSaveCategory($params)
    {
        $colArr = array(
            'uid' => '',
            'name' => '',
            'info' => '',
            'create_time' => '',
           
        );
        $data = array_intersect_key($params, $colArr);
        $table = new MediaClassTable();
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
    public function doDel($eidArr)
    {
    	$eid_str = implode(",",$eidArr);
    	$paramArr = array(
           'whereSql' => ' and uid  in ("'.$eid_str.'")',
        );
     
        $table = new MediaClassTable();
        $res = $table->deleteRow($paramArr);
        return $res ? true : false;
    }
    
//     public static function getMenu()
//     {
//         $categoryTbl = new MediaClassTable(); 
//         $res = array();
//         foreach ($categoryTbl->getList() as $val) {
//         	$res[$val['uid']]  = $val['name'];
//         }   
//         return $res;
//     }
//     
//     public static function getMenu2()
//     {
//         $categoryTbl = new MediaClassTable(); 
//         $all =  $categoryTbl->getList();
//         $res = array();
//       
//      //  	{
// //             厂商1:{品牌1_1: "型号1_1_1, 型号1_1_2", 品牌1_2: "型号1_2_1, 型号1_2_2"},
// //             厂商2:{品牌2_1: "型号2_1_1, 型号2_1_2", 品牌2_2: "型号2_2_1, 型号2_2_2"}
// //             
// //         };
//         
//         foreach ( $all as $val) {
//         	if ($val['fid'] == 0) {
//         		$ss  = array();
//         		foreach($all  as $val2 ) {
//         			if ($val['uid']  ==  $val2['fid']) {
//         				$ss[$val2['name']] =    $val2['uid'];
//         			}
//         		}
//         		
//         		$res[$val['name']] = (object)$ss;
//         	}
//         } 
//      
//       //  echo json_encode($res);  
//         return json_encode($res);
//     }
    
    public static function getMenu()
    {
    	$table = new ClientCategoryTable();
    	 
    
        $res = array();
        foreach ($table->getList() as $val) {
        	$res[$val['uid']]  = $val['name'];
        }   
        return $res;
    }
    
    public static function getMenu2()
    {
        $categoryTbl = new ClientCategoryTable(); 
        $all =  $categoryTbl->getList();
        $res = array();
      
     //  	{
//             厂商1:{品牌1_1: "型号1_1_1, 型号1_1_2", 品牌1_2: "型号1_2_1, 型号1_2_2"},
//             厂商2:{品牌2_1: "型号2_1_1, 型号2_1_2", 品牌2_2: "型号2_2_1, 型号2_2_2"}
//             
//         };
       
        foreach ( $all as $val) {
        	
        	if (empty($val['pid'])) {
        		$ss  = array();
        		foreach($all  as $val2 ) {
        			
        			if ($val['uid']  ==  $val2['pid']) {
        				$ss[$val2['name']] =    $val2['uid'];
        				
        			}
        		}
        		
        		$res[$val['name']] = (object)$ss;
        	}
        } 
      
      //  echo json_encode($res);  
      	
    
        return json_encode($res);
    }
    
}
