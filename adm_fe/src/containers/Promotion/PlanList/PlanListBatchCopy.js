/**
 * @class 批量复制
 */
import React from 'react'
import { Form, Input } from 'antd'
import { Modal } from '../../../components/Table'
import { FormRadio, FormTree } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        const firstObj = props.checkedRows[0] || {}
        this.state = {
            copyData: {
                field: 'recurse',
                required: true,
                data: [{
                    value: 1,
                    label: '复制广告计划及其广告计划下的广告创意'
                }, {
                    value: 0,
                    label: '仅复制广告计划'
                }],
                initialValue: 1
            },
            groupData: {
                field: 'gid',
                data: [],
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择广告组'
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
            <Modal isSubmit title="复制广告计划（已选择#length个广告计划）" onInit={this.initHandle} {...this.props}>
                <div style={{ width: 210, marginBottom: 24 }}>
                    <Input.Search placeholder="搜索广告组" enterButton
                        onSearch={this.searchHandle}
                        onPressEnter={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            this.searchHandle(e.target.value)
                        }} />
                </div>
                <FormRadio full {...this.state.copyData} />
                <FormTree full {...this.state.groupData} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)