/**
 * @class 字号
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '字号',
            field: `templates.${props.templateId}.setting.description_setting.font-size`,
            data: props.config || [],
            validate: (value) => {
                if (!value) {
                    return '请选择字号'
                }
            },
            initialValue: '14'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}