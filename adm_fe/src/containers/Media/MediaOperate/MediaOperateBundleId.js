/**
 * @class 程序主包名
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '程序主包名',
            field: 'bundle_id',
            required: true,
            validate: (value) => {
                if (value === '') {
                    return '程序主包名不能为空'
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