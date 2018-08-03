/**
 * @class 下载链接
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '下载链接',
            field: 'download_link',
            required: true,
            validate: (value) => {
                if (!/^(http:\/\/|https:\/\/){1}/.test(value)) {
                    return '请填写以http(https)开头的链接地址'
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