/**
 * @class 联盟媒体
 */

import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '联盟媒体',
            field: 'resource',
            multiple: true,
            placeholder: '请选择联盟媒体，可多选',
            validate: (value) => {

            }
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}