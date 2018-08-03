/**
 * @class 计划频次控制(次/每人每天)
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '计划频次控制(次/每人每天)',
            field: 'frequency',
            placeholder: '单个人每天最多看多少次广告 不填写时 频次没有上限',
            required: true,
            validate: (value) => {
                if (value === '') {
                    return
                }
                if (!/^[0-9]*$/.test(value)) {
                    return '请输入整数'
                }
                if (value < 1 || value > 100) {
                    return '频次输入范围是1~100'
                }
            }
        }
    }

    render() {
        return (
            <FormInput {...this.state} {...this.props} />
        )
    }
}