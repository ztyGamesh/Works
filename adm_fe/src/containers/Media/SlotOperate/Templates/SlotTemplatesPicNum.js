/**
 * @class 图片数量
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '图片数',
            field: `templates.${props.templateId}.setting.pic_setting.number`,
            required: true,
            data: props.config || [],
            validate: (value) => {
                if (!value) {
                    return '请选择图片数'
                }
            },
            initialValue: '3'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}