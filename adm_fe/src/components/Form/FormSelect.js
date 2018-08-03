/**
 * @class 下拉框
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Array} data 可选数据配置
 * @prop {Function} onChange change事件
 * @prop {Boolean} multiple 多选
 * @prop {String|Array} initialValue 默认值，multiple时为Array
 * @prop {Boolean} group 开启分组
 * 
 * @method validate(value:Any)
 * @param {data[].value} value 选中的值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 * 
 * @description data[]
 * @prop {Any} value 值
 * @prop {String} label 文本
 */
import React from 'react'
import { Form, Select } from 'antd'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item
const { Option, OptGroup } = Select

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
            onChange,
            multiple,
            initialValue = multiple ? [] : '',
            group,
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
                    <Select disabled={disabled}
                        placeholder={placeholder}
                        onChange={onChange}
                        mode={multiple ? 'multiple' : undefined}
                        notFoundContent="暂无数据"
                        allowClear={false}>
                        {
                            group ? data.map(t =>
                                <OptGroup key={t.value} label={t.label}>
                                    {
                                        (t.children || []).map(s =>
                                            <Option key={s.value} value={s.value}>{s.label}</Option>
                                        )
                                    }
                                </OptGroup>
                            ) : data.map(t =>
                                <Option key={t.value} value={t.value}>{t.label}</Option>
                            )
                        }
                    </Select>
                )}
            </FormItem>
        )
    }
}