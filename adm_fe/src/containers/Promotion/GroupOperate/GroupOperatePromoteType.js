/**
 * @class 创意类型
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '选择创意类型',
            field: 'promote_type',
            required: true,
            data: [
                { value: 1, label: '通用创意广告' },
                { value: 2, label: '动态商品广告' }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择创意类型'
                }
            },
            initialValue: 1
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}