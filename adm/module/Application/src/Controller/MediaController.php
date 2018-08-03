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
use Application\Model\ConfigModel;
use Application\Model\MediumModel;
use Application\Model\UserModel;
use Application\Model\BaseModel;
use Application\Model\MediaModel;
use Application\Model\MediaClassModel;
use Application\Model\CompanyModel;
use Application\Model\SlotModel;
use Application\Model\SlotTemplateModel;
use Application\Model\MaterielModel;
use Application\Model\TemplateModel;
use Application\Model\PassportModel;
use Custom\ArrayHandle;

class MediaController extends BaseController
{
    private $userPower = null;// 保存登录用户权限信息

    public function __construct()
    {
        $this->userPower = PassportModel::factory()->getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly ) 
    }

    public function indexAction()
    {
        $this->redirect()->toUrl('/media/media');
    }

    //媒介渠道
    public function companyAction()
    {
        if (($formGet = $this->_getGet())) {

            // 所属资源控制
            $formGet['uid'] = $this->userPower['uid'];

            $res = CompanyModel::factory()->getList($formGet);
            exit(json_encode($res));
        }

        return $this->render();
    }

    /**
     * 获取添加 客户分类 html
     */
    public function companyaddAction()
    {
        $formPost = $this->_getPost();
        $request = $this->getRequest();

        $viewData = ['form' => &$formPost];

        if (!$request->isPost()) {
            return $viewData;
        }

        if (empty($formPost['name'])) {
            $formPost['error'] = "请输入渠道名称！";
            return $viewData;
        }

        $user = UserModel::factory()->getCurrentUid();

        $formPost['create_user'] = $user; // 获取用户,等封装
        $formPost['create_time'] = time(); // 获取用户,等封装

        $model = new CompanyModel();

        if (!$model->isValid($formPost)) {
            return $viewData;
        }

        $res = $model->doSave($formPost);

        if (!$res) {
            $formPost['error'] = $res[1];
            return ['form' => $formPost];
        }

        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'company'));

    }

    public function companyeditAction()
    {
        $formGet = $this->_getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'companyadd'));
        }

        $mediaMdl = new CompanyModel();
        $mediaMdl->getCompany($uid);
        if (empty($mediaMdl->items)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'company'));
        }

        $formPost = $mediaMdl->items;

        $request = $this->getRequest();
        $viewData = ['id' => $uid, 'form' => &$formPost];
        if (!$request->isPost()) {
            return $viewData;
        }

        $formPost = $this->_getPost();
        $formPost['uid'] = $uid;

        if (!$mediaMdl->isValid($formPost)) {
            return $viewData;
        }

        // save
        $res = $mediaMdl->doSave($formPost);

        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'company'));
    }

    /**
     * 删除数据
     */
    public function companydelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装


        $model = new CompanyModel();

        $res = $model->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '删除失败,请检查数据');
    }

    //网站
    public function mediaAction()
    {
        if (($formGet = $this->_getGet())) {
            // 所属资源控制
            $formGet['uid'] = $this->userPower['uid'];
            $res = MediaModel::factory()->getMediaList($formGet);
            exit(json_encode($res));
        }

        return $this->render();
    }

    /**
     * 获取添加 客户分类 html
     */
    public function mediaaddAction()
    {

        $mediaMdl = new MediaModel();

        $mediaclass_menu = MediaClassModel::getMenu();
        $mediaclass_menu2 = MediaClassModel::getMenu2();//json
        //print_r(MediaClassModel::getMenu2());//json);die;
        $mediacompany_menu = CompanyModel::getMenu($this->userPower['uid']);
        $slotclass_menu = SlotModel::getClassMenu();
        $user_menu = UserModel::getMenu($this->userPower['uid']);

        $request = $this->getRequest();
//        $formPost = $this->_getPost();
        $formPost = $this->raw_decode();
        $viewData = ['id' => $uid, 'form' => &$formPost, 'mediaclass_menu' => $mediaclass_menu, 'mediaclass_menu2' => $mediaclass_menu2, 'mediacompany_menu' => $mediacompany_menu, 'slotclass_menu' => $slotclass_menu, 'mst_select' => $mst_select, 'user_menu' => $user_menu];
        if (!$request->isPost()) {
            return $viewData;
        }

        if (!$mediaMdl->isValid($formPost)) {
            $this->_sendJson([0, '输入数据有错误', $formPost['error']]);
        }

        // save
        $res = $mediaMdl->doSave($formPost);
        self::ajax_json($res);
//        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'media'));
    }

    public function mediaeditAction()
    {

        $formGet = $this->_getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'mediaadd'));
        }

        $mediaMdl = new MediaModel();
        $mediaMdl->getMedia($uid);

        if (empty($mediaMdl->items)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'media'));
        }

        $formPost = $mediaMdl->items;

        $mediaclass_menu = MediaClassModel::getMenu();
        $mediaclass_menu2 = MediaClassModel::getMenu2();//json
        //print_r(MediaClassModel::getMenu2());//json);die;
        $mediacompany_menu = CompanyModel::getMenu($this->userPower['uid']);
        $slotclass_menu = SlotModel::getClassMenu();
        $user_menu = UserModel::getMenu($this->userPower['uid']);


        $formPost['media_select'] = $media_menu[$formPost['media']];
        $formPost['slot_select'] = $slot_menu[$formPost['adslot']];

        // 通过二级分类获取一级分类
        $clientMdl = new ClientModel();
        $subcategory = $clientMdl->getCategoryByUid($formPost['class']);
        $maincategory = $clientMdl->getCategoryByUid($subcategory['pid']);

        $request = $this->getRequest();
        $viewData = ['id' => $uid, 'form' => &$formPost, 'mediaclass_menu' => $mediaclass_menu, 'mediaclass_menu2' => $mediaclass_menu2, 'mediacompany_menu' => $mediacompany_menu, 'slotclass_menu' => $slotclass_menu, 'mst_select' => $mst_select, 'user_menu' => $user_menu, 'maincategoryname' => $maincategory['name']];
        if (!$request->isPost()) {
            return $viewData;
        }

//        $formPost = $this->_getPost();
        $formPost = $this->raw_decode();
        $formPost['uid'] = $uid;

        if (!$mediaMdl->isValid($formPost)) {
            $this->_sendJson([0, '输入数据有错误', $formPost['error']]);
//            return $viewData;
        }

        // save
        $res = $mediaMdl->doSave($formPost);
        self::ajax_json($res);

//        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'media'));

    }

    /**
     * 保存 媒体分类
     */
    public function mediasaveAction()
    {
        $formPost = $this->_getPost();


        $user = UserModel::factory()->getCurrentUid();

        if ($formPost['uid']) {
            //  $formPost['edit_user'] = $user; // 获取用户,等封装
//             $formPost['edit_time'] = time(); // 获取用户,等封装
        } else {
            $formPost['create_time'] = time(); // 获取用户,等封装
        }


        $model = new MediaModel();
        $res = $model->doSave($formPost);
        if ($res[0] == 1) {
            $this->_sendJson(1);
        } else {
            $this->_sendJson($res);
        }
        exit();
    }

    /**
     * 删除数据
     */
    public function mediadelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装

        $model = new MediaModel();
        $res = $model->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '删除失败,请检查数据');
    }

    public function mediainfoAction()
    {
        $formGet = $this->_getGet();
        $uid = $formGet['uid'];

        $mediaMdl = new MediaModel();

        $item = $mediaMdl->getByUid($uid);

        $this->view['item'] = $item;
        if (empty($item)) {
            return $this->_sendJson(0, '数据不存在。');
        }

        return $this->render(false, 'media/mediainfo');
    }

    /**
     * 查询媒体信息
     */
    public function fetchmediainfoAction()
    {
        $params = $this->_getGet();
        $result = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return MediaModel::factory()->getMedia($params['uid']);
        });
        self::ajax_json($result);
    }

    //广告位
    public function slotAction()
    {
        if (($formGet = $this->_getGet())) {

            // 所属资源控制
            $formGet['uid'] = $this->userPower['uid'] ? $this->userPower['uid'] : "";

            $res = SlotModel::factory()->getList($formGet);
            foreach ($res['rows'] as $key => $val) {

                $res['rows'][$key]['channel_slot'] = $val['channel'] . "-" . $val['adslot'];
                $res['rows'][$key]['w_h'] = $val['w'] . "-" . $val['h'];
            }

            exit(json_encode($res));
        }
        $this->view['media_menu'] = MediaModel::getMenu($this->userPower['uid']);
        $this->view['status_menu'] = array(

            "有效" => "有效",
            "暂停" => "暂停",
            "删除" => "删除",

        );
        $this->view['slotclass_menu'] = SlotModel::getClassMenu();
        return $this->render();
    }

    /**
     * 获取添加 客户分类 html
     */
    public function slotaddAction()
    {
        $mediaMdl = new SlotModel();

        $media_type = MediaModel::getMenuType();
        $media_menu = MediaModel::getMenu($this->userPower['uid']);
        $mediaclass_menu = MediaClassModel::getMenu();
        $user_menu = UserModel::getMenu($this->userPower['uid']);

        $slotclass_menu = SlotModel::getClassMenu();

        $lunbo_time = array(
//			"1"=>"1",
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
        $otMdl = new TemplateModel();
        $templateCodeMenu = $otMdl->getTemplateCodeMenu();
        $templateVideoCodeMenu = TemplateModel::getVideoTemplateCodeMenu();
        $templateHalfCodeMenu = TemplateModel::getHalfTemplateCodeMenu();

        $request = $this->getRequest();
        $formPost = $this->_getPost();

        $viewData = ['id' => $uid, 'user_id' => $this->userPower['uid'], 'form' => &$formPost, 'templateHalfCodeMenu' => $templateHalfCodeMenu,
            'media_type' => $media_type, 'media_menu' => $media_menu, 'mediaclass_menu' => $mediaclass_menu,
            'user_menu' => $user_menu, 'slotclass_menu' => $slotclass_menu, 'lunbo_time' => $lunbo_time, 'splash_time' => $splash_time,
            'templateCodeMenu' => $templateCodeMenu, 'templateVideoCodeMenu' => $templateVideoCodeMenu];
        if (!$request->isPost()) {
            return $viewData;
        }

        // 找到所有的template，计算出template_count
        // templateFormPost大概的格式如下：[1=>{...}, 2=>{...}, 3=>{...}]，在保存时就将templateFormPost[1], [2], [3]分别保存进数据库就行
        $templateFormPost = array();
        foreach ($formPost as $k => $v) {
            $kList = explode("_", $k);
            // 如果下划线后跟数字说明是属于某一template的属性，挪掉末尾的数字，放到templateFormPost的对应位置中
            $idx = end($kList);
            if (is_numeric($idx)) {
                if (!isset($templateFormPost[$idx])) {
                    $templateFormPost[$idx] = array();
                }
                array_pop($kList);
                $templateFormPost[$idx][join('_', $kList)] = $v;
            }
        }
        $formPost['template_count'] = count($templateFormPost);

        // 保存splash 半屏物料图片
        // 在这里先做上传再存数据，数据存入后文件上传失败
        if ($formPost['class'] == '3e2bbd3f-3e8a-4ddc-892a-12070890543c') {
            foreach ($templateFormPost as $k => $v) {
                // 检查该模板是否是半屏的
                if ($v['slot_screen'] == 'half') {
                    foreach ($_FILES as $key => $value) {
                        $kList = explode("_", $key);
                        $idx = end($kList);

                        if ($idx != $k) {
                            continue;
                        }

                        $n_arr = explode(".", $value['name']);
                        $b_uid = \Custom\Guid::factory()->create();

                        $destination_file = ConfigModel::factory()->GetUploadPath() . $b_uid . "." . $n_arr[1];
                        if (!move_uploaded_file($value['tmp_name'], $destination_file)) {
                            $this->_sendJson(array(
                                0,
                                '上传素材图片失败'
                            ));
                            exit();
                        }
                        MaterielModel::sendImage($destination_file, $b_uid . "." . $n_arr[1]);

                        array_pop($kList);
                        array_shift($kList);
                        $templateFormPost[$k][join('_', $kList)] = $b_uid . "." . $n_arr[1];
                    }
                }
            }
        }

        if (!$mediaMdl->isValid($formPost)) {
            return $viewData;
        }

        $res = $mediaMdl->doSave($formPost);

        if ($res[0]) {
            foreach ($templateFormPost as $k => $v) {
                $v['slot'] = $mediaMdl->uid;
                $model2 = new SlotTemplateModel();
                $res2 = $model2->doSave(array_merge($formPost, $v), $k);
            }
        }

        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'slot'));
    }

    public function sloteditAction()
    {
        $formGet = $this->_getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'slotadd'));
        }

        $mediaMdl = new SlotModel();
        $mediaMdl->getSlot($uid);
        if (empty($mediaMdl->items)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'slot'));
        }

        $formPost = $mediaMdl->items;

        $mMdl = new MediaModel();
        $item2 = $mMdl->getByUid($formPost['media']);
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

        $media_type = MediaModel::getMenuType();
        //$this->view['media_type'] = $item2['type'];
        $media_menu = MediaModel::getMenu($this->userPower['uid']);


        $mediaclass_menu = MediaClassModel::getMenu();
        $user_menu = UserModel::getMenu($this->userPower['uid']);

        $slotclass_menu = SlotModel::getClassMenu();

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
        $otMdl = new TemplateModel();
        $templateCodeMenu = $otMdl->getTemplateCodeMenu();
        $templateVideoCodeMenu = TemplateModel::getVideoTemplateCodeMenu();
        $templateHalfCodeMenu = TemplateModel::getHalfTemplateCodeMenu();

        $request = $this->getRequest();
        $viewData = ['id' => $uid, 'user_id' => $this->userPower['uid'], 'form' => &$formPost, 'templateHalfCodeMenu' => $templateHalfCodeMenu, 'media_type' => $media_type, 'media_type_select' => $media_type_select, 'media_menu' => $media_menu, 'mediaclass_menu' => $mediaclass_menu, 'user_menu' => $user_menu, 'slotclass_menu' => $slotclass_menu, 'lunbo_time' => $lunbo_time, 'splash_time' => $splash_time, 'templateCodeMenu' => $templateCodeMenu, 'templateVideoCodeMenu' => $templateVideoCodeMenu];

        if (!$request->isPost()) {
            return $viewData;
        }

        $formPost = $this->_getPost();// 没有编辑的实际操作
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
                    $b_uid = \Custom\Guid::factory()->create();

                    $destination_file = ConfigModel::factory()->GetUploadPath() . $b_uid . "." . $n_arr[1];
                    if (!move_uploaded_file($value['tmp_name'], $destination_file)) {
                        $this->_sendJson(array(
                            0,
                            '上传素材图片失败'
                        ));
                        exit();
                    }
                    MaterielModel::sendImage($destination_file, $b_uid . "." . $n_arr[1]);
                    array_pop($kList);
                    array_shift($kList);
                    $templateFormPost[$k][join('_', $kList)] = $b_uid . "." . $n_arr[1];
                }
            }
        }

        if (!$mediaMdl->isValid($formPost)) {
            return $viewData;
        }

        $tmp_post = $mediaMdl->items;
        $tmp_post['template_name'] = $formPost['template_name'];
        // 告诉doSave加了多少模板进来
        $tmp_post['template_count'] = count($templateFormPost);

        // save
        $res = $mediaMdl->doSave($tmp_post);
        if ($res[0]) {
            foreach ($templateFormPost as $k => $v) {
                $v['slot'] = $uid;
                $v['class'] = $mediaMdl->items['class'];
                $model2 = new SlotTemplateModel();
                $res2 = $model2->doSave($v, $k);
            }
        }
        return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'slot'));
    }

    /**
     * 从oppo同步过来的固定广告位只允许修改名字
     */
    public function slotUpdateNameAction()
    {
        $formPost = $this->raw_decode();
        $result = BaseModel::Transaction(function () use ($formPost) {
            SlotModel::factory()->updateName($formPost);

        });
        self::ajax_json($result);
    }

    /**
     * 联盟广告位添加界面
     */
    public function allianceslotaddviewAction()
    {
        return $this->render();
    }

    /**
     * 联盟广告位编辑界面
     * @return \Zend\View\Model\ViewModel
     */
    public function alliancesloteditviewAction()
    {
        return $this->render();
    }

    /**
     * 联盟广告位查看界面
     * @return \Zend\View\Model\ViewModel
     */
    public function allianceslotviewAction()
    {
        return $this->render();
    }

    /**
     * 信息流广告、动态广告 保存
     */
    public function feedsslotaddAction()
    {
        $params = $this->raw_decode();
        $result = BaseModel::Transaction(function () use ($params) {
            SlotModel::factory()->Save($params);
            SlotTemplateModel::factory()->Save($params['templates']);
        });
        self::ajax_json($result);
    }

    /**
     * 查看广告位以及下面的广告位模板信息
     */
    public function fetchslotAction()
    {
        $params = $this->_getGet();
        $result = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return SlotModel::factory()->FetchSlot($params['uid']);
        });
        self::ajax_json($result);
    }

    /**
     * 查询广告位模板信息
     */
    public function fetchtemplateAction()
    {
        $params = $this->_getGet();
        $result = BaseModel::ExecuteWithoutTransaction(function () use ($params) {
            return SlotTemplateModel::factory()->FetchSlotTemplate($params['uid']);
        });
        self::ajax_json($result);
    }

    /**
     * 删除广告位模板
     */
    public function deleteslottemplateAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return SlotTemplateModel::factory()->DeleteSlotTemplate($params['uid']);
        });
        self::ajax_json($data);
    }

    /**
     * 更新广告位模板状态
     */
    public function updateslottemplatestatusAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return SlotTemplateModel::factory()->UpdateSlotTemplateStatus($params['uid'], $params['status']);
        });
        self::ajax_json($data);
    }

    /**
     * 删除数据
     */
    public function slotdelAction()
    {
        $formPost = $this->_getPost();
        $uidArr = $formPost['uid']; // 获取用户,等封装

        $model = new SlotModel();

        $res = $model->doDel($uidArr);
        if ($res) {
            $this->_sendJson(1);
        }
        $this->_sendJson(0, '删除失败,请检查数据');
    }

    public function slotinfoAction()
    {
        $formGet = $this->_getGet();
        $uid = $formGet['uid'];

        $mediaSMdl = new SlotModel();

        $item = $mediaSMdl->getByUid($uid);

        $mediaMdl = new MediaModel();
        $itemM = $mediaMdl->getByUid($item['media']);


        $item['media_name'] = $itemM['name'];

        if (empty($item)) {
            return $this->_sendJson(0, '数据不存在。');
        }

        $this->view['item'] = $item;


        return $this->render(false, 'media/slotinfo');
    }

    public function slotdetailAction()
    {
        $formGet = $this->_getGet();
        $uid = $formGet['uid'];

        if (empty($uid)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'slotadd'));
        }

        $mediaMdl = new SlotModel();
        $mediaMdl->getSlot($uid);
        if (empty($mediaMdl->items)) {
            return $this->redirect()->toRoute('application', array('controller' => 'media', 'action' => 'slot'));
        }

        $formPost = $mediaMdl->items;

        $mMdl = new MediaModel();
        $item2 = $mMdl->getByUid($formPost['media']);
        $this->view['item'] = $item;

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

        $media_type = MediaModel::getMenuType();
        //$this->view['media_type'] = $item2['type'];
        $media_menu = MediaModel::getMenu($this->userPower['uid']);
        $mediaclass_menu = MediaClassModel::getMenu();
        $user_menu = UserModel::getMenu($this->userPower['uid']);

        $slotclass_menu = SlotModel::getClassMenu();

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

        // 基础模板
        $otMdl = new TemplateModel();
        $templateCodeMenu = $otMdl->getTemplateCodeMenu();

        // 获取保存的广告位模板


        $formGet2['slot'] = $uid;
        $model2 = new SlotTemplateModel();

        $stm = $model2->getList($formGet2);


        $request = $this->getRequest();
        $viewData = ['id' => $uid, 'form' => &$formPost, 'media_type' => $media_type, 'media_type_select' => $media_type_select, 'media_menu' => $media_menu, 'mediaclass_menu' => $mediaclass_menu, 'user_menu' => $user_menu, 'slotclass_menu' => $slotclass_menu, 'lunbo_time' => $lunbo_time, 'splash_time' => $splash_time, 'templateCodeMenu' => $templateCodeMenu, 'stm' => $stm['rows']];

        if (!$request->isPost()) {
            return $viewData;
        }


    }


    //下载页面
    public function downloadAction()
    {
        $formGet = $this->_getGet();
        return $this->render();
    }

    public function checkAddMediaFormValidAction()
    {
        $formPost = $this->raw_decode();
        $res = (new MediaModel)->isValid($formPost);
        return $this->_sendJson(1, '', array('res' => $res, 'error' => $formPost['error']));
    }

    public function testAction()
    {
        echo ConfigModel::factory()->GetUploadPath();
        exit;
    }

    public function isSlotValidAction()
    {
        $params = $this->_getPost();
        $ret = array('template' => array());

        $msModel = new SlotModel();
        $res = $msModel->Valid($params['slot']);
        $ret['slot']['name']['res'] = $res[0];
        $ret['slot']['name']['error'] = $res[1];

        $mstModel = new SlotTemplateModel();
        foreach ($params['template'] as $k => $v) {
            $ret['template'][$k] = $mstModel->isValid($v);
        }
        return $this->_sendJson(1, '', $ret);
    }

    /**
     * 根据登录用户权限，获取媒体列表
     */
    public function medialistAction()
    {
        $params = $this->raw_decode();
        $dataType = isset($params['data_type']) ? $params['data_type'] : 'uid';
        $data = BaseModel::ExecuteWithoutTransaction(function () use($dataType){
            if (UserModel::factory()->IsAdminUser()) {
                return MediaModel::getMenu('',$dataType);
            } else {
                return MediaModel::getMenu(UserModel::factory()->getCurrentUid(),$dataType);
            }
        });
        self::ajax_json($data);
    }

    /**
     * 媒体创建广告位是返回该媒体账户下面的媒体列表
     */
    public function mediaListForCurrentUserAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return MediaModel::getMenu(UserModel::factory()->getCurrentUid());

        });
        self::ajax_json($data);
    }

    /**
     * 提取媒体、广告位、模板三级结构
     */
    public function fetchmediaslotstructAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return SlotModel::factory()->slotstruct();
        });
        self::ajax_json($data);
    }

    /**
     * 根据bundle_id获取媒体广告位形式:dynamic，static
     *  bundle_ids 'id1,id2,id3'，为空代表获取可用的广告位形式，不为空代表获取获取bundle_id对应的广告位形式
     */
    public function fetchmediaadtypeAction()
    {
        $bundle_ids = $this->_getGet('bundle_ids');
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($bundle_ids) {
            return SlotModel::factory()->adType($bundle_ids);
        });
        self::ajax_json($data);
    }

    /**
     * 返回所有的媒体列表
     * 返回某一用户的媒体列表 uid=xxx
     */
    public function getmediumAction()
    {
        $uid = $this->_getGet('uid');
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($uid) {
            return MediumModel::factory()->getMediumUserList($uid);
        });
        self::ajax_json($data);
    }

    /**
     * 获取全量媒体账户
     */
    public function getallmediumAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return MediumModel::factory()->getAllMedium();
        });
        self::ajax_json($data);
    }

    /**
     *  广告主创建计划 根据广告位形式获取所有的媒体列表 固定-动态
     * slot_class=29076f0d-a923-47d4-bfef-2e3cf28fc099
     */
    public function getmediabyadtypeAction($all = true)
    {
        $slot_class = $this->_getGet('slot_class');
        if (empty($slot_class)) {
            self::ajax_json([0, 'no slot_class', '']);
        }
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($slot_class, $all) {
            if ($all) {
                $data = MediaModel::factory()->getMediaListBySlotClass($slot_class);
            } else {
                $data = MediaModel::factory()->getUserMediaListBySlotClass($slot_class);
            }
            return $this->processMediaNames($data);
        });
        self::ajax_json($data);
    }

    /**
     * 处理bundle_id对应多个媒体的情况,返回按照create_time倒序确定的名称
     * @param $data [[name:'',bundle_id:'']...]
     * @return array
     */
    function processMediaNames($data)
    {
        $bundleIds = ArrayHandle::FetchMultipleArrayLeafWithKey($data, 'bundle_id');
        if (empty($bundleIds)){
            return $bundleIds;
        }
        $idStr = ArrayHandle::SplitByComma($bundleIds);
        $rows = MediaModel::factory()->getMediaByBundleIds($idStr);
        return $rows;
    }

    /**
     *  广告主创建计划 根据广告位形式获取当前登录用户的媒体列表 固定-动态
     */
    public function getusermediabyadtypeAction()
    {
        $this->getmediabyadtypeAction(false);
    }

    /**
     * 获取所有的媒体name,bundle_id
     */
    public function getAllMediaAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            return MediaModel::factory()->getAllMedia();
        });
        self::ajax_json($data);
    }

    /**
     * 根据广告位id判断广告形式是否是固定信息流
     */
    public function isSlotFixedFeedsAction()
    {
        $slotId = $this->_getGet('id');
        if (empty($slotId)) {
            self::ajax_json([0, '没有计划id', '']);
        }
        $data = BaseModel::ExecuteWithoutTransaction(function () use ($slotId) {
            return SlotModel::factory()->isSlotFixedFeeds($slotId);
        });

        self::ajax_json($data);
    }
}
