<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22
 * Time: 13:26
 */

namespace app\services;

use app\models\DicWordModel;
use app\models\WordModel;
use app\services\custom\ArrayHandle;
use Yii;
use yii\caching\DbDependency;

class WordService
{
    const PLAN_MAX_POSITIVE_WORD = 1000;//计划正向关键词
    const PLAN_MAX_NEGATIVE_WORD = 1000;//计划否定关键词

    public static function factory()
    {
        return new self;
    }

    /**
     * 查询计划下的词
     * @param $plan_id
     * @return array
     */
    public static function FetchPlanWord($plan_id)
    {
        return DicWordModel::queryList("
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
    public static function SplitWord($original)
    {
        $url = ConfigService::GetSplitWordUrl();
        $split_word = file_get_contents($url . urlencode($original));

        $split_word = trim($split_word);

        //分词库不包含改词则插入整个词
        if ($split_word == null || $split_word == '') {
            return SplitWordService::Save($original);
        } else {
            $split_word = explode(',', $split_word);
            foreach ($split_word as $word_item) {
                if (!empty($word_item))
                    DicWordModel::execute(" INSERT IGNORE INTO `dic_word`(`word`) VALUES('{$word_item}')");
            }

            $split_word = "'" . implode("','", $split_word) . "'";

            $result = DicWordModel::queryRow("SELECT 
                                                    GROUP_CONCAT(id) as ids
                                                    FROM
                                                    `dic_word`
                                                    WHERE word IN ({$split_word})");

            return isset($result['ids']) ? $result['ids'] : null;
        }
    }

    /**
     * 保存 词都是去过重的，目前前端去重
     * @param $wordItems array 关键词
     */
    public static function SavePlanWord($wordItems, $plan_id)
    {
        $noEmptyWordItems = [];
        $positiveCnt = 0;//肯定关键词
        $negativeCnt = 0;//否定关键词
        foreach ($wordItems as &$item) {
            if (isset($item['word']) && strlen($item['word'] = trim($item['word'])) > 0) {
                $noEmptyWordItems[] = $item;
                if ($item['target_type'] == '1') {
                    $positiveCnt++;
                } else {
                    $negativeCnt++;
                }
            }
        }
        unset($item);
        if ($positiveCnt > self::PLAN_MAX_POSITIVE_WORD ||
            $negativeCnt > self::PLAN_MAX_NEGATIVE_WORD
        ) {
            throw new \Exception('关键词数量超过最大值,plan_id=' . $plan_id);
        }

//        $sqlQuery1 = 'SELECT pw.word_id,pw.target_type,aw.word FROM ad_plan_word pw JOIN dic_adm_word aw ON aw.id=pw.word_id WHERE pw.plan_id=:pid';
//        $oldWords = Yii::$app->db->createCommand($sqlQuery1)->queryAll();
//        $newWordDict = [];//保存新词
//        foreach ($noEmptyWordItems as &$noEmptyWordItem) {
//            $key = $noEmptyWordItem['word'] . '-' . $noEmptyWordItem['target_type'];
//            $newWordDict[$key] = $noEmptyWordItem;
//        }
//        unset($noEmptyWordItem);
//        foreach ($oldWords as &$oldWord) {
//            $key1 = $oldWord['word'] . '-' . $oldWord['target_type'];
//            if (array_key_exists($key1, $newWordDict)) {
//                unset($newWordDict[$key1]);//删除已添加的词
//            } else {
//            }
//        }
//        unset($oldWord);
//
//        if (!empty($deleteWordIds)) {
//            $ids = implode(',', $deleteWordIds);
//            Yii::$app->db->createCommand("delete from ad_plan_word WHERE plan_id=:pid and word_id in({$ids})")->bindValues([':pid' => $plan_id])->execute();
//        }
//        $newWordItems = array_values($newWordDict);
//        self::SavePlanWords($newWordItems, $noEmptyWordItems, $plan_id);
        self::SavePlanWords($noEmptyWordItems, $noEmptyWordItems, $plan_id);
        return true;
    }

    /**
     * 保存新词（如果已经存在则直接返回id）
     * @param $word
     */
    public static function SaveWord($word)
    {
        //检查单词是否存在
        $id = DicWordModel::queryRowWithBind("SELECT id FROM dic_adm_word WHERE word = :word", [':word' => $word]);

        if ($id and isset($id['id']))
            return $id['id'];

        $split_word = self::SplitWord($word);

        if (!$split_word)
            throw new \Exception('分词失败！');

        DicWordModel::insertOne(['word' => $word, 'split_word' => $split_word]);
        return DicWordModel::getLastInsertValue();
    }

    /**
     * 批量保存词
     * @param $words
     */
    public static function SavePlanWords(&$newWordItems, &$allWordItems, $plan_id)
    {
        //保存词到
        $newAddedWords = [];
        foreach ($newWordItems as $wordItem) {
            $newAddedWords[] = $wordItem['word'];
        }
        self::SaveWords($newAddedWords);

        //改为批量修改
        $rows = [];
        $originalWordPlaceHolder = '';
        $originalWordValues = [];
        $allWords = [];//肯定、否定关键词共有的一些词,影响sql执行 in(..)
        foreach ($allWordItems as $key => $allWordItem) {
            $word = $allWordItem['word'];
            if (!isset($allWords[$word])) {
                $allWords[$word] = 1;
                $originalWordPlaceHolder .= ":v{$key},";
                $originalWordValues[":v{$key}"] = $allWordItem['word'];
            }
        }
        $originalWordPlaceHolder = rtrim($originalWordPlaceHolder, ',');

        if (!empty($originalWordPlaceHolder)) {
            $sqlQuery = "select id,word from dic_adm_word WHERE word in({$originalWordPlaceHolder})";
            $dicAdmRows = Yii::$app->db->createCommand($sqlQuery)->bindValues($originalWordValues)->queryAll();
            $dicAdmDict = [];//word=>id
            foreach ($dicAdmRows as $dicAdmRow) {
                $dicAdmDict[$dicAdmRow['word']] = $dicAdmRow['id'];
            }

            foreach ($allWordItems as $k => $param) {
                if(!isset($dicAdmDict[$param['word']])){
                    $id=Yii::$app->db->createCommand("select id from dic_adm_word WHERE word=:word")->bindValue(':word',$param['word'])->queryScalar();
                    if(!empty($id)){
                        $rows[] = [$plan_id, $id, $param['target_type'], $param['match_type']];
                        Yii::error('分词失败-成功'.$param['word'].'=>'.$id);
                    }else{
                        Yii::error("分词失败，{$param['word']}");
                    }
                }else{
                    $rows[] = [$plan_id, $dicAdmDict[$param['word']], $param['target_type'], $param['match_type']];
                }
            }

            //删除再插入 =》 保证用户看到的顺序是一致的
            Yii::$app->db->createCommand("delete from ad_plan_word WHERE plan_id='{$plan_id}'")->execute();
            $affected = Yii::$app->db->createCommand()->batchInsert(
                WordModel::tableName(),
                ['plan_id', 'word_id', 'target_type', 'match_type'],
                $rows)->execute();
            Yii::error('分词原词:'.count($allWordItems).";db插入：".count($rows).";affected:".$affected);
            return $affected;
        }else{
            //删除再插入 =》 保证用户看到的顺序是一致的
            return Yii::$app->db->createCommand("delete from ad_plan_word WHERE plan_id='{$plan_id}'")->execute();
        }

    }

    /**
     * 首先去重，然后将原词切分成元词，保存到数据库
     * @param $newWords
     *  array  [dic_adm_word.id]
     * @throws \Exception
     */
    public static function SaveWords(&$newWords)
    {
        //分过的词 数组元素顺序和$originalWords保持一致
        $newWords = array_unique($newWords);//去重
        if (empty($newWords)) {
            return;
        }
        self::SplitWords($newWords);

////        $placeHolder = '';
//        $originalWordPlaceHolder = '';
//        $originalWordValues = [];
//        foreach ($newWords as $key => $originalWord) {
//            $originalWordPlaceHolder .= ":v{$key},";
//            $originalWordValues[":v{$key}"] = $originalWord;
////            $placeHolder .= "(:word{$key},:split_word{$key}),";
//        }
//        $originalWordPlaceHolder = rtrim($originalWordPlaceHolder, ',');
//
////        $sqlQuery = "select id as cnt from dic_adm_word WHERE word in({$originalWordPlaceHolder}) ORDER BY field(word,{$originalWordPlaceHolder})";
//        $sqlQuery = "select count(1) as cnt from dic_adm_word WHERE word in({$originalWordPlaceHolder})";
//        $command = Yii::$app->db->createCommand($sqlQuery)->bindValues($originalWordValues);
//        $cnt = $command->queryScalar();
//        if ($cnt != ($len2 = count($newWords))) {
//            Yii::error("保存分词失败,len1={$cnt},len2={$len2},details:" . json_encode($newWords, JSON_UNESCAPED_UNICODE));
//            throw new \Exception('保存分词失败!');
//        }
    }

    /**
     *  todo 提取到公共函数库
     *  post请求
     * @param $url
     * @param $data
     * @return bool|mixed
     */
    public static function getUrlContent($url, $data)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);
        curl_setopt($ch, CURLOPT_TIMEOUT, 90);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $data = curl_exec($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($httpcode >= 200 && $httpcode < 300) ? $data : false;
    }

    /**
     * 分词方法 //新词请求接口，老词直接读数据库
     * @param $original
     *  ['元词id1,元词id2','元词idn']
     */
    public static function SplitWords(&$originalWords)
    {
        list($placeHolder, $bindValues) = BaseService::makeHolderAndValues($originalWords);

        $oldWords = Yii::$app->db
            ->createCommand("SELECT word FROM dic_adm_word WHERE word in($placeHolder)")
            ->bindValues($bindValues)
            ->queryColumn();

        $newWords = array_values(array_diff($originalWords, $oldWords));

        if (!empty($newWords)) {
            self::splitWordsUsingApi($newWords);
        }
    }

    /**
     * @param $newOriginalWords
     * @throws \Exception
     */
    protected static function splitWordsUsingApi(&$newOriginalWords)
    {
        if (empty($newOriginalWords)) {
            return;
        }
        $original = implode(',', $newOriginalWords);
        $url = ConfigService::GetBatchSplitWordUrl();
        $url = substr($url, 0, strpos($url, '?'));
        $ts1 = microtime(true);
        // [中国股市汽车二手,批量添加] => ["中国,股市,汽车,二手", "批量,添加"]
        $split_words = self::getUrlContent($url, ["word" => $original]);
        $split_words = json_decode($split_words, true);
        $timeCost = microtime(true) - $ts1;
        Yii::info("分词服务耗时:{$timeCost}", 'profile');

        if (count($split_words) != count($newOriginalWords)) {
            Yii::error('分词错误,原词是：' . json_encode($newOriginalWords, JSON_UNESCAPED_UNICODE) . "\n分词结果是：" . json_encode($split_words, JSON_UNESCAPED_UNICODE));
            throw new \Exception('分词错误！');
        }

        $gId = 1;
        $placeHolderInsert = '';//插入语句占位符
        $valueInsertArr = [];//插入语句值
        $valueQueryArr = [];//查询语句值
        $placeHolderQueryArr = [];//查询语句占位符
        $len = count($newOriginalWords);
        for ($index = 0; $index < $len; $index++) {
            $validWords = explode(',', $split_words[$index]);
            $placeHolderStr = '';
            $valueQueryRow = [];
            if (!empty($validWords)) {
                foreach ($validWords as $validWord) {
                    $placeHolderStr .= ":v{$gId},";
                    $placeHolderInsert .= "(:v{$gId}),";
                    $valueInsertArr[":v{$gId}"] = $validWord;
                    $valueQueryRow[":v{$gId}"] = $validWord;
                    $gId++;
                }
                $placeHolderStr = rtrim($placeHolderStr, ',');
                $placeHolderQueryArr[] = $placeHolderStr;
                $valueQueryArr[] = $valueQueryRow;
            } else {
                $placeHolderQueryArr[] = '';
                $valueQueryArr[] = null;
            }
        }
        $placeHolderInsert = rtrim($placeHolderInsert, ',');
        $sql0 = "INSERT IGNORE INTO `dic_word`(`word`) VALUES $placeHolderInsert";
        Yii::$app->db->createCommand($sql0)->bindValues($valueInsertArr)->execute();

        $placeHolder2 = '';
        $bindValues2 = [];
        foreach ($newOriginalWords as $k => $originalWord) {
            if (!empty($placeHolderQueryArr[$k])) {
                //每次新词对应的 元词id
                $sql = "SELECT GROUP_CONCAT(id) as ids FROM `dic_word` WHERE word IN ($placeHolderQueryArr[$k])";
                $id = Yii::$app->db->createCommand($sql)->cache()->bindValues($valueQueryArr[$k])->queryScalar();
                $placeHolder2 .= "(:word{$k},:split_word{$k}),";
                $bindValues2[":word{$k}"] = $originalWord;
                $bindValues2[":split_word{$k}"] = $id;
            } else {
//                $ids[] = '';
            }
        }
        if ($placeHolder2 = rtrim($placeHolder2, ',')) {
            $sql = 'INSERT INTO dic_adm_word(word,split_word) VALUES '
                . $placeHolder2
                . '  ON DUPLICATE KEY UPDATE split_word=values(split_word)';
            Yii::$app->db->createCommand($sql)->bindValues($bindValues2)->execute();
        }
    }

    public static function RepeatSplitExistsWord()
    {
        $data = DicWordModel::getList();
        foreach ($data as $item) {
            $word = $item['word'];
            $split_word = self::SplitWord($word);
            DicWordModel::updateAll(['split_word' => $split_word], ['id' => $item['id']]);
        }
        return true;
    }


}