<?php
namespace Application\Table;

class SlotTemplateTable extends BaseTable
{
    protected $table = 'slot_template';
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
