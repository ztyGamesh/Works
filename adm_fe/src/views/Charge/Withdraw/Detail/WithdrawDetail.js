/**
 * @class 页面 财务-提现详情
 */
import React, { Component } from 'react';
import styles from './WithdrawDetail.less'
import { Form } from 'antd'
import {
    WithdrawList,
    WithdrawBreadcrumb,
    WithdrawBaseInfo,
    WithdrawChargeInfo,
    WithdrawInfo
} from '../../../../containers/Charge/WithdrawDetail'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

class WithdrawDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //ID
            id: props.match.params.id || '',
            //初始化数据
            initData: null
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/drawdetail`,
            method: 'get',
            data: {
                id: this.state.id
            }
        })
        if (res.status === 1) {
            this.initDataHandle(res.data)
        }
    }

    /**
     * @method cancelHandle 取消
     */
    cancelHandle = () => {
        this.props.history.push('/charge/withdraw')
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data 
     */
    initDataHandle = async (data = {}) => {
        const attach = data.attach || []
        const initData = {
            name: data.name || '',
            account_name: data.account_name || '',
            mail: data.mail || '',
            tel: data.tel || '',
            link_name: data.link_name || '',
            bank: data.bank || '',
            bank_account: data.bank_account || '',
            corporation_name: data.corporation_name || '',
            attach: attach[0] ? `http://static.adm.deepleaper.com/material/${attach[0]}` : '',
            amount: data.amount || '',
            comment: data.comment || ''
        }
        console.log('receive=====>', data)
        console.log('init=====>', initData)
        this.setState({ initData })
    }

    render() {
        const { initData } = this.state
        return (
            <div className={styles.body}>
                <WithdrawBreadcrumb className={styles.header} onCancel={this.cancelHandle} />
                <WithdrawList className={styles.content} initData={initData} {...this.props}>
                    <WithdrawBaseInfo className={styles.well} />
                    <WithdrawChargeInfo className={styles.well} />
                    <WithdrawInfo className={styles.well} onCancel={this.cancelHandle} />
                </WithdrawList>
            </div>
        )
    }
}

export default Form.create()(WithdrawDetail)
