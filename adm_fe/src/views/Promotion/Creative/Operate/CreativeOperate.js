/**
 * @class 添加、编辑页面
 */
import React, { Component } from 'react';
import styles from './CreativeOperate.less'
import { Form, message } from 'antd'
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
    CreativeSubmit
} from '../../../../containers/Promotion/CreativeOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class CreativeOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //广告组ID
            gid: '',
            //广告计划ID
            pid: props.match.params.pid || '',
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
            iPid: ''
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        await this.receivePlanList()
        await this.receivePlanInfo(this.state.pid, true)
        const { cid } = this.state
        if (cid) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/promotion/fetchcreative`,
                method: 'get',
                data: { id: cid }
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
        const data = await values
        if (data) {
            const { gid, pid, cid, template_class } = this.state
            let req = []
            if (cid) {//编辑
                const { modify = {} } = data
                const modifyData = modify[template_class] || {}
                req = [{
                    template_class,
                    name: modifyData.name || '',
                    group_id: gid || '',
                    plan_id: pid || '',
                    creative_id: cid,
                    link: data.link || '',
                    deep_link: data.deep_link || '',
                    landing: data.landing || '',
                    monitoring_url: data.monitoring_url || '',
                    ad_source: data.ad_source || '',
                    extend_type: data.extend_type || '',
                    extend_data: data.extend_data || {},
                    material: Object.keys(modifyData).reduce((r, i) => {
                        if (i !== 'name') {
                            r[i] = modifyData[i]
                        }
                        return r
                    }, {})
                }]
            } else {//新建
                if (!data.add) {
                    message.warning('请至少选择一种模板！')
                    return
                }
                const { add = {} } = data
                req = Object.keys(add).reduce((r, t) => r.concat(
                    Object.values(add[t]).map(s => ({
                        template_class: t,
                        name: s.name || '',
                        group_id: gid || '',
                        plan_id: pid || '',
                        link: data.link || '',
                        deep_link: data.deep_link || '',
                        landing: data.landing || '',
                        monitoring_url: data.monitoring_url || '',
                        ad_source: data.ad_source || '',
                        extend_type: data.extend_type || '',
                        extend_data: data.extend_data || {},
                        material: Object.keys(s).reduce((r, i) => {
                            if (i !== 'name') {
                                r[i] = s[i]
                            }
                            return r
                        }, {})
                    }))
                ), [])
            }
            this.setState({ loading: true })
            const res = await request({
                url: `${BUSINESSAPIHOST}/promotion/adcreativesave`,
                method: 'post',
                data: req
            })
            console.log('submit=====>', data, req, res)
            if (res && res.status === 1) {
                message.success(cid ? '修改成功' : '添加成功')
                this.setState({ loading: false })
                this.toCreativeHandle(pid)
                if (!cid) {
                    request({
                        url: `${BUSINESSAPIHOST}/event/report`,
                        method: 'get',
                        data: {
                            event_type: 2,
                            data: pid
                        }
                    })
                }
            } else {
                message.error(res && res.msg || '服务器异常')
                this.setState({ loading: false })
            }
        }

    }

    /**
     * @method toGroupHandle 广告组列表
     */
    toGroupHandle = () => {
        this.props.history.push('/promotion/group')
    }

    /**
     * @method toPlanHandle 当前组下计划列表
     */
    toPlanHandle = (gid) => {
        this.props.history.push(`/promotion/plan/${gid}`)
    }

    /**
     * @method toCreativeHandle 当前计划下创意列表
     */
    toCreativeHandle = (pid) => {
        this.props.history.push(`/promotion/creative/${pid}`)
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data
     */
    initDataHandle = async (data = {}) => {
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
        console.log('receive=====>', data)
        console.log('init=====>', initData)
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
            iGroupName,
            iGid,
            iPlanName,
            iPid
        } = this.state
        //页面状态
        const isEdit = cid !== ''
        return (
            <div className={styles.body}>
                <CreativeBreadcrumb className={styles.header}
                    toGroup={e => this.toGroupHandle()}
                    group={iGroupName}
                    toPlan={e => this.toPlanHandle(iGid)}
                    plan={iPlanName}
                    toCreative={e => this.toCreativeHandle(iPid)}
                    text={isEdit ? '修改广告创意' : '添加广告创意'} />
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
                                    initData={initData} />
                            </CreativeWell> :
                            <CreativeWell title="添加创意" className={styles.well}>
                                <CreativeAdd ad_scene={ad_scene}
                                    promote_type={promote_type}
                                    schemaList={schemaList}
                                    config={creativeFormats}
                                    key={creativeFormatsKey} />
                            </CreativeWell>
                    }
                    {
                        purpose === 'landing' ?
                            <CreativeWell title="广告来源及附加创意配置" className={styles.well}>
                                <CreativeAdSource />
                                <CreativeExtend showType={extendValue} onSelectChange={e => this.setState({ extendValue: e })} />
                            </CreativeWell> :
                            purpose === 'download' ?
                                <CreativeWell title="应用下载配置" className={styles.well}>
                                    <CreativeAppName />
                                    <CreativeAppExtend />
                                </CreativeWell> : null
                    }
                    <CreativeWell title="设置广告着陆页" className={styles.well}>
                        {
                            purpose === 'landing' && ad_scene == 1 ?
                                <CreativeLink promote_type={promote_type} schemaList={schemaList} /> :
                                purpose === 'download' ?
                                    <CreativeAppLink /> : null
                        }
                        {
                            purpose === 'landing' ?
                                <CreativeDeeplink /> : null
                        }
                    </CreativeWell>
                    <CreativeWell title="设置广告监测地址" className={styles.well}>
                        <CreativeMonitoringUrl />
                        <CreativeLanding />
                    </CreativeWell>
                    <CreativeSubmit onCancel={e => this.toCreativeHandle(iPid)} text={isEdit ? '保存修改' : '完成'} />
                </CreativeList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(CreativeOperate)
