/**
 * @class 申请提现
 */
import React from 'react'
import { FormWell, FormInput, FormTextarea, FormSubmit } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            input: {
                label: '申请提现金额（含税）',
                field: 'amount',
                required: true,
                validate: (value) => {
                    const { max } = this.props
                    if (!/^\d+\.?\d{0,1}$/g.test(value)) {
                        return '请输入正确的金额，最多一位小数'
                    }
                    if (+value > max) {
                        return '申请金额不能超过最大提现金额'
                    }
                }
            },
            text: {
                label: '备注',
                field: 'comment',
                required: true
            }
        }
    }

    render() {
        return (
            <FormWell className={this.props.className} title="申请提现" {...this.props}>
                <FormInput {...this.state.input} extra={`当前最大提现金额为${this.props.max}`} />
                <FormTextarea {...this.state.text} />
                <FormSubmit onCancel={this.props.onCancel} text="立即申请" />
            </FormWell>
        )
    }
}