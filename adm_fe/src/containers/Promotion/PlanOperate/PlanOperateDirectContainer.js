/**
 * @class 复制已有定向设置
 */
import React from 'react'
import { Form, Button, Collapse } from 'antd'
import { FormCustom, FormModal, FormTree, FormStorage } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }

    cancelHandle = () => {
        this.setState({ showModal: false })
    }

    submitHandle = async (values) => {
        const { more = {} } = this.props
        const data = await values
        if (data && typeof more.submit === 'function') {
            more.submit(data.directInfo)
        }
    }

    render() {
        const { more = {} } = this.props
        return (
            <FormCustom label="快速使用已有定向" {...this.props}>
                <div style={{ width: '100%' }}>
                    <Button type="primary" onClick={e => this.setState({ showModal: true })}>复制已有定向设置</Button>
                    <ModalComp showModal={this.state.showModal}
                        onCancel={this.cancelHandle}
                        onSubmit={this.submitHandle}
                        more={more} />
                </div>
            </FormCustom>
        )
    }
}

class ModalComp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupList: {
                field: 'groupList',
                multiple: false,
                full: true,
                onChange: this.changeGroupListHandle,
                height: 400
            },
            directInfo: {
                field: 'directInfo',
                initialValue: {}
            },
            viewDirectInfo: {}
        }
    }

    changeGroupListHandle = async (e) => {
        const { more = {} } = this.props
        const {
            areaList = [],
            channelList = [],
            tagList = [],
            categoryList = [],
            receiveDirect
        } = more
        if (typeof receiveDirect === 'function') {
            const directInfo = await receiveDirect(e)
            if (directInfo !== false) {
                const allChannelList = channelList.reduce((r, t) => r.concat(t, t.children), [])
                const allTagList = tagList.reduce((r, t) => r.concat(t, t.children), [])
                const allCategoryList = categoryList.reduce((r, t) => r.concat(t, t.children), [])
                let kw = ''
                let dkw = ''
                if (directInfo.key_word) {
                    directInfo.key_word.forEach(t => {
                        if (t.target_type == 1) {
                            kw += ',' + t.word
                        } else {
                            dkw += ',' + t.word
                        }
                    })
                }
                this.setState({
                    viewDirectInfo: {
                        area: (directInfo.area ? directInfo.area.split(',') : []).reduce((r, t) => {
                            const obj = areaList.find(s => s.value === t)
                            if (obj) {
                                return r + ',' + obj.label
                            }
                            return r
                        }, '').slice(1) || '不限',
                        platform: directInfo.platform || '不限',
                        network: (directInfo.network || '不限').replace(/UNKNOWN/g, '其他'),
                        media: directInfo.media_slot_target && directInfo.media_slot_target.length ?
                            <React.Fragment>
                                {
                                    directInfo.media_slot_target.map(t => <div key={t.bundle_id}>{
                                        t.media_name + (
                                            t.slots && t.slots.length ?
                                                ':' + t.slots.reduce((r, s) => {
                                                    return r + ',' + s.slot_name
                                                }, '').slice(1) : ''
                                        )
                                    }</div>)
                                }
                            </React.Fragment> : '不限',
                        keyword: kw.slice(1) || '无',
                        denyKeyword: dkw.slice(1) || '无',
                        channel: (directInfo.channel_class ? directInfo.channel_class.split(',') : []).reduce((r, t) => {
                            const obj = allChannelList.find(s => s.value === t)
                            if (obj) {
                                return r + ',' + obj.label
                            }
                            return r
                        }, '').slice(1) || '不限',
                        tag: (directInfo.tag_target || []).reduce((r, t) => {
                            const obj = allTagList.find(s => s.value === t.level2)
                            if (obj) {
                                return r + ',' + obj.label
                            }
                            return r
                        }, '').slice(1) || '不限',
                        category: (directInfo.category_target || []).reduce((r, t) => {
                            const obj = allCategoryList.find(s => s.value === t.level2)
                            if (obj) {
                                return r + ',' + obj.label
                            }
                            return r
                        }, '').slice(1) || '不限',
                    }
                })
                this.props.form.setFieldsValue({ directInfo })
            }
        }
    }

    render() {
        const { more = {} } = this.props
        const { groupList, directInfo, viewDirectInfo } = this.state
        const { purpose, promote_type, ad_scene, groupListDirect } = more
        return (
            <FormModal {...this.props}
                modalTitle="复制已有定向设置"
                isSubmit>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch'
                }}>
                    <div style={{ width: '50%', paddingRight: 6 }}>
                        <FormTree {...groupList} {...this.props}
                            data={groupListDirect} />
                    </div>
                    <div style={{ width: '50%', paddingLeft: 6 }}>
                        <div style={{
                            height: 400,
                            overflow: 'auto',
                            textAlign: 'left',
                            borderRadius: 4,
                            border: '1px solid #d9d9d9'
                        }}>
                            <Collapse defaultActiveKey={['1']} bordered={false}>
                                <Collapse.Panel header="地域" key="1">
                                    <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.area || '不限'}</div>
                                </Collapse.Panel>
                                {purpose === 'landing' && ad_scene == 1 ?
                                    <Collapse.Panel header="平台" key="2">
                                        <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.platform || '不限'}</div>
                                    </Collapse.Panel> : null
                                }
                                {ad_scene == 1 ?
                                    <Collapse.Panel header="网络" key="3">
                                        <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.network || '不限'}</div>
                                    </Collapse.Panel> : null
                                }
                                {ad_scene == 1 ?
                                    <Collapse.Panel header="媒体广告位定向" key="4">
                                        <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.media || '不限'}</div>
                                    </Collapse.Panel> : null
                                }
                                <Collapse.Panel header="关键词" key="5">
                                    <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.keyword || '无'}</div>
                                </Collapse.Panel>
                                <Collapse.Panel header="否定关键词" key="6">
                                    <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.denyKeyword || '无'}</div>
                                </Collapse.Panel>
                                {ad_scene == 1 ?
                                    <Collapse.Panel header="频道分类定向" key="7">
                                        <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.channel || '不限'}</div>
                                    </Collapse.Panel> : null
                                }
                                {ad_scene == 1 ?
                                    <Collapse.Panel header="广告行为定向" key="8">
                                        <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.tag || '不限'}</div>
                                    </Collapse.Panel> : null
                                }
                                {ad_scene == 1 ?
                                    <Collapse.Panel header="用户兴趣标签定向" key="9">
                                        <div style={{ paddingLeft: 24, maxHeight: 100, overflow: 'auto' }}>{viewDirectInfo.category || '不限'}</div>
                                    </Collapse.Panel> : null
                                }
                            </Collapse>
                        </div>
                    </div>
                </div>
                <FormStorage {...directInfo} />
            </FormModal>
        )
    }
}

ModalComp = Form.create()(ModalComp)