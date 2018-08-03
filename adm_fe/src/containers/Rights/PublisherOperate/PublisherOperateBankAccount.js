/**
 * @class 银行账户
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '银行账户',
            field: 'bank_account',
            required: true,
            validate: (value) => {
                const reg = /^\d{16,19}$/;
                // const { length } = value.replace(/[^x00-xFF]/g, '**')
                if (!reg.test(value)) {
                    return '银行账户格式错误：不能为空且为16-19位数字'
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