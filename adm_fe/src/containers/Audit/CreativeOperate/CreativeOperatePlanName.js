/**
 * @class 广告计划名称
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '广告计划名称',
            field: 'plan_id',
            required: true,
            group: true,
            validate: (value) => {
                if (!value) {
                    // return '请选择广告计划名称'
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