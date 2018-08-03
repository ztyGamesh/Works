/**
 * @class 广告位频道分类
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: true,
            field: 'slot_channel',
            multiple: true,
            placeholder: '请选择广告位频道分类',
            validate: (value) => {
                if (value.length === 0) {
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