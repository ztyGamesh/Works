/**
 * 关联/修改 PID
 * */

import React, { Component } from 'react';

import styles from './AddCooperate.less'
import { Form, message } from 'antd'
import {
    PidList,
    PidWell,
    PidBreadcrumb,
    PidAppSecret,
    PidTbAppKey,
    PidTbMedia,
    PidTbPid,
    PidSubmit,
    readLevelInfo,
    removeLevelInfo
} from '../../../../containers/Media/PidOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class PidCooperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //媒体UID
            uid: props.match.params.uid,
            type: props.match.params.type,

            //初始化数据
            initData: null,
            loading:false
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        const { type , uid} = this.state
        if (type) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/feeds/getFeeds`,
                method: 'get',
                data: { uid }
            })
            if (res.status === 1) {
                this.initDataHandle(res.data)
                return
            }
        }
        // 新建
        this.initDataHandle()
    }

    /**
     * @method submitHandle 提交
     * @param {Object} values
     */
    submitHandle = async (values) => {
        const res = await values
        if (res) {
            const { type,uid } = this.state
            const data = {
                tb_media: res.tb_media,
                tb_pid: res.tb_pid,
                tb_app_key: res.tb_app_key,
                tb_app_secret: res.tb_app_secret,
                uid:uid,

            }

            this.setState({ loading: true })
            console.log(data)
            if(type){
                await this.updateuserAPI(data)
            }
            else {
                await this.adduserAPI(data)
            }
        }

    }
    /**
     * @method initDataHandle 添加媒体账户
     * @param {Object} data
     */
    adduserAPI = async (values) => {
        const req = await values;
        console.log('adduserAPI', req)
        const res = await request({
            url: `${BUSINESSAPIHOST}/feeds/saveTbPid`,
            method: 'post',
            data: req,
        })
        if (res.status === 1 && res.data) {
            message.success( '添加成功')
            this.setState({ loading: false })
            this.props.history.push('/media/cooperate')
        }else {
            this.setState({ loading: false })
            message.error(res && res.msg || '服务器异常')
        }
    }
    /**
     * @method initDataHandle 修改媒体账户
     * @param {Object} data
     */
    updateuserAPI = async (values) => {
        const req = await values;
        console.log('updateuserAPI', req)
        const res = await request({
            url: `${BUSINESSAPIHOST}/feeds/saveTbPid`,
            method: 'post',
            data: req,
        })
        if (res.status === 1 && res.data) {
            message.success('修改成功')
            this.setState({ loading: false })
            this.props.history.push('/media/cooperate')
        }else {
            this.setState({ loading: false })
            message.error(res && res.msg || '服务器异常')
        }
    }
    /**
     * @method cancelHandle 取消
     */
    cancelHandle = () => {
        this.props.history.goBack()
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data
     */
    initDataHandle = async (data = {}) => {
        var initData = {
            tb_media: data.tb_media || '',
            tb_pid : data.tb_pid || '',
            mail: data.mail || '',
            tb_app_key: data.tb_app_key || '',
            tb_app_secret: data.tb_app_secret || '',
            uid:data.uid

        }

        this.setState({ initData })
    }



    render() {
        const {
            type,
            initData,
            loading
        } = this.state
        //页面状态
        const isEdit = type !== undefined
        return (
            <div className={styles.body}>
                <PidBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={isEdit ? '修改pid' : '关联pid'} />
                <PidList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <PidWell className={styles.well} >
                        <PidTbMedia />
                        <PidTbPid />
                        <PidTbAppKey  />
                        <PidAppSecret />

                    </PidWell>

                    <PidSubmit onCancel={this.cancelHandle} text={isEdit ? '完成修改' : '完成添加'}/>
                </PidList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(PidCooperate)
