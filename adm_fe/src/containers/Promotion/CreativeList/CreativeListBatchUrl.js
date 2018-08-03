/**
 * @class 批量修改URL
 */
import React from 'react'
import { Form } from 'antd'
import { Modal } from '../../../components/Table'
import { FormInput } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            linkData: {
                label: 'URL',
                field: 'link',
                placeholder: '请填写以http(https)开头的有效着陆页',
                validate: (value) => {
                    if (value && !/^(http:\/\/|https:\/\/){1}/.test(value)) {
                        return '请填写以http(https)开头的有效着陆页'
                    }
                }
            },
            monitoringData: {
                label: '第三方曝光监测链接',
                field: 'monitoring_url',
                placeholder: '请填写以http(https)开头的有效第三方曝光监测链接',
                validate: (value) => {
                    if (value && !/^(http:\/\/|https:\/\/){1}/.test(value)) {
                        return '请填写以http(https)开头的有效第三方曝光监测链接'
                    }
                }
            },
            landingData: {
                label: '第三方点击监测链接',
                field: 'landing',
                placeholder: '请填写以http(https)开头的有效第三方点击监测链接',
                validate: (value) => {
                    if (value && !/^(http:\/\/|https:\/\/){1}/.test(value)) {
                        return '请填写以http(https)开头的有效第三方点击监测链接'
                    }
                }
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="修改创意URL（已选择#length个广告创意）" {...this.props}>
                <FormInput full {...this.state.linkData} />
                <FormInput full {...this.state.monitoringData} />
                <FormInput full {...this.state.landingData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)