/**
 * @class 账户类型
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '账户类型',
            field: 'media_type',
            required: false,
            data: [
                {
                    value: 'media',
                    label: '媒体'
                }, {
                    value: 'adx',
                    label: 'Ad Exchange'
                }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择账户类型'
                }
            }
        }
    }

    render() {
        return (
            <FormRadio {...this.state} {...this.props} />
        )
    }
}