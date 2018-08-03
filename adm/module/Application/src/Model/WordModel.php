<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22
 * Time: 13:26
 */

namespace Application\Model;

use Application\Table\WordTable;
use Application\Table\DicWordTable;
use Custom\ArrayHandle;

class WordModel
{
    public static function factory()
    {
        return new self;
    }

    /**
     * 查询计划下的词
     * @param $plan_id
     * @return array
     */
    public function FetchPlanWord($plan_id)
    {
        return DicWordTable::factory()->queryList("
                                                    SELECT 
                                                    w.*,
                                                    d.`word`
                                                    FROM `ad_plan_word` AS w INNER JOIN `dic_adm_word` AS d ON w.`word_id` = d.`id`
                                                    WHERE w.`plan_id` = {$plan_id}        
                                                    ");

    }

    /**
     * 分词方法
     * @param $original
     */
    public function SplitWord($original)
    {
        $url = ConfigModel::factory()->GetSplitWordUrl();
        $split_word = file_get_contents($url . urlencode($original));

        $split_word = trim($split_word);

        //分词库不包含改词则插入整个词
        if ($split_word == null || $split_word == '') {
            return SplitWordModel::factory()->Save($original);
        } else {
            $split_word = explode(',', $split_word);
            foreach ($split_word as $word_item) {
                if (!empty($word_item))
                    DicWordTable::factory()->execute(" INSERT IGNORE INTO `dic_word`(`word`) VALUES('{$word_item}')");
            }

            $split_word = "'" . implode("','", $split_word) . "'";

            $result = DicWordTable::factory()->queryRow("SELECT 
                                                    GROUP_CONCAT(id) as ids
                                                    FROM
                                                    `dic_word`
                                                    WHERE word IN ({$split_word})");

            return isset($result['ids']) ? $result['ids'] : null;
        }
    }

    /**
     * 保存
     * @param $params
     */
    public function SavePlanWord($params, $plan_id)
    {
        $array = [];
        foreach ($params as $item){
            if($item['word'] and !empty($item['word']) and !empty(trim($item['word'])))
                $array[] = $item;
        }

        WordTable::factory()->deleteRow(['whereSql' => " and plan_id = {$plan_id}"]);
        if (!empty($array)){
            $this->SavePlanWords($array,$plan_id);
        }
        return true;
    }

    /**
     * 保存新词（如果已经存在则直接返回id）
     * @param $word
     */
    public function SaveWord($word)
    {
        //检查单词是否存在
        $id = DicWordTable::factory()->queryRow("SELECT 
                                                id
                                                FROM dic_adm_word
                                                WHERE word = '{$word}'");

        if ($id and isset($id['id']))
            return $id['id'];

        $split_word = $this->SplitWord($word);

        if (!$split_word)
            throw new \Exception('分词失败！');

        DicWordTable::factory()->insert(['word' => $word, 'split_word' => $split_word]);
        return DicWordTable::factory()->getLastInsertValue();
    }

    /**
     * 批量保存词
     * @param $words
     */
    public function SavePlanWords($params, $plan_id)
    {
        $words = ArrayHandle::FetchMultipleArrayLeafWithKey($params, 'word');
        $ids = $this->SaveWords($words);

        if (count($ids) != count($params))
            throw new \Exception('保存分词失败!');

        for ($index = 0; $index < count($params); $index++) {
            $item = $params[$index];
            WordTable::factory()->insert(['plan_id' => $plan_id, 'word_id' => $ids[$index], 'target_type' => $item['target_type'], 'match_type' => $item['match_type']]);
        }
        return true;
    }

    public function SaveWords($words)
    {
        $ids = [];
        $split_words = $this->SplitWords($words);

        if (!$split_words || count($split_words) != count($words))
            throw new \Exception('分词失败！');

        for ($index = 0; $index < count($split_words); $index++) {
            $id = DicWordTable::factory()->queryRow("SELECT
                                                id
                                                FROM dic_adm_word
                                                WHERE word = '{$words[$index]}'");
            if (!$id or empty($id['id'])) {
                DicWordTable::factory()->insert(['word' => $words[$index], 'split_word' => $split_words[$index]]);
                $ids[] = DicWordTable::factory()->getLastInsertValue();
            } else {
                DicWordTable::factory()->update(['split_word' => $split_words[$index]], ['id' => $id['id']]);
                $ids[] = $id['id'];
            }
        }
        return $ids;
    }

    /**
     *  todo 提取到公共函数库
     *  post请求
     * @param $url
     * @param $data
     * @return bool|mixed
     */
    function getUrlContent($url, $data){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);
        curl_setopt($ch, CURLOPT_TIMEOUT, 90);
        curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
        $data = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($httpcode>=200 && $httpcode<300) ? $data : false;
    }

    /**
     * 分词方法
     * @param $original
     */
    public function SplitWords($words)
    {
        $original = implode(',', $words);
        $url = ConfigModel::factory()->GetBatchSplitWordUrl();
        $url=substr($url,0,strpos($url,'?'));
//
//        $split_words = file_get_contents($url . urlencode($original));
        $split_words=$this->getUrlContent($url,["word"=>$original]);
        $split_words = json_decode($split_words, true);

        if(count($split_words) != count($words))
            throw new \Exception('分词错误！');

        $ids = [];

        for ($index = 0; $index < count($words); $index++) {
            $split_word = trim($split_words[$index]);

            //分词库不包含该词则插入整个词
            if ($split_word == null || $split_word == '') {
                return SplitWordModel::factory()->Save($words[$index]);
            } else {
                $split_word = explode(',', $split_word);
                foreach ($split_word as $word_item) {
                    if (!empty($word_item))
                        DicWordTable::factory()->execute("INSERT IGNORE INTO `dic_word`(`word`) VALUES('{$word_item}')");
                }

                $split_word = "'" . implode("','", $split_word) . "'";

                $result = DicWordTable::factory()->queryRow("SELECT 
                                                    GROUP_CONCAT(id) as ids
                                                    FROM
                                                    `dic_word`
                                                    WHERE word IN ({$split_word})");

                $ids[] = $result['ids'];
            }
        }

        return $ids;
    }

    public function RepeatSplitExistsWord()
    {
        $data = DicWordTable::factory()->getList();
        foreach ($data as $item) {
            $word = $item['word'];
            $split_word = $this->SplitWord($word);
            DicWordTable::factory()->update(['split_word' => $split_word], ['id' => $item['id']]);
        }
        return true;
    }
}