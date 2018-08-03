<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Application;

use Zend\Mvc\MvcEvent;
use Zend\Mvc\ModuleRouteListener;

class Module
{
    const VERSION = '3.0.1';

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function onBootstrap(MvcEvent $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
    
        // set initialize adapter;
        $e->getApplication()->getServiceManager()->get('dbAdapter');
    
        // set initialize session
        $e->getApplication()->getServiceManager()->get('sessionManager');

        // set check auth
        $MyAuth = new \Application\Model\MyAuth();
        $MyAuth->doAuth( $e );
    
        // set config
        $eventManager->attach('dispatch', array($this,'customConfig'));
    }

    // custom set config
    public function customConfig( MvcEvent $e ) {
        $controller = $e->getTarget();
        $controllerClass = get_class($controller);
    
        $moduleName = substr($controllerClass, 0, strpos($controllerClass, '\\'));
    
        // set varible to layout
        $controller->layout()->ModuleName = $moduleName;
    
        // set current user
        $user = \Application\Model\UserModel::factory()->getCurrentUser();
        $controller->layout()->User = $user;
        //if () {
        //    $controller->layout()->Clients = \Application\Model\UserModel::factory()->getCurrentUserClients();
        //}
    	
        // set logout url
        $config = $e->getApplication()->getServiceManager()->get('config');
        $controller->layout()->Url = $config['url'];
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                //                     __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                    'Model' => __DIR__ .'/src/Model',
                    'Table' => __DIR__ .'/src/Table',
                    

                    // custom library
                    'Custom' => __ROOT__ .'/vendor/custom/',
                    'Export' => __ROOT__ .'/vendor/export/',
                ),
            ),
        );
    }

    // Add this method:
    public function getServiceConfig()
    {
        return array(
            'factories' => array(
    
                'dbAdapter' => function ($sm) {
                $config = $sm->get('config');
                $dbAdapter = new \Zend\Db\Adapter\Adapter($config['db']);
                //                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::setStaticAdapter($dbAdapter);
                return $dbAdapter;
                },
    
                'sessionManager' => function ($sm) {
                $config = $sm->get('config');
                $sessionConfig = $sessionStorage = null;
                if ( isset($config['session']) ){
                    $sessionConfig = new \Zend\Session\Config\SessionConfig();
                    $sessionConfig->setOptions( $config['session'] );
                    $sessionStorage = new \Zend\Session\Storage\SessionArrayStorage();
                }
                $sessionManager = new \Zend\Session\SessionManager($sessionConfig, $sessionStorage);
                $sessionManager->start();
                //                     Container::setDefaultManager($sessionManager);
                return $sessionManager;
                },
    
                ),
                );
    }
}
