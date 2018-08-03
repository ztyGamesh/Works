/**
 * @class 投放周期
 */
import React from 'react'
import moment from 'moment'
import { FormDate } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '投放周期',
            field: 'cycle',
            required: true,
            validate: (value) => {
                if (value.length === 0) {
                    return '请选择投放周期'
                }
            },
            disabledDate: (current) => {
                return current.diff(moment(), 'day') < 0
            }
        }
    }

    render() {
        return (
            <FormDate {...this.state} {...this.props} />
        )
    }
}