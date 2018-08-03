/**
 * @class 素材尺寸
 */
import React from 'react'
import { Divider } from 'antd'
import { FormSelect } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '素材尺寸',
            field: `templates.${props.templateId}.setting.pic_setting.scale`,
            required: true,
            data: props.config || [],
            validate: (value) => {
                if (!value) {
                    return '请选择素材尺寸'
                }
            },
            initialValue: props.config ? props.config[0].value : ''
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}