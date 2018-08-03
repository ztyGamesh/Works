/**
 * @class 广告计划列表页面
 * */
import React, { Component } from 'react';
import { message } from 'antd'
import styles from './PlanList.less'
import { TableBase, Cell, Links, Link, LinkShow, LinkEdit, LinkAdd, Switch, Batchs, BatchLink, BatchSelect, BatchOption } from '../../../../components/Table'
import {
    PlanBreadcrumb,
    PlanAdd,
    PlanBatchPrice,
    PlanBatchBudget,
    PlanBatchCopy,
    PlanBatchKeyword
} from '../../../../containers/Promotion/PlanList'
import Tools from '../../../../containers/Promotion/Tools/Tools'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
//编辑操作
import { editStatus, editName, editPrice, editBudget } from './PlanListEdit'
//批量操作
import {
    batchActive,
    batchPause,
    batchDelete,
    openPrice,
    batchPrice,
    openBudget,
    batchBudget,
    openCopy,
    batchCopy,
    openKeyword,
    batchKeyword,
    receiveGroupList,
    receiveKeyword
} from './PlanListBatch'

export default class PlanList extends Component {
    constructor(props) {
        super(props)
        const { gid = '' } = props.match.params
        this.state = {
            key: 0,
            gid,
            groupName: '',
            history: props.history,
            columns: [
                {
                    title: '广告计划',
                    dataIndex: 'name',
                    width: 160,
                    // fixed: true,
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid'
                        return <Cell value={value} row={row} link edit={edit} limit={16}
                            tag={row.is_new == 1 && '新'}
                            onLink={e => this.toCreativeHandle(row.id, row.is_new == 1)}
                            onEdit={editName} />
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
                    render: (value, row, index) => (
                        <Switch value={value} row={row}
                            onClick={editStatus}
                            config={[
                                { text: '启用', value: 'active' },
                                { text: '暂停', value: 'pause' },
                                { text: '无效', value: 'invalid' }
                            ]}
                        />
                    )
                },
                {
                    title: '广告组',
                    dataIndex: 'goup_name',
                    render: (value, row, index) => (
                        <Cell value={value} row={row} link limit={16}
                            tag={row.group_is_new == 1 && '新'}
                            onLink={e => this.toPlanHandle(row.goup_id, row.group_is_new == 1)} />
                    )
                }, {
                    title: '广告形式',
                    dataIndex: 'ad_scene',
                    filters: [
                        { text: '展示广告', value: '1' },
                        { text: '搜索广告', value: '2' }
                    ],
                    // 广告形式，默认搜索广告，单一广告组下计划列表不设置默认
                    filteredValue: gid === '' ? ['2'] : undefined,
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
                    title: '出价(元)',
                    dataIndex: 'price',
                    width: 120,
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid'
                        if (row.ad_scene != 2) {
                            return <Cell value={value} row={row} edit={edit}
                                onEdit={editPrice} />
                        }
                    }
                }, {
                    title: '出价方式',
                    dataIndex: 'bid_type',
                    filters: [
                        { text: 'CPM', value: 'cpm' },
                        { text: 'CPC', value: 'cpc' }
                    ],
                    filterMultiple: false,
                    renderFilters: true
                }, {
                    title: '投放周期',
                    dataIndex: 'period'
                }, {
                    title: '日预算(元)',
                    dataIndex: 'budget',
                    width: 120,
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid'
                        return <Cell value={value} row={row} edit={edit} onEdit={editBudget} />
                    }
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
                    render: (value, row, index) => {
                        const edit = row.status !== 'invalid'
                        if (edit) {
                            return <Links>
                                <LinkEdit onClick={e => this.editHandle(row.goup_id, value)} />
                                <Link text="添加创意" onClick={e => this.nextHandle(value)} />
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
        await this.receiveGroupInfo(this.state.gid)
    }

    componentWillReceiveProps(nextProps) {
        // 路由变化后，获取新的gid
        const { gid = '' } = nextProps.match.params
        this.setState({
            columns: this.state.columns.map(t => {
                const item = { ...t }
                switch (t.dataIndex) {
                    // 广告形式，默认搜索广告，单一广告组下计划列表不设置默认
                    case 'ad_scene':
                        item.filteredValue = gid === '' ? ['2'] : undefined
                        break
                }
                return item
            })
        })
    }

    componentWillUnmount() {
        // 移除路由监听
        this.unlisten()
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
            group_id: this.props.match.params.gid || '',
            search: params.searchText,
            order: 'desc',
            limit: pageSize,
            offset: pageSize * (current - 1),
            begin: '',
            end: '',
            purpose: filters.purpose && filters.purpose[0] || '',
            promote_type: filters.promote_type && filters.promote_type[0] || '',
            ad_scene: filters.ad_scene && filters.ad_scene[0] || '',
            status: filters.status && filters.status[0] || '',
            bid_type: filters.bid_type && filters.bid_type[0] || ''
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/adplanlist`,
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
     * @method receiveGroupInfo 获取广告组信息
     * @param {String} gid 广告组ID
     */
    receiveGroupInfo = async (gid) => {
        const req = {
            id: gid
        }
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
     * @method addHandle 添加计划
     */
    addHandle = () => {
        const { gid = '' } = this.props.match.params
        if (gid) {
            this.state.history.push('/promotion/plan/operate/' + gid)
            return false
        }
    }

    /**
     * @method addSelectHandle 选择广告组，添加计划
     */
    addSelectHandle = async (ids, rows, values) => {
        const data = await values
        if (data) {
            const { gid } = data
            if (gid) {
                this.state.history.push('/promotion/plan/operate/' + gid)
            }
        }
        return false
    }

    /**
     * @method editHandle 编辑计划
     */
    editHandle = (gid, pid) => {
        this.state.history.push(`/promotion/plan/operate/${gid}/${pid}`)
    }

    /**
     * @method nextHandle 当前计划下添加创意
     */
    nextHandle = (pid) => {
        this.state.history.push('/promotion/creative/operate/' + pid)
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
    toCreativeHandle = (pid, isNew) => {
        this.state.history.push('/promotion/creative/' + pid)
    }

    render() {
        const { gid = '' } = this.props.match.params
        const { columns, groupName } = this.state
        return (
            <div className={styles.body} key={this.state.key}>
                <PlanBreadcrumb className={styles.header}
                    toGroup={e => this.toGroupHandle()}
                    text={groupName} view={{ gid }} />
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="新建广告计划"
                        search="请输入广告计划名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        onUpdateEnd={this.updateEndHandle}
                        rowKey={'id'}
                        canCheck
                        addModal={<PlanAdd onSubmit={this.addSelectHandle} receiveGroupList={receiveGroupList} />}
                        extra={
                            <Batchs>
                                <BatchLink text="启用" onClick={batchActive} />
                                <BatchLink text="暂停" onClick={batchPause} />
                                <BatchLink text="删除" onClick={batchDelete} confirm="已选中#length个广告计划，删除后将不能恢复，确定删除吗？" />
                                <BatchSelect text="批量操作">
                                    <BatchOption text="修改出价"
                                        onClick={openPrice}
                                        modal={<PlanBatchPrice onSubmit={batchPrice} />} />
                                    <BatchOption text="修改日预算"
                                        onClick={openBudget}
                                        modal={<PlanBatchBudget onSubmit={batchBudget} />} />
                                    <BatchOption text="添加关键词"
                                        onClick={openKeyword}
                                        modal={<PlanBatchKeyword onSubmit={batchKeyword} receiveData={receiveKeyword} />} />
                                    <BatchOption text="复制广告计划"
                                        onClick={openCopy}
                                        modal={<PlanBatchCopy onSubmit={batchCopy} receiveGroupList={receiveGroupList} />} />
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