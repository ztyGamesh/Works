/**
 * @class 图片
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {String} extra 提示
 */
import React from 'react'
import { Form, Input } from 'antd'
import { extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        const {
            required,
            label,
            field,
            placeholder = '',
            extra,
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
                    initialValue
                })(
                    <Img placeholder={placeholder} />
                )}
            </FormItem>
        )
    }
}

class Img extends React.Component {
    render() {
        const { placeholder, value } = this.props
        return value ? (
            <img style={{
                width: 150,
                height: 'auto',
                display: 'block',
                border: 'none'
            }} src={value} />
        ) : <div>{placeholder}</div>
    }
}