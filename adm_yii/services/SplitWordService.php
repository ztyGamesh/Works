<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/1/9
 * Time: 11:08
 */

namespace app\services;
use app\models\SplitWordModel;


/**
 * 分词模型
 * Class SplitWordModel
 * @package Application\Model
 */
class SplitWordService
{
    public static function factory() {
        return new self;
    }

    /**
     * 保存新词到分词表
     * @param $params
     */
    public static function Save($word)
    {
        $data = SplitWordModel::getRow(['word' => $word]);
        if (!$data) {
            SplitWordModel::insertOne(['word' => $word]);
            return SplitWordModel::getLastInsertValue();
        }
        return $data['id'];
    }
}