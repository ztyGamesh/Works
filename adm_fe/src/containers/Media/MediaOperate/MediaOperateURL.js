/**
 * @class 网站地址
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '网站地址',
            field: 'url',
            required: true,
            placeholder: '请以http://或https://开头',
            validate: (value) => {
                if (!/^(http:\/\/|https:\/\/){1}/.test(value)) {
                    return '网站地址输入有误'
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