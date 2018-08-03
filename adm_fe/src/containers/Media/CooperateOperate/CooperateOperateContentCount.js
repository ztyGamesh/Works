/**
 * 新建内容合作 --- 内容条数
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '内容条数',
            field: 'content_count',
            placeholder:'请填写1-50之间的整数',
            required: true,
            validate: (value) => {
                var reg = /^[0-9]*[1-9][0-9]*$/;
                if(!reg.test(value)){
                    return '请填写1-50之间的整数'
                }
                if (value < 1 || value > 50) {
                    return '请填写1-50之间的整数'
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