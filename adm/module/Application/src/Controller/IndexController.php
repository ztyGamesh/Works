<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Application\Model\DrawLogModel;
use Application\Model\SlotTemplateModel;
use Application\Model\PassportModel;
use Application\Model\UserModel;
use Application\Model\BaseModel;

class IndexController extends BaseController
{
    public function indexAction()
    {
        return $this->render(false, "index/index.phtml");
        //return new ViewModel();
    }

    public function notfoundAction()
    {
        return $this->render();
    }

    public function forbiddenAction()
    {
        return $this->render();
    }

    public function loginAction()
    {
        $useCaptcha = false;
        if (($param = $this->raw_decode())) {

            $param['useCaptcha'] = $useCaptcha;
            $res = PassportModel::factory()->doLogin($param);

            if ($res[0] == 1) {
                $res[2] = PassportModel::GetUserIndexPage($param);
                self::ajax_json($res);
            } else
                self::ajax_json($res);
        }
    }

    /**
     * do logout
     */
    public function logoutAction()
    {
        $ajax = $this->_getPost('ajax');

        $res = PassportModel::factory()->doLogout();
        if ($ajax == 1) {
            $this->_sendJson(1, $res[1]);
        }

        $backurl = '/index/index';

        return $this->redirect()->toUrl($backurl);
    }

    public function robotAction()
    {
        set_time_limit(0);
        $params = $this->_getGet();

        switch ($params['task']) {
            case 'compute_media_total_income':
                DrawLogModel::factory()->ComputeAllianceMediaTotalIncome($params);
                break;
            case 'compute_alliance_last_month_media_bill':
                DrawLogModel::factory()->ComputeAllianceLastMonthMediaBill($params);
                break;
            case 'compute_alliance_whole_media_bill':
                DrawLogModel::factory()->ComputeAllianceWholeMediaBill($params);
                break;
            case 'template_push':
                SlotTemplateModel::factory()->PushTemplate();
                break;
        }
        echo 'Done!';
        exit;
    }

    public function sendemailAction()
    {
        $params = $this->raw_decode();
        $data = BaseModel::Transaction(function () use ($params) {
            return UserModel::factory()->SendEmail($params);
        });
        self::ajax_json($data);
    }
}



