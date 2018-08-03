/**
 * @class 创意标签
 */
import React from 'react'
import {FormTreeDouble } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            detail: {
                label: true,
                field: 'tag',
                required: true,
                treeCheckable:false,
                // checkable:true,
                multiple:false,
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择创意标签'
                    }
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.showDetail ?
                        <FormTreeDouble {...this.state.detail} {...this.props} data={this.props.receiveData} /> :
                        null
                }
            </React.Fragment>
        )
    }
}