<?php
namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;
use Application\Model\PassportModel;

class BaseController extends AbstractActionController
{
    // change skin for layout
    protected $skin = '';
    
    // set variable for template
    protected $view = array();
    
    // initialize session container
    protected $session;

    //顶部导航,键值作为url中的 controller,在 render方法中赋值
    protected $topNav = array(
        'media' => array('name' => '媒体管理', 'act' => '',),
        'client' => array('name' => '客户管理', 'act' => '',),
        'user' => array('name' => '用户管理', 'act' => '',)
    );
    //左侧导航,一级数组键值作为url中的 controller,二级数组键值作为 action ,在 render方法中赋值
    protected $leftNav = array(
    	'media' => array(
            //'category' => array('name' => '媒体分类管理', 'act' => ''),
            'company' => array('name' => '媒介渠道管理', 'act' => ''),
            'media' => array('name' => ' 媒体管理', 'act' => ''),
         //   'app' => array('name' => '应用管理', 'act' => ''),
            'slot' => array('name' => '广告位管理', 'act' => ''),
             'download' => array('name' => 'SDK下载', 'act' => ''),
        ),
        
        'user' => array(
           // 'client' => array('name' => '广告主用户管理', 'act' => ''),
           // 'internal' => array('name' => '内部用户管理', 'act' => ''),
           // 'agency' => array('name' => '代理商用户管理', 'act' => ''),
           // 'site' => array('name' => '媒体用户管理', 'act' => ''),
            'userpermissionview' => array('name' => '权限控制', 'act' => ''),
          
        ),
        'client'    => array(
            'category'     => array( 'name'  => '客户分类管理', 'act'   => '', ),
            'agency'       => array( 'name'  => '代理商管理', 'act'   => '', ),
            'client'       => array( 'name'  => '广告主信息管理', 'act'   => '', ),
        ),
         'setup' => array(
            'user' => array('name' => '内部用户管理', 'act' => ''),
            'mediauser' => array('name' => '媒体用户管理', 'act' => ''),
            'clientuser' => array('name' => '广告主用户管理', 'act' => ''),
            'message' => array('name' => '消息中心', 'act' => ''),
            'template' => array('name' => '广告模板管理', 'act' => ''),
            
        ),
    );

    public function __construct() {
        $this->session = new Container('deep');
    }

    /**
     * get query for get
     * @param string $key
     * @return unknown
     */
    public function _getGet($key = '')
    {
        $params = $this->getRequest()->getQuery()->toArray();
        if ( !empty($params) ) {
            foreach ($params as &$val) {
                if (is_array($val)) continue;
                $val = strip_tags(trim($val));
            }
            unset($val);
        }
        $this->_setnavi();
        if (! empty($key)) {
            return $params[$key];
        }
        return $params;
    }
    
    /**
     * get query for post
     * @param string $key
     */
    public function _getPost($key = '')
    {
        $params = $this->getRequest()->getPost()->toArray();
        if ( !empty($params) ) {
            foreach ($params as &$val) {
                if (is_array($val)) continue;
                $val = strip_tags(trim($val));
            }
            unset($val);
        }
        $this->_setnavi();
        if (! empty($key)) {
            return $params[$key];
        }
        return $params;
    }

    public function raw_input()
    {
        return file_get_contents("php://input");
    }

    public function raw_decode()
    {
        $data = $this->raw_input();
        $data = $data ? json_decode($data, true) : $data;
        array_walk_recursive($data, function (&$val, $key) {
            $val = is_string($val) ? strip_tags(trim($val)) : $val;
        });
        return $data;
    }

    /**
     * return josn content
     * @param int $status
     * @param string $msg
     * @param array $data
     */
    public function _sendJson($status, $msg='', $data=array())
    {
        // can first param use array
        if ( is_array( $status ) ){
            list($status, $msg, $data) = $status;
        }

        $res = array(
            'status'    => (int)$status ? 1 : 0,
            'msg'       => !empty($msg) ? $msg : '操作成功',
            'data'      => $data,
        );
        if (empty($data)) unset($res['data']);

        exit(json_encode($res,JSON_UNESCAPED_UNICODE));
    }

    /**
     * return render and data
     * @param array|boolean $data, if array will set variables, else false will disabled layout
     * @param string $template, default null, if has will use other template, rule [controller/action]
     * @example:
     *      default set variable and use layout
     *      return $this->render(array(
     *                  'info' => $row,
     *                  'cate' => $cate,));
     *
     *      or use parent $view to set
     *          $this->view = array(
     *                  'info' => $row,
     *                  'cate' => $cate,);
     *          return $this->render();
     *
     *      if use other template
     *          return $this->render($data, 'index/demo');
     *
     *      if disabled layout
     *           $this->view = array(...);
     *           return $this->render(false);
     */
    protected function render( $data=array(), $template='' ) {
        $view = new ViewModel();
   
        // set disabled layout
        if ( false === $data ){
            $view->setTerminal(true);
        }
    
        // set variable for template
        if (!empty($this->view)) {
            $data = array_merge((array)$data, (array)$this->view);
        }
        if (!empty($data)) {
            foreach ($data as $key => $val) {
                $view->setVariable($key, $val);
            }
        }
    
        // set skin
        $this->layout()->setVariable('skin', $this->skin);
        
        //set nav
        //$this->_setnavi();
    
        // default template, use [application/controller/action]
        if ( !empty($template) ){
            $appname = substr(__NAMESPACE__, 0, strpos(__NAMESPACE__, '\\'));
            $template = strtolower($appname) .'/' .$template;
            $view->setTemplate($template);
        }
    
        return $view;
    }

    /**
     * 设置头部导航和左侧关联navi
     */
    protected function _setnavi() {
    	
        $controller = $this->getEvent()->getRouteMatch()->getParam('controller');
        $action = $this->getEvent()->getRouteMatch()->getParam('action');


        $controller = str_replace("\\", '|', $controller);
        $pathArr = explode('|', $controller);
        $controllerName = strtolower($pathArr[2]);

        $topNavArr = $this->topNav;
        $topNavArr[$controllerName]['act'] = 'act';
        //生成 url值
        foreach ($topNavArr as $key => $val) {
            $topNavArr[$key]['url'] = '/' . $key;
        }

        if ( is_array(($leftNav = $this->leftNav[$controllerName])) ){ ;
        	
            foreach ($leftNav as $key => $val) {
                if (is_array($leftNav[$key])) {
                    $leftNav[$key]['url'] = '/' . $controllerName . '/' . $key;
                }
            }
        }
        //无右侧导航的指定父级action
        if (isset($this->subLeftAction[$action])) {
            $action = $this->subLeftAction[$action]['parent'];
        }

		//print_r($topNavArr);die;
        $leftNav[$action]['act'] = 'act';
        $this->topNav[$controllerName]['act'] = 'act';
        $this->layout()->setVariable('topNavArr', $topNavArr);
        $this->layout()->setVariable('leftNavArr', $leftNav);
        
        $this->layout()->setVariable('cc', $controllerName);
        $this->layout()->setVariable('aa', $action);
        $userArr = PassportModel::factory()->getLoginUser(true);
         $this->layout()->setVariable('power',$userArr['power']);
    
        
    }

    public static function ajax_json(array $data)
    {
        if(!isset($_GET['export_raw_data'])) {
            $res = array(
                'status' => $data[0],
                'msg' => $data[1],
                'data' => isset($data[2]) ? $data[2] : null,
            );

            exit(json_encode($res));
        }
        else{
            return $data;
        }
    }
}
