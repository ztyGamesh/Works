/**
 * @class 广告组列表页面
 * */
import React, { Component } from 'react'
import { message } from 'antd'
import styles from './GroupList.less'
import { TableBase, Cell, Links, Link, LinkShow, LinkEdit, LinkAdd, Switch, Batchs, BatchLink, BatchSelect, BatchOption } from '../../../../components/Table'
import { GroupBatchBudget, GroupBatchCopy } from '../../../../containers/Promotion/GroupList'
import Tools from '../../../../containers/Promotion/Tools/Tools'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
//编辑操作
import { editStatus, editName, editBudget } from './GroupListEdit'
//批量操作
import { batchActive, batchPause, batchDelete, openBudget, batchBudget, openCopy, batchCopy } from './GroupListBatch'

export default class GroupList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            columns: [
                {
                    title: '广告组',
                    dataIndex: 'name',
                    width: 160,
                    // fixed: true,
                    render: (value, row, index) => (
                        <Cell value={value} row={row} link edit limit={16}
                            tag={row.is_new == 1 && '新'}
                            onLink={e => this.toPlanHandle(row.id, row.is_new == 1)}
                            onEdit={editName} />
                    )
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    filters: [
                        { text: '启用', value: 'active' },
                        { text: '暂停', value: 'pause' }
                    ],
                    filterMultiple: false,
                    render: (value, row, index) => (
                        <Switch value={value} row={row}
                            onClick={editStatus}
                            config={[
                                { text: '启用', value: 'active' },
                                { text: '暂停', value: 'pause' }
                            ]}
                        />
                    )
                }, {
                    title: '广告形式',
                    dataIndex: 'ad_scene',
                    filters: [
                        { text: '展示广告', value: '1' },
                        { text: '搜索广告', value: '2' }
                    ],
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
                    title: '推广目的',
                    dataIndex: 'purpose',
                    filters: [
                        { text: '落地页', value: 'landing' },
                        { text: '应用下载', value: 'download' }
                    ],
                    filterMultiple: false,
                    renderFilters: true
                }, {
                    title: '日预算(元)',
                    dataIndex: 'budget',
                    width: 120,
                    render: (value, row, index) => (
                        <Cell value={value} row={row} edit
                            onEdit={editBudget} />
                    )
                }, {
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
                    render: (value, row, index) => (
                        <Links>
                            <LinkEdit onClick={e => this.editHandle(value)} />
                            <Link text="添加计划" onClick={e => this.nextHandle(value)} />
                        </Links>
                    )
                }
            ]
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { pageSize, current, filters } = params
        const req = {
            search: params.searchText,
            order: 'desc',
            limit: pageSize,
            offset: pageSize * (current - 1),
            begin: '',
            end: '',
            purpose: filters.purpose && filters.purpose[0] || '',
            promote_type: filters.promote_type && filters.promote_type[0] || '',
            ad_scene: filters.ad_scene && filters.ad_scene[0] || '',
            status: filters.status && filters.status[0] || ''
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/adgrouplist`,
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
     * @method updateEndHandle 表格渲染完成后被调用
     */
    updateEndHandle() {
        //数据渲染后，通过触发滚动条事件更新底部工具箱状态
        Tools.scrollView()
    }

    /**
     * @method addHandle 添加组
     */
    addHandle = () => {
        this.state.history.push('/promotion/group/operate')
    }

    /**
     * @method editHandle 编辑组
     */
    editHandle = (gid) => {
        this.state.history.push('/promotion/group/operate/' + gid)
    }

    /**
     * @method nextHandle 当前组下添加计划
     */
    nextHandle = (gid) => {
        this.state.history.push('/promotion/plan/operate/' + gid)
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

    render() {
        const { columns, showVisible, modalData } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="新建广告组"
                        search="请输入广告组名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        onUpdateEnd={this.updateEndHandle}
                        rowKey={'id'}
                        canCheck
                        extra={
                            <Batchs>
                                <BatchLink text="启用" onClick={batchActive} />
                                <BatchLink text="暂停" onClick={batchPause} />
                                <BatchLink text="删除" onClick={batchDelete} confirm="已选中#length个广告组，删除后将不能恢复，确定删除吗？" />
                                <BatchSelect text="批量操作">
                                    <BatchOption text="修改日预算"
                                        onClick={openBudget}
                                        modal={<GroupBatchBudget onSubmit={batchBudget} />} />
                                    <BatchOption text="复制广告组"
                                        onClick={openCopy}
                                        modal={<GroupBatchCopy onSubmit={batchCopy} />} />
                                </BatchSelect>
                            </Batchs>
                        }
                    />
                </div>
                <Tools history={this.props.history} />
            </div>
        )
    }
}