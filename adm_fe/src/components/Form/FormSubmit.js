/**
 * @class 提交
 * 
 * @prop {Function} onCancel 返回列表点击事件
 */
import React from 'react'
import { Form, Button } from 'antd'
import { submitStyle } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { onCancel, onClick, cancelText = '返回列表', text = false } = this.props
        return (
            <FormItem {...submitStyle}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 24
                }}>
                    <Button type="primary" onClick={onCancel}>{cancelText}</Button>
                    {text === false ? null : <div style={{ width: '18px' }}></div>}
                    {text === false ? null : <Button type="primary" htmlType="submit" onClick={onClick}>{text}</Button>}
                </div>
            </FormItem>
        )
    }
}