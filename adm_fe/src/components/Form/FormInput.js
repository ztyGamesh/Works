/**
 * @class 输入框
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Function} onChange change事件
 * 
 * @method validate(value:String)
 * @param {String} value 当前输入框值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 */
import React from 'react'
import { Form, Input } from 'antd'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {
    componentDidMount() {
        const { field, addRef } = this.props
        addRef(field, this.refNode)
    }

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
            initialValue = '',
            type = 'text',
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
                    <Input disabled={disabled}
                           type={type}
                        ref={ref => this.refNode = ref}
                        autoComplete="off"
                        onChange={onChange}
                        placeholder={placeholder} />
                )}
            </FormItem>
        )
    }
}