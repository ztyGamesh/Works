/**
 * @class 应用包名称
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '应用包名称',
            field: 'app_pkg',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请配置应用包名称'
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