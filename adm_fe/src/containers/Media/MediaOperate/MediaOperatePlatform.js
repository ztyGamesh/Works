/**
 * @class 应用平台
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '应用平台',
            field: 'platform',
            required: true,
            data: [
                {
                    value: 'android',
                    label: 'Android'
                }, {
                    value: 'ios',
                    label: 'iOS'
                }
            ],
            validate: (value) => {
                if (!value) {
                    return '请选择应用平台'
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