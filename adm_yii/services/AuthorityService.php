<?php
/**
 * Created by PhpStorm.
 * User: gaosiyuan
 * Date: 2016/11/10
 * Time: 18:05
 */

namespace app\services;
use app\models\AuthorityModel;
use app\models\UserModel;
use app\services\custom\ArrayHandle;

/**
 * 权限模型
 * Class AuthorityModel
 * @package Application\Model
 */
class AuthorityService
{


    /**
     * 获取用户权限 authority 0 无权限 1读权限 2读写权限
     * @param $uid
     * @return array
     */
    public static function GetUserRoleAuthority($uid)
    {
        if(!$uid)
            return [];

        $data = UserModel::getRow(array(
            'uid' => $uid
        ));

        //前端需要的数据结构 完整的广告主、媒体、权限树
        if ($data['create_user'] == '') {
            //权限树整理
            $tree_data = UserService::NavigationTree();
            foreach ($tree_data as &$item) {
                $item['authority'] = "2";
            }
            $data['authority'] = $tree_data;
        } else {
            $authority_data = AuthorityModel::getList(['uid' => $uid,'platform_role' => $data['platform_role']]);
            //权限树整理
            $tree_data = UserService::NavigationTree();
            if ($authority_data) {
                foreach ($tree_data as &$item) {
                    $auth_item = ArrayHandle::FindFirstArrayItemWithKeyValue($authority_data, 'url', $item['url']);
                    if (isset($auth_item))
                        $item = array_merge($item, $auth_item);
                    else
                        $item['authority'] = "0";
                }
            } else {
                foreach ($tree_data as &$item) {
                    $item['authority'] = "0";
                }
            }
            $data['authority'] = $tree_data;
        }

        return $data['authority'];
    }
}