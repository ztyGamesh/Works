<?php
namespace Application\Table;

class SlotClassTable extends BaseTable
{
    protected $table = 'slot_class';
    protected $gateway;
    protected $adapter;
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }
}
