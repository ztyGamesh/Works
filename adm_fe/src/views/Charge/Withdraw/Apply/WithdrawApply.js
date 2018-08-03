/**
 * @class 页面 财务-申请提现
 */
import React, { Component } from 'react';
import styles from './WithdrawApply.less'
import { Form, message } from 'antd'
import {
    WithdrawList,
    WithdrawBreadcrumb,
    WithdrawBaseInfo,
    WithdrawChargeInfo,
    WithdrawInfo
} from '../../../../containers/Charge/WithdrawApply'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class WithdrawApply extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //初始化数据
            initData: null,
            //最大提现金额
            allowDrawRemain: 0,
            //===== =====
            loading: false
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        this.receiveAccountInfo()
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/mediaaccount`,
            method: 'post',
            data: {}
        })
        if (res.status === 1) {
            this.initDataHandle(res.data)
        }
    }

    /**
     * @method submitHandle 提交
     * @param {Object} values 
     */
    submitHandle = async (values) => {
        const data = await values
        if (data) {
            const req = {
                amount: data.amount,
                comment: data.comment
            }
            this.setState({ loading: true })
            const res = await request({
                url: `${BUSINESSAPIHOST}/charge/applydraw`,
                method: 'post',
                data: req
            })
            console.log('submit=====>', req, res)
            if (res && res.status === 1) {
                message.success('申请提现成功')
                this.setState({ loading: false })
                this.props.history.push('/charge/withdraw')
            } else {
                message.error(res && res.msg || '服务器异常')
                this.setState({ loading: false })
            }
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
            attach: attach[0] ? `http://static.adm.deepleaper.com/material/${attach[0]}` : ''
        }
        console.log('receive=====>', data)
        console.log('init=====>', initData)
        this.setState({ initData })
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
                allowDrawRemain: +res.data.allow_draw_remain
            })
        }
    }

    render() {
        const { initData, allowDrawRemain, loading } = this.state
        return (
            <div className={styles.body}>
                <WithdrawBreadcrumb className={styles.header} onCancel={this.cancelHandle} />
                <WithdrawList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <WithdrawBaseInfo className={styles.well} />
                    <WithdrawChargeInfo className={styles.well} />
                    <WithdrawInfo className={styles.well} onCancel={this.cancelHandle} max={allowDrawRemain} />
                </WithdrawList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(WithdrawApply)
