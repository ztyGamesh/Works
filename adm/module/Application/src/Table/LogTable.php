<?php
namespace Application\Table;


class LogTable extends BaseTable
{
    protected $table = 'log';
    protected $gateway;
    protected $adapter;
    
    public function setLogger(){
        $mapping = array(
            'timestamp' => 'time',
            'priority' => 'priority',
            'priorityName' => 'type',
            'message' => 'message',
            // set value use, $logger->info($message, $extra);
            'extra' => array(
                'time' => 'time',
                'ip' => 'ip', 
                'uid' => 'uid', 
                'mail' => 'mail', 
                'power' => 'power',
            ),
        );
        $writer = new \Zend\Log\Writer\Db($this->adapter, $this->table, $mapping);
        $logger = new \Zend\Log\Logger();
        $logger->addWriter($writer);
        return $logger;
    }
    
    
    public function setCondition( $condition ){
        $where = '';
        if ($condition['date'] && is_array($condition['date'])) {
            $where .= " and time >=" .strtotime($condition['date'][0]);
            if ($condition['date'][1]) {
                $where .= " and time <=" .strtotime($condition['date'][1]);
            }
        }
        return $where;
    }
    
    
}
