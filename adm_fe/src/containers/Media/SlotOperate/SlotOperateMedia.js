/**
 * @class 所属媒体
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '所属媒体',
            field: 'media',
            required: true,
            validate: (value) => {
                if (!value) {
                    return '请选择所属媒体'
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