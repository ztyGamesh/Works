/**
 * @class 应用下载详情页
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '应用下载详情页',
            field: 'link',
            required: true,
            placeholder: '点击广告创意到达的页面',
            validate: (value) => {
                if (!/^https?:\/\//.test(value)) {
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