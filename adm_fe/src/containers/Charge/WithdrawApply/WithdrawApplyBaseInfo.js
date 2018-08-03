/**
 * @class 基本信息
 */
import React from 'react'
import { FormInput, FormWell } from '../../../components/Form'

export default class extends React.Component {
    render() {
        return (
            <FormWell title="基本信息" className={this.props.className} {...this.props}>
                <FormInput label="账户名" field="name" disabled />
                <FormInput label="公司名称" field="corporation_name" disabled />
                <FormInput label="邮箱" field="mail" disabled />
                <FormInput label="联系人" field="link_name" disabled />
                <FormInput label="手机" field="tel" disabled />
            </FormWell>
        )
    }
}