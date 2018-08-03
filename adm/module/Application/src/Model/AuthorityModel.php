<?php
/**
 * Created by PhpStorm.
 * User: gaosiyuan
 * Date: 2016/11/10
 * Time: 18:05
 */

namespace Application\Model;
use Application\Table\AuthorityTable;
use Application\Table\UserTable;
use Custom\ArrayHandle;

/**
 * 权限模型
 * Class AuthorityModel
 * @package Application\Model
 */
class AuthorityModel
{
    public static function factory() {
        return new self();
    }

    /**
     * 获取用户权限 authority 0 无权限 1读权限 2读写权限
     * @param $uid
     * @return array
     */
    public static function GetUserRoleAuthority($uid)
    {
        if(!$uid)
            return [];

        $user_table = new UserTable();
        $data = $user_table->getRow(array(
            'uid' => $uid
        ));

        $authority = new AuthorityTable();
        $authority_data = $authority->getList(['uid' => $uid,'platform_role' => $data['platform_role']]);

        //前端需要的数据结构 完整的广告主、媒体、权限树
        if ($data['create_user'] == '') {
            //权限树整理
            $tree_data = UserModel::NavigationTree();
            foreach ($tree_data as &$item) {
                $item['authority'] = "2";
            }
            $data['authority'] = $tree_data;
        } else {
            //权限树整理
            $tree_data = UserModel::NavigationTree();
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