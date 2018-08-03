/**
 * @class 创意审核的查看页面
 *
 */
import React, { Component } from 'react';
import styles from './AuditCreativeOperate.less'
import { Form, message, Modal, Button, Input } from 'antd'
const { TextArea } = Input;

import {
    CreativeList,
    CreativeWell,
    CreativeBreadcrumb,
    CreativePlanName,
    CreativeSlotClass,
    CreativeTemplateClass,
    CreativeAdd,
    CreativeModify,
    CreativeAdSource,
    CreativeExtend,
    CreativeAppName,
    CreativeAppExtend,
    CreativeLink,
    CreativeAppLink,
    CreativeDeeplink,
    CreativeMonitoringUrl,
    CreativeLanding,
    CreativeSubmit,
    CreativeLabel
} from '../../../../containers/Audit/CreativeOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'
import * as formatters from './formatters'

class AuditCreativeOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //广告组ID
            gid: '',
            //广告计划ID
            pid:'',
            //广告创意ID
            cid: props.match.params.cid || '',
            //初始化数据
            initData: null,
            //===== =====
            //创意模板数据
            creativeFormats: [],
            creativeFormatsKey: 0,
            //编辑时创意模板id
            slot_class: '',
            template_class: '',
            //===== =====
            //推广目的
            purpose: 'landing',
            //推广类型
            promote_type: 1,
            //广告形式
            ad_scene: 1,
            //广告计划列表
            planList: [],
            //商品组字段列表
            schemaList: [],
            //===== =====
            //附加创意当前值
            extendValue: 'empty',
            //===== =====
            loading: true,
            //===== 面包屑初始化 =====
            iGroupName: '',
            iGid: '',
            iPlanName: '',
            iPid: '',
            showArea:true,
            labelList:[],
            type:1,
            showModal:false,
            textAreaVal:'',
            comment:''
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        await this.receivePlanList()//获取所有广告组
        await this.getLabelList()//获取所有广告创意标签
        const { cid } = this.state
        if (cid) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/promotion/fetchcreative`,
                method: 'get',
                data: { id: cid }
            })
            if (res.status === 1) {
                this.setState({
                    pid:res.data.plan_id
                })
                await this.receivePlanInfo(res.data.plan_id, true)
                this.initDataHandle(res.data)
                return
            }
        }
        //新建
        this.initDataHandle()
    }
    /**
     * @method receivePlanList 获取所有广告创意标签
     */
    getLabelList = async () => {
        // const req = { plan: 1 }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/tag?level=3`,
            method: 'get',
            data: {}
        })
        if (res && res.status === 1) {
            const data = res.data
            this.setState({
                labelList:formatters.categoryList(data),
            })
        }
    }
    /**
     * @method submitHandle 提交
     * @param {Object} values
     */
    submitHandle = async (values) => {
        const data = await values
        if (data) {
            const { gid, pid, cid, template_class ,type} = this.state
            let req = {};
            req.ids = cid;
            if(type == 1){
                req.audit_status = 'pass';
                req.comment = '';
                req.tag = data.tag.join(',');
            }
            else {
                this.setState({
                    showModal:true,
                })
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatus`,
                method: 'post',
                data: req
            })
            if(res && res.status === 1){
                message.success( '内审通过提交成功')
                this.props.history.push(`/audit/creative/`)
            }
        }
    }

    /**
     * @method toPassHandle 内审通过
     */
    toPassHandle = async (Ptype) => {
        this.setState({
            type:Ptype
        })
    }
    /**
     * @method toRejectHandle 内审拒绝
     */
    toRejectHandle = (Rtype) => {
        this.setState({
            type:Rtype,
        })
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data
     */
    initDataHandle = async (data = {}) => {
        this.setState({
            pid: data.plan_id
        })
        const { cid, purpose, promote_type, ad_scene } = this.state
        const initData = {
            landing: data.landing || '',
            monitoring_url: data.monitoring_url || '',
            ad_source: data.ad_source || '',
            extend_type: data.extend_type || (purpose === 'landing' ? 'empty' : 'download'),
            extend_data: JSON.parse(data.extend_data || '{}')
        }
        if (cid) {
            initData.slot_class = data.slot_class || ''
            initData.template_class = [data.template_class || '']
        } else {
            initData.plan_id = (data.plan_id || this.state.pid) + ''
        }
        if (cid && data.template_class) {
            const material = JSON.parse(data.material || '{}')
            material.name = data.name || ''
            const modify = {}
            modify[data.template_class] = material
            initData.modify = modify
        }
        if (purpose === 'landing') {
            initData.deep_link = data.deep_link || ''
        }
        if ((purpose === 'landing' && ad_scene == 1) || purpose === 'download') {
            initData.link = data.link || ''
        }
        await this.setState({
            slot_class: initData.slot_class,
            template_class: data.template_class || '',
            extendValue: initData.extend_type
        })
        this.setState({ initData, loading: false })
    }

    /**
     * @method receivePlanInfo 获取广告计划信息
     * @param {Boolean} init true:初始化时更新面包屑
     */
    receivePlanInfo = async (id, init) => {
        const req = { id }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/fetchadplan`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            const data = res.data
            this.setState({
                pid: id,
                iPlanName: init === true && data.name || this.state.iPlanName,
                iPid: init === true && id || this.state.iPid
            })
            await this.receiveGroupInfo(data.group_id, id, init)
            await this.receiveSchemaList(data.product_group)
        }
        await this.receiveCreativeFormats(id)
    }

    /**
     * @method receiveGroupInfo 获取广告组信息
     * @param {Boolean} init true:初始化时更新面包屑
     */
    receiveGroupInfo = async (id, pid, init) => {
        const req = { id }
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/fetchadgroup`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            const data = res.data
            this.setState({
                purpose: data.purpose || '',
                promote_type: data.promote_type || '',
                ad_scene: data.ad_scene || '',
                gid: id,
                iGroupName: init === true && data.name || this.state.iGroupName,
                iGid: init === true && id || this.state.iGid,
            })
        }
    }

    /**
     * @method receivePlanList 获取所有广告组
     */
    receivePlanList = async () => {
        const req = { plan: 1 }
        const res = await request({
            url: `${BUSINESSAPIHOST}/adgroup/groups`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            const data = res.data
            this.setState({
                planList: data.map(t => ({
                    value: t.group_id,
                    label: t.group_name,
                    children: (t.child || []).map(s => ({
                        value: s.plan_id,
                        label: s.plan_name
                    }))
                }))
            })
        }
    }

    /**
     * @method receiveCreativeFormats 获取模板数据
     */
    receiveCreativeFormats = async (pid) => {
        const req = { id: pid }
        const res = await request({
            url: `${BUSINESSAPIHOST}/adplan/creativeFormats`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            this.setState({
                creativeFormats: res.data,
                creativeFormatsKey: + new Date()
            })
        }
    }

    /**
     * @method receiveSchemaList 获取商品组字段
     */
    receiveSchemaList = async (product_group) => {
        if (!product_group) {
            return
        }
        const req = {
            groupId: product_group,
            needSample: true
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/dmc/getSchemaByGroup`,
            method: 'get',
            data: req
        })
        if (res && res.status === 1) {
            this.setState({
                schemaList: res.data
            })
        }
    }
    //拒绝理由
    textAreaBlurHandle= async(e)=>{
        await this.setState({
            comment: e.target.value
        })

    }
    textAreaChangeHandle= async(e)=>{
        await this.setState({
            comment: e.target.value,
            textAreaVal:e.target.value
        })
    }
    //拒绝提交
    attactAccountSubmit = async(e)=>{
       var req = {}
       req.ids = this.state.cid;
        req.audit_status = 'reject';
        req.comment = this.state.comment;
        req.tag = null;
        const res = await request({
            url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatus`,
            method: 'post',
            data: req

        })
        if(res){
            message.success( '内审拒绝提交成功')
            this.props.history.push(`/audit/creative/`)
        }
        else {
            message.error(res && res.msg || '服务器异常')

        }
        await this.setState({
            showModal:false
        })
    }
    toBackHandle =()=>{
        this.props.history.push(`/audit/creative/`)
    }
    render() {
        const {
            cid,
            initData,
            creativeFormats,
            creativeFormatsKey,
            slot_class,
            template_class,
            //===== =====
            //推广目的
            purpose,
            //推广类型
            promote_type,
            //广告形式
            ad_scene,
            planList,
            //商品组字段列表
            schemaList,
            //show
            extendValue,
            loading,
            showArea,
            labelList,
            showModal,
            textAreaVal
        } = this.state
        //页面状态
        const isEdit = cid !== ''
        return (
            <div className={styles.body}>
                <CreativeBreadcrumb className={styles.header}
                                    onCancel={this.toBackHandle}
                                    text={isEdit ? '广告创意审核详情' : '添加广告创意'} />
                <CreativeList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <CreativeWell className={styles.well}>
                        {
                            isEdit ?
                                <CreativeSlotClass /> :
                                <CreativePlanName data={planList} onChange={this.receivePlanInfo} />
                        }
                    </CreativeWell>
                    {
                        isEdit ? <CreativeWell dot title="选择模版" subTitle="请点击缩略图预览样式，根据广告位尺寸比例推荐适配较好的样式">
                            <CreativeTemplateClass classId={slot_class} />
                        </CreativeWell> : null
                    }
                    {
                        isEdit ?
                            <CreativeWell title="修改创意" className={styles.well}>
                                <CreativeModify ad_scene={ad_scene}
                                                promote_type={promote_type}
                                                schemaList={schemaList}
                                                config={creativeFormats}
                                                slot_class={slot_class}
                                                template_class={template_class}
                                                initData={initData}
                                                disabled={isEdit}
                                />
                            </CreativeWell> :
                            <CreativeWell title="添加创意" className={styles.well}>
                                <CreativeAdd ad_scene={ad_scene}
                                             promote_type={promote_type}
                                             schemaList={schemaList}
                                             config={creativeFormats}
                                             key={creativeFormatsKey}
                                             disabled={isEdit}
                                />
                            </CreativeWell>
                    }
                    {
                        purpose === 'landing' ?
                            <CreativeWell title="广告来源及附加创意配置" className={styles.well}>
                                <CreativeAdSource  disabled={isEdit}/>
                                <CreativeExtend showType={extendValue} onSelectChange={e => this.setState({ extendValue: e })} disabled={isEdit}/>
                            </CreativeWell> :
                            purpose === 'download' ?
                                <CreativeWell title="应用下载配置" className={styles.well}>
                                    <CreativeAppName disabled={isEdit}/>
                                    <CreativeAppExtend disabled={isEdit}/>
                                </CreativeWell> : null
                    }
                    <CreativeWell title="设置广告着陆页" className={styles.well}>
                        {
                            purpose === 'landing' && ad_scene == 1 ?
                                <CreativeLink promote_type={promote_type} schemaList={schemaList} disabled={isEdit}/> :
                                purpose === 'download' ?
                                    <CreativeAppLink disabled={isEdit}/> : null
                        }
                        {
                            purpose === 'landing' ?
                                <CreativeDeeplink disabled={isEdit}/> : null
                        }
                    </CreativeWell>
                    <CreativeWell title="设置广告监测地址" className={styles.well}>
                        <CreativeMonitoringUrl disabled={isEdit}/>
                        <CreativeLanding disabled={isEdit}/>
                    </CreativeWell>
                    <CreativeWell title="设置广告创意标签" className={styles.well}>
                        <CreativeLabel receiveData={labelList} showDetail={showArea} onSelectChange={e => this.setState({ showArea: !!e })} />
                    </CreativeWell>
                    <div className={styles.button_box}>
                        <button className={styles.res_button} onClick={e => this.toBackHandle()}>返回列表</button>
                        <button className={styles.res_button} onClick={e => this.toPassHandle(1)}>内审通过</button>
                        <button className={styles.res_button} onClick={e => this.toRejectHandle(2)}>内审拒绝</button>
                    </div>
                    <Modal title="审核拒绝原因"
                           visible={showModal}
                           onCancel={e => this.setState({showModal: false})}
                           footer={
                               <div>
                                   <Button onClick={e => this.setState({showModal: false})}>关 闭</Button>
                                   <Button onClick={this.attactAccountSubmit}>提 交</Button>
                               </div>
                           }
                    >

                        <div className={styles.line}>
                            <TextArea autosize={{minRows: 10}}
                                      placeholder="请输入内审拒绝理由"
                                      onBlur={this.textAreaBlurHandle}
                                      onChange={this.textAreaChangeHandle}
                                      value={ textAreaVal}
                            />
                        </div>

                    </Modal>
                </CreativeList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(AuditCreativeOperate)
