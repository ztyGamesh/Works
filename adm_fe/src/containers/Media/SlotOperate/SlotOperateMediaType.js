/**
 * @class 媒体平台属性
 */
import React from 'react'
import { FormInfo } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '媒体平台属性',
            required: true
        }
    }

    render() {
        return (
            <FormInfo {...this.state} {...this.props} />
        )
    }
}