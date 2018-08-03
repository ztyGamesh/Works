/**
 * @class 标题长度
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        const { config = [] } = props
        const lastObj = config[config.length - 1]
        this.state = {
            label: '标题长度',
            field: `templates.${props.templateId}.setting.title_setting.length`,
            required: true,
            data: config,
            validate: (value) => {
                if (!value) {
                    return '请选择标题长度'
                }
            },
            initialValue: lastObj ? lastObj.value : ''
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}