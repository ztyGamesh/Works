/**
 * @class 媒体分类
 */
import React from 'react'
import { FormCascader } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '媒体分类',
            field: 'class',
            required: true,
            validate: (value) => {
                if (value.length === 0) {
                    return '请选择媒体分类'
                }
            }
        }
    }

    render() {
        return (
            <FormCascader {...this.state} {...this.props} />
        )
    }
}