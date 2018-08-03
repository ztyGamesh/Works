<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/18
 * Time: 11:33
 */

namespace Application\Controller;




/**
 * 账户
 * Class AccountController
 * @package Application\Controller
 */
class AccountController extends BaseController
{
    /**
     * 媒体账户信息页面
     * @return \Zend\View\Model\ViewModel
     */
    public function mediaaccountviewAction()
    {
        return $this->render();
    }
}