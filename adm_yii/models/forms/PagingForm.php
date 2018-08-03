<?php

namespace app\models\forms;
/**
 * PagingForm 分页相关参数
 *
 * ```
 *  $form = PagingForm::doValidate($this->get());
 *
 * ```
 *
 * User: xueleixi
 * Date: 2017/9/18
 * Time: 下午7:03
 */
class PagingForm extends BaseValiatorForm
{
    public $limit;
    public $offset;

    /**
     * @var string 排序方式 asc|desc
     */
    public $order;

    /**
     * @var string 排布字段
     */
    public $sort;

    /**
     * @var string 搜索关键字
     */
    public $search;

    /**
     * @var string 状态过滤
     */
    public $status;

    const SORT_ASC = "asc";
    const SORT_DESC = "desc";

    public function rules()
    {
        return [
            ['limit', 'default', 'value' => 10],
            ['offset', 'default', 'value' => 0],
            [['limit', 'offset'], 'integer'],//只进行验证并不会修改为整数
            ['order', 'validateOrder'],
            [['search','sort'], 'string'],
            ['status', 'in', 'range' => ['pause', 'active']],
        ];
    }

    public function validateOrder($attribute)
    {
        if (!in_array(strtolower($this->$attribute), [self::SORT_ASC, self::SORT_DESC])) {
            $this->addError($attribute, 'sort取值只能为"asc"、"desc"');
        }
    }

}