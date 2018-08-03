/**
 * @class 加密规则备注
 */
import React from 'react'
import { FormTextarea } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '加密规则备注',
            field: 'remark',
            required: false,
            validate: (value) => {
            }
        }
    }

    render() {
        return (
            <FormTextarea {...this.state} {...this.props} />
        )
    }
}