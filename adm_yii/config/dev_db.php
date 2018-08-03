<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:dbname=deepleaper;host=59.110.115.50;port=13306',
    'username' => 'root',
    'password' => 'T9feq1v6xFlOvNsQ',
    'charset' => 'utf8',
    'attributes'=>[
        PDO::ATTR_PERSISTENT => true
    ],
    'on afterOpen' => function($event) {
        //自动给"不允许为空且没有默认值的字段"设置空值
        $event->sender->createCommand("set sql_mode='NO_ENGINE_SUBSTITUTION'")->execute();
    }
];

