/**
 * @class 计费方式
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '计费方式',
            field: 'bid_type',
            required: true,
            data: [
                { label: 'cpm（元/千次展示）', value: 'cpm' },
                { label: 'cpc（元/次点击）', value: 'cpc' }
            ],
            validate: (value) => {
            },
            initialValue: 'cpm'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}