/**
 * @class 批量修改日预算
 */
import React from 'react'
import { Form } from 'antd'
import { Modal } from '../../../components/Table'
import { FormInput } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            budgetData: {
                label: '修改日预算(元)',
                field: 'budget',
                required: true,
                placeholder: '可输入金额范围：50~9999999999.99',
                validate: (value) => {
                    if (!(/^[0-9]{1,10}(|\.[0-9]{0,2})$/.test(value) && value >= 50)) {
                        return '请输入最多两位小数的数值！范围：50~9999999999.99'
                    }
                }
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="修改日预算（已选择#length个广告计划）" {...this.props}>
                <FormInput {...this.state.budgetData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)