/**
 * 添加/修改 广告主账户
 * */

import React, { Component } from 'react';

import styles from './AdsOperate.less'
import { Form, message } from 'antd'
import {
    AdsList,
    AdsWell,
    AdsName,
    AdsCorporation_name,
    AdsMail,
    AdsTel,
    AdsPassword,
    AdsRepassword,
    AdsMedia,
    AdsBreadCrumb,
    AdsSubmit,
    readLevelInfo,
    removeLevelInfo
} from '../../../../containers/Rights/AdsOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class PublisherOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //媒体UID
            uid: props.match.params.id,
            //初始化数据
            initData: null,
            //联盟媒体列表
            mediumList: [],
            loading:false
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        const { uid } = this.state
        await this.receiveMedium()
        if (uid) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/user/userdetail`,
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
            const { uid } = this.state
            const data = {
                name: res.name,
                corporation_name: res.corporation_name,
                mail: res.mail,
                tel: res.tel,
                password: res.password || '',

            }
            var result = [];
            for(var i = 0; i < res.media.length; i++){
                var resourceData = {
                    type:'media',
                    id:res.media[i],
                    platform_role:'alliance'
                }
                result.push(resourceData)
            }
            data.resource = result;
            this.setState({ loading: true })

            if (uid) {
                data.uid = uid
            }
            console.log(data)
            if(uid){
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
            url: `${BUSINESSAPIHOST}/user/addclientuser`,
            method: 'post',
            data: req,
        })
        var uid = req.uid;
        if (res.status === 1 && res.data) {
            message.success(uid ? '修改成功' : '添加成功')
            this.setState({ loading: false })
            this.props.history.push('/rights/Ads')
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
            url: `${BUSINESSAPIHOST}/user/addclientuser`,
            method: 'post',
            data: req,
        })
        var uid = req.uid;
        if (res.status === 1 && res.data) {
            message.success(uid ? '修改成功' : '添加成功')
            this.setState({ loading: false })
            this.props.history.push('/rights/Ads')
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
            name: data.name || '',
            corporation_name : data.corporation_name || '',
            mail: data.mail || '',
            tel: data.tel || '',
            password: '',
            rep_password: '',

        }
        if(data.uid){
            var mediaValues = [];
            console.log('data.media', data.media)
            for(var t = 0; t < data.media.length; t++){
                mediaValues[t] = data.media[t].uid;
            }
            initData.media = mediaValues;
        }else {
            initData.media = [];
        }

        this.setState({ initData })
    }


    /**
     * @method receiveMedium 获取媒体列表
     */
    receiveMedium = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/medialist`,
            method: 'post',
            data:{
                data_type: "bundle_id"
            }
        })
        if (res.status === 1 && res.data) {
            var mediaArr = [];
            for(var i in res.data){
                mediaArr.push({
                    value: i,
                    label: res.data[i]
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
            loading
        } = this.state
        //页面状态
        const isEdit = uid !== undefined
        return (
            <div className={styles.body}>
                <AdsBreadCrumb className={styles.header} onCancel={this.cancelHandle} text={isEdit ? '修改广告主账户' : '添加广告主账户'} />
                <AdsList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>

                    <AdsWell className={styles.well} dot title="账户信息">
                        <AdsName disabled={isEdit}/>
                        <AdsCorporation_name disabled={isEdit}/>
                        <AdsMail disabled={isEdit} />
                        <AdsTel />
                        <AdsPassword />
                        <AdsRepassword />
                    </AdsWell>
                    <AdsWell className={styles.well} dot title="配置媒体白名单" subTitle="不配置媒体则默认该账户为全媒体的广告投放；配置媒体则默认该账户仅在配置的媒体进行广告投放">
                        <AdsMedia data={mediumList}/>
                    </AdsWell>
                    <AdsSubmit onCancel={this.cancelHandle} text={isEdit ? '完成修改' : '完成添加'}/>
                </AdsList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(PublisherOperate)
