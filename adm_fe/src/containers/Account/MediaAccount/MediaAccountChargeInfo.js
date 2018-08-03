/**
 * @class 财务信息
 */
import React from 'react'
import { Divider } from 'antd'
import { FormInput, FormImg, FormWell } from '../../../components/Form'

export default class extends React.Component {
    render() {
        return (
            <FormWell title="财务信息" className={this.props.className} {...this.props}>
                <FormInput label="开户银行" field="bank" disabled />
                <FormInput label="银行账户" field="bank_account" disabled />
                <FormInput label="开户名" field="account_name" disabled />
                <FormImg label="信息截图存根" field="attach" placeholder="无截图存根" />
            </FormWell>
        )
    }
}