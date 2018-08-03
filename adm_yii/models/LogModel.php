<?php

namespace app\models;


use Yii;

class LogModel extends BaseModel
{
    protected static $table = 'log';

    const EMERG = 0;
    const ALERT = 1;
    const CRIT = 2;
    const ERR = 3;
    const WARN = 4;
    const NOTICE = 5;
    const INFO = 6;
    const DEBUG = 7;


    protected static $priorities = [
        self::EMERG => 'EMERG',
        self::ALERT => 'ALERT',
        self::CRIT => 'CRIT',
        self::ERR => 'ERR',
        self::WARN => 'WARN',
        self::NOTICE => 'NOTICE',
        self::INFO => 'INFO',
        self::DEBUG => 'DEBUG',
    ];

    public static function setLogger()
    {
//        $mapping = array(
//            'timestamp' => 'time',
//            'priority' => 'priority',
//            'priorityName' => 'type',
//            'message' => 'message',
//            // set value use, $logger->info($message, $extra);
//            'extra' => array(
//                'time' => 'time',
//                'ip' => 'ip',
//                'uid' => 'uid',
//                'mail' => 'mail',
//                'power' => 'power',
//            ),
//        );
//        $writer = new \Zend\Log\Writer\Db(self::adapter, self::table, $mapping);
//        $logger = new \Zend\Log\Logger();
//        $logger->addWriter($writer);
//        return $logger;
    }


    public static function emerg($message, $extra = [])
    {
        return self::log(self::EMERG, $message, $extra);
    }


    public static function alert($message, $extra = [])
    {
        return self::log(self::ALERT, $message, $extra);
    }


    public static function crit($message, $extra = [])
    {
        return self::log(self::CRIT, $message, $extra);
    }


    public static function err($message, $extra = [])
    {
        return self::log(self::ERR, $message, $extra);
    }


    public static function warn($message, $extra = [])
    {
        return self::log(self::WARN, $message, $extra);
    }


    public static function notice($message, $extra = [])
    {
        return self::log(self::NOTICE, $message, $extra);
    }


    public static function info($message, $extra = [])
    {
        return self::log(self::INFO, $message, $extra);
    }


    public static function debug($message, $extra = [])
    {
        return self::log(self::DEBUG, $message, $extra);
    }

    /**
     * @param $priority
     * @param $message
     * @param array $extra 额外信息：'time', 'ip', 'uid', 'mail', 'power'
     */
    private static function log($priority, $message, $extra = [])
    {
        if (!empty($extra)) {
            $message .= json_encode($extra, JSON_UNESCAPED_UNICODE);
        }
        $log = [
            'time' => $extra['time'] ?: time(),
            'ip' => $extra['ip'] ?: (\Yii::$app->request->getUserIP() ?: '127.0.0.1'),
            'uid' => $extra['uid'] ?: '',
            'mail' => $extra['mail'] ?: '',
            'power' => $extra['power'] ?: '',
            'priority' => $priority,
            'type' => static::$priorities[$priority],
            'message' => $message
        ];
        return self::insertOne($log) ? true : false;
    }


    /**
     * 没用到？ //todo test
     */
    public static function setCondition($condition)
    {
        $where = '';
        if ($condition['date'] && is_array($condition['date'])) {
            $where .= " and time >=" . strtotime($condition['date'][0]);
            if ($condition['date'][1]) {
                $where .= " and time <=" . strtotime($condition['date'][1]);
            }
        }
        return $where;
    }


}
