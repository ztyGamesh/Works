/**
 * @class 投放速度
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '投放速度',
            field: 'speed',
            data: [
                { label: '匀速投放', value: 'cs' },
                { label: '快速投放', value: 'asap' }
            ],
            validate: (value) => {
            },
            initialValue: 'cs'
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}