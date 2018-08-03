/**
 * @class 投放时段
 */
import React from 'react'
import { FormSelect, FormHour } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '投放时段',
                field: 'hour_target_select',
                data: [
                    { label: '全天投放', value: 0 },
                    { label: '自定义投放时段', value: 1 }
                ],
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择投放时段'
                    }
                },
                initialValue: 0,
                onChange: this.props.onSelectChange
            },
            detail: {
                label: true,
                field: 'hour_target',
                validate: (value) => {
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <FormSelect {...this.state.select} {...this.props} />
                {
                    this.props.showDetail ?
                        <FormHour {...this.state.detail} {...this.props} /> :
                        null
                }
            </React.Fragment>
        )
    }
}