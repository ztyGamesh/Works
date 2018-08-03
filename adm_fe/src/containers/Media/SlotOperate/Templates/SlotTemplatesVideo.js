/**
 * @class 视频-素材格式
 */
import React from 'react'
import { Divider } from 'antd'
import { FormCheckbox } from '../../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '素材格式',
            field: `templates.${props.templateId}.setting.video_setting.format`,
            required: true,
            data: props.config || [],
            validate: (value) => {
                if (!value) {
                    return '请选择素材格式'
                }
            },
            initialValue: ['mp4']
        }
    }

    render() {
        return (
            <FormCheckbox {...this.state} {...this.props} />
        )
    }
}