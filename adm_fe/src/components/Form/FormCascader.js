/**
 * @class 级联选择
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Array} data 可选数据配置
 * @prop {Function} onChange change事件
 * @prop {String} initialValue 默认值
 * 
 * @method validate(value:Any)
 * @param {data[].value} value 选中的值，叶子节点
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 * 
 * @description data[]
 * @prop {Any} value 值
 * @prop {String} label 文本
 * @prop {Array} children 子节点
 */
import React from 'react'
import { Form, Cascader } from 'antd'
import { validateFieldData, extraStyle, readStyle, removeLevelInfo, readLevelInfo } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        const {
            disabled,
            required,
            label,
            field,
            placeholder = '',
            extra,
            data = [],
            validate,
            initialValue = '',
            full
        } = this.props
        const itemProps = {
            required,
            label: label === true ? ' ' : label,
            colon: label !== true,
            extra: <div style={extraStyle}>{extra}</div>,
            ...readStyle(label, full)
        }
        return (
            <FormItem {...itemProps}>
                {getFieldDecorator(field, {
                    rules: [{
                        validator: validateFieldData(validate)
                    }],
                    initialValue
                })(
                    <CascaderBox disabled={disabled}
                        data={data}
                        onChange={this.changeHandle}
                        placeholder={placeholder} />
                )}
            </FormItem>
        )
    }
}

class CascaderBox extends React.Component {
    changeHandle = (e) => {
        const { onChange, data } = this.props
        //只返回叶子节点信息
        const newValue = removeLevelInfo(data, e)
        typeof onChange === 'function' && onChange(newValue.length ? newValue[0] : '')
    }

    render() {
        const { disabled, data, placeholder, value } = this.props
        //叶子节点所在分支信息
        const newValue = readLevelInfo(data, value)
        return (
            <Cascader disabled={disabled}
                options={data}
                onChange={this.changeHandle}
                placeholder={placeholder}
                allowClear={false}
                value={newValue} />
        )
    }
}