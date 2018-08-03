/**
 * @class 联系人手机号码
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '联系人手机号码',
            field: 'tel',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请输入联系人手机号码'
                }
                if(!/^1\d{10}$/.test(value)){
                    return '手机号码格式错误'
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