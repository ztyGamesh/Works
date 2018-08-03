<?php


namespace app\controllers;

use app\models\MediaModel;
use app\services\ClientService;
use app\services\ConfigService;
use app\services\custom\Guid;
use app\services\MediumService;
use app\services\UserService;
use app\services\BaseService;
use app\services\MediaService;
use app\services\MediaClassService;
use app\services\CompanyService;
use app\services\SlotService;
use app\services\SlotTemplateService;
use app\services\MaterielService;
use app\services\TemplateService;
use app\services\PassportService;
use app\services\custom\ArrayHandle;
use yii\base\NotSupportedException;

class MediaController extends BaseController
{
    private $userPower = null;// 保存登录用户权限信息

    public function init()
    {
        parent::init();
        $this->userPower = PassportService::getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly )
    }

    public function actionIndex()
    {
        $this->redirect('/media/media');
    }

    //媒介渠道
    public function actionCompany()
    {
        if (($formGet = $this->getGet())) {

            // 所属资源控制
            $formGet['uid'] = $this->userPower['uid'];

            $res = CompanyService::getList($formGet);
            exit(json_encode($res));
        }

        return $this->render();
    }

    /**
     * 获取添加 客户分类 html
     */
    public function actionCompanyadd()
    {
        $formPost = $this->getPost();
        $request = \Yii::$app->getRequest();

        $viewData = ['form' => &$formPost];

        if (!$request->isPost) {
            return $this->render('', $viewData);
        }

        if (empty($formPost['name'])) {
            $formPost['error'] = "请输入渠道名称！";
            return $this->render('', $viewData);
        }

        $user = UserService::getCurrentUid();

        $formPost['create_user'] = $user; // 获取用户,等封装
        $formPost['create_time'] = time(); // 获取用户,等封装

        $model = new CompanyService();

        if (!$model::isValid($formPost)) {
            return $this->render('', $viewData);
        }

        $res = $model::doSave($formPost);

        if (!$res) {
            $formPost['error'] = $res[1];
            return $this->render('', $viewData);
        }

        return $this->redirect('/media/company');

    }

    public function actionCompanyedit()
    {
        $formGet = $this->getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect('/media/companyadd');
        }

        $companyRow = CompanyService::getCompany($uid);
        if (empty($companyRow)) {
            return $this->redirect('/media/company');
        }

        $formPost = $companyRow;

        $request = \Yii::$app->getRequest();
        $viewData = ['id' => $uid, 'form' => &$formPost];
        if (!$request->isPost) {
            return $this->render('', $viewData);
        }

        $formPost = $this->getPost();
        $formPost['uid'] = $uid;

        if (!CompanyService::isValid($formPost)) {
            return $this->render('', $viewData);
        }

        // save
        $res = CompanyService::doSave($formPost);

        return $this->redirect('/media/company');
    }

    /**
     * 删除数据
     */
    public function actionCompanydel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装


        $model = new CompanyService();

        $res = $model::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    //网站
    public function actionMedia()
    {
        if (($formGet = $this->getGet())) {
            // 所属资源控制
            $formGet['uid'] = $this->userPower['uid'];
            $res = MediaService::getMediaList($formGet);
            exit(json_encode($res));
//            return $this->jsonResponseOk($res);//todo 前端配合修改
        } else {
            return $this->render();
        }

    }

    /**
     * 获取添加 客户分类 html
     */
    public function actionMediaadd()
    {

        $mediaMdl = new MediaService();

        $mediaclass_menu = MediaClassService::getMenu();
        $mediaclass_menu2 = MediaClassService::getMenu2();//json
        //print_r(MediaClassService::getMenu2());//json);die;
        $mediacompany_menu = CompanyService::getMenu($this->userPower['uid']);
        $slotclass_menu = SlotService::getClassMenu();
        $user_menu = UserService::getMenu($this->userPower['uid']);

        $request = \Yii::$app->getRequest();
//        $formPost = $this->_getPost();
        $formPost = $this->getPost();
        $viewData = ['id' => $uid, 'form' => &$formPost, 'mediaclass_menu' => $mediaclass_menu, 'mediaclass_menu2' => $mediaclass_menu2, 'mediacompany_menu' => $mediacompany_menu, 'slotclass_menu' => $slotclass_menu, 'mst_select' => $mst_select, 'user_menu' => $user_menu];
        if (!$request->isPost) {
            return $this->render('', $viewData);
        }

        if (!$mediaMdl::isValid($formPost)) {
            return $this->jsonResponse(0, '输入数据有错误', $formPost['error']);
        }

        // save
        $res = $mediaMdl::doSave($formPost);
        return $this->jsonResponse($res);
//        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'media'));
    }

    public function actionMediaedit()
    {
        $uid = $this->get('uid');
        if (empty($uid)) {
            return $this->redirect('/media/mediaadd');
        }

        if ($this->isGet()) {
            $media = MediaService::getMedia($uid);
            if (empty($media)) {
                return $this->redirect('/media/media');
            }

            $media_menu = MediaClassService::getMenu2();//json

            $viewData = ['form' => &$media, 'mediaclass_menu2' => $media_menu];
            return $this->render('', $viewData);
        } else {
            $formPost = $this->getPost();
            $formPost['uid'] = $uid;

            if (!MediaService::isValid($formPost)) {
                return $this->jsonResponse(0, '输入数据有错误', $formPost['error']);
            }
            $res = MediaService::doSave($formPost);
            return $this->jsonResponse($res);
        }
    }


    /**
     * 保存 媒体分类
     */
    public function actionMediasave()
    {
        $formPost = $this->getPost();


        $user = UserService::getCurrentUid();

        if ($formPost['uid']) {
            //  $formPost['edit_user'] = $user; // 获取用户,等封装
//             $formPost['edit_time'] = time(); // 获取用户,等封装
        } else {
            $formPost['create_time'] = time(); // 获取用户,等封装
        }


        $model = new MediaService();
        $res = $model::doSave($formPost);
        if ($res[0] == 1) {
            return $this->jsonResponse(1);
        } else {
            return $this->jsonResponse(...$res);
        }
        exit();
    }

    /**
     * 删除数据
     */
    public function actionMediadel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装

        $model = new MediaService();
        $res = $model::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    public function actionMediainfo()
    {
        $formGet = $this->getGet();
        $uid = $formGet['uid'];

        $mediaMdl = new MediaService();

        $item = $mediaMdl::getByUid($uid);

        $viewData['item'] = $item;
        if (empty($item)) {
            return $this->jsonResponse(0, '数据不存在。');
        }
        return $this->disableLayout()->render('', $viewData);
    }

    /**
     * 查询媒体信息
     */
    public function actionFetchmediainfo()
    {
        $params = $this->getGet();
        $result = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return MediaService::getMedia($params['uid']);
        });
        return $this->jsonResponse($result);
    }

    //广告位
    public function actionSlot()
    {
        if (($formGet = $this->getGet())) {
            // 所属资源控制
            $formGet['uid'] = $this->userPower['uid'] ? $this->userPower['uid'] : "";

            $res = SlotService::getList($formGet);
            foreach ($res['rows'] as $key => $val) {

//                $res['rows'][$key]['channel_slot'] = $val['channel'] . "-" . $val['adslot'];//todo fuck
                $res['rows'][$key]['channel_slot'] = $val['channel'] . "-";
                $res['rows'][$key]['w_h'] = $val['w'] . "-" . $val['h'];
            }

            exit(json_encode($res));
        }
        $viewData['media_menu'] = MediaService::getMenu($this->userPower['uid']);
        $viewData['status_menu'] = array(

            "有效" => "有效",
            "暂停" => "暂停",
            "删除" => "删除",

        );
        $viewData['slotclass_menu'] = SlotService::getClassMenu();
        return $this->render('slot.phtml', $viewData);
    }


    public function actionSlotedit()
    {
        $formGet = $this->getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect('/media/slotadd');

        }

        $mediaMdl = new SlotService();
        $mediaMdl::getSlot($uid);
        if (empty($mediaMdl::items)) {
            return $this->redirect('/media/slot');

        }

        $formPost = $mediaMdl::items;

        $mMdl = new MediaService();
        $item2 = $mMdl::getByUid($formPost['media']);
        //$this->view['item'] = $item;

        switch ($item2['type']) {
            case 1:
                $media_type_select = "网站/应用";
                break;
            case 2:
                $media_type_select = "网站";
                break;
            case 3:
                $media_type_select = "应用";
                break;
            default:
                $media_type_select = "未知";
        }

        $media_type = MediaService::getMenuType();
        //$this->view['media_type'] = $item2['type'];
        $media_menu = MediaService::getMenu($this->userPower['uid']);


        $mediaclass_menu = MediaClassService::getMenu();
        $user_menu = UserService::getMenu($this->userPower['uid']);

        $slotclass_menu = SlotService::getClassMenu();

        $lunbo_time = array(
            "1" => "1",
            "2" => "2",
            "3" => "3",
            "4" => "4",
            "5" => "5",
        );

        $splash_time = array(
            "1" => "1",
            "2" => "2",
            "3" => "3",
            "4" => "4",
            "5" => "5",
        );

        // 需要修改 别写死
        $otMdl = new TemplateService();
        $templateCodeMenu = $otMdl::getTemplateCodeMenu();
        $templateVideoCodeMenu = TemplateService::getVideoTemplateCodeMenu();
        $templateHalfCodeMenu = TemplateService::getHalfTemplateCodeMenu();

        $request = \Yii::$app->getRequest();
        $viewData = ['id' => $uid, 'user_id' => $this->userPower['uid'], 'form' => &$formPost, 'templateHalfCodeMenu' => $templateHalfCodeMenu, 'media_type' => $media_type, 'media_type_select' => $media_type_select, 'media_menu' => $media_menu, 'mediaclass_menu' => $mediaclass_menu, 'user_menu' => $user_menu, 'slotclass_menu' => $slotclass_menu, 'lunbo_time' => $lunbo_time, 'splash_time' => $splash_time, 'templateCodeMenu' => $templateCodeMenu, 'templateVideoCodeMenu' => $templateVideoCodeMenu];

        if (!$request->isPost) {
            return $this->render('', $viewData);
        }

        $formPost = $this->getPost();// 没有编辑的实际操作
        $formPost['uid'] = $uid;

        // 找到所有的template，计算出template_count
        // templateFormPost大概的格式如下：[1=>{...}, 2=>{...}, 3=>{...}]，在保存时就将templateFormPost[1], [2], [3]分别保存进数据库就行
        $templateFormPost = array();
        foreach ($formPost as $k => $v) {
            $kList = explode("_", $k);
            // 如果下划线后跟数字而且第一位不是s说明是属于某一template的属性，挪掉末尾的数字，放到templateFormPost的对应位置中
            // s说明是带分辨率的图片
            $idx = end($kList);
            if (is_numeric($idx) && $kList[0] != 's') {
                if (!isset($templateFormPost[$idx])) {
                    $templateFormPost[$idx] = array();
                }
                array_pop($kList);
                $templateFormPost[$idx][join('_', $kList)] = $v;
            }
        }

        // 保存splash 半屏物料图片
        foreach ($templateFormPost as $k => $v) {
            // 检查该模板是否是半屏的
            if ($v['slot_screen'] == 'half') {
                // 找到该半屏模板的素材
                foreach ($_FILES as $key => $value) {
                    $kList = explode("_", $key);
                    $idx = end($kList);
                    if ($idx != $k) {
                        continue;
                    }
                    if (empty($value['tmp_name'])) {
                        continue;
                    }

                    $n_arr = explode(".", $value['name']);
                    $b_uid = Guid::factory()->create();

                    $destination_file = ConfigService::GetUploadPath() . $b_uid . "." . $n_arr[1];
                    if (!move_uploaded_file($value['tmp_name'], $destination_file)) {
                        return $this->jsonResponse(0, '上传素材图片失败');
                        exit();
                    }
                    MaterielService::sendImage($destination_file, $b_uid . "." . $n_arr[1]);
                    array_pop($kList);
                    array_shift($kList);
                    $templateFormPost[$k][join('_', $kList)] = $b_uid . "." . $n_arr[1];
                }
            }
        }

        if (!$mediaMdl::isValid($formPost)) {
            return $this->render('', $viewData);
        }

        $tmp_post = $mediaMdl::items;
        $tmp_post['template_name'] = $formPost['template_name'];
        // 告诉doSave加了多少模板进来
        $tmp_post['template_count'] = count($templateFormPost);

        // save
        $res = $mediaMdl::doSave($tmp_post);
        if ($res[0]) {
            foreach ($templateFormPost as $k => $v) {
                $v['slot'] = $uid;
                $v['class'] = $mediaMdl::items['class'];
                $model2 = new SlotTemplateService();
                $res2 = $model2::doSave($v, $k);
            }
        }
        return $this->redirect('/media/slot');

    }

    /**
     * 从oppo同步过来的固定广告位只允许修改名字
     */
    public function actionSlotUpdateName()
    {
        $formPost = $this->getPost();
        $result = BaseService::Transaction(function () use ($formPost) {
            SlotService::updateName($formPost);

        });
        return $this->jsonResponse($result);
    }

    /**
     * 联盟广告位添加界面
     */
    public function actionAllianceslotaddview()
    {
        return $this->render();
    }

    /**
     * 联盟广告位编辑界面
     *
     */
    public function actionAlliancesloteditview()
    {
        return $this->render();
    }

    /**
     * 联盟广告位查看界面
     *
     */
    public function actionAllianceslotview()
    {
        return $this->render();
    }

    /**
     * 添加广告位 todo => rename
     */
    public function actionFeedsslotadd()
    {
        $params = $this->getPost();
        $result = BaseService::Transaction(function () use ($params) {
            $isNew = false;
            SlotService::Save($params, $isNew);
            SlotTemplateService::Save($params['templates']);
            if ($isNew) {
                //发邮件
                SlotService::sendEmail($params);
            }
        });
        return $this->jsonResponse($result);
    }

    /**
     * 查看广告位以及下面的广告位模板信息
     */
    public function actionFetchslot()
    {
        $params = $this->getGet();
        $result = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return SlotService::FetchSlot($params['uid']);
        });
        return $this->jsonResponse($result);
    }

    /**
     * 查询广告位模板信息
     */
    public function actionFetchtemplate()
    {
        $params = $this->getGet();
        $result = BaseService::ExecuteWithoutTransaction(function () use ($params) {
            return SlotTemplateService::FetchSlotTemplate($params['uid']);
        });
        return $this->jsonResponse($result);
    }

    /**
     * 删除广告位模板
     */
    public function actionDeleteslottemplate()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return SlotTemplateService::DeleteSlotTemplate($params['uid']);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 更新广告位模板状态
     */
    public function actionUpdateslottemplatestatus()
    {
        $params = $this->getPost();
        $data = BaseService::Transaction(function () use ($params) {
            return SlotTemplateService::UpdateSlotTemplateStatus($params['uid'], $params['status']);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 删除数据
     */
    public function actionSlotdel()
    {
        $formPost = $this->getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装

        $model = new SlotService();

        $res = $model::doDel($uidArr);
        if ($res) {
            return $this->jsonResponse(1);
        }
        return $this->jsonResponse(0, '删除失败,请检查数据');
    }

    public function actionSlotinfo()
    {
        $formGet = $this->getGet();
        $uid = $formGet['uid'];

        $mediaSMdl = new SlotService();

        $item = $mediaSMdl::getByUid($uid);

        $mediaMdl = new MediaService();
        $itemM = $mediaMdl::getByUid($item['media']);


        $item['media_name'] = $itemM['name'];

        if (empty($item)) {
            return $this->jsonResponse(0, '数据不存在。');
        }

        $viewData['item'] = $item;

        return $this->disableLayout()->render('', $viewData);
    }


    //下载页面
    public function actionDownload()
    {
        $formGet = $this->getGet();
        return $this->render();
    }

    public function actionCheckAddMediaFormValid()
    {
        $formPost = $this->getPost();
        $res = MediaService::isValid($formPost);
        return $this->jsonResponse(1, '', array('res' => $res, 'error' => $formPost['error']));
    }


    public function actionIsSlotValid()
    {
        $params = $this->getPost();
        $ret = array('template' => array());

        $res = SlotService::Valid($params['slot']);
        $ret['slot']['name']['res'] = $res[0];
        $ret['slot']['name']['error'] = $res[1];

        foreach ($params['template'] as $k => $v) {
            $ret['template'][$k] = SlotTemplateService::isValid($v);
        }
        return $this->jsonResponse(1, '', $ret);
    }

    /**
     * 根据登录用户权限，获取媒体列表
     */
    public function actionMedialist()
    {
        $params = $this->getPost();
        $dataType = isset($params['data_type']) ? $params['data_type'] : 'uid';
        $data = BaseService::ExecuteWithoutTransaction(function () use ($dataType) {
            if (UserService::IsAdminUser()) {
                return MediaService::getMenu('', $dataType);
            } else {
                return MediaService::getMenu(UserService::getCurrentUid(), $dataType);
            }
        });
        return $this->jsonResponse($data);
    }

    /**
     * 媒体创建广告位是返回该媒体账户下面的媒体列表
     */
    public function actionMedialistforcurrentuser()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return MediaService::getMenu(UserService::getCurrentUid());

        });
        return $this->jsonResponse($data);
    }

    /**
     * 提取媒体、广告位、模板三级结构
     */
    public function actionFetchmediaslotstruct()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return SlotService::slotstruct();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 根据bundle_id获取媒体广告位形式:dynamic，static
     *  bundle_ids 'id1,id2,id3'，为空代表获取可用的广告位形式，不为空代表获取获取bundle_id对应的广告位形式
     */
    public function actionFetchmediaadtype()
    {
        $bundle_ids = $this->getGet('bundle_ids');
        $data = BaseService::ExecuteWithoutTransaction(function () use ($bundle_ids) {
            return SlotService::adType($bundle_ids);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 返回所有的媒体列表
     * 返回某一用户的媒体列表 uid=xxx
     */
    public function actionGetmedium()
    {
        $uid = $this->getGet('uid');
        $data = BaseService::ExecuteWithoutTransaction(function () use ($uid) {
            return MediumService::getMediumUserList($uid);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 获取全量媒体账户
     */
    public function actionGetallmedium()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return MediumService::getAllMedium();
        });
        return $this->jsonResponse($data);
    }

    /**
     *  广告主创建计划 根据广告位形式获取所有的媒体列表 固定-动态
     * slot_class=29076f0d-a923-47d4-bfef-2e3cf28fc099
     */
    public function actionGetmediabyadtype($all = true)
    {
        $slot_class = $this->getGet('slot_class');
        if (empty($slot_class)) {
            return $this->jsonResponse([0, 'no slot_class', '']);
        }
        $data = BaseService::ExecuteWithoutTransaction(function () use ($slot_class, $all) {
            if ($all) {
                $data = MediaService::getMediaListBySlotClass($slot_class);
            } else {
                $data = MediaService::getUserMediaListBySlotClass($slot_class);
            }
            return $this->processMediaNames($data);
        });
        return $this->jsonResponse($data);
    }

    /**
     * 处理bundle_id对应多个媒体的情况,返回按照create_time倒序确定的名称
     * @param $data [[name:'',bundle_id:'']...]
     * @return array
     */
    public function processMediaNames($data)
    {
        $bundleIds = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'bundle_id');
        if (empty($bundleIds)) {
            return $bundleIds;
        }
        $idStr = ArrayHandle::SplitByComma($bundleIds);
        return MediaService::getMediaByBundleIds($idStr);
    }

    /**
     *  广告主创建计划 根据广告位形式获取当前登录用户的媒体列表 固定-动态
     */
    public function actionGetusermediabyadtype()
    {
        $this->actionGetmediabyadtype(false);
    }

    /**
     * 获取所有的媒体name,bundle_id
     */
    public function actionGetAllMedia()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            return MediaService::getAllMedia();
        });
        return $this->jsonResponse($data);
    }

    /**
     * 根据广告位id判断广告形式是否是固定信息流
     */
    public function actionIsSlotFixedFeeds()
    {
        $slotId = $this->getGet('id');
        if (empty($slotId)) {
            return $this->jsonResponse([0, '没有计划id', '']);
        }
        $data = BaseService::ExecuteWithoutTransaction(function () use ($slotId) {
            return SlotService::isSlotFixedFeeds($slotId);
        });

        return $this->jsonResponse($data);
    }

    /**
     * 修改媒体状态
     * @return mixed|null
     */
    public function actionStatus()
    {
        if (\Yii::$app->request->isPost) {
            $input = $this->getPost();
            $data = BaseService::Transaction(function () use ($input) {
                return MediaService::saveStatus($input);
            });
            return $this->jsonResponse($data);
        }

        return $this->jsonResponse([0, '不支持get方式']);
    }

    /**
     * 媒体编辑行业屏蔽
     * @return string
     */
    public function actionMediaeditshield()
    {
//        return $this->render();

        $formGet = $this->getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect('/media/mediaadd');
        }

        $mediaMdl = new MediaService();
        $mediaRow = $mediaMdl::getMedia($uid);

        if (empty($mediaRow)) {
            return $this->redirect('/media/media');
        }

        $formPost = $mediaRow;

        $mediaclass_menu = MediaClassService::getMenu();
        $mediaclass_menu2 = MediaClassService::getMenu2();//json
        //print_r(MediaClassService::getMenu2());//json);die;
        $mediacompany_menu = CompanyService::getMenu($this->userPower['uid']);
        $slotclass_menu = SlotService::getClassMenu();
        $user_menu = UserService::getMenu($this->userPower['uid']);


        $formPost['media_select'] = $media_menu[$formPost['media']];
        $formPost['slot_select'] = $slot_menu[$formPost['adslot']];

        // 通过二级分类获取一级分类
        $clientMdl = new ClientService();
        $subcategory = ClientService::getCategoryByUid($formPost['class']);
        $maincategory = ClientService::getCategoryByUid($subcategory['pid']);

        $request = \Yii::$app->getRequest();
        $viewData = ['id' => $uid, 'form' => &$formPost, 'mediaclass_menu' => $mediaclass_menu, 'mediaclass_menu2' => $mediaclass_menu2, 'mediacompany_menu' => $mediacompany_menu, 'slotclass_menu' => $slotclass_menu, 'mst_select' => $mst_select, 'user_menu' => $user_menu, 'maincategoryname' => $maincategory['name']];
        if (!$request->isPost) {
            return $this->render('', $viewData);
        }

//        $formPost = $this->_getPost();
        $formPost = $this->getPost();
        $formPost['uid'] = $uid;

        if (!$mediaMdl::isValid($formPost)) {
            return $this->jsonResponse(0, '输入数据有错误', $formPost['error']);
//            return $viewData;
        }

        // save
        $res = $mediaMdl::doSave($formPost);
        return $this->jsonResponse($res);
    }

    /**
     * 根据主键获取媒体信息
     *
     * - GET /media/getMedia?uid=f3c7177c-726f-484c-833f-f564de76ca66
     *
     * @param $uid string 媒体uid
     */
    public function actionGetMedia($uid)
    {
        $media = MediaService::getMedia($uid);
        return $this->jsonResponseOk($media);
    }

    /**
     * 获取媒体分类结构
     * - GET /media/getMediaCategory
     * @return mixed|null
     */
    public function actionGetMediaCategory()
    {
        $media_menu = MediaClassService::getMenu2(false);//json
        return $this->jsonResponseOk($media_menu);
    }


    public function actionFeeds()
    {
        return $this->render('');
    }
//   关联PID
    public function actionPidadd()
    {
        return $this->render('');
    }
//    修改PID
    public function actionPidedit()
    {
        return $this->render('');
    }

    public function actionCreate()
    {
        return $this->render('');
    }
    /**
     * 根据传入的字段、条件等返回媒体列表
     * @param string $fields 'name,uid'
     * @param string $type  2:网页|3:app 不传：所有
     * @return array
     */
    public function actionGetMediaList($fields = '*', $type = '')
    {
        $cond = ['status' => 'active'];
        if ($type) {
            $cond['type'] = $type;
        }
        return BaseService::ExecuteWithoutTransaction(function () use ($fields, $cond) {
            return MediaService::getMediasByFieldsAndCond($fields, $cond);
        });
    }

//内容合作列表页 查看按钮弹出框信息
    public function actionFeedsinfo()
    {
        return $this->disableLayout()->render();
    }

}
