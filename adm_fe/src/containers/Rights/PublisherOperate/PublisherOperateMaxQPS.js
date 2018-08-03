/**
 * @class 最大QPS设置
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '最大QPS设置(次/秒)',
            field: 'max_qps',
            required: true,
            validate: (value) => {
                const reg = /^[1-9]\d*$/;
                // const { length } = value.replace(/[^x00-xFF]/g, '**')
                if (!reg.test(value)) {
                    return '最大QPS设置应为正整数'
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