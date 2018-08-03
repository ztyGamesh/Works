/**
 * @class 批量添加关键词
 */
import React from 'react'
import { Form } from 'antd'
import { Modal } from '../../../components/Table'
import { FormTabs, FormStorage } from '../../../components/Form'
import { KeyWord, KeyWordDeny } from '../PlanOperate/KeyWord'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: '添加关键词/.$+',
            initData: null,
            oldKeywords: {
                field: 'oldkeywords',
                initialValue: {}
            }
        }
    }

    openHandle = async () => {
        const { checkedKeys, receiveData } = this.props
        this.setState({
            activeKey: '添加关键词/.$+'
        })
        if (typeof receiveData === 'function') {
            const data = await receiveData(checkedKeys)
            if (data !== false) {
                const initData = {
                    oldkeywords: data,
                    keyword: '',
                    denykeyword: ''
                }
                console.log(initData)
                this.setState({ initData })
            }
        }
    }

    render() {
        return (
            <Modal {...this.props}
                isSubmit
                initData={this.state.initData}
                onInit={this.openHandle}
                space="0 24px"
                width={750}
                title={<div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <div>添加关键词</div>
                    <div style={{ fontSize: 12, paddingLeft: 12 }}>请您认真复核将使用的关键词，确保其不违法、侵权，且与您的网页信息相关！</div>
                </div>}
            >
                <FormTabs activeKey={this.state.activeKey}
                    onChange={activeKey => this.setState({ activeKey })}
                    tabs={['添加关键词', '添加否定关键词']}>
                    <KeyWord key="+" max={1000} />
                    <KeyWordDeny key="-" max={1000} />
                </FormTabs>
                <FormStorage {...this.state.oldKeywords} />
            </Modal>
        )
    }
}

export default Form.create()(Comp)