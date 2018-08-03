/**
 * @class 地域
 */
import React from 'react'
import { FormSelect, FormTreeDouble } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '地域',
                field: 'area_select',
                data: [
                    { label: '不限', value: 0 },
                    { label: '省市', value: 1 }
                ],
                validate: (value) => {
                },
                initialValue: 0,
                onChange: props.onSelectChange
            },
            detail: {
                label: true,
                field: 'area',
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择投放地域'
                    }
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
                        <FormTreeDouble {...this.state.detail} {...this.props} data={this.props.receiveData} /> :
                        null
                }
            </React.Fragment>
        )
    }
}