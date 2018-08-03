<?php
namespace app\services;

use app\models\AdplanModel;
use app\models\ArticleCategoryModel;
use app\models\TagModel;
use Yii;

class ArticleCategoryService
{
    /**
     * @var int 标签级别 计划展示二级标签，创意展示三级标签
     */
    private static $level = 2;
    /**
     * @var bool 是否在1，2级分类下添加"全部"
     */
    private static $addAll = true;

    const DEFAULT_LEVEL = 2;



    /**
     * 返回标签的分级结构
     * @param $level int 要获取的标签级别，default:3
     * @param $all  boolean 子分类中是否添加"全部"
     * @param $dictId null|int 要查询的标签字典id
     */
    public static function categoryTree($level, $all = true,$dictId=null)
    {
        self::$level = $level;
        self::$addAll = $all;
        // 只返回未删除的标签
        $whereSql = ' and status=0';
        if ($dictId){
            $whereSql .=" and dict_id={$dictId}";
        }
        $category = ArticleCategoryModel::getRows(['whereSql' => $whereSql]);
        return self::generateTree($category);
    }

    /**
     * @param $rows   要分类的数据
     * @param $addAll 子分类下是否添加"全部"节点
     * @param int $level 分类级别1，2，3
     * @param null $parentCode 父分类编码
     * @return array    分类后的数据
     * @throws Exception
     */
    public static function generateTree(&$rows, $level = 1, $parentCode = null)
    {
        if ($level < 1 || $level > 2) {
            throw new \Exception("invalid level:{$level}");
        }
        static $levelMap = [1 => 'level1', 2 => 'level2'];

        $currentLevelField = $levelMap[$level];
        $divide1 = pow(1000, 3 - $level);
        $divide2 = $divide1 * 1000;
        $tree = [];
        foreach ($rows as $row) {
            if (($row['category_id'] % $divide1 == 0)) {
                /**
                 * 二、三级分类父编码匹配
                 */
                if ($level != 1 && (intval($row['category_id'] / $divide2) * $divide2 != $parentCode)) {
                    continue;
                }
                if (!self::$addAll && ('全部' === $row[$currentLevelField])) {
                    continue;
                }

                $node = [
                    'code' => "{$row['category_id']}",
                    'level' => $level,
                    'name' => $row[$currentLevelField],
                ];
                /**
                 * 添加一、二级分类下的子节点
                 * 如果二级分类为全部，则忽略三级
                 */
                if (($level < self::$level)
                    && ((1 == $level) || ((2 == $level) && ($row[$currentLevelField] != '全部')))
                ) {
                    $node['child'] = self::generateTree($rows, $level + 1, $row['category_id']);
                }
                $tree[] = $node;
            }
        }
        return $tree;
    }

}