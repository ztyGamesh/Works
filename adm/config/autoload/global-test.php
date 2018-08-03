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

        'dsn' => 'mysql:dbname=deepleaper;host=10.51.91.101',
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
        'logout' => 'http://test.deepleaper.com/',
        'webpage' => 'http://www.jettzhang.com/',
        //'passport' => 'http://dev.deepleaper.jettzhang.com/',
        'passport' => 'http://test.deepleaper.com/index/index',
    ),
    'template_path' => '/home/test/adm/public/templates/',
    'adm_upload_path' => '/home/test/adm/public/uploads/',
    'split_path' => 'http://10.174.12.140/cgi-bin/segmentation.py?word=',
    'batch_split_path' => 'http://10.174.12.140/cgi-bin/batch_segmentation.py?word=',
    'static_server' => 'http://static.adm.deepleaper.com/material/'
);