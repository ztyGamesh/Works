/**
 * @class 添加计划选择广告组
 */
import React from 'react'
import { Form, Input } from 'antd'
import { Modal } from '../../../components/Table'
import { FormTree, FormSubmit } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupData: {
                field: 'gid',
                data: [],
                multiple: false,
                validate: (value) => {
                    if (value === '') {
                        return '请选择广告组'
                    }
                }
            }
        }
    }

    initHandle = async () => {
        this.searchHandle('')
    }

    searchHandle = async (e = '') => {
        const { receiveGroupList, form } = this.props
        if (typeof receiveGroupList === 'function') {
            const groupList = await receiveGroupList(e)
            if (groupList !== false) {
                await this.setState({
                    groupData: {
                        ...this.state.groupData,
                        data: groupList
                    }
                })
                form.setFieldsValue({ gid: groupList[0] && groupList[0].value || '' })
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="选择广告组" onInit={this.initHandle} {...this.props}>
                <div style={{ width: 210, marginBottom: 24 }}>
                    <Input.Search placeholder="搜索广告组" enterButton
                        onSearch={this.searchHandle}
                        onPressEnter={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            this.searchHandle(e.target.value)
                        }} />
                </div>
                <FormTree full {...this.state.groupData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)