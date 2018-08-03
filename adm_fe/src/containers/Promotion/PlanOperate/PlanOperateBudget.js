/**
 * @class 日预算
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '日预算(元)',
            field: 'budget',
            required: true,
            placeholder: '可输入金额范围：50~9999999999.99',
            validate: (value) => {
                if (!(/^[0-9]{1,10}(|\.[0-9]{0,2})$/.test(value) && value >= 50)) {
                    return '请输入最多两位小数的数值！范围：50~9999999999.99'
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