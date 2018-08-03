/**
 * @class 网络
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '网络',
                field: 'network_select',
                data: [
                    { label: '不限', value: 0 },
                    { label: '自定义', value: 1 }
                ],
                validate: (value) => {
                },
                initialValue: 0,
                onChange: props.onSelectChange
            },
            detail: {
                label: true,
                field: 'network',
                placeholder: '自定义网络可多选',
                data: [
                    { label: 'WIFI', value: 'WIFI' },
                    { label: '4G', value: '4G' },
                    { label: '其他', value: 'UNKNOWN' }
                ],
                multiple: true,
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择网络'
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
                    this.props.showDetail ? <FormSelect {...this.state.detail} {...this.props} /> : null
                }
            </React.Fragment>
        )
    }
}