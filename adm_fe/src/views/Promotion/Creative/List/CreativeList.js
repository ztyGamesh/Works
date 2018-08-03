/**
 * @class 广告创意列表页面
 * */
import React, { Component } from 'react';
import { message } from 'antd'
import styles from './CreativeList.less'
import { TableBase, Cell, Links, LinkShow, LinkEdit, LinkAdd, Switch, Batchs, BatchLink, BatchSelect, BatchOption } from '../../../../components/Table'
import {
    CreativeBreadcrumb,
    CreativeAdd,
    CreativeAuditOthers,
    CreativeBatchTitle,
    CreativeBatchUrl,
    CreativeBatchCopy,
    CreativeAuditStatus
} from '../../../../containers/Promotion/CreativeList'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
//编辑操作
import { editStatus, editName, editTitle, editUrl } from './CreativeListEdit'
//批量操作
import { batchActive, batchPause, batchDelete, openTitle, batchTitle, openUrl, batchUrl, openCopy, receiveGroupList, batchCopy } from './CreativeListBatch'
//创意图片路径
const RESOURCE = '//static.adm.deepleaper.com/material/'

export default class CreativeList extends Component {
    constructor(props) {
        super(props)
        const { pid = '' } = props.match.params
        this.state = {
            key: 0,
            pid,
            gid: '',
            planName: '',
            groupName: '',
            history: props.history,
            columns: [
                {
                    title: '创意名称',
                    dataIndex: 'name',
                    width: 160,
                    // fixed: true,
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid' && row.usable == 1
                        return <Cell value={value} row={row} edit={edit} limit={16}
                            onEdit={editName} />
                    }
                }, {
                    title: '创意标题',
                    dataIndex: 'material.title',
                    width: 160,
                    render: (value, row, index) => {
                        const edit = row.ad_scene == 1 && row.status !== 'invalid' && row.usable == 1
                        return <Cell value={value} row={row} edit={edit} limit={16}
                            onEdit={editTitle} />
                    }
                }, {
                    title: '图片预览',
                    dataIndex: 'material.pic',
                    width: 180,
                    render: (value, row, index) => {
                        const { material = {} } = row
                        const { pic, pic1, pic2, pic3 } = material
                        if (row.promote_type == 2) {
                            if (pic) {
                                return <div>{pic}</div>
                            } else if (pic1) {
                                return <div>{pic1}<br />{pic2}<br />{pic3}</div>
                            }
                        } else {
                            if (pic) {
                                return <div className={styles.imgs}>
                                    <img className={styles.imgone} src={RESOURCE + pic} />
                                </div>
                            } else if (pic1) {
                                return <div className={styles.imgs}>
                                    <img className={styles.img} src={RESOURCE + pic1} />
                                    <img className={styles.img} src={RESOURCE + pic2} />
                                    <img className={styles.img} src={RESOURCE + pic3} />
                                </div>
                            }
                        }
                    }
                }, {
                    title: 'URL',
                    dataIndex: 'link',
                    width: 160,
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid' && row.usable == 1
                        if (row.ad_scene != 2) {
                            return <Cell value={value} row={row} edit={edit} limit={16}
                                onEdit={editUrl} />
                        }
                    }
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    filters: [
                        { text: '启用', value: 'active' },
                        { text: '暂停', value: 'pause' },
                        { text: '无效', value: 'invalid' }
                    ],
                    filterMultiple: false,
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid' && row.usable == 1
                        return <Switch value={value} row={row}
                            onClick={editStatus}
                            disabled={!edit}
                            config={[
                                { text: '启用', value: 'active' },
                                { text: '暂停', value: 'pause' },
                                { text: '无效', value: 'invalid' }
                            ]}
                        />
                    }
                },
                {
                    title: '广告组',
                    dataIndex: 'goup_name',
                    render: (value, row, index) => (
                        <Cell value={value} row={row} link limit={16}
                            tag={row.group_is_new == 1 && '新'}
                            onLink={e => this.toPlanHandle(row.goup_id, row.group_is_new == 1)} />
                    )
                },
                {
                    title: '广告计划',
                    dataIndex: 'plan_name',
                    render: (value, row, index) => (
                        <Cell value={value} row={row} link limit={16}
                            tag={row.plan_is_new == 1 && '新'}
                            onLink={e => this.toCreativeHandle(row.plan_id)} />
                    )
                }, {
                    title: '广告形式',
                    dataIndex: 'ad_scene',
                    filters: [
                        { text: '展示广告', value: '1' },
                        { text: '搜索广告', value: '2' }
                    ],
                    // 广告形式，默认搜索广告，单一广告计划下创意列表不设置默认
                    filteredValue: pid === '' ? ['2'] : undefined,
                    filterMultiple: false,
                    renderFilters: true
                }, {
                    title: '推广类型',
                    dataIndex: 'promote_type',
                    filters: [
                        { text: '通用创意广告', value: '1' },
                        { text: '动态商品广告', value: '2' }
                    ],
                    filterMultiple: false,
                    renderFilters: true
                }, {
                    title: 'Deepleaper审核状态',
                    dataIndex: 'audit_status',
                    render: (value, row, index) => (
                        <CreativeAuditStatus value={value} comment={row.comment} />
                    ),
                    sorter: true
                },
                // {
                //     title: '媒体审核状态',
                //     dataIndex: 'audit_others',
                //     render: (value = [], row, index) => {
                //         if (value.length > 0) {
                //             return <CreativeAuditOthers value={value} row={row} />
                //         }
                //     },
                //     sorter: true
                // }, 
                {
                    title: '花费(元)',
                    dataIndex: 'spend_budget'
                }, {
                    title: '展示数',
                    dataIndex: 'imp'
                }, {
                    title: '点击数',
                    dataIndex: 'clk'
                }, {
                    title: '点击率(%)',
                    dataIndex: 'ctr',
                    render: (value, row, index) => {
                        if (value || value === 0) {
                            return (value * 100).toFixed(2)
                        }
                    }
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    render: (value, row, index) => {
                        if (row.usable == 0) {
                            return '失效'
                        }
                        const edit = row.status !== 'invalid'
                        if (edit) {
                            return <Links>
                                <LinkEdit onClick={e => this.editHandle(row.plan_id, value)} />
                            </Links>
                        }
                    }
                }
            ]
        }
    }

    async componentWillMount() {
        // 路由变化，页面更换key完成刷新
        this.unlisten = this.state.history.listen(e => {
            this.setState({ key: +new Date() })
        })
        await this.receivePlanInfo(this.state.pid)
    }

    componentWillUnmount() {
        // 移除路由监听
        this.unlisten()
    }

    componentWillReceiveProps(nextProps) {
        // 路由变化后，获取新的pid
        const { pid = '' } = nextProps.match.params
        this.setState({
            columns: this.state.columns.map(t => {
                const item = { ...t }
                switch (t.dataIndex) {
                    // 广告形式，默认搜索广告，单一广告计划下创意列表不设置默认
                    case 'ad_scene':
                        item.filteredValue = pid === '' ? ['2'] : undefined
                        break
                }
                return item
            })
        })
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { pageSize, current, filters, sorter } = params
        const req = {
            plan_id: this.props.match.params.pid || '',
            search: params.searchText,
            sort: sorter.field,
            order: sorter.order || 'desc',
            limit: pageSize,
            offset: pageSize * (current - 1),
            begin: '',
            end: '',
            promote_type: filters.promote_type && filters.promote_type[0] || '',
            ad_scene: filters.ad_scene && filters.ad_scene[0] || '',
            status: filters.status && filters.status[0] || '',
            bid_type: filters.bid_type && filters.bid_type[0] || ''
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/adcreativelist`,
            method: 'get',
            data: req
        })
        console.log('list====>', req, res)
        if (res) {
            return {
                rows: res.data.rows,
                total: res.data.total
            }
        }
    }

    /**
     * @method receivePlanInfo 获取广告计划信息
     */
    receivePlanInfo = async (id) => {
        const req = { id }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/fetchadplan`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            const data = res.data || {}
            const gid = data.group_id || ''
            if (gid) {
                await this.setState({
                    gid,
                    planName: data.name || ''
                })
                await this.receiveGroupInfo(data.group_id || '')
            }

        }
    }

    /**
     * @method receiveGroupInfo 获取广告组信息
     */
    receiveGroupInfo = async (id) => {
        const req = { id }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/fetchadgroup`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            this.setState({
                groupName: res.data && res.data.name || ''
            })
        }
    }

    /**
     * @method addHandle 添加创意
     */
    addHandle = () => {
        const { pid = '' } = this.props.match.params
        if (pid) {
            this.state.history.push('/promotion/creative/operate/' + pid)
            return false
        }
    }

    /**
     * @method addSelectHandle 选择广告计划，添加创意
     */
    addSelectHandle = async (ids, rows, values) => {
        const data = await values
        if (data) {
            const { pid } = data
            if (pid) {
                this.state.history.push('/promotion/creative/operate/' + pid)
            }
        }
        return false
    }

    /**
     * @method editHandle 编辑创意
     */
    editHandle = (pid, cid) => {
        this.state.history.push(`/promotion/creative/operate/${pid}/${cid}`)
    }

    /**
     * @method toGroupHandle 广告组列表
     */
    toGroupHandle = () => {
        this.props.history.push('/promotion/group')
    }

    /**
     * @method toPlanHandle 当前组下计划列表
     */
    toPlanHandle = (gid, isNew) => {
        if (isNew) {
            const req = {
                event_type: 1,
                data: gid
            }
            const res = request({
                url: `${BUSINESSAPIHOST}/event/report`,
                method: 'get',
                data: req
            })
        }
        this.state.history.push('/promotion/plan/' + gid)
    }

    /**
     * @method toCreativeHandle 当前计划下创意列表
     */
    toCreativeHandle = (pid) => {
        this.state.history.push('/promotion/creative/' + pid)
    }

    render() {
        const { pid = '' } = this.props.match.params
        const { columns, groupName, gid, planName } = this.state
        return (
            <div className={styles.body} key={this.state.key}>
                <CreativeBreadcrumb className={styles.header}
                    toGroup={e => this.toGroupHandle()}
                    group={groupName}
                    toPlan={e => this.toPlanHandle(gid)}
                    text={planName}
                    view={{ pid }} />
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="新建广告创意"
                        search="请输入广告创意名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        rowKey={'id'}
                        canCheck
                        addModal={<CreativeAdd onSubmit={this.addSelectHandle} receiveGroupList={receiveGroupList} />}
                        extra={
                            <Batchs>
                                <BatchLink text="启用" onClick={batchActive} />
                                <BatchLink text="暂停" onClick={batchPause} />
                                <BatchLink text="删除" onClick={batchDelete} confirm="已选中#length个广告创意，删除后将不能恢复，确定删除吗？" />
                                <BatchSelect text="批量操作">
                                    <BatchOption text="修改创意标题/描述"
                                        onClick={openTitle}
                                        modal={<CreativeBatchTitle onSubmit={batchTitle} />} />
                                    <BatchOption text="修改创意URL"
                                        onClick={openUrl}
                                        modal={<CreativeBatchUrl onSubmit={batchUrl} />} />
                                    <BatchOption text="复制广告创意"
                                        onClick={openCopy}
                                        modal={<CreativeBatchCopy onSubmit={batchCopy} receiveGroupList={receiveGroupList} />} />
                                </BatchSelect>
                            </Batchs>
                        }
                    />
                </div>
            </div>
        )
    }
}