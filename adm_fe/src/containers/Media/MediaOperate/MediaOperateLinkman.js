/**
 * @class 联系人
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '联系人',
            field: 'linkman',
            required: true,
            validate: (value) => {
                if (value === '') {
                    return '联系人不能为空'
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