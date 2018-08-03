<?php
namespace Application\Model;

use Zend\Mvc\MvcEvent;
// use Zend\Server\Reflection\ReflectionClass;
use Application\Table\AclTable;


class MyAuth 
{
    // current login user info
    protected $power = 'guest';
    protected $uid;
    protected $permission;
    // request method is ajax;
    protected $ajax = false;
    
    // default opened access
    protected $allow = array(
        'index' => array('unfound', 'forbidden','robot',' sendemail'),
        'passport' => 'all',
    );

//    public function __construct() {
//        $user = UserModel::factory()->getCurrentUser();
//        
//        $this->power = $user['power'];
//        $this->uid = $user['uid'];
//        
//    }
    
    public function doAuth( MvcEvent $e ) 
    {
    	
        $sm = $e->getApplication()->getServiceManager();
		
        $router = $sm->get('router');
        $request = $sm->get('request');
        $response = $sm->get('response');
        $matched = $router->match($request);
       
        $this->ajax = $request->isXmlHttpRequest();
        
        // save log to db.log
        $logTable = new \Application\Table\LogTable();
        $logger = $logTable->setLogger();
      
      	
         //var_dump($matched->getParam('controller'));die;

        // The requested URL could not be matched by routing
        if (empty($matched)) {
            $logger->notice('嗅探访问/' .$request->getRequestUri(), $this->_setExtra());
            
            //header("Location:/error/404.html");
            echo "该页面没有权限或页面不存在！";
            exit;
        }
      
    
      
        
        
        // 404 Redirect
//         $is404 = true;
//         if (class_exists($controllerClass)) {
//             $rf = new ReflectionClass($controllerClass);
//             if ( $rf->hasMethod($actionMethod) ){
//                 $is404 = false;
//             }
//         }        
        
        $namespace = $matched->getParam('__NAMESPACE__');//Application\Controller
        
        $controller = strtolower( $matched->getParam('controller') );
        $action = $matched->getParam('action');
//        var_dump( $controller, $action, $namespace ); exit;
        $allowAct = array();
        
        if ( isset($this->allow[$controller]) ) {
            $allowAct = $this->allow[$controller];
        } 
        if ( $allowAct =='all' || in_array($action, $allowAct) ){
            // allow access
            return true;
        }
        
        // check if login
        $user = PassportModel::factory()->getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly ) 
      
        if($user)
        {
            $this->power = $user['power'];// 角色
            $this->uid = $user['uid'];// 
            $this->permission = $user['permission'];//用户表里记录的
        }

        $current_module = substr($namespace, 0, strpos($namespace, '\\'));//Application
        $uri = $namespace .'/' .$controller .'/' .$action;
      
      
      
       // auth action
        $dbAcl = new AclTable();
        $res = $dbAcl->checkPower($this->power, $controller, $action, $this->uid);//1

        if (!$this->uid && $controller != 'index') {
            $config = $sm->get('config');
            $passport = $config['url']['passport'];
            $passport_url = $passport;
            if (isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest") {
                // ajax 请求的处理方式
                exit(json_encode(['status' => -1, 'msg' => '请重新登录！', 'data' => null]));
            } else {
                // 正常请求的处理方式
                header("Location:$passport_url");
                exit;
            };

        }
        
       /*
        if ( !$res ) {
            $logger->warn('越权访问/' .$uri, $this->_setExtra());
            if ( true === $this->ajax ){
                $this->_sendJson(0, "抱歉，您无权访问所指定的资源！");
            } else {
                header('Location:/index/forbidden');
            }
            exit;
        }
        
*/
        
        //if ( true !== $this->ajax ){
            $logger->info('访问页面/' .$uri, $this->_setExtra());
        //}
        
    }
    


    
    
    private function _setExtra() {
        $user = UserModel::factory()->getCurrentUser();
        return array(
            'time' => time(),
            'ip' => \Custom\Utility::getIp(),
            'uid' => $user['uid'] ?: '',
            'mail' => $user['mail'] ?: '',
            'power' => $user['power'] ?: '',
        );
        
    }
    
    private function _sendJson($status, $msg){
        // can first param use array
        if ( is_array( $status ) ){
            list($status, $msg) = $status;
        }
        $res = array(
            'status'    => (int)$status ? 1 : 0,
            'msg'       => !empty($msg) ? $msg : '操作成功',
        );
        exit(json_encode($res));
    }
    
    
}
