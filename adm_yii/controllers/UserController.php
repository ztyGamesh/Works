<?php

namespace app\controllers;

use app\services\AuthorityService;
use app\services\BaseService;
use app\services\ChannelClassService;
use app\services\ClientService;
use app\services\PassportService;
use app\services\SlotService;
use app\services\SlotTemplateService;
use app\services\UserService;
use app\services\WordService;

class UserController extends BaseController
{

    private $user = null;
    private $userMdl = null;
    private $userPower = null;// 保存登录用户权限信息
    private $userPlatformRole = null;

    public function init()
    {
        parent::init();
        $this->user = UserService::getCurrentUid(); //获取用户,等封装
        \Yii::info($this->user,UserController::className());
        $this->userPlatformRole = UserService::getCurrentPlatformRole(); //获取用户当前登录角色
        $this->userPower = PassportService::getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly )
    }

    public function actionIndex()
    {
//        $this->redirect()->toUrl('/user/internal');
        return $this->redirect('/user/internal');
    }

    /**
     * 广告主管理
     */
    public function actionClient()
    {
        if (($formGet = $this->getGet())) {
//            $formGet['power'] = 'client';
//            $res = $this->userMdl->getList($formGet);
            $res = UserService::getClientList($formGet);
            exit(json_encode($res));
        }

        $this->view['userInfo'] = $this->userInfo;

        return $this->render();
    }

    /**
     * 获取添加 客户 html
     */
    public function actionClientadd()
    {
        $this->view['agenceList'] = UserService::getAgencySelect();


        $this->view['clientList'] = UserService::getClientSelect();
        return $this->render();
    }

    /**
     * 获取编辑 客户 html
     */
    public function actionClientedit()
    {
        $uid = $this->getGet('uid');
        $item = UserService::getUserByUid($uid);
        if (empty($item)) {
            return $this->jsonResponse(0, '数据不存在。');
        }
        $this->view['clientList'] = UserService::getClientSelect();
        $this->view['item'] = $item;
        return $this->render();
    }

    /**
     * 保存 客户
     */
    public function actionClientsave()
    {
        $formPost = $this->getPost();

        if ($formPost['power'] == 'client') {
            $formPost['pid'] = $formPost['pid_client'];
        } else {
            $formPost['pid'] = $formPost['pid_agency'];
        }
        $res = UserService::doCheckSave($formPost);
        if (!$res['status']) {
            return $this->jsonResponse(0, $res['msg']);
        }
        $res = UserService::doSave($res['data']);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '保存失败,请检查数据');
    }

    /**
     * 删除数据
     */
    public function actionClientdel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid'];
        $res = UserService::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        } else {
            return $this->jsonResponse(0, '删除失败,请检查数据');
        }
        exit;
    }

    /* 内部用户 */

    /**
     * 内部用户管理
     */
    public function actionInternal()
    {
        if (($formGet = $this->getGet())) {
            $formGet['internal'] = 1;
            $res = UserService::getList($formGet);
            exit(json_encode($res));
        }
        $this->view['userPower'] = $this->userPower;
        return $this->render();
    }

    /**
     * 获取添加 用户 html
     */
    public function actionInternaladd()
    {
        $this->view['clientList'] = UserService::getClientSelect();
        $this->view['powerList'] = UserService::getInternalAddConf();
        return $this->render();
    }

    /**
     * 获取编辑 用户 html
     */
    public function actionInternaledit()
    {
        $uid = $this->getGet('uid');
        $item = UserService::getUserByUid($uid);
        if (empty($item)) {
            return $this->jsonResponse(0, '数据不存在。');
        }
        $this->view['clientList'] = UserService::getClientSelect();
        $this->view['powerList'] = UserService::getInternalAddConf();

        $this->view['item'] = $item;
        return $this->render();
    }

    /**
     * 保存 用户
     */
    public function actionInternalsave()
    {
        $formPost = $this->getPost();

        $formPost['internal'] = 1;

        $res = UserService::doCheckSave($formPost);
        if (!$res['status']) {
            return $this->jsonResponse(0, $res['msg']);
        }
        $res = UserService::doSave($res['data']);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '保存失败,请检查数据');
    }

    /**
     * 删除数据
     */
    public function actionInternaldel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid'];
        $res = UserService::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    /* 代理商 */

    /**
     * 代理商管理
     */
    public function actionAgency()
    {
        if (($formGet = $this->getGet())) {
//            $formGet['power'] = 'agency';
            $res = UserService::getAgencyList($formGet);
            exit(json_encode($res));
        }
        return $this->render();
    }

    /**
     * 添加&编辑 代理商 html
     */
    public function actionAgencyedit()
    {
        if (($uid = $this->getGet('uid'))) {
            $item = UserService::getUserByUid($uid);
            if (empty($item)) {
                return $this->jsonResponse(0, '数据不存在。');
            }
            $this->view['item'] = $item;
        }

        $this->view['agencyList'] = UserService::getAgencySelect();
        return $this->render();
    }

    /**
     * 保存 代理商
     */
    public function actionAgencysave()
    {
        $formPost = $this->getPost();
        $formPost['power'] = 'agency';

        $res = UserService::doCheckSave($formPost);
        if (!$res['status']) {
            return $this->jsonResponse(0, $res['msg']);
        }
        $res = UserService::doSave($res['data']);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '保存失败,请检查数据');
    }

    /**
     * 删除数据
     */
    public function actionAgencydel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid'];
        $res = UserService::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    /**
     * 媒体用户管理
     */
    public function actionSite()
    {
        if (($formGet = $this->getGet())) {
            $formGet['uid'] = $this->user;
            $res = UserService::getSiteList($formGet);
            exit(json_encode($res));
        }
        $this->view['userPower'] = $this->userPower;
        return $this->render();
    }

    /**
     * 添加&编辑媒体用户
     */
    public function actionSiteedit()
    {

        if (($uid = $this->getGet('uid'))) {
            $item = UserService::getUserByUid($uid);
            if (empty($item)) {
                return $this->jsonResponse(0, '数据不存在。');
            }
            $this->view['item'] = $item;
        }

        if ($item['power'] != 'company') {
            $this->view['siteList'] = MediaService::getMenu();
        } else {
            $this->view['siteList'] = CompanyService::getMenu();
        }
        return $this->render();
    }

    public function actionSiteadd()
    {
        $u = new UserService();
        //$this->view['siteList'] =  $u->getSiteSelect();

        $this->view['siteList'] = MediaService::getMenu();
        $this->view['companyList'] = MediaService::getMediaCompany();
        return $this->render();
    }

    /**
     * 保存媒体用户
     */
    public function actionSitesave()
    {
        $formPost = $this->getPost();

        if ($formPost['uid']) {//更新直接取uid

        } else {

            if ($formPost['power'] == 'media') {
                $formPost['pid'] = $formPost['pid_media'];
            } else {
                $formPost['pid'] = $formPost['pid_company'];
            }
        }

        $res = UserService::doCheckSave($formPost);
        if (!$res['status']) {
            return $this->jsonResponse(0, $res['msg']);
        }
        $res = UserService::doSave($res['data']);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '保存失败,请检查数据');
    }

    /**
     * 媒体用户删除
     */
    public function actionSitedel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid'];
        $res = UserService::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    /**
     * 账户信息
     */
    public function actionUserinfo()
    {
        $userid = UserService::getCurrentUid();
        $this->view['user'] = $user = UserService::getUserByUid($userid);
        $this->view['clientList'] = UserService::getUserClients($user);
        $this->view['powerSelect'] = UserService::getPowerSelect($user['power']);
        $this->view['permissionSelect'] = UserService::getPermissionSelect($user['permission']);
        return $this->render();
    }

    /**
     * 修改个人密码
     */
    public function actionModifypwd()
    {
        $user = UserService::getCurrentUser();
        if (($formPost = $this->getPost())) {
            // do modify
            $res = UserService::doModifyPasswd($formPost, $user['uid']);
            return $this->jsonResponse($res[0], $res[1]);
        }

        $this->view['user'] = $user;
        return $this->render();
    }

    /**
     * 权限列表页面
     *
     */
    public function actionUserpermissionview()
    {
        $this->view['user_id'] = $this->user;
        return $this->render();
    }

    /**
     * 获取用户下属子用户
     */
    public function actionChilduser()
    {
        $formGet = $this->getGet();
        $data = UserService::getChildUser($formGet);
        exit(json_encode($data));
        //return $data ? $this->_jsonResponse(1,'' , $data) : $this->_jsonResponse(0, '');
    }

    /**
     * 更改用户状态
     */
    public function actionChangeuserstatus()
    {
        $uid = $this->getPost('uid');
        $status = $this->getPost('val');
        $data = UserService::changeUserStatus($uid, $status);
        return $data ? $this->jsonResponse(1, '', $data) : $this->jsonResponse(0, '');
    }

    /**
     * 查看用户 view接口
     *
     */
    public function actionUserview()
    {
        return $this->disableLayout()->render();
    }

    public function actionAdduserview()
    {
        $this->view['parent_id'] = $this->user;
        $this->view['parent_info'] = UserService::userdetail($this->user);
        return $this->render();
    }

    /**
     * 添加媒体用户
     */
    public function actionAdduser()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return UserService::SaveMediaUser($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 广告主账户添加数据接口
     */
    public function actionAddclientuser()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return UserService::SaveClientUser($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 广告主账户添加界面
     *
     */
    public function actionAddclientuserview()
    {
        return $this->render();
    }

    /**
     * 冻结广告主账户数据接口
     */
    public function actionUpdateclientuserstatus()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return UserService::UpdateClientUser($params['ids'], $params['status']);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 更新广告主页面
     *
     */
    public function actionUpdateclientuserview()
    {
        return $this->render();
    }

    /**
     * 广告主账户管理列表界面
     *
     */
    public function actionClientuserlistview()
    {
        return $this->render();
    }

    /**
     * 广告主账户管理列表数据接口
     */
    public function actionClientuserlist()
    {
        $params = $this->getGet();
        $data = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return UserService::ClientUserList($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 更新用户
     */
    public function actionUpdateuser()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return UserService::SaveMediaUser($params);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 更新用户 view接口
     */
    public function actionUpdateuserview()
    {
        $this->view['parent_id'] = $this->user;
        $this->view['current_uid'] = $this->getGet('uid');
//        $this->view['current_info'] = $this->userMdl->userdetail( $this->_getGet('uid'));
//        $this->view['parent_info'] = $this->userMdl->userdetail($this->user);
        return $this->render();
    }

    /**
     * 广告主用户查看界面
     *
     */
    public function actionClientuserview()
    {
        return $this->disableLayout()->render();
    }

    /**
     * 用户信息接口
     */
    public function actionUserdetail()
    {
        $uid = $this->getGet('uid');
        $data = UserService::userdetail($uid);
        return $data ? $this->jsonResponse(1, '', $data) : $this->jsonResponse(0, '');
    }

    /**
     * 导航栏树形结构
     */
    public function actionNavigationtree()
    {
        $data = UserService::NavigationTree();
        return $data ? $this->jsonResponse(1, '', $data) : $this->jsonResponse(0, '');
    }

    public function actionGetcurrentuserauthority()
    {
        $data = AuthorityService::GetUserRoleAuthority($this->user);
        $user = PassportService::getLoginUser();
        return $data ? exit(json_encode(['status' => 1, 'msg' => '', 'data' => $data, 'user' => $user],JSON_UNESCAPED_UNICODE)) : $this->jsonResponse(0, '');
    }

    /**
     * 获取频道分类
     */
    public function actionGetchannelclass()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ChannelClassService::GetList();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 获取频道分类 (格式化 id name child)
     */
    public function actionGetchannelclassformatted()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return ChannelClassService::GetFormattedList();
        });
        return $this->jsonResponse($data);
    }

    public function actionCheckEmailDuplicated()
    {
        $formGet = $this->getGet();
        $data = UserService::checkEmailDuplicated($formGet['mail']);
        return $data ? $this->jsonResponse(1, '', $data) : $this->jsonResponse(0, '');
    }

    /**
     * 当前角色下广告位类型
     */
    public function actionCurrentroleslotclass()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return UserService::CurrentRoleSlotClass();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 模板调价界面
     */
    public function actionTemplateprofitrateview()
    {
        return $this->redirect('/slot/slotPriceView');
    }


    public function actionClientmenu()
    {
        $data = BaseService::ExecuteWithoutTransaction(function (){
            return ClientService::getMenu(UserService::getCurrentUid());
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体账户页面
     *
     */
    public function actionMediaaccountview()
    {
        return $this->render();
    }

    /**
     * 媒体查看自己账户信息接口
     * @return array
     */
    public function actionMediaaccount()
    {
        $data = BaseService::ExecuteWithoutTransaction(function (){
            return UserService::mediaaccountdetail();
        });
        return $this->jsonResponse($data);
    }

    public function actionTest()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
           return WordService::RepeatSplitExistsWord();
        });
        return $this->jsonResponse($data);
    }

}
