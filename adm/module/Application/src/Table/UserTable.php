<?php
namespace Application\Table;


class UserTable extends BaseTable
{
    protected $table = 'user';
    protected $gateway;
    protected $adapter;
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

    // system has power list
    public static $powerArr = array(
        'guest',
        'admin',
        'operation',
        'media_director',
        'client',
        'media_specialist',
        'site',
        'company',
        'agency',
        'finace',
    );
    
    public static $permissionArr = array(
        'readonly' => '只读',
        'full' => '自助权限',
    );
    
    /**
     * 根据用户邮箱获取用户
     * @param $mail
     * @return bool
     */
    public function getUserByMail($mail) {
        $mail = trim($mail);
        $rowset = $this->gateway->select(array('mail' => $mail));
        $row = $rowset->current();
        return $row ?: false;
    }
    
    /**
     * 根据用户id获取用户
     * @param $uid
     * @return bool
     */
    public function getUserByUid($uid) {
        $rowset = $this->gateway->select(array('uid' => $uid));
        $row = $rowset->current();
        return $row ?: false;
    }

    /**
     * 根据用户权限获取用户
     * @param $power
     * @return bool
     */
    public function getUsersByPower($powerArr = array()) {
        $rowset = $this->gateway->select(array('power' => $powerArr));
        $row    = $rowset->toArray();
        return $row ?: false;
    }

    /**
     * 获取所有内部用户
     * @param $power
     * @return bool
     */
    public function getInternalUsers() {
        $rowset = $this->gateway->select(array('internal' => 1));
        $row    = $rowset->toArray();
        return $row ?: false;
    }
}
