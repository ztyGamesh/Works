/**
 * @class 服务器地址
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '服务器地址',
            field: 'server',
            required: true,
            placeholder:'广告请求发送服务器IP地址',
            validate: (value) => {
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

                // const { length } = value.replace(/[^x00-xFF]/g, '**')
                if (!reg.test(value)) {
                    return '请填写正确的服务器地址'
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