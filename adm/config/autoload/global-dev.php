<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return array(
    // ...
    'db' => array(
        'driver' => 'Pdo',
        //'dsn' => 'mysql:dbname=deepleaper;host=deepleaper.mysql.rds.aliyuncs.com',
        //'username' => 'deepleaper',
        //'password' => 'C8i7fysc3',

//        'dsn' => 'mysql:dbname=deepleaper;host=jettzhang.mysql.rds.aliyuncs.com',
//        'username' => 'deepleaper',
//        'password' => 'C8i7fysc3',

        'dsn' => 'mysql:dbname=deepleaper;host=192.168.0.133',
        'username' => 'root',
        'password' => '1qaz@WSX',

        'driver_options' => array(
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'",
            PDO::ATTR_PERSISTENT => true,
        ),
    ),

    'session' => array(
        'name' => 'md',
        'cookie_domain' => '.deepleaper.com',
        'cookie_path' => '/',
        'cookie_lifetime' => 86400,
        'use_cookies' => true,
//         'storage' => 'Zend\Session\Storage\SessionArrayStorage',
//         'validators' => array(
//             'Zend\Session\Validator\RemoteAddr',
//             'Zend\Session\Validator\HttpUserAgent',
//         ),
    ),

//    'url' => array(
//        'logout' => 'http://adm.deepleaper.com/',
//        'webpage' => 'http://adm.deepleaper.com/',
//		'passport' => 'http://adm.deepleaper.com/',
//    ),

    'url' => array(
        //'logout' => 'http://dev.deepleaper.jettzhang.com/',
        'logout' => 'http://dev.deepleaper.com/',
        'webpage' => 'http://www.jettzhang.com/',
        //'passport' => 'http://dev.deepleaper.jettzhang.com/',
        'passport' => 'http://dev.deepleaper.com/index/index',
    ),
    'template_path' => '/samba/anonymous/aliyun/code/adm/public/templates/',
    'adm_upload_path' => '/samba/anonymous/aliyun/code/adm/public/uploads/',
    'split_path' => 'http://59.110.113.126/cgi-bin/segmentation.py?word=',
    'batch_split_path' => 'http://59.110.113.126/cgi-bin/batch_segmentation.py?word=',
    'static_server' => 'http://static.adm.deepleaper.com/material/'
    //'adm_upload_path' => '/home/www/public/uploads/',
);

