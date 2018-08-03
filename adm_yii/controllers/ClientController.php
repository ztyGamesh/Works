<?php
namespace app\controllers;

use app\models\AgencyModel;
use app\services\ClientService;
use app\services\UserService;
use app\services\BaseService;
use app\services\MediaClassService;
use app\services\PassportService;




class ClientController extends BaseController
{

	private $userPower = null;// 保存登录用户权限信息

    public function init()
    {
        parent::init();
        $this->userPower = PassportService::getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly )
    }
    
    public function actionIndex()
    {
        return $this->redirect('/client/category');
    }

    /**
     * 客户分类管理
     */
    public function actionCategory()
    {
        if (($formGet = $this->getGet())) {
       
            $res = ClientService::getCategoryList($formGet);
           exit(json_encode($res));
        }
         $viewData['userPower'] =  $this->userPower;
        
        return $this->render();
    }

    /**
     * 代理商管理
     */
    public function actionAgency()
    {
        if ( ($formGet = $this->getGet()) ){
        		$formGet['uid'] = $this->userPower['uid'];
            $res = ClientService::getAgencyList($formGet);
            exit( json_encode($res) );
        }

          $viewData['userPower'] =  $this->userPower;
        return $this->render();
    }

    /**
     * 获取添加 客户分类 html
     */
    public function actionCategoryadd()
    {
        $mainCat = ClientService::getMainCategory();

        $viewData['category'] = $mainCat;
        return $this->disableLayout()->render('',$viewData);
    }

    /**
     * 获取编辑 客户分类 html
     */
    public function actionCategoryedit()
    {
        $formGet = $this->getGet();
        $uid = $formGet['uid'];
        

        $item = ClientService::getCategoryByUid($uid);
        if (empty($item)) {
            return $this->jsonResponse(0, '数据不存在。');
        }
        
        $viewData['item'] = $item;
        $viewData['category'] = ClientService::getMainCategory();
        return $this->disableLayout()->render('',$viewData);
    }

    /**
     * 保存 客户分类
     */
    public function actionCategorysave()
    {
        $formPost = $this->getPost();
        // current user
        $user = UserService::getCurrentUid();
        
        if ($formPost['uid']) {
            $formPost['edit_user'] = $user; // 获取用户,等封装
            $formPost['edit_time'] = time(); // 获取用户,等封装
        } else {
            $formPost['create_user'] = $user; // 获取用户,等封装
            $formPost['create_time'] = time(); // 获取用户,等封装
        }
        $model = new ClientService();
        $res = $model::doSaveCategory($formPost);
        if ($res) {
            return $this->jsonResponse(1);
        } else {
            return $this->jsonResponse(0, '保存失败,请检查数据');
        }
        exit();
    }

    /**
     * 删除数据
     */
    public function actionCategorydel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装
        
        $model = new ClientService();
        // 如果当前删除的是主分类,不允许删除
        $delCatArr = ClientService::getCategoryByUidArr($uidArr);

        foreach ($delCatArr as $val) {
            if ('' == $val['pid']) {
                return $this->jsonResponse(0, '主分类不允许删除,请检查数据');
            }
        }
        $res = $model::doDelCategory($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    /**
     * 获取添加 html
     */
    public function actionAgencyadd()
    {
        return $this->disableLayout()->render('',$viewData);
    }

    /**
     * 获取编辑html
     */
    public function actionAgencyedit()
    {
        $uid = $this->getGet('uid');
        $item = AgencyModel::getRow(array(
                'uid' => $uid
            ));
        if (empty($item)) {
            return $this->jsonResponse(0, '错误不存在。');
        }
        
        $viewData['item'] = $item;
        return $this->disableLayout()->render('',$viewData);
    }

    /**
     * 保存
     */
    public function actionAgencysave()
    {
        $formPost = $this->getPost();
        
        if (!$formPost['uid']) {
            $formPost['create_user'] = UserService::getCurrentUid(); // 获取用户,等封装
            $formPost['create_time'] = time(); // 获取用户,等封装
        }
        $model = new ClientService();
        $res = $model::doSaveAgency($formPost);
        if ($res['status'] == 1) {
            return $this->jsonResponse(1);
        } else {
            return $this->jsonResponse(0,$res['msg']);
        }
        exit();
    }

    /**
     * 删除数据
     */
    public function actionAgencydel()
    {
        $uidArr = $this->getPost('uid');
        
        $model = new ClientService();
        $res = $model::doDelAgency($uidArr);
        if (!$res) {
            return $this->jsonResponse(0, '删除失败,请检查数据');
            
        }
        return $this->jsonResponse(1);
    }
    
    /**
     * 广告主信息管理
     */
    public function actionClient()
    {
        if (($formGet = $this->getGet())) {
        	// 所属资源控制
        	$formGet['uid'] = $this->userPower['uid'];
            $res = ClientService::getClientList($formGet);
            exit( json_encode($res) );
        }
         $viewData['userPower'] =  $this->userPower;
        return $this->render();
    }
    
    /**
     * 广告主添加
     */
    public function actionClientadd() {
     	$agencyList = ClientService::getAgencySelect($this->userPower['uid']);
        $categoryList = ClientService::getCategorySelect();
        //$userList = UserService::getInternalUserSelect();
         $userList =  UserService::getMenu($this->userPower['uid']);
        $mediaclass_menu2 = MediaClassService::getMenu2();//json
		
		$request = \Yii::$app->getRequest();
		$formPost = $this->getPost();
		$viewData = ['id' => $uid, 'form' => &$formPost, 'agencyList' => $agencyList,'categoryList'=>$categoryList,'userList'=>$userList,'mediaclass_menu2'=>$mediaclass_menu2];
		if (!$request->isPost) {
			return $this->render('',$viewData);
        }
			      
        if (!ClientService::isValid($formPost)) {
            return $this->render('',$viewData);
        }
       
       	// save       
        $res = ClientService::doSaveClient($formPost);
	
        return $this->redirect('/client/clientadd');

    }
    
    /**
     * 广告主编辑
     */
    public function actionClientedit() {
    
    	$formGet = $this->getGet();
        $uid = $formGet['uid'];
		
        if (empty($uid)) { 
            return $this->redirect('/client/clientadd');
        }
       
        $items=ClientService::getClient($uid);
     
        if (empty($items)) {
            return $this->redirect('/client/client');
        }
        
        $formPost = $items;
      	
		$agencyList = ClientService::getAgencySelect($this->userPower['uid']);
        $categoryList = ClientService::getCategorySelect();
        
        $userList =  UserService::getMenu($this->userPower['uid']);
		$mediaclass_menu2 = MediaClassService::getMenu2();//json

		// 通过二级分类获取一级分类
		$subcategory = ClientService::getCategoryByUid($formPost['category']);
		$maincategory = ClientService::getCategoryByUid($subcategory['pid']);
		
		$request = \Yii::$app->getRequest();
		$viewData = ['id' => $uid, 'form' => &$formPost, 'agencyList' => $agencyList,'categoryList'=>$categoryList,'userList'=>$userList,'mediaclass_menu2'=>$mediaclass_menu2,'maincategoryname'=>$maincategory['name']];
		if (!$request->isPost) {
            return $this->render('',$viewData);
        }
			      
		$formPost = $this->getPost();
        $formPost['uid'] =  $uid;
        
        if (!ClientService::isValid($formPost)) {
//            $this->render('',$viewData);
            return $this->render('',$viewData);
        }

       
       	// save       
        $res = ClientService::doSaveClient($formPost);
	
        return $this->redirect('/client/client');

    }

    /**
     * 广告主编辑保存
     */
    public function actionClientsave() {
        $params = $this->getPost();
        if (empty($params)) {
            return $this->jsonResponse(0, '参数错误！');
        }
        $res = ClientService::doSaveClient($params);
        return $this->jsonResponse($res[0], $res[1]);
    }
    /**
     * 广告主删除
     */
    public function actionClientdel() {
        $uids = $this->getPost('uid');
        $res = ClientService::doDelClient($uids);
        return $this->jsonResponse($res[0], $res[1]);
    }
    
    public function actionCheckAddOrEditAngencyFormValid() {
        $formPost = $this->getPost();
        $res = ClientService::isAgencyValid($formPost);
        return $this->jsonResponse(1, '', array('res' => $res, 'error' => $formPost['error']));
    }

    public function actionCheckAddOrEditClientFormValid() {
        $formPost = $this->getPost();
        $res = ClientService::isValid($formPost);
        return $this->jsonResponse(1, '', array('res' => $res, 'error' => $formPost['error']));
    }

    /**
     * 查询广告主账户余额信息
     */
    public function actionClientaccount()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
                return ClientService::getCurrentClientAccount();
        });
        return $this->jsonResponse($data);
    }
}
