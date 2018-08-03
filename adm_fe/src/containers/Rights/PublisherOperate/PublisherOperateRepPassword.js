/**
 * @class 确认密码
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '重复密码',
            field: 'rep_password',
            required: true,
            type:'password',
            validate: (value) => {
                var passwordVal = this.props.form.getFieldValue('password');
                if(value != passwordVal){
                    return '两次密码填写不一致'
                }
            }
        }
    }

    render() {
        // console.log(this.props.form.getFieldValue)
        // console.log('校验',this.props.passwordVal)
        // console.log('校验',this.props.form.getFieldValue('password'))
        return (
            <FormInput {...this.state} {...this.props} />
        )
    }
}