/**
 * @class 批量复制
 */
import React from 'react'
import { Form, Input } from 'antd'
import { Modal } from '../../../components/Table'
import { FormTree } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        const firstObj = props.checkedRows[0] || {}
        this.state = {
            groupData: {
                field: 'pid',
                data: [],
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择广告计划'
                    }
                }
            },
            params: {
                purpose: firstObj.purpose || '',
                promote_type: firstObj.promote_type || '',
                ad_scene: firstObj.ad_scene || ''
            }
        }
    }

    submitHandle = async (values) => {
        const { checkedKeys, checkedRows, onUpdate, onEdit, onCancel } = this.props
        if (typeof onEdit === 'function' &&
            false !== await onEdit(checkedKeys, checkedRows, values)) {
            onUpdate()
            if (typeof onCancel === 'function') {
                onCancel()
            }
        }
    }

    initHandle = async () => {
        this.searchHandle()
    }

    searchHandle = async (e) => {
        const { receiveGroupList } = this.props
        if (typeof receiveGroupList === 'function') {
            const groupList = await receiveGroupList(e, this.state.params)
            if (groupList !== false) {
                this.setState({
                    groupData: {
                        ...this.state.groupData,
                        data: groupList
                    }
                })
            }
        }
    }

    render() {
        return (
            <Modal isSubmit title="复制广告创意（已选择#length个广告创意）" onInit={this.initHandle} {...this.props}>
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