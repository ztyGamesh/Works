<?php
namespace app\services;




use app\models\ClientCategoryModel;
use app\models\MediaClassModel;
use app\services\custom\Guid;

class MediaClassService
{


    /**
     * 获取主分类数据
     */
//    public static function getMainCategory()
//    {
//        $categoryTbl = new MediaClassModel();
//        return MediaClassService::getMainList();
//    }

    /**
     * 获取所有分类数据
     */
    public static function getAllCategory()
    {
        return ClientCategoryModel::getAllCategory();
    }

    /**
     * 根据uid获取分类
     * 
     * @param $uid
     */
    public static function getByUid($uid)
    {
        $table = new MediaClassModel();
       
        return $item = $table::getRow(array('uid' => $uid));
    }

    /**
     * 根据uid数组获取分类
     * 
     * @param $uid
     */
    public static function getCategoryByUidArr($uidArr)
    {
        return MediaClassModel::getListByUids($uidArr);
    }

    /**
     * 获取列表
     */
    public static function getList($formGet)
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
        $table = new MediaClassModel();
        $res = $table::getTableList($paramArr);
       
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
    public static function doSaveCategory($params)
    {
        $colArr = array(
            'uid' => '',
            'name' => '',
            'info' => '',
            'create_time' => '',
           
        );
        $data = array_intersect_key($params, $colArr);
        $table = new MediaClassModel();
        // 更新
        if (isset($data['uid']) && $data['uid']) {
            $res = $table::updateAll($data, array(
                'uid' => $data['uid']
            ));
        } else {
            $data['uid'] = Guid::factory()->create();
            $res = $table::insertOne($data);
        }
        return $res ? true : false;
    }

    /**
     * 删除数据,软删除
     * 
     * @param $uidArr
     * @return bool
     */
    public static function doDel($eidArr)
    {
    	$eid_str = implode(",",$eidArr);
    	$paramArr = array(
           'whereSql' => ' and uid  in ("'.$eid_str.'")',
        );
     
        $res = MediaClassModel::deleteRow($paramArr);
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
    	$table = new ClientCategoryModel();
    	 
    
        $res = array();
        foreach ($table::getList() as $val) {
        	$res[$val['uid']]  = $val['name'];
        }   
        return $res;
    }
    
    public static function getMenu2($encode=true)
    {
        $categoryTbl = new ClientCategoryModel();
        $all =  $categoryTbl::getList();
        $res = array();

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

        return $encode ? json_encode($res) : $res;
    }
    
}
