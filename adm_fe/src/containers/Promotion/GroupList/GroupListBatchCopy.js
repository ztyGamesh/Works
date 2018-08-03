/**
 * @class 批量复制
 */
import React from 'react'
import { Form, Input } from 'antd'
import { Modal } from '../../../components/Table'
import { FormRadio } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            copyData: {
                label: false,
                field: 'recurse',
                required: true,
                data: [{
                    value: 1,
                    label: '复制广告组及其广告组下广告计划和广告创意'
                }, {
                    value: 0,
                    label: '仅复制广告组'
                }],
                initialValue: 1
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="复制广告计划（已选择#length个广告组）" onInit={this.initHandle} {...this.props}>
                <FormRadio {...this.state.copyData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)