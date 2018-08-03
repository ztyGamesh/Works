/**
 * @class 页面 媒体提现-详情
 */
import React, { Component } from 'react';
import styles from './ConfirmChargeOperate.less'
import { Form } from 'antd'
import {
    ConfirmChargeList,
    ConfirmChargeBreadcrumb,
    ConfirmChargeBaseInfo,
    ConfirmChargeChargeInfo,
    ConfirmChargeInfo
} from '../../../../containers/Charge/ConfirmCharge'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

class ConfirmChargeOperate extends Component {

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
                <ConfirmChargeBreadcrumb className={styles.header} onCancel={this.cancelHandle} />
                <ConfirmChargeList className={styles.content} initData={initData} {...this.props}>
                    <ConfirmChargeBaseInfo className={styles.well} />
                    <ConfirmChargeChargeInfo className={styles.well} />
                    <ConfirmChargeInfo className={styles.well} onCancel={this.cancelHandle} />
                </ConfirmChargeList>
            </div>
        )
    }
}

export default Form.create()(ConfirmChargeOperate)
