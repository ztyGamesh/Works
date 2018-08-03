/**
 * @class 第三方点击监测链接
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '第三方点击监测链接',
            field: 'landing',
            validate: (value) => {
                if (!value) {
                    if (value && !/^https?:\/\//.test(value)) {
                        return '请填写以http(https)开头的第三方点击监测链接'
                    }
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