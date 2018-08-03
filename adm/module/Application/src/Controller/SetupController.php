<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;



use Zend\View\Model\ViewModel;

class SetupController extends BaseController
{
    public function indexAction()
    {
       // return $this->render();
        return new ViewModel();
    }
  
  
    public function notfoundAction()
    {
        return $this->render();
    }



    public function forbiddenAction(){

        return $this->render();
    }
}



