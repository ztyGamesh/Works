<?php
namespace app\models;



class IpGeoModel extends BaseModel
{
    protected static $table = 'ip';
    protected static $table_geo = 'geo';


    
    
    public static function getAddressByEip( $ip ){
        $ip2long = ip2long($ip);
    
        $where = " AND i.e = '$ip2long' ";
        $sql = "SELECT g.province, g.city
                FROM `ip` i LEFT JOIN `geo` g ON i.code = g.code
                WHERE 1 $where";

        return self::queryRow($sql);
    }
    
}

?>