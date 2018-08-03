/**
 * @class 手机
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '手机',
            field: 'tel',
            required: true,
            validate: (value) => {
                const reg = /^1\d{10}$/;
                // const { length } = value.replace(/[^x00-xFF]/g, '**')
                if (!reg.test(value)) {
                    return '请填写正确的电话号码'
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