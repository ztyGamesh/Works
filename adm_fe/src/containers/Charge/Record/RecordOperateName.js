/**
 * @class 账户名称
 */

import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '账户名称',
            field: 'name',
            multiple: false,
            placeholder: '请选择账户',
            required:true,
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