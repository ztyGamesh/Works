/**
 * @class 申请提现
 */
import React from 'react'
import { Divider } from 'antd'
import { FormWell, FormInput, FormTextarea, FormSubmit } from '../../../components/Form'

export default class extends React.Component {

    render() {
        return (
            <FormWell className={this.props.className} title="申请提现" {...this.props}>
                <FormInput label="申请提现金额（含税）" field="amount" disabled />
                <FormTextarea label="备注" field="comment" disabled />
                <FormSubmit onCancel={this.props.onCancel} text={false} />
            </FormWell>
        )
    }
}