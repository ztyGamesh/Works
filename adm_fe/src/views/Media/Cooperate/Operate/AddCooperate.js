/**
 * 添加内容合作
 * */

import React, { Component } from 'react';

import styles from './AddCooperate.less'
import { Form, message } from 'antd'
import {
    CooperateList,
    CooperateWell,
    CooperateBreadcrumb,
    CooperateAdCount,
    CooperateContentCount,
    CooperateCooperateName,
    CooperateMediaUid,
    CooperateUseMode,
    CooperateSubmit,
    readLevelInfo,
    removeLevelInfo
} from '../../../../containers/Media/CooperateOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class AddCooperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //媒体UID
            uid: props.match.params.id,
            //初始化数据
            initData: null,
            //联盟媒体列表
            mediumList: [],
            useModeList:[{
                value:'api',
                label:'API'
            }],
            loading:false
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        // const { uid } = this.state
        await this.receiveMedium()
        // if (uid) {//编辑
        //     const res = await request({
        //         url: `${BUSINESSAPIHOST}/user/userdetail`,
        //         method: 'get',
        //         data: { uid }
        //     })
        //     if (res.status === 1) {
        //         this.initDataHandle(res.data)
        //         return
        //     }
        // }
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

            const data = {
                cooperate_name: res.cooperate_name,
                media_uid: res.media_uid,
                use_mode: res.use_mode,
                content_count: res.content_count,
                ad_count: 1,

            }
            await this.adduserAPI(data)
        }

    }
    /**
     * @method adduserAPI 添加媒体账户
     * @param {Object} data
     */
    adduserAPI = async (values) => {
        const req = await values;
        console.log('adduserAPI', req)
        const res = await request({
            url: `${BUSINESSAPIHOST}/feeds/store`,
            method: 'post',
            data: req,
        })

        if (res.status === 1 && res.data) {
            message.success('添加成功')
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
        console.log('新建',data.medium)
        var initData = {
            cooperate_name: data.cooperate_name || '',
            media_uid : data.media_uid || '',
            use_mode: data.use_mode || '',
            content_count: data.content_count || '',
            ad_count: '1',

        }


        this.setState({ initData })
    }


    /**
     * @method receiveMedium 获取媒体列表
     */
    receiveMedium = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/getMediaList`,
            method: 'get',
            data:{
                type: "3"
            }
        })
        if (res.status === 1 && res.data) {
            var mediaArr = [];
            for(var i in res.data){
                mediaArr.push({
                    value: res.data[i].uid,
                    label: res.data[i].name
                })
            }
            this.setState({
                    mediumList:mediaArr
                }
            )
        }
    }

    render() {
        const {
            uid,
            initData,
            mediumList,
            useModeList,
            loading
        } = this.state
        //页面状态
        const isEdit = uid !== undefined
        return (
            <div className={styles.body}>
                <CooperateBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={'新建内容合作'} />
                <CooperateList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <CooperateWell className={styles.well} >
                        <CooperateCooperateName />
                        <CooperateMediaUid  data={mediumList} />
                        <CooperateUseMode data={useModeList}/>
                        <CooperateContentCount />
                        <CooperateAdCount disabled={true}/>
                    </CooperateWell>
                    <CooperateSubmit onCancel={this.cancelHandle} text={'完成添加'}/>
                </CooperateList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(AddCooperate)
