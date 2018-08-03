/**
 * @class 创意审核
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '创意审核',
            field: 'audit_type',
            required: false,
            data: [
                {
                    value: 'self_other',
                    label: '是'
                }, {
                    value: 'self',
                    label: '否'
                }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择创意审核方式'
                }
            }
        }
    }

    render() {
        return (
            <FormRadio {...this.state} {...this.props} />
        )
    }
}