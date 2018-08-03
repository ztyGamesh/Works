/**
 * @class 推广目的
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '选择推广目的',
            field: 'purpose',
            required: true,
            data: [
                { value: 'landing', label: '落地页' },
                { value: 'download', label: '应用下载' }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择推广目的'
                }
            },
            initialValue: 'landing'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}