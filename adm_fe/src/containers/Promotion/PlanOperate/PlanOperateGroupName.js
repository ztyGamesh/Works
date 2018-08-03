/**
 * @class 广告组名称
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '广告组名称',
            field: 'group_id',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请选择广告组名称'
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