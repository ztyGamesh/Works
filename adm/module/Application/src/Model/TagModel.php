<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21
 * Time: 18:47
 */

namespace Application\Model;

use Application\Table\AdcreativeTable;
use Application\Table\AdgroupTable;
use Application\Table\AdplanTable;
use Application\Table\MediaAppTable;
use Application\Table\MediaTable;
use Application\Table\TagTable;
use Application\Table\WordTable;
use Custom\ArrayHandle;

class TagModel
{
    /**
     * @var int 标签级别 计划展示二级标签，创意展示三级标签
     */
    private $level = 3;
    /**
     * @var bool 是否在1，2级分类下添加"全部"
     */
    private $addAll = true;

    const DEFAULT_LEVEL = 3;

    public static function factory()
    {
        return new self();
    }

    /**
     * 返回标签的分级结构
     * @param $level 要获取的标签级别，default:3
     * @param $all   子分类中是否添加"全部"
     */
    public function tagTree($level, $all = true)
    {
        $this->level = $level;
        $this->addAll = $all;
        // 只返回未删除的标签
        $tags = TagTable::factory()->getRows(['whereSql' => ' and status=0 ']);
        return $this->generateTree($tags);
    }

    /**
     * @param $rows   要分类的数据
     * @param $addAll 子分类下是否添加"全部"节点
     * @param int $level 分类级别1，2，3
     * @param null $parentCode 父分类编码
     * @return array    分类后的数据
     * @throws Exception
     */
    function generateTree(&$rows, $level = 1, $parentCode = null)
    {
        if ($level < 1 || $level > 3) {
            throw new \Exception("invalid level:{$level}");
        }
        static $levelMap = [1 => 'level1', 2 => 'level2', 3 => 'level3'];

        $currentLevelField = $levelMap[$level];
        $divide1 = pow(100, 3 - $level);
        $divide2 = $divide1 * 100;
        $tree = [];
        foreach ($rows as $row) {
            if (($row['code'] % $divide1 == 0)) {
                /**
                 * 二、三级分类父编码匹配
                 */
                if ($level != 1 && (intval($row['code'] / $divide2) * $divide2 != $parentCode)) {
                    continue;
                }
                if (!$this->addAll && ('全部' === $row[$currentLevelField])) {
                    continue;
                }

                $node = [
                    'code' => "{$row['code']}",
                    'level' => $level,
                    'name' => $row[$currentLevelField],
                ];
                /**
                 * 添加一、二级分类下的子节点
                 * 如果二级分类为全部，则忽略三级
                 */
                if (($level < $this->level)
                    && ((1 == $level) || ((2 == $level) && ($row[$currentLevelField] != '全部')))
                ) {
                    $node['child'] = $this->generateTree($rows, $level + 1, $row['code']);
                }
                $tree[] = $node;
            }
        }
        return $tree;
    }

    /**
     * 添加、更新、删除标签
     * @param $config 标签配置
     * @param $debug bool true:不执行sql,返回解析后的数据；false:执行sql
     */
    public function updateTag(&$config, $debug = false)
    {
        $dict_id = $config['dict_id'];
        $dict_name = $config['dict_name'];
        $ts = time();
        $tag_file = __ROOT__ . DIRECTORY_SEPARATOR . $config['tag_file'];

        if (!file_exists($tag_file)) {
            throw new \Exception("file:$tag_file does not exist!");
        }
        $rows = file($tag_file);
        $retArr = [];
        $deletedTags = [];

        foreach ($rows as $row) {
            $fields = explode(',', trim($row));
            if (count($fields) != 6) {
                throw new \Exception("row format mismatch: {$row}");
            }
            $fields[0] = $dict_id . $fields[0];
            list($code, $level1, $level2, $level3, , $type) = $fields;

            if (!$debug) {
                switch ($type) {
                    case "add":
                        $retArr[] = $ret = TagTable::factory()->insert([
                            'dict_id' => $dict_id,
                            'dict_name' => $dict_name,
                            'code' => $code,
                            'level1' => $level1,
                            'level2' => $level2,
                            'level3' => $level3,
                            'create_time' => $ts,
                        ]);;
                        break;
                    case "modify":
                        $retArr[] = $ret = TagTable::factory()->update(
                            [
                                'level1' => $level1,
                                'level2' => $level2,
                                'level3' => $level3,
                                'update_time' => $ts],
                            ['code' => $code]);
                        break;
                    case "delete":
                        $retArr[] = $ret = TagTable::factory()->update(['status' => 1, 'update_time' => $ts], ['code' => $code]);
                        $deletedTags[] = $code;
                        break;
                    default:
                        throw new \Exception("invalid operation type:{$type}");
                }
            } else {
                $retArr[] = array_merge([$dict_id, $dict_name], $fields);
            }

        }
        $updatedPlanNum = $this->updatePlanByDeletedTag($deletedTags);
        $retArr['plan_updated'] = $updatedPlanNum;
        return $retArr;
    }

    /**
     * 更新标签时，把标签定向全被删除的计划的状态设置为暂停
     * @param array $deletedTags 要删除的标签codes
     * @return int  修改计划数
     */
    protected function updatePlanByDeletedTag(array $deletedTags)
    {
        if (empty($deletedTags)) {
            return 0;
        }
        $plans = [];
        $updatedRows = 0;
        $regexp = sprintf('(%s)', implode('|', $deletedTags));

        $sql = "SELECT id,tag_target,status from ad_plan p WHERE status='active' and tag_target is not null and tag_target REGEXP '$regexp'";
        $rows = AdplanTable::factory()->queryList($sql);
        foreach ($rows as $row) {
            if (!in_array($row['id'], $plans)) {
                $tagTargets = explode(',', $row['tag_target']);
                if (count(array_diff($tagTargets, $deletedTags)) > 0) {
                    continue;
                }
                $plans[] = $row['id'];
            }
        }

        if (!empty($plans)) {
            $planIds = implode(',', $plans);
            $updateSql = "update ad_plan set status='pause' where id in ($planIds)";
            $updatedRows = AdplanTable::factory()->execute($updateSql)->getAffectedRows();
        }

        return $updatedRows;
    }


}