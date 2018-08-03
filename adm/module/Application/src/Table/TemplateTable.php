<?php
namespace Application\Table;

class TemplateTable extends BaseTable
{
    protected $table = 'template';
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
