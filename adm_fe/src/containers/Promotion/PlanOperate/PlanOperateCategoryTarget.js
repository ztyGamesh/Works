/**
 * @class 用户兴趣标签定向
 */
import React from 'react'
import { FormSelect, FormTreeDouble } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '用户兴趣标签定向',
                field: 'category_target_select',
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
                field: 'category_target',
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择用户兴趣标签定向'
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