<?php
namespace Application\Table;



class IpGeoTable extends BaseTable
{
    protected $table = 'ip';
    protected $table_geo = 'geo';
    protected $gateway;
    protected $adapter;
    
    
    public function getAddressByEip( $ip ){
        $ip2long = ip2long($ip);
    
        $where = " AND i.e = '$ip2long' ";
        $sql = "SELECT g.province, g.city
                FROM {$this->table} i LEFT JOIN {$this->table_geo} g ON i.code = g.code
                WHERE 1 $where";
        $query = $this->adapter->query($sql)->execute();;
        
        $data = $query->getResource()->fetchAll();
        return $data[0];
    }
    
}

?>