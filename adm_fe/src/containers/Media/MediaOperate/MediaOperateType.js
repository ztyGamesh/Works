/**
 * @class 媒体类型
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '媒体类型',
            field: 'type',
            required: true,
            data: [
                {
                    value: 2,
                    label: '网页'
                }, {
                    value: 3,
                    label: '应用'
                }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择媒体类型'
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