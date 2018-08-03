/**
 * @class
 * */
import React from 'react'
import styles from './PriceList.less'
import { TableBase, Switch, Select, Cell, Links, Link } from '../../../../components/Table'
import {
    PriceWhiteList
} from '../../../../containers/Media/PriceList'
import * as requests from './flow/requests'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '广告位名称',
                    dataIndex: 'slot_name',
                    render: (value, row, index) => (
                        <Cell value={value} limit={16} />
                    )
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    filters: [
                        { text: '启用', value: 'active' },
                        { text: '暂停', value: 'pause' }
                    ],
                    filterMultiple: false,
                    render: (value, row, index) => {
                        return <Switch value={value} row={row} config={[
                            { text: '启用', value: 'active' },
                            { text: '暂停', value: 'pause' }
                        ]} onClick={requests.editStatus} />
                    }
                }, {
                    title: '媒体名称',
                    dataIndex: 'media_name',
                    render: (value, row, index) => (
                        <Cell value={value} limit={16} />
                    )
                }, {
                    title: '合作方式',
                    dataIndex: 'cooperate_mode',
                    width: 150,
                    render: (value, row, index) => {
                        return <Select value={value} row={row} config={[
                            { value: '0', text: '固定价格cpm' },
                            { value: '1', text: '分成' },
                            { value: '2', text: 'cpm底价+分成' },
                            { value: '3', text: '技术服务费' },
                            { value: '4', text: '公开竞价' },
                            { value: '5', text: 'cpm合约' },
                            { value: '6', text: '固定价格cpc' },
                            { value: '7', text: 'cpc底价+分成' }
                        ]} onClick={requests.editCooperateMode} />
                    }
                }, {
                    title: '底价(元)',
                    dataIndex: 'price',
                    render: (value, row, index) => {
                        if (row.cooperate_mode == 1) {
                            //不可修改，默认为0
                            return 0
                        }
                        return <Cell value={value} row={row} edit
                            onEdit={requests.editPrice} />
                    }
                }, {
                    title: '媒体分成比例(%)',
                    dataIndex: 'media_share',
                    render: (value, row, index) => {
                        if (row.cooperate_mode == 0 ||
                            row.cooperate_mode == 4 ||
                            row.cooperate_mode == 5 ||
                            row.cooperate_mode == 6) {
                            //不可修改，默认为0
                            return 0
                        }
                        if (row.cooperate_mode == 3) {
                            //不可修改，默认为100
                            return 100
                        }
                        return <Cell value={value} row={row} edit
                            onEdit={requests.editMediaShare} />
                    }
                }, {
                    title: '最低利润率(%)',
                    dataIndex: 'profit_rate',
                    render: (value, row, index) => {
                        if (row.cooperate_mode == 3) {
                            //不可修改，默认为0
                            return 0
                        }
                        return <Cell value={value} row={row} edit
                            onEdit={requests.editProfitRate} />
                    }
                }, {
                    title: '广告成本',
                    dataIndex: 'profit_price'
                }, {
                    title: '创建时间',
                    dataIndex: 'create_time'
                }, {
                    title: '操作',
                    dataIndex: 'uid',
                    width: 110,
                    render: (value, row, index) => {
                        const { has_white_list } = row
                        return <Links>
                            <Link text="查看广告位" onClick={e => this.props.history.push('/media/price/operate/' + value)} />
                            <Link text={has_white_list == 1 ? '修改保护策略' : '创建保护策略'}
                                onClick={() => { }}
                                modal={
                                    <PriceWhiteList title={has_white_list == 1 ? '修改保护策略' : '创建保护策略'}
                                        init={e => requests.receiveWhiteList(value)}
                                        submit={e => requests.submitWhiteList(value, e, null, true)} />
                                } />
                        </Links>
                    }
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
        const { searchText, pageSize, current, filters, sorter } = params
        const req = {
            search: searchText,
            sort: 'create_time',
            order: 'desc',
            limit: pageSize,
            offset: pageSize * (current - 1),
            status: filters.status && filters.status[0] || ''
        }
        const res = await requests.list(req, null, true)
        console.log('list====>', req, res)
        return {
            rows: res && res.rows || [],
            total: res && res.total || 0
        }
    }

    render() {
        const { columns } = this.state
        return (
            <div className={styles.body} key={this.state.key}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        search="搜索广告位名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        canCheck
                    />
                </div>
            </div>
        )
    }
}