<?php
namespace Application\Table;

class MediaTable extends BaseTable
{
    protected $table = 'media';
    protected $gateway;
    protected $adapter;

    protected $valid = 'is_deleted';
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
    
}
