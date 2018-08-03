/**
 * @class 批量修改创意标题/描述
 */
import React from 'react'
import { Form } from 'antd'
import { Modal } from '../../../components/Table'
import { FormTextarea } from '../../../components/Form'


class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            titleData: {
                label: '修改创意标题',
                field: 'title',
                validate: (value) => {
                    if (value && (value.length < 2 || value.length > 23)) {
                        return '创意标题格式错误！2-23个字'
                    }
                }
            },
            descData: {
                label: '修改创意描述',
                field: 'description',
                validate: (value) => {
                    if (value && (value.length < 2 || value.length > 23)) {
                        return '创意描述格式错误！2-23个字'
                    }
                }
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="修改创意标题/描述（已选择#length个广告创意）" {...this.props}>
                <FormTextarea full size={2} {...this.state.titleData} />
                <FormTextarea full size={2} {...this.state.descData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)