/**
 * @class 字体
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '字体',
            field: `templates.${props.templateId}.setting.description_setting.font`,
            data: props.config || [],
            validate: (value) => {
            }
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}