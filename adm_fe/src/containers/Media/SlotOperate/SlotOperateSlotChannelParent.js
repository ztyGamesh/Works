/**
 * @class 广告位频道分类
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '广告位频道分类',
            field: 'slot_channel_parent',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请选择广告位频道分类'
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