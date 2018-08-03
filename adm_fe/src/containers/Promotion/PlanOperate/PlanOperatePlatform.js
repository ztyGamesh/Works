/**
 * @class 平台
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '平台',
            field: 'platform',
            required: true,
            data: [
                { label: 'android', value: 'android' },
                { label: 'ios', value: 'ios' }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择平台'
                }
            }
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}