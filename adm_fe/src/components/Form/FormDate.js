/**
 * @class 时间选择器
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Function} onChange change事件
 * @prop {Function} disabledDate 不可选时间
 * 
 * @method validate(value:Array)
 * @param {String} value 当前输入框值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 */
import React from 'react'
import { Form, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

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
            validate,
            onChange,
            initialValue = [],
            disabledDate,
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
                    <RangePicker allowClear={false}
                        style={{ width: '100%' }}
                        disabled={disabled}
                        onChange={onChange}
                        disabledDate={disabledDate} />
                )}
            </FormItem>
        )
    }
}