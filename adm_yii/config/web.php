<?php
use yii\helpers\Inflector;

$params = require(__DIR__ . '/params.php');
$db = require(__DIR__ . '/db.php');
$redis=require(__DIR__.'/redis.php');

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'language' => 'zh-CN',
    'bootstrap' => ['log'],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'IoF2sCf7lj0vPu9unoI6qcmNZqVnEkRy',
            'enableCsrfValidation' => false,
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'errorHandler' => [
            'errorAction' => 'index/error',
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                'error' => [
                    'class' => 'yii\log\FileTarget',
                    'logFile'=>$params['logDir'].'/app.log',
                    'levels' => YII_DEBUG ? ['error', 'warning', 'info', 'trace'] : ['error', 'warning'],
                    'maxLogFiles'=>100,
                ],
                'profile' => [
                    'class' => 'yii\log\FileTarget',
                    'logFile'=>$params['logDir'].'/profile.log',
                    'levels' => ['error', 'warning', 'info'],
                    'categories' => [
                        'yii\db\*',
                        'profile',
                    ],
                    'maxLogFiles'=>100,
                    'maxFileSize'=>102400,
                    'logVars'=>[],
                ],
            ],
        ],
        'db' => $db,
        'redis' =>$redis['business'],
        'session' => [
            'class'=>'yii\redis\Session',
            'keyPrefix'=>'phpsess.',
            'redis'=>$redis['session'],
            'cookieParams' => [
                'lifetime' => 86400,
                'httpOnly' => false,
                'path' => '/',
            ],
            'name' => 'md',
        ],

        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                //默认路由规则
                'GET,POST <controller:[\w-]+>/<action:[a-zA-Z]+>' => '<controller>/<action>',
                //以下为rest规则
//                'GET <controller:[\w-]+>/<uid:\w+>' => '<controller>/show',
//                'POST <controller:[\w-]+>' => '<controller>/store',
//                'GET <controller:[\w-]+>' => '<controller>/index',
//                'PUT,POST <controller:[\w-]+>/<uid:\d+>'    => '<controller>/update',
//                'DELETE <controller:[\w-]+>/<id:\d+>' => '<controller>/destroy',

            ],
        ],

    ],
    'params' => $params,
    'defaultRoute' => 'index',
    'layout' => 'layout.phtml',
    'aliases' => [
        '@filters' => '@app/filters',
    ],
    'as accessFilter' => [
        'class' => 'app\filters\AccessFilter',
        'loginUrl' => '/',
        'rules' => [//不需要登录的action
            'index' => array('index', 'login', 'unfound', 'forbidden', 'robot', 'sendemail'),
            'test' => '*',
            'chk'=>'*',
        ]
    ],
    'on beforeRequest' => function () {
        //camel case action adapter
        $path = Yii::$app->getRequest()->getPathInfo();
        $paths = explode('/', $path);
        if (count($paths) == 2) {
            $paths[1] = Inflector::camel2id($paths[1]);
            Yii::$app->getRequest()->setPathInfo(implode('/', $paths));
        }
    },
    'on afterRequest'=> function () {
        $ts=round((microtime(true)-YII_BEGIN_TIME)*1000);
        $path = Yii::$app->getRequest()->getPathInfo();
        Yii::info("time.cost.ms {$ts} {$path}",'profile');
    }


];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
