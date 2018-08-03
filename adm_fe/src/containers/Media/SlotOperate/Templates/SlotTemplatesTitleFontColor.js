/**
 * @class 字色
 */
import React from 'react'
import { Divider } from 'antd'
import { FormInput } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '字色',
            field: `templates.${props.templateId}.setting.title_setting.font-color`,
            data: props.config || [],
            validate: (value) => {
            },
            initialValue: '#000000'
        }
    }

    render() {
        return (
            <FormInput {...this.state} {...this.props} />
        )
    }
}