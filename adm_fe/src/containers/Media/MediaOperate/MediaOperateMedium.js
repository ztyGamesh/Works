/**
 * @class 媒体账户
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '媒体账户',
            field: 'medium',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请选择媒体账户'
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