/**
 * @class 广告形式
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '选择广告形式',
            field: 'ad_scene',
            required: true,
            data: [
                { value: 1, label: '展示广告' },
                { value: 2, label: '搜索广告' }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择广告形式'
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