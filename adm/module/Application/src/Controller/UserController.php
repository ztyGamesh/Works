<?php

namespace Application\Controller;

use Application\Model\ChannelClassModel;
use Application\Model\SlotTemplateModel;
use Application\Model\UserModel;
use Application\Model\MediaModel;
use Application\Model\CompanyModel;
use Application\Model\PassportModel;
use Application\Model\AuthorityModel;
use Application\Model\BaseModel;
use Application\Model\WordModel;
use Application\Model\ClientModel;

class UserController extends BaseController
{

    private $user = null;
    private $userMdl = null;
    private $userPower = null;// 保存登录用户权限信息
    private $userPlatformRole = null;

    public function __construct()
    {
        $this->userMdl = new UserModel();
        $this->user = UserModel::factory()->getCurrentUid(); //获取用户,等封装
        $this->userPlatformRole = UserModel::factory()->getCurrentPlatformRole(); //获取用户当前登录角色

        $this->userPower = PassportModel::factory()->getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly ) 

        //  if($user)
//         {
//             $this->power = $user['power'];// 角色
//             $this->uid = $user['uid'];// 
//             $this->permission = $user['permission'];//用户表里记录的
//         }
    }

    public function indexAction()
    {
        $this->redirect()->toUrl('/user/internal');
    }

    /**
     * 广告主管理
     */
    public function clientAction()
    {
        if (($formGet = $this->_getGet())) {
//            $formGet['power'] = 'client';
//            $res = $this->userMdl->getList($formGet);
            $res = $this->userMdl->getClientList($formGet);
            exit(json_encode($res));
        }

        $this->view['userInfo'] = $this->userInfo;

        return $this->render();
    }

    /**
     * 获取添加 客户 html
     */
    public function clientaddAction()
    {
        $this->view['agenceList'] = $this->userMdl->getAgencySelect();


        $this->view['clientList'] = $this->userMdl->getClientSelect();
        return $this->render(false, 'user/clientadd');
    }

    /**
     * 获取编辑 客户 html
     */
    public function clienteditAction()
    {
        $uid = $this->_getGet('uid');
        $item = $this->userMdl->getUserByUid($uid);
        if (empty($item)) {
            return $this->_sendJson(0, '数据不存在。');
        }
        $this->view['clientList'] = $this->userMdl->getClientSelect();
        $this->view['item'] = $item;
        return $this->render(false, 'user/clientedit');
    }

    /**
     * 保存 客户
     */
    public function clientsaveAction()
    {
        $formPost = $this->_getPost();

        if ($formPost['power'] == 'client') {
            $formPost['pid'] = $formPost['pid_client'];
        } else {
            $formPost['pid'] = $formPost['pid_agency'];
        }
        $res = $this->userMdl->doCheckSave($formPost);
        if (!$res['status']) {
            $this->_sendJson(0, $res['msg']);
        }
        $res = $this->userMdl->doSave($res['data']);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '保存失败,请检查数据');
    }

    /**
     * 删除数据
     */
    public function clientdelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid'];
        $res = $this->userMdl->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        } else {
            $this->_sendJson(array(
                0, '删除失败,请检查数据'
            ));
        }
        exit;
    }

    /* 内部用户 */

    /**
     * 内部用户管理
     */
    public function internalAction()
    {
        if (($formGet = $this->_getGet())) {
            $formGet['internal'] = 1;
            $res = $this->userMdl->getList($formGet);
            exit(json_encode($res));
        }
        $this->view['userPower'] = $this->userPower;
        return $this->render();
    }

    /**
     * 获取添加 用户 html
     */
    public function internaladdAction()
    {
        $this->view['clientList'] = $this->userMdl->getClientSelect();
        $this->view['powerList'] = $this->userMdl->getInternalAddConf();
        return $this->render(false, 'user/internaladd');
    }

    /**
     * 获取编辑 用户 html
     */
    public function internaleditAction()
    {
        $uid = $this->_getGet('uid');
        $item = $this->userMdl->getUserByUid($uid);
        if (empty($item)) {
            return $this->_sendJson(0, '数据不存在。');
        }
        $this->view['clientList'] = $this->userMdl->getClientSelect();
        $this->view['powerList'] = $this->userMdl->getInternalAddConf();

        $this->view['item'] = $item;
        return $this->render(false, 'user/internaledit');
    }

    /**
     * 保存 用户
     */
    public function internalsaveAction()
    {
        $formPost = $this->_getPost();

        $formPost['internal'] = 1;

        $res = $this->userMdl->doCheckSave($formPost);
        if (!$res['status']) {
            $this->_sendJson(0, $res['msg']);
        }
        $res = $this->userMdl->doSave($res['data']);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '保存失败,请检查数据');
    }

    /**
     * 删除数据
     */
    public function internaldelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid'];
        $res = $this->userMdl->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(array(
            0, '删除失败,请检查数据'
        ));
    }

    /* 代理商 */

    /**
     * 代理商管理
     */
    public function agencyAction()
    {
        if (($formGet = $this->_getGet())) {
//            $formGet['power'] = 'agency';
            $res = $this->userMdl->getAgencyList($formGet);
            exit(json_encode($res));
        }
        return $this->render();
    }

    /**
     * 添加&编辑 代理商 html
     */
    public function agencyeditAction()
    {
        if (($uid = $this->_getGet('uid'))) {
            $item = $this->userMdl->getUserByUid($uid);
            if (empty($item)) {
                return $this->_sendJson(0, '数据不存在。');
            }
            $this->view['item'] = $item;
        }

        $this->view['agencyList'] = $this->userMdl->getAgencySelect();
        return $this->render(false, 'user/agencyedit');
    }

    /**
     * 保存 代理商
     */
    public function agencysaveAction()
    {
        $formPost = $this->_getPost();
        $formPost['power'] = 'agency';

        $res = $this->userMdl->doCheckSave($formPost);
        if (!$res['status']) {
            $this->_sendJson(0, $res['msg']);
        }
        $res = $this->userMdl->doSave($res['data']);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '保存失败,请检查数据');
    }

    /**
     * 删除数据
     */
    public function agencydelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid'];
        $res = $this->userMdl->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(array(
            0, '删除失败,请检查数据'
        ));
    }

    /**
     * 媒体用户管理
     */
    public function siteAction()
    {
        if (($formGet = $this->_getGet())) {
            $formGet['uid'] = $this->user;
            $res = $this->userMdl->getSiteList($formGet);
            exit(json_encode($res));
        }
        $this->view['userPower'] = $this->userPower;
        return $this->render();
    }

    /**
     * 添加&编辑媒体用户
     */
    public function siteeditAction()
    {

        if (($uid = $this->_getGet('uid'))) {
            $item = $this->userMdl->getUserByUid($uid);
            if (empty($item)) {
                return $this->_sendJson(0, '数据不存在。');
            }
            $this->view['item'] = $item;
        }

        if ($item['power'] != 'company') {
            $this->view['siteList'] = MediaModel::getMenu();
        } else {
            $this->view['siteList'] = CompanyModel::getMenu();
        }
        return $this->render(false, 'user/siteedit');
    }

    public function siteaddAction()
    {
        $u = new UserModel();
        //$this->view['siteList'] =  $u->getSiteSelect();

        $this->view['siteList'] = MediaModel::getMenu();
        $this->view['companyList'] = MediaModel::getMediaCompany();
        return $this->render(false, 'user/siteadd');
    }

    /**
     * 保存媒体用户
     */
    public function sitesaveAction()
    {
        $formPost = $this->_getPost();

        if ($formPost['uid']) {//更新直接取uid

        } else {

            if ($formPost['power'] == 'media') {
                $formPost['pid'] = $formPost['pid_media'];
            } else {
                $formPost['pid'] = $formPost['pid_company'];
            }
        }

        $res = $this->userMdl->doCheckSave($formPost);
        if (!$res['status']) {
            $this->_sendJson(0, $res['msg']);
        }
        $res = $this->userMdl->doSave($res['data']);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '保存失败,请检查数据');
    }

    /**
     * 媒体用户删除
     */
    public function sitedelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid'];
        $res = $this->userMdl->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '删除失败,请检查数据');
    }

    /**
     * 账户信息
     */
    public function userinfoAction()
    {
        $userid = UserModel::factory()->getCurrentUid();
        $this->view['user'] = $user = UserModel::factory()->getUserByUid($userid);
        $this->view['clientList'] = UserModel::factory()->getUserClients($user);
        $this->view['powerSelect'] = UserModel::factory()->getPowerSelect($user['power']);
        $this->view['permissionSelect'] = UserModel::factory()->getPermissionSelect($user['permission']);
        return $this->render(false, 'user/userinfo');
    }

    /**
     * 修改个人密码
     */
    public function modifypwdAction()
    {
        $user = UserModel::factory()->getCurrentUser();
        if (($formPost = $this->_getPost())) {
            // do modify
            $res = UserModel::factory()->doModifyPasswd($formPost, $user['uid']);
            $this->_sendJson($res[0], $res[1]);
        }

        $this->view['user'] = $user;
        return $this->render(false, 'user/modifypwd');
    }

    /**
     * 权限列表页面
     * @return \Zend\View\Model\ViewModel
     */
    public function userpermissionviewAction()
    {
        $this->view['user_id'] = $this->user;
        return $this->render();
    }

    /**
     * 获取用户下属子用户
     */
    public function childuserAction()
    {
        $formGet = $this->_getGet();
        $data = $this->userMdl->getChildUser($formGet);
        exit(json_encode($data));
        //return $data ? $this->_sendJson(1,'' , $data) : $this->_sendJson(0, '');
    }

    /**
     * 更改用户状态
     */
    public function changeuserstatusAction()
    {
        $uid = $this->_getPost('uid');
        $status = $this->_getPost('val');
        $data = $this->userMdl->changeUserStatus($uid, $status);
        return $data ? $this->_sendJson(1, '', $data) : $this->_sendJson(0, '');
    }

    /**
     * 查看用户 view接口
     * @return \Zend\View\Model\ViewModel
     */
    public function userviewAction()
    {
        return $this->render(false);
    }

    public function adduserviewAction()
    {
        $this->view['parent_id'] = $this->user;
        $this->view['parent_info'] = $this->userMdl->userdetail($this->user);
        return $this->render();
    }

    /**
     * 添加用户
     */
    public function adduserAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return UserModel::factory()->SaveMediaUser($params);
        });
        self::ajax_json($data);
    }

    /**
     * 广告主账户添加数据接口
     */
    public function addclientuserAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return UserModel::factory()->SaveClientUser($params);
        });
        self::ajax_json($data);
    }

    /**
     * 广告主账户添加界面
     * @return \Zend\View\Model\ViewModel
     */
    public function addclientuserviewAction()
    {
        return $this->render();
    }

    /**
     * 冻结广告主账户数据接口
     */
    public function updateclientuserstatusAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return UserModel::factory()->UpdateClientUser($params['ids'], $params['status']);
        });
        self::ajax_json($data);
    }

    /**
     * 更新广告主页面
     * @return \Zend\View\Model\ViewModel
     */
    public function updateclientuserviewAction()
    {
        return $this->render();
    }

    /**
     * 广告主账户管理列表界面
     * @return \Zend\View\Model\ViewModel
     */
    public function clientuserlistviewAction()
    {
        return $this->render();
    }

    /**
     * 广告主账户管理列表数据接口
     */
    public function clientuserlistAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return UserModel::factory()->ClientUserList($params);
        });
        self::ajax_json($data);
    }

    /**
     * 更新用户
     */
    public function updateuserAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return UserModel::factory()->SaveMediaUser($params);
        });
        self::ajax_json($data);
    }

    /**
     * 更新用户 view接口
     */
    public function updateuserviewAction()
    {
        $this->view['parent_id'] = $this->user;
        $this->view['current_uid'] = $this->_getGet('uid');
//        $this->view['current_info'] = $this->userMdl->userdetail( $this->_getGet('uid'));
//        $this->view['parent_info'] = $this->userMdl->userdetail($this->user);
        return $this->render();
    }

    /**
     * 广告主用户查看界面
     * @return \Zend\View\Model\ViewModel
     */
    public function clientuserviewAction()
    {
        return $this->render(false);
    }

    /**
     * 用户信息接口
     */
    public function userdetailAction()
    {
        $uid = $this->_getGet('uid');
        $data = $this->userMdl->userdetail($uid);
        return $data ? $this->_sendJson(1, '', $data) : $this->_sendJson(0, '');
    }

    /**
     * 导航栏树形结构
     */
    public function navigationtreeAction()
    {
        $data = UserModel::NavigationTree();
        return $data ? $this->_sendJson(1, '', $data) : $this->_sendJson(0, '');
    }

    public function getcurrentuserauthorityAction()
    {
        $data = AuthorityModel::GetUserRoleAuthority($this->user);
        $user = PassportModel::factory()->getLoginUser();
        return $data ? exit(json_encode(['status' => 1, 'msg' => '', 'data' => $data, 'user' => $user])) : $this->_sendJson(0, '');
    }

    /**
     * 获取频道分类
     */
    public function getchannelclassAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return ChannelClassModel::factory()->GetList();
        });
        self::ajax_json($data);
    }

    /**
     * 获取频道分类 (格式化 id name child)
     */
    public function getchannelclassformattedAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return ChannelClassModel::factory()->GetFormattedList();
        });
        self::ajax_json($data);
    }

    public function checkEmailDuplicatedAction()
    {
        $formGet = $this->_getGet();
        $data = UserModel::checkEmailDuplicated($formGet['mail']);
        return $data ? $this->_sendJson(1, '', $data) : $this->_sendJson(0, '');
    }

    /**
     * 当前角色下广告位类型
     */
    public function currentroleslotclassAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return UserModel::factory()->CurrentRoleSlotClass();
        });
        self::ajax_json($data);
    }

    /**
     * 模板调价界面
     */
    public function templateprofitrateviewAction()
    {
        return $this->render();
    }

    /**
     * 模板调价数据接口
     */
    public function templateprofitrateAction()
    {
        $params = $this->_getGet();
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return SlotTemplateModel::factory()->FetchTemplateProfitRateAndPrice($params);
        });
        return self::ajax_json($data);
    }

    /**
     * 保存模板价格接口
     */
    public function savetemplateprofitrateAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            foreach ($params as $item) {
                SlotTemplateModel::factory()->SaveTemplateProfitRateAndPrice($item);
            }
            return true;
        });
        self::ajax_json($data);
    }

    public function clientmenuAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function (){
            return ClientModel::getMenu(UserModel::factory()->getCurrentUid());
        });
        return self::ajax_json($data);
    }

    /**
     * 媒体账户页面
     * @return \Zend\View\Model\ViewModel
     */
    public function mediaaccountviewAction()
    {
        return $this->render();
    }

    /**
     * 媒体查看自己账户信息接口
     * @return array
     */
    public function mediaaccountAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function (){
            return UserModel::factory()->mediaaccountdetail();
        });
        return self::ajax_json($data);
    }

    public function testAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
           return WordModel::factory()->RepeatSplitExistsWord();
        });
        return self::ajax_json($data);
    }

}
