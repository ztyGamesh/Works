/**
 * @class 存储信息
 * @prop {String} field 字段
 */
import React from 'react'

export default class extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        const {
            field,
            initialValue = '',
            value
        } = this.props
        return (
            <div style={{ display: 'none' }}>
                {getFieldDecorator(field, {
                    initialValue
                })(
                    <div>{value}</div>
                )}
            </div>
        )
    }
}