<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22
 * Time: 11:20
 */

namespace Application\Model;


use Application\Table\CorporationTable;

class CorporationModel
{
    private static $instance = null;

    public static function factory()
    {
        if (self::$instance == null)
            self::$instance = new self();
        return self::$instance;
    }

    /**
     * 保存公司 （发现重名公司就返回id 否则保存新的公司）
     * @param $name
     */
    public function Save($name)
    {
        if(!$name)
            throw new \Exception('错误的公司名称！');

        $corporation = CorporationTable::factory()->getRow(['name'=>$name]);

        if($corporation)
            return $corporation['id'];

        $corporation['name'] = $name;
        $corporation['create_user'] = UserModel::factory()->getCurrentUid();
        $corporation['create_time'] = time();
        CorporationTable::factory()->insert($corporation);
        return  CorporationTable::factory()->getLastInsertValue();
    }

    /**
     * 充值列表数据接口
     */
    public function ChargeList()
    {
        $sql = "
                SELECT 
                l.*,
                u.`name`,
                c.`name` AS corporation_name
                FROM `charge_log` AS l INNER JOIN `user` AS u ON u.`uid` = l.`client` AND u.`role` = 'client'
                LEFT JOIN `corporation` AS c ON c.`id` = u.`corporation_id`
                ";
        return CorporationTable::factory()->queryList($sql);
    }
}