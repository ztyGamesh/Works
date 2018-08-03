/**
 * @class 屏蔽行业
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '屏蔽行业',
            field: 'shield',
            required: true,
            data: [
                {
                    value: 0,
                    label: '不屏蔽'
                }, {
                    value: 1,
                    label: '屏蔽'
                }
            ],
            validate: (value) => {
                if (value === undefined) {
                    return '请选择屏蔽行业'
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