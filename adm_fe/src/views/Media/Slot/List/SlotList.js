/**
 * @class 页面 媒体管理-广告位配置
 */
import React, { Component } from 'react'
import styles from './SlotList.less'
import { TableBase, Links, LinkShow, LinkEdit, Switch } from '../../../../components/Table'
import { Modal, Button } from 'antd'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

export default class SlotList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            modalData: {
                uid: ''
            },
            columns: [
                {
                    title: '广告位名称',
                    dataIndex: 'name',
                    width: 120,
                    // fixed: true
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    // filters: [
                    //     { text: '启用', value: 'active' },
                    //     { text: '冻结', value: 'pause' }
                    // ],
                    render: (value, row, index) => (
                        <Switch
                            value={value}
                            onClick={e => this.changeSwitchHandle('status', e, row)}
                            config={[
                                { text: '启用', value: 'active' },
                                { text: '冻结', value: 'pause' }
                            ]}
                        />
                    )
                }, {
                    title: '广告形式',
                    dataIndex: 'slot_class_name',
                    filters: () => this.getFilterList('slot_class_name'),
                    filterMultiple: false
                }, {
                    title: '所属媒体',
                    dataIndex: 'media_name',
                    filters: () => this.getFilterList('media_name'),
                    filterMultiple: false
                }, {
                    title: '媒体类型',
                    dataIndex: 'media_type'
                }, {
                    title: '样式数量',
                    dataIndex: 'template_count',
                    align: 'center'
                }, {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    sorter: true
                }, {
                    title: '操作',
                    dataIndex: 'uid',
                    render: (value, rows, index) => (
                        <Links>
                            <LinkShow onClick={e => this.showHandle(rows)} />
                            <LinkEdit onClick={e => this.editHandle(value)} />
                        </Links>
                    )
                }
            ],
            // 广告形式列表
            slotClassNameList: {},
            // 所属媒体
            mediaNameList: {}
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { pageSize, current, filters, sorter, searchText } = params
        const req = {
            search: searchText,
            sort: sorter.field,
            order: sorter.order,
            limit: pageSize,
            offset: pageSize * (current - 1),
            slotclass: this.state.slotClassNameList[filters.slot_class_name] || '',
            media: this.state.mediaNameList[filters.media_name] || ''
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/slot`,
            method: 'get',
            data: req
        })
        console.log('list====>', req, res)
        if (res) {
            return {
                rows: res.rows,
                total: res.total
            }
        }
    }

    /**
     * @method changeSwitchHandle 开关组件点击事件，更新数据
     * @returns {Promise} 更新结果
     */
    changeSwitchHandle = async (field, value, row) => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/slot/SaveStatus`,
            method: 'post',
            data: {
                uid: row.uid,
                field,
                status: value
            }
        })
        if (res.status === 1) {
            // alert('成功')
            return true
        }
        // alert('失败')
        return false
    }

    addHandle = () => {
        const { history } = this.state
        history.push('/media/slot/operate')
    }

    showHandle = (data = {}) => {
        this.setState({
            showVisible: true,
            modalData: {
                media_name: data.media_name || '',
                name: data.name || '',
                uid: data.uid || '',
                code: data.uid ? `<script src="http://web.adm.deepleaper.com/slot/${data.uid}"></script>` : ''
            }
        })
    }

    editHandle = (uid) => {
        const { history } = this.state
        history.push('/media/slot/operate/' + uid)
    }

    getFilterList = async (field) => {
        if (field === 'slot_class_name') {
            const res = await request({
                url: `${BUSINESSAPIHOST}/user/currentroleslotclass`,
                method: 'post'
            })
            if (res.status === 1) {
                const { data } = res
                this.setState({
                    slotClassNameList: data
                })
                return Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }))
            }
        } else if (field === 'media_name') {
            const res = await request({
                url: `${BUSINESSAPIHOST}/media/medialist`,
                method: 'post'
            })
            if (res.status === 1) {
                const { data } = res
                this.setState({
                    mediaNameList: data
                })
                return Object.keys(data).map(key => ({
                    value: key,
                    text: data[key]
                }))
            }
        }

    }

    render() {
        const { columns, showVisible, modalData } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="添加广告位"
                        search="广告位名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                    />
                    <Modal title="广告位代码"
                        visible={showVisible}
                        onCancel={e => this.setState({ showVisible: false })}
                        footer={<Button onClick={e => this.setState({ showVisible: false })}>关 闭</Button>}
                    >
                        <div className={styles.line}>
                            <div>媒体：</div>
                            <div>{modalData.media_name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>广告位名称：</div>
                            <div>{modalData.name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>广告位ID：</div>
                            <div>{modalData.uid}</div>
                        </div>
                        <div className={styles.line}>
                            <div>广告位代码：</div>
                            <div>{modalData.code}</div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
