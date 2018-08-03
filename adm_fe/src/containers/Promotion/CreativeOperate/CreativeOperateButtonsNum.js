/**
 * @class 添加按钮
 */
import React from 'react'
import { FormCheckbox } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: true,
            field: 'buttons_num',
            data: [
                { label: '按钮', value: '1' }
            ],
            validate: (value) => {
            }
        }
    }

    render() {
        const { view = {} } = this.props
        const { sug_type } = view
        if (sug_type == 0) {
            //非品牌广告
            return null
        }
        return (
            <FormCheckbox {...this.state} {...this.props} />
        )
    }
}