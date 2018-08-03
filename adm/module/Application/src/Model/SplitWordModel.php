<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/9
 * Time: 11:08
 */

namespace Application\Model;

use Application\Table\SplitWordTable;

/**
 * 分词模型
 * Class SplitWordModel
 * @package Application\Model
 */
class SplitWordModel
{
    public static function factory() {
        return new self;
    }

    /**
     * 保存新词到分词表
     * @param $params
     */
    public function Save($word)
    {
        $data = SplitWordTable::factory()->getRow(['word' => $word]);
        if (!$data) {
            SplitWordTable::factory()->insert(['word' => $word]);
            return SplitWordTable::factory()->getLastInsertValue();
        }
        return $data['id'];
    }
}