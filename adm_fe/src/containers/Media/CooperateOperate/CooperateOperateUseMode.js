/**
 * 新建内容合作 --- 接入方式
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '接入方式',
            field: 'use_mode',
            placeholder: '请选择接入方式',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请选择接入方式'
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