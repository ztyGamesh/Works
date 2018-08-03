/**
 * @class 图片位置
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '图片位置',
            field: `templates.${props.templateId}.setting.pic_setting.position`,
            required: true,
            data: props.config || [],
            validate: (value) => {
                if (!value) {
                    return '请选择图片位置'
                }
            },
            initialValue: 'left'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}