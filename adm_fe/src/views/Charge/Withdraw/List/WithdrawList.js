/**
 * @class 页面 财务-财务
 */
import React, { Component } from 'react'
import { TableBase, Links, LinkShow, LinkEdit, Switch } from '../../../../components/Table'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import styles from './WithdrawList.less'

export default class WithdrawList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            columns: [
                {
                    title: '提款日期',
                    dataIndex: 'create_time'
                }, {
                    title: '媒体状态',
                    dataIndex: 'status',
                    render: (value, row, index) => {
                        switch (value) {
                            case 'paid':
                                return '已付款'
                                break;
                            case 'un_pay':
                                return '待付款'
                                break;
                            default:
                                return value
                        }
                    }
                }, {
                    title: '提款人',
                    dataIndex: 'link_name'
                }, {
                    title: '提款金额',
                    dataIndex: 'amount'
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    render: (value, rows, index) => (
                        <Links>
                            <LinkShow onClick={e => this.showHandle(value)} />
                        </Links>
                    )
                }
            ],
            account_remain: 0,
            allow_draw_remain: 0,
            total_income: 0,
            canApply: false
        }
    }

    async componentWillMount() {
        this.receiveAccountInfo()
        this.receiveCanApply()
    }

    /**
     * @method receiveAccountInfo 获取账号信息
     */
    receiveAccountInfo = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/getaccountfinanceinfo`,
            method: 'post'
        })
        if (res && res.status === 1) {
            this.setState({
                account_remain: res.data.account_remain,
                allow_draw_remain: res.data.allow_draw_remain,
                total_income: res.data.total_income
            })
        }
    }

    /**
     * @method receiveCanApply 检查是否可提现
     */
    receiveCanApply = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/checkdraw`,
            method: 'post'
        })
        if (res && res.status === 1) {
            this.setState({
                canApply: res.data
            })
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { pageSize, current, sorter } = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/applydrawlist`,
            method: 'get',
            data: {
                sort: sorter.field,
                order: sorter.order,
                limit: pageSize,
                offset: pageSize * (current - 1)
            }
        })
        if (res && res.data) {
            return {
                rows: res.data.rows,
                total: res.data.total
            }
        }
    }

    addHandle = () => {
        const { history } = this.state
        history.push('/charge/withdraw/apply')
    }

    showHandle = (id) => {
        const { history } = this.state
        history.push('/charge/withdraw/detail/' + id)
    }

    render() {
        const { account_remain = 0, allow_draw_remain = 0, total_income = 0, canApply } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.info}>
                    <div className={styles.msg}>每月只能5-24号申请一次提现，不可重复操作！平台付款时间统一为每月的25-30号！</div>
                    <div className={styles.line}>
                        <div>累计收入</div><div>账户余额</div><div>可提现金额</div>
                    </div>
                    <div className={styles.line}>
                        <div>{total_income}</div><div>{account_remain}</div><div>{allow_draw_remain}</div>
                    </div>
                </div>
                <div className={styles.content}>
                    <TableBase
                        columns={this.state.columns}
                        add="申请提现"
                        canAdd={canApply}
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        onChangeSwitch={this.changeSwitchHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                    />
                </div>
            </div>
        )
    }
}
