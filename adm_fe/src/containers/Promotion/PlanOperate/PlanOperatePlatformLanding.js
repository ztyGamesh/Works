/**
 * @class 平台 - 落地页
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '平台',
                field: 'platform_landing_select',
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
                field: 'platform_landing',
                placeholder: '落地页平台可多选',
                data: [
                    { label: 'android', value: 'android' },
                    { label: 'ios', value: 'ios' }
                ],
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择平台'
                    }
                },
                multiple: true
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