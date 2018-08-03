/**
 * @class 添加创意选择广告计划
 */
import React from 'react'
import { Form, Input } from 'antd'
import { Modal } from '../../../components/Table'
import { FormTree } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupData: {
                field: 'pid',
                data: [],
                multiple: false,
                validate: (value) => {
                    if (value === '') {
                        return '请选择广告计划'
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
                const firstObj = groupList[0]
                const firstObjChildren = firstObj && firstObj.children || []
                form.setFieldsValue({ pid: firstObjChildren.length && firstObjChildren[0].value || '' })
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="选择广告计划" onInit={this.initHandle} {...this.props}>
                <div style={{ width: 210, marginBottom: 24 }}>
                    <Input.Search placeholder="搜索广告计划" enterButton
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