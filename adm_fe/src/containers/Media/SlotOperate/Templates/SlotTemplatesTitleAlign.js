/**
 * @class 标题与图片对齐方式
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '标题与图片对齐方式',
            field: `templates.${props.templateId}.setting.title_setting.align`,
            required: true,
            data: props.config || [],
            validate: (value) => {
                if (!value) {
                    return '请选择对齐方式'
                }
            },
            initialValue: 'top'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}