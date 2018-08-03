/**
 * @class deeplink地址
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'deeplink地址',
            field: 'deep_link',
            placeholder: '当投放WIFI万能钥匙Android端信息流deeplink广告时填写',
            validate: (value) => {
            }
        }
    }

    render() {
        return (
            <FormInput {...this.state} {...this.props} />
        )
    }
}