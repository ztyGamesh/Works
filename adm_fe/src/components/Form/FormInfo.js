/**
 * @class 信息框
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} value 当前值
 */
import React from 'react'
import { Form } from 'antd'
import { readStyle } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {

    render() {
        const {
            required,
            label,
            value = '',
            disabled,
            full
        } = this.props
        const itemProps = {
            required,
            label: label === true ? ' ' : label,
            colon: label !== true,
            ...readStyle(label, full)
        }
        return (
            <FormItem {...itemProps}>
                <div className={`ant-input${disabled ? ' ant-input-disabled' : ''}`} style={{
                    cursor: 'not-allowed',
                    userSelect: 'none'
                }}>
                    {value}&nbsp;
                </div>
            </FormItem>
        )
    }
}