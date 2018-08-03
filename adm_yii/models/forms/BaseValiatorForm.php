<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/9/18
 * Time: 下午8:45
 */

namespace app\models\forms;


use yii\base\InvalidParamException;
use yii\base\Model;

abstract class BaseValiatorForm extends Model
{
    /**
     * @param $data
     * @param string $formName
     * @return array
     * @throws InvalidParamException
     */
    public static function doValidate($data, $scenario='default',$formName = '')
    {
        $form = new static();
        $form->scenario=$scenario;
        $form->load($data, $formName);
        if (!$form->validate()) {
            throw new InvalidParamException(json_encode(array_values($form->errors),JSON_UNESCAPED_UNICODE));
        }
        return $form->toArray();
    }

    /**
     * 生成示例数据
     * @return array
     */
    public static function forkData(){
        return [];
    }
}