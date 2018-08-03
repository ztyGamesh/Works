/**
 * @class 提交
 */
import React from 'react'
import { FormSubmit } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={this.props.className}>
                <FormSubmit {...this.props} />
            </div>
        )
    }
}