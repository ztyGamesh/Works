/**
 * @class 关键词
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '关键词',
            field: 'keywords',
            placeholder: '多个关键词以空格隔开',
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