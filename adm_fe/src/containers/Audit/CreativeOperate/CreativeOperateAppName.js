/**
 * @class 应用名
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '应用名',
            field: 'ad_source',
            required: true,
            placeholder: '2-10个字',
            validate: (value) => {
                const { length } = value.replace(/[\u2E80-\u9FFF]/g, '**')
                if (length < 4 || length > 20) {
                    return '2-10个字'
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