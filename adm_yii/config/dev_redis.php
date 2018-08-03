<?php

$def = [
    'class' => 'yii\redis\Connection',
    'hostname' => '172.16.8.1',
    'port' => 2333,
    'database' => 0,
    'password'=>'Fl0gx66L0Ya',
    'connectionTimeout'=>5,
    'dataTimeout'=>5,
];

return [
    'business' => $def,
    'session' => array_merge($def, ['database' => 1])
];