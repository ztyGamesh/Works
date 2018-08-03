/**
 * @class 密码
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '密码',
            field: 'password',
            required: false,
            type:'password',
            validate: (value) => {
                const reg = /^(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{2,})$/;
                const { length } = value.replace(/[^x00-xFF]/g, '**')
                if (!reg.test(value) || length < 6) {
                    return '请填写正确的密码，格式: 长度至少为6个字符，需要包含数字和大小写字母'
                }
            }
        }
    }

    render() {
        return (
            <FormInput {...this.state} {...this.props} />
        )
    }
}