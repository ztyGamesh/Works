/**
 * @class
 */
import React from 'react'
import { Form } from 'antd'
import { Modal } from '../../../components/Table'
import { FormRadio, FormTextarea } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initData: null,
            select: {
                field: 'has_white_list',
                label: '广告主',
                full: true,
                data: [
                    { label: '不限', value: '0' },
                    { label: '仅限定', value: '1' }
                ],
                validate: value => {
                    if (!value) {
                        return '请选择条件'
                    }
                },
                onChange: e => {
                    this.setState({
                        showText: e.target.value == 1
                    })
                }
            },
            text: {
                field: 'client_ids',
                full: true,
                validate: value => {
                    if (!value.trim()) {
                        return '请输入广告位ID'
                    }
                }
            },
            showText: false
        }
    }

    initHandle = async () => {
        const { init } = this.props
        if (typeof init === 'function') {
            const res = await init()
            if (res instanceof Array) {
                const client_ids = res.reduce((r, t) => {
                    return r + t.client_id + '\n'
                }, '')
                const showText = client_ids !== ''
                const initData = {
                    has_white_list: '0'
                }
                if (showText) {
                    initData.has_white_list = '1'
                    initData.client_ids = client_ids
                }
                this.setState({ initData, showText })
            }
        }
    }

    submitHandle = async (checkedKeys, checkedRows, values) => {
        const { submit } = this.props
        const data = await values
        if (data === false) {
            return false
        }
        const { client_ids = '' } = data
        if (typeof submit === 'function') {
            return submit(client_ids.split('\n').reduce((r, t) => {
                const value = t.trim()
                if (value !== '' && !r.includes(value)) {
                    return r.concat(value)
                }
                return r
            }, []).join(','))
        }
    }

    render() {
        return <Modal {...this.props}
            isSubmit
            initData={this.state.initData}
            onInit={this.initHandle}
            onSubmit={this.submitHandle} >
            <FormRadio {...this.state.select} />
            {
                this.state.showText ? <FormTextarea {...this.state.text} /> : null
            }
        </Modal>
    }
}

export default Form.create()(Comp)