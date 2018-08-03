
/**
 * @class 充值金额
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '公司名称',
            field: 'corporation',
            required: true,
            // disabled:true,
            validate: (value) => {
                console.log('value',value)
            }
        }
    }

    render() {
        return (
            <FormInput {...this.state} {...this.props} />
        )
    }
}