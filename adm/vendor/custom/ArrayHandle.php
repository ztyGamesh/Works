<?php
/**
 * Created by PhpStorm.
 * User: gaosiyuan
 * Date: 2015/12/2
 * Time: 18:31
 */

namespace Custom;

/***
 * 数组操作类
 * Class ArrayHandle
 * @package common\dsp\domain\model\operation_platform
 */
class ArrayHandle
{
    /**
     * 获取多维数组叶子节点
     * @param array $array
     * @return array
     */
    public static function FetchMultipleArrayLeaf(array $array)
    {
        $final = [];
        foreach ($array as $item) {
            is_array($item) ? $final = array_merge($final, ArrayHandle::FetchMultipleArrayLeaf($item)) : $final[] = $item;
        }
        return $final;
    }

    /**
     * 从关联数组提取指定键名的键值
     * @param array $array
     * @param $key
     * @return array
     */
    public static function FetchMultipleArrayLeafWithKey(array $array, $key)
    {
        $final = [];

        foreach ($array as $key_iterator => $value) {
            if ($key_iterator === $key)
                $final[] = $value;
            else {
                if (is_array($value))
                    $final = array_merge($final, ArrayHandle::FetchMultipleArrayLeafWithKey($value, $key));
            }
        }
        return $final;
    }

    /***
     * 递归数组查询第一个键名、键值条件相符的数组项
     * @param array $array
     * @param $key
     * @param $value
     * @return array|null
     */
    public static function FindFirstArrayItemWithKeyValue(array $array, $key, $value)
    {
        foreach ($array as $key_iterator => $value_iterator) {
            if ($key_iterator == $key and $value_iterator == $value)
                return $array;
            else {
                if (is_array($value_iterator)) {
                    $final = ArrayHandle::FindFirstArrayItemWithKeyValue($value_iterator, $key, $value);
                    if ($final !== null)
                        return $final;
                }
            }
        }
        return null;
    }

    /***
     * 递归数组查询所有键名、键值条件相符的数组项
     * @param array $array
     * @param $key
     * @param $value
     * @return array|null
     */
    public static function FindArrayItemsWithKeyValue(array $array, $key, $value)
    {
        $final = [];
        foreach ($array as $key_iterator => $value_iterator) {
            if ($key_iterator == $key and $value_iterator == $value)
                $final[] = $array;
            else {
                if (is_array($value_iterator)) {
                    $final = array_merge($final, ArrayHandle::FindArrayItemsWithKeyValue($value_iterator, $key, $value));
                }
            }
        }
        return $final;
    }

    public static function UniqueArray(array $array, $columns = '')
    {
        $unique = [];
        $final = [];
        $columns = is_array($columns) ? $columns : explode(',', $columns);
        foreach ($array as $item) {
            $new_item = [];
            $key = '';
            foreach ($columns as $k_item) {
                $key .= '_' . $item[$k_item];
                $new_item[$k_item] = $item[$k_item];
            }
            if (in_array($key, $unique))
                continue;
            else {
                $unique[] = $key;
                $final[] = $new_item;
            }
        }
        return $final;
    }

    public static function FindArrayColumnsWithKeyValue(array $array, $key, $value, $columns = '')
    {
        $array = self::FindArrayItemsWithKeyValue($array, $key, $value);
        if (!$columns)
            return $array;
        return self::UniqueArray($array, $columns);
    }

    /**
     * 提取数组所有key （只提取非整形键名）
     * @param array $array
     */
    public static function FetchArrayKeys(array $array)
    {
        $final = [];
        foreach ($array as $key => $value) {
            if (is_int($key)) {
                if (is_array($value))
                    $final = array_merge($final, ArrayHandle::FetchArrayKeys($value));
            } else
                $final[] = $key;
        }
        return $final;
    }

    /**
     * 指定key排序关联数组
     * @param array $assoc_array
     * @param $key_name
     * @param int $sort_type
     */
    public static function SortTwoDimensionArrayByKey(array &$assoc_array, $key_name, $sort_type = SORT_DESC)
    {
        $item_array = [];

        foreach ($assoc_array as $key => $row) {
            $item_array[$key] = $row[$key_name];
        }

        array_multisort($item_array, $sort_type, $assoc_array);
    }

    /**
     * @param array $array
     * @param array $include_key
     * @param array $exclude_key
     */
    public static function SumArrayByKeyName(array $array, array $include_key = null)
    {
        $include_key = $include_key ? $include_key : [];

        $final = [];
        if ($include_key) {
            foreach ($include_key as $item) {
                $temp = ArrayHandle::FetchMultipleArrayLeafWithKey($array, $item);
                $temp ? $final[$item] = array_sum($temp) : $final[$item] = 0;
            }
            return $final;
        }
        $all_key = ArrayHandle::FetchArrayKeys($array);
        foreach ($all_key as $item) {
            $temp = ArrayHandle::FetchMultipleArrayLeafWithKey($array, $item);
            $temp ? $final[$item] = array_sum($temp) : $final[$item] = 0;
        }
        return $final;
    }

    public static function SortRecursiveArrayByKey(array &$array)
    {
        ksort($array);
        array_walk_recursive($array, function (&$val, $key) {
            if (is_array($val))
                ksort($val);
        });
    }

    /**
     * 比较两个数组在指定列的内容是否一致
     * @param $array1
     * @param $array2
     * @param null $columns
     * @return bool
     */
    public static function CompareArrayContent(array $array1, array $array2, $columns = null)
    {
        if ($array1 ^ $array2)
            return false;

        $str1 = $str2 = "";

        if ($columns != null)
            $columns = is_array($columns) ? $columns : explode(',', $columns);
        else
            $columns = ArrayHandle::FetchArrayKeys($array1);

        ksort($array1);
        ksort($array2);
        array_walk_recursive($array1, function (&$val, $key) {
            if (is_array($val))
                ksort($val);
        });
        array_walk_recursive($array2, function (&$val, $key) {
            if (is_array($val))
                ksort($val);
        });

        array_walk_recursive($array1, function ($val, $key) use ($columns, &$str1) {
            if (in_array($key, $columns))
                $str1 .= print_r($val, true);
        }
        );

        array_walk_recursive($array2, function ($val, $key) use ($columns, &$str2) {
            if (in_array($key, $columns))
                $str2 .= print_r($val, true);
        }
        );

        return $str1 == $str2;
    }

    /**
     * 数组转换为逗号分隔的字符串，否则返回原始字符串
     * @param array $ids
     * @return string
     */
    public static function SplitByComma($ids)
    {
        if (!$ids)
            return '';

        if(is_array($ids))
            return "'" . implode("','",  ArrayHandle::FetchMultipleArrayLeaf($ids)) . "'";
        else
            return $ids;
    }
}