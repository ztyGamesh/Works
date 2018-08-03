/**
 * @class 开户银行
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '开户银行',
            field: 'bank',
            required: true,
            validate: (value) => {
                const { length } = value.replace(/[^x00-xFF]/g, '**')
                if (length < 1 || length > 50) {
                    return '名称长度应为1-50个字符:汉字占2个字符'
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