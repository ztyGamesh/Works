/**
 * @class 批量修改出价
 */
import React from 'react'
import { Form } from 'antd'
import { Modal } from '../../../components/Table'
import { FormInput } from '../../../components/Form'


class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            priceData: {
                label: '修改出价(元)',
                field: 'price',
                required: true,
                placeholder: '可输入金额范围：0.01~9999999999.99',
                validate: (value) => {
                    if (!(/^[0-9]{1,10}(|\.[0-9]{0,2})$/.test(value) && value >= 0.01)) {
                        return '请输入最多两位小数的数值！范围：0.01~9999999999.99'
                    }
                }
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="修改出价（已选择#length个广告计划）" {...this.props}>
                <FormInput {...this.state.priceData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)