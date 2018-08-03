/**
 * @class 简介
 */
import React from 'react'
import { FormTextarea } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '简介',
            field: 'intro',
            required: true,
            validate: (value) => {
            }
        }
    }

    render() {
        return (
            <FormTextarea {...this.state} {...this.props} />
        )
    }
}