/**
 * @class 页面 账号-账号信息
 */
import React, { Component } from 'react';
import styles from './MediaAccount.less'
import { Form } from 'antd'
import {
    AccountList,
    AccountBaseInfo,
    AccountChargeInfo
} from '../../containers/Account/MediaAccount'
import { BUSINESSAPIHOST } from '../../common/env'
import request from '../../utils/request'

class MediaAccount extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //初始化数据
            initData: null
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
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

    render() {
        const { initData, allowDrawRemain } = this.state
        return (
            <div className={styles.body}>
                <AccountList className={styles.content} initData={initData} {...this.props}>
                    <AccountBaseInfo className={styles.well} />
                    <AccountChargeInfo className={styles.well} />
                </AccountList>
            </div>
        )
    }
}

export default Form.create()(MediaAccount)