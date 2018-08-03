/**
 * 新建内容合作 --- 所属应用
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '所属应用',
            field: 'media_uid',
            placeholder: '请选择所属应用',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请选择所属应用'
                }
            }
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}