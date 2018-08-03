/**
 * @class 财务信息
 */
import React from 'react'
import { FormInput, FormImg, FormWell } from '../../../components/Form'

export default class extends React.Component {
    render() {
        return (
            <FormWell title="财务信息" className={this.props.className} {...this.props}>
                <FormInput label="开户银行" field="bank" disabled />
                <FormInput label="银行账户" field="bank_account" disabled />
                <FormInput label="开户名" field="account_name" disabled />
                <FormImg label="信息截图存根" field="attach" placeholder="无截图存根"
                    extra={
                        <div style={{ fontSize: 12, color: 'red' }}>注:请核对以上信息，如信息有误请及时联系Deepleaper CSM团队修改信息</div>
                    }
                />
            </FormWell>
        )
    }
}