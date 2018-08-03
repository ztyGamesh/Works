/**
 * 添加/修改 媒体账户
 * */

import React, { Component } from 'react';
import {connect} from 'react-redux';

import styles from './PublisherOperate.less'
import { Form, Breadcrumb, message } from 'antd'
import {
    PublisherBreadcrumb,
    PublisherMediaType,
    PublisherCreativity,
    PublisherList,
    PublisherWell,
    PublisherName,
    PublisherCompanyName,
    PublisherEmail,
    PublisherLinkName,
    PublisherTel,
    PublisherBank,
    PublisherBankAccount,
    PublisherAccountName,
    PublisherAttach,
    PublisherPassword,
    PublisherRepPassword,
    PublisherServer,
    PublisherMaxQPS,
    PublisherEncryptType,
    PublisherRepRemark,
    PublisherUnionmediaGroup,
    PublisherSubmit,
    readLevelInfo,
    removeLevelInfo
} from '../../../../containers/Rights/PublisherOperate'
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
            //平台管理设置，当账户类型位adx时显示
            showPlatform: true,
            //联盟媒体列表
            mediumList: [],
            loading: false,
            fileList:[]


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
        //新建
        this.initDataHandle()
    }

    /**
     * @method submitHandle 提交
     * @param {Object} values
     */
    submitHandle = async (values) => {
        const res = await values
        if (res) {
            const { uid, showPlatform } = this.state
            const data = {
                media_type: res.media_type,
                audit_type: res.audit_type,
                name: res.name,
                corporation_name: res.corporation_name,
                mail: res.mail,
                link_name: res.link_name,
                tel: res.tel,

                bank: res.bank,
                bank_account: res.bank_account,
                account_name: res.account_name,
                attach: res.attach || [],
                password: res.password || '',
                allow_platform_role : 'alliance',

            }
            //upload还得加个预览
            // var attachRes = [];
            // attachRes.push(res.attach.fileList[0].response.data.name);
            // data.attach = attachRes;
            var result = [];
            for(var i = 0; i < res.resource.length; i++){
                var resourceData = {
                    type:'media',
                    id:res.resource[i],
                    platform_role:'alliance'
                }
                result.push(resourceData)
            }
           data.resource = JSON.stringify(result);
            if (showPlatform) {
                var ret = {
                    'server' : res.server || '',
                    'max_qps' : res.max_qps || '',
                    'encrypt_type': res.encrypt_type || '',
                    'remark' : res.remark || ''
                }
                    data.setting = JSON.stringify(ret)

            } else {
                data.setting = "{}"
            }

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
            url: `${BUSINESSAPIHOST}/user/adduser`,
            method: 'post',
            data: req,
        })
        var uid = req.uid;
        if (res.status === 1 && res.data) {
            message.success(uid ? '修改成功' : '添加成功')

            this.setState({ loading: false })

            console.log('添加成功')
            this.props.history.push('/rights/publisher')

        }else {
            this.setState({ loading: false })
            message.error(res && res.msg || '服务器异常')

            console.log('res',res)
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
            url: `${BUSINESSAPIHOST}/user/updateuser`,
            method: 'post',
            data: req,
        })
        var uid = req.uid;
        if (res.status === 1 && res.data) {
            console.log('修改成功')
            message.success(uid ? '修改成功' : '添加成功')
            this.setState({ loading: false })
            this.props.history.push('/rights/publisher')

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
        if(data.medium == null){
            var showPlatform = true;
            var initData = {
                media_type: 'adx',
                audit_type: 'self_other',
                name: '',
                corporation_name: '',
                mail: '',
                link_name: '',
                tel: '',

                bank: '',
                bank_account: '',
                account_name: '',
                attach:[],

                password: '',
                rep_password: '',

                server: '',
                max_qps: '',
                encrypt_type: 'plain',
                remark: '',
                resource : [],
            }

        }
        else {
            console.log('else')
            var showPlatform = data.medium.media_type === 'adx';
            var initData = {

                media_type: data.medium.media_type || 'adx',
                audit_type: data.medium.audit_type || 'self_other',

                name: data.name || '',
                corporation_name : data.corporation_name || '',
                mail: data.mail || '',
                link_name: data.link_name || '',
                tel: data.tel || '',

                bank : data.medium.bank || '',
                bank_account : data.medium.bank_account || '',
                account_name : data.medium.account_name || '',
                attach : data.medium.attach || [],

                password: data.password || '',
                rep_password: data.password || '',


            }
            var mediaValues = [];
            for(var t = 0; t < data.media.length; t++){
                mediaValues[t] = data.media[t].uid;
            }
            initData.resource = mediaValues;

            if (showPlatform) {
                console.log('true')
                var res = JSON.parse(data.medium.setting);
                initData.server = res.server;
                initData.max_qps = res.max_qps;
                initData.encrypt_type = res.encrypt_type;
                initData.remark = res.remark;

            }
            await this.setState({
                fileList: data.medium.attach.fileList
            })
        }

        await this.setState({ showPlatform })
        this.setState({ initData })
    }

    /**
     * @method typeChangeHandle 账户类型切换
     */
    typeChangeHandle = async (e) => {
        const showPlatform = e.target.value === 'adx'
        await this.setState({ showPlatform })
        showPlatform && this.props.form.setFieldsValue({ audit_type: 'self_other' })
        if(e.target.value === 'media'){
            this.props.form.setFieldsValue({ audit_type: 'self' })
        }
    }



    /**
     * @method receiveMedium 获取联盟媒体列表
     */
    receiveMedium = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/userdetail`,
            method: 'get',
            data:{
                uid:this.props.userId
            }
        })
        if (res.status === 1 && res.data) {
            console.log('res.data',res.data)
            this.setState({
                mediumList: res.data.media.map(t => ({
                    value: t.uid,
                    label: t.name
                }))
            })
        }
    }
    attachedChangeHandle = (info)=>{
        console.log('change',info)
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} 上传成功.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.setState( {fileList : info.fileList});

    }



    render() {
        const {
            uid,
            initData,
            showPlatform,
            mediumList,
            loading,
            fileList

        } = this.state
         //页面状态
        const isEdit = uid !== undefined
        return (
            <div className={styles.body}>
                <PublisherBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={isEdit ? '修改媒体/平台账户' : '添加媒体/平台账户'} />
                <PublisherList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <PublisherWell className={styles.well} >
                        <PublisherMediaType onChange={this.typeChangeHandle}/>
                        <PublisherCreativity/>
                    </PublisherWell>
                    <PublisherWell className={styles.well} dot title="基本信息">
                        <PublisherName  disabled={isEdit}/>
                        <PublisherCompanyName />
                        <PublisherEmail disabled={isEdit}/>
                        <PublisherLinkName />
                        <PublisherTel />
                    </PublisherWell>
                    <PublisherWell className={styles.well} dot title="财务信息">
                        <PublisherBank />
                        <PublisherBankAccount />
                        <PublisherAccountName />
                        <PublisherAttach fileList={fileList} onChange={this.attachedChangeHandle}/>
                    </PublisherWell>
                    <PublisherWell className={styles.well} dot title="设置密码">
                        <PublisherPassword />
                        <PublisherRepPassword  form={this.props.form} />
                    </PublisherWell>
                    {
                        showPlatform
                            ? <PublisherWell className={styles.well} dot title="平台管理设置">
                                <PublisherServer/>
                                <PublisherMaxQPS/>
                                <PublisherEncryptType/>
                                <PublisherRepRemark/>
                             </PublisherWell>
                            : null
                    }

                    <PublisherWell className={styles.well} dot title="资源权限">
                    <PublisherUnionmediaGroup data={mediumList}/>
                    </PublisherWell>
                    <PublisherSubmit onCancel={this.cancelHandle} text={isEdit ? '完成修改' : '完成添加'}/>
                </PublisherList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    console.log('state1111111111111',state.user.uid)
    return{
        userId: state.user.uid,
    }
}
const aaa = Form.create()(PublisherOperate)
export default connect(mapStateToProps,null)(aaa)
// export default Form.create()(PublisherOperate)
