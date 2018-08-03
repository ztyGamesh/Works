/**
 * @class 添加组件
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '添加组件',
            field: 'links_num',
            required: true,
            data: [
                { label: '信息阵列-单行', value: '1' },
                { label: '信息阵列-双行', value: '2' }
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
            <FormRadio {...this.state} {...this.props} />
        )
    }
}