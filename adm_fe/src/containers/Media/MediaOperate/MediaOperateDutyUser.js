/**
 * @class deepleaper负责人
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'deepleaper负责人',
            field: 'duty_user',
            required: true,
            validate: (value) => {
                if (value === '') {
                    return 'deepleaper负责人不能为空'
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