<?php

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Application\Controller;

use Application\Model\ClientModel;
use Application\Model\UserModel;
use Application\Model\BaseModel;
use Application\Model\MediaClassModel;
use Application\Model\PassportModel;

class ClientController extends BaseController
{

	private $userPower = null;// 保存登录用户权限信息

    public function __construct()
    {
        $this->userPower = PassportModel::factory()->getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly ) 
    }
    
    public function indexAction()
    {
        $this->redirect()->toUrl('/client/category');
    }

    /**
     * 客户分类管理
     */
    public function categoryAction()
    {
        if (($formGet = $this->_getGet())) {
       
            $res = ClientModel::factory()->getCategoryList($formGet);
           exit(json_encode($res));
        }
         $this->view['userPower'] =  $this->userPower;
        
        return $this->render();
    }

    /**
     * 代理商管理
     */
    public function agencyAction()
    {
        if ( ($formGet = $this->_getGet()) ){
        		$formGet['uid'] = $this->userPower['uid'];
            $res = ClientModel::factory()->getAgencyList($formGet);
            exit( json_encode($res) );
        }
          $this->view['userPower'] =  $this->userPower;
        return $this->render();
    }

    /**
     * 获取添加 客户分类 html
     */
    public function categoryaddAction()
    {
        $clientMdl = new ClientModel();
        $mainCat = $clientMdl->getMainCategory();

        $this->view['category'] = $mainCat;
        return $this->render(false, 'client/categoryadd');
    }

    /**
     * 获取编辑 客户分类 html
     */
    public function categoryeditAction()
    {
        $formGet = $this->_getGet();
        $uid = $formGet['uid'];
        
        $clientMdl = new ClientModel();
        
        $item = $clientMdl->getCategoryByUid($uid);
        if (empty($item)) {
            return $this->_sendJson(0, '数据不存在。');
        }
        
        $this->view['item'] = $item;
        $this->view['category'] = $clientMdl->getMainCategory();
        return $this->render(false, 'client/categoryedit');
    }

    /**
     * 保存 客户分类
     */
    public function categorysaveAction()
    {
        $formPost = $this->_getPost();
        // current user
        $user = UserModel::factory()->getCurrentUid();
        
        if ($formPost['uid']) {
            $formPost['edit_user'] = $user; // 获取用户,等封装
            $formPost['edit_time'] = time(); // 获取用户,等封装
        } else {
            $formPost['create_user'] = $user; // 获取用户,等封装
            $formPost['create_time'] = time(); // 获取用户,等封装
        }
        $model = new ClientModel();
        $res = $model->doSaveCategory($formPost);
        if ($res) {
            $this->_sendJson(1);
        } else {
            $this->_sendJson(array(
                0,
                '保存失败,请检查数据'
            ));
        }
        exit();
    }

    /**
     * 删除数据
     */
    public function categorydelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装
        
        $model = new ClientModel();
        // 如果当前删除的是主分类,不允许删除
        $delCatArr = $model->getCategoryByUidArr($uidArr);
        
        foreach ($delCatArr as $val) {
            if ('' == $val['pid']) {
                $this->_sendJson(0, '主分类不允许删除,请检查数据');
            }
        }
        $res = $model->doDelCategory($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '删除失败,请检查数据');
    }

    /**
     * 获取添加 html
     */
    public function agencyaddAction()
    {
        return $this->render(false, 'client/agencyadd');
    }

    /**
     * 获取编辑html
     */
    public function agencyeditAction()
    {
        $uid = $this->_getGet('uid');        
        $item = BaseModel::getModel('agency')->getRow(array(
                'uid' => $uid
            ));
        if (empty($item)) {
            return $this->_sendJson(0, '错误不存在。');
        }
        
        $this->view['item'] = $item;
        return $this->render(false, 'client/agencyedit');
    }

    /**
     * 保存
     */
    public function agencysaveAction()
    {
        $formPost = $this->_getPost();
        
        if (!$formPost['uid']) {
            $formPost['create_user'] = UserModel::factory()->getCurrentUid(); // 获取用户,等封装
            $formPost['create_time'] = time(); // 获取用户,等封装
        }
        $model = new ClientModel();
        $res = $model->doSaveAgency($formPost);
        if ($res['status'] == 1) {
            $this->_sendJson(1);
        } else {
            $this->_sendJson(0,$res['msg']);
        }
        exit();
    }

    /**
     * 删除数据
     */
    public function agencydelAction()
    {
        $uidArr = $this->_getPost('uid');
        
        $model = new ClientModel();
        $res = $model->doDelAgency($uidArr);
        if (!$res) {
            $this->_sendJson(0, '删除失败,请检查数据');
            
        }
        $this->_sendJson(1);
    }
    
    /**
     * 广告主信息管理
     */
    public function clientAction()
    {
        if (($formGet = $this->_getGet())) {
        	// 所属资源控制
        	$formGet['uid'] = $this->userPower['uid'];
            $res = ClientModel::factory()->getClientList($formGet);
            exit( json_encode($res) );
        }
         $this->view['userPower'] =  $this->userPower;
        return $this->render();
    }
    
    /**
     * 广告主添加
     */
    public function clientaddAction() {
    
    	$mediaMdl = new ClientModel();
     	
     	$agencyList = ClientModel::factory()->getAgencySelect($this->userPower['uid']);
        $categoryList = ClientModel::factory()->getCategorySelect();
        //$userList = UserModel::factory()->getInternalUserSelect();
         $userList =  UserModel::getMenu($this->userPower['uid']);
        $mediaclass_menu2 = MediaClassModel::getMenu2();//json
		
		$request = $this->getRequest();
		$formPost = $this->_getPost();
		$viewData = ['id' => $uid, 'form' => &$formPost, 'agencyList' => $agencyList,'categoryList'=>$categoryList,'userList'=>$userList,'mediaclass_menu2'=>$mediaclass_menu2];
		if (!$request->isPost()) {
			return $viewData;
        }
			      
        if (!$mediaMdl->isValid($formPost)) {
            return $viewData;
        }
       
       	// save       
        $res = $mediaMdl->doSaveClient($formPost);
	
        return  $this->redirect()->toRoute('application',array('controller'=>'client','action'=>'client'));
    }
    
    /**
     * 广告主编辑
     */
    public function clienteditAction() {
    
    	$formGet = $this->_getGet();
        $uid = $formGet['uid'];
		
        if (empty($uid)) { 
            return  $this->redirect()->toRoute('application',array('controller'=>'client','action'=>'clientadd'));
        }
       
        $mediaMdl = new ClientModel();        
        $mediaMdl->getClient($uid);
     
        if (empty($mediaMdl->items)) {
           return  $this->redirect()->toRoute('application',array('controller'=>'client','action'=>'client'));
        }
        
        $formPost = $mediaMdl->items;
      	
		$agencyList = ClientModel::factory()->getAgencySelect($this->userPower['uid']);
        $categoryList = ClientModel::factory()->getCategorySelect();
        
        $userList =  UserModel::getMenu($this->userPower['uid']);
		$mediaclass_menu2 = MediaClassModel::getMenu2();//json

		// 通过二级分类获取一级分类
		$subcategory = $mediaMdl->getCategoryByUid($formPost['category']);
		$maincategory =	$mediaMdl->getCategoryByUid($subcategory['pid']);
		
		$request = $this->getRequest();
		$viewData = ['id' => $uid, 'form' => &$formPost, 'agencyList' => $agencyList,'categoryList'=>$categoryList,'userList'=>$userList,'mediaclass_menu2'=>$mediaclass_menu2,'maincategoryname'=>$maincategory['name']];
		if (!$request->isPost()) {
			return $viewData;
        }
			      
		$formPost = $this->_getPost();
        $formPost['uid'] =  $uid;
        
        if (!$mediaMdl->isValid($formPost)) {
            return $viewData;
        }
       
       	// save       
        $res = $mediaMdl->doSaveClient($formPost);
	
        return  $this->redirect()->toRoute('application',array('controller'=>'client','action'=>'client'));
    }

    /**
     * 广告主编辑保存
     */
    public function clientsaveAction() {
        $params = $this->_getPost();
        if (empty($params)) {
            $this->_sendJson(0, '参数错误！');
        }
        $res = ClientModel::factory()->doSaveClient($params);
        $this->_sendJson($res[0], $res[1]);
    }
    /**
     * 广告主删除
     */
    public function clientdelAction() {
        $uids = $this->_getPost('uid');
        $res = ClientModel::factory()->doDelClient($uids);
        $this->_sendJson($res[0], $res[1]);
    }
    
    public function checkAddOrEditAngencyFormValidAction() {
        $formPost = $this->_getPost();
        $res = (new ClientModel)->isAgencyValid($formPost);
        return $this->_sendJson(1, '', array('res' => $res, 'error' => $formPost['error']));
    }

    public function checkAddOrEditClientFormValidAction() {
        $formPost = $this->_getPost();
        $res = (new ClientModel)->isValid($formPost);
        return $this->_sendJson(1, '', array('res' => $res, 'error' => $formPost['error']));
    }

    /**
     * 查询广告主账户余额信息
     */
    public function clientaccountAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
                return ClientModel::factory()->getCurrentClientAccount();
        });
        self::ajax_json($data);
    }
}
