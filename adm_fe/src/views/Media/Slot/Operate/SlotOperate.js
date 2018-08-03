/**
 * @class 广告位添加、编辑页面
 */
import React, { Component } from 'react';
import styles from './SlotOperate.less'
import { Form, message } from 'antd'
import {
    SlotBreadcrumb,
    SlotList,
    SlotWell,
    SlotName,
    SlotMedia,
    SlotMediaType,
    SlotClass,
    SlotSlotChannelParent,
    SlotSlotChannel,
    SlotShield,
    SlotBlackIndustry,
    SlotTemplates,
    SlotTemplatesConfig,
    SlotSubmit
} from '../../../../containers/Media/SlotOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import { SLOT_DICTIONARY as idDictionary, SLOT_TEMPLATE_LIST as templateInfo } from '../../../../containers/Media/SlotOperate/config'
import Loading from '../../../../components/Loading/Loading'

class SlotOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //广告位UID
            uid: props.match.params.id || '',
            //初始化数据
            initData: null,
            //是否屏蔽行业
            showBlackList: false,
            //媒体平台属性
            mediaType: '',
            //广告位频道分类当前二级列表
            slotChannelList: [],
            //广告位类型
            classId: '',
            //模板
            templates: [],
            //历史模板uid集合
            historyTemplatesUid: [],
            //===== =====
            //媒体列表
            mediaList: [],
            //广告位频道分类一级列表
            slotChannelParentList: [],
            //广告位频道分类所有二级列表
            slotChannelAllList: {},
            //黑名单分类列表
            classBlackList: [],
            //===== =====
            loading: false
        }
    }

    /**
     * @description 初始化数据
     */
    componentWillMount = async () => {
        const { uid } = this.state
        await this.receiveMedia()
        await this.receiveSlotChannel()
        await this.receiveBlackClass()
        if (uid) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/media/fetchslot`,
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
        const data = await values
        if (data) {
            const { uid, showBlackList, historyTemplatesUid } = this.state
            const { templates = [] } = data
            //修改的模板中被启用的模板UID
            const activeTemplatesUid = []
            const req = {
                name: data.name,
                media: data.media,
                sell_type: '3',//暂写死
                class: data.class,
                slot_channel: (data.slot_channel || []).join(','),
                templates: Object.keys(templates).map(k => {
                    const t = templates[k] || {}
                    let st_uid = t.uid
                    if (st_uid) {
                        activeTemplatesUid.push(st_uid)
                    } else {//如果是新建模板，从历史列表里取st_uid
                        const historyTemplatesUidObj = historyTemplatesUid.find(t => t.template_class === k)
                        if (historyTemplatesUidObj) {
                            st_uid = historyTemplatesUidObj.st_uid
                            activeTemplatesUid.push(st_uid)
                        }
                    }
                    return {
                        uid: st_uid,
                        slot: uid,
                        class: data.class,
                        setting: t.setting,
                        template: '',//固定传空
                        template_name: idDictionary[k],
                        //固定信息流remove:_fixed
                        template_class: 'c96089f7-9cff-4149-997f-bb03d617cda0' === data.class ?
                            k.replace(/_fixed/g, '') : k
                    }
                })
            }
            if (showBlackList) {
                req.black_industry = data.black_industry.join(',')
            } else {
                req.black_industry = ''
            }
            this.setState({ loading: true })
            if (uid) {
                req.uid = uid
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/media/feedsslotadd`,
                method: 'post',
                data: req
            })
            console.log('submit=====>', req, res)
            //更改历史模板状态
            for (let i = 0, l = historyTemplatesUid.length; i < l; i++) {
                const t = historyTemplatesUid[i]
                if (activeTemplatesUid.includes(t.st_uid)) {
                    if (t.st_status !== 'active') {
                        await request({
                            url: `${BUSINESSAPIHOST}/media/updateslottemplatestatus`,
                            method: 'post',
                            data: {
                                uid: t.st_uid,
                                status: 'active'
                            }
                        })
                    }
                } else if (t.st_status === 'active') {
                    await request({
                        url: `${BUSINESSAPIHOST}/media/updateslottemplatestatus`,
                        method: 'post',
                        data: {
                            uid: t.st_uid,
                            status: 'pause'
                        }
                    })
                }
            }
            if (res && res.status === 1) {
                message.success(uid ? '修改成功' : '添加成功')
                this.setState({ loading: false })
                this.props.history.push('/media/slot')
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
        this.props.history.push('/media/slot')
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data 
     */
    initDataHandle = async (data = {}) => {
        const showBlackList = !!data.black_industry
        const slot_channel = data.slot_channel ? data.slot_channel.split(',') : []
        console.log('slot_channel', slot_channel)
        //已选的模板id
        const templates_select = []
        //已选的模板设置
        const templates = {}
        //历史模板uid集合
        const historyTemplatesUid = (data.templates || []).map(t => {
            //固定信息流add:_fixed
            const template_class = 'c96089f7-9cff-4149-997f-bb03d617cda0' === data.class ?
                t.template_class + '_fixed' : t.template_class
            //展示第一次出现的状态为active模板
            if (t.st_status === 'active' && !templates_select.includes(template_class)
                //template_class必须在配置表中存在，过滤废弃的模板ID
                && (templateInfo[data.class] || []).some(t => t.templateId === template_class)) {
                templates_select.push(template_class)
                templates[template_class] = {
                    uid: t.st_uid,
                    setting: t.setting
                }
            }
            //每个模板UID保存进历史表
            return {
                st_uid: t.st_uid,
                st_status: t.st_status,
                template_class: template_class
            }
        })
        const initData = {
            name: data.name || '',
            media: data.media || '',
            class: data.class || '29076f0d-a923-47d4-bfef-2e3cf28fc099',
            slot_channel_parent: ((info = {}, values = []) => {
                if (values.length === 0) {
                    return ''
                }
                console.log('value', values)
                const keys = Object.keys(info)
                for (let i = 0, l = keys.length; i < l; i++) {
                    const key = keys[i]
                    if (info[key].map(t => t.value).includes(values[0])) {
                        return key
                    }
                }
                return ''
            })(this.state.slotChannelAllList, slot_channel),
            slot_channel,
            templates_select,
            templates
        }
        if (showBlackList) {
            initData.shield = 1
            initData.black_industry = data.black_industry.split(',')
        } else {
            initData.shield = 0
        }
        await this.setState({
            showBlackList,
            classId: initData.class,
            templates: initData.templates_select,
            slotChannelList: this.state.slotChannelAllList[initData.slot_channel_parent] || [],
            historyTemplatesUid
        })
        if (initData.media) {
            await this.mediaChangeHandle(initData.media)
        }
        console.log('receive=====>', data)
        console.log('init=====>', initData)
        this.setState({ initData })
    }

    /**
     * @method mediaChangeHandle 媒体列表切换
     */
    mediaChangeHandle = async (e) => {
        this.setState({ mediaType: '' })
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/fetchmediainfo`,
            method: 'get',
            data: {
                uid: e
            }
        })
        if (res && res.status === 1) {
            const mediaType = res.data.type
            this.setState({
                mediaType: mediaType === 2 ? '网页' : mediaType === 3 ? '应用' : ''
            })
        }
    }

    /**
     * @method classChangeHandle 广告位类型切换
     */
    classChangeHandle = (e) => {
        this.props.form.resetFields('templates_select')
        this.setState({
            classId: e.target.value,
            templates: []
        })
    }

    /**
     * @method slotChannelParentChangeHandle 广告位频道分类一级列表切换
     */
    slotChannelParentChangeHandle = async (e) => {
        this.props.form.resetFields('slot_channel')
        this.setState({
            slotChannelList: this.state.slotChannelAllList[e] || []
        })
    }

    /**
     * @method shieldChangeHandle 行业屏蔽切换
     */
    shieldChangeHandle = (e) => {
        this.setState({
            showBlackList: e.target.value === 1
        })
    }

    /**
     * @method templatesChangeHandle 选择模板
     */
    templatesChangeHandle = (e) => {
        this.setState({ templates: e })
    }

    /**
     * @method receiveMedia 获取媒体列表
     */
    receiveMedia = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/medialistforcurrentuser`,
            method: 'post'
        })
        if (res && res.status === 1) {
            const { data } = res
            this.setState({
                mediaList: Object.keys(data).map(t => ({
                    value: t,
                    label: data[t]
                }))
            })
        }
    }

    /**
     * @method receiveSlotChannel 获取广告位频道分类列表
     */
    receiveSlotChannel = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/getchannelclassformatted`,
            method: 'post'
        })
        if (res && res.status === 1) {
            const data = res.data
            const slotChannelParentList = []
            const slotChannelAllList = {}
            for (let i = 0, l = data.length; i < l; i++) {
                const item = data[i]
                slotChannelParentList.push({
                    value: item.id,
                    label: item.name
                })
                slotChannelAllList[item.id] = item.child.map(t => ({
                    value: t.id,
                    label: t.name
                }))
            }
            this.setState({
                slotChannelParentList,
                slotChannelAllList
            })
        }
    }

    /**
     * @method receiveBlackClass 获取黑名单
     */
    receiveBlackClass = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/promotion/tag`,
            method: 'post',
            data: {
                level: 2
            }
        })
        if (res && res.status === 1) {
            this.setState({
                classBlackList: res.data.map(t => ({
                    value: t.code,
                    label: t.name,
                    children: t.child.map(s => ({
                        value: s.code,
                        label: s.name
                    })).filter(s => s.value !== t.code)
                }))
            })
        }
    }

    render() {
        const {
            uid,
            initData,
            mediaList,
            mediaType,
            classId,
            templates,
            showBlackList,
            slotChannelParentList,
            slotChannelList,
            classBlackList,
            loading
        } = this.state
        //页面状态
        const isEdit = uid !== ''
        return (
            <div className={styles.body}>
                <SlotBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={isEdit ? '修改广告位' : '添加广告位'} />
                <SlotList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <SlotWell className={styles.well}>
                        <SlotName />
                        <SlotMedia disabled={isEdit} data={mediaList} onChange={this.mediaChangeHandle} />
                        <SlotMediaType value={mediaType} />
                        <SlotClass disabled={isEdit} onChange={this.classChangeHandle} />
                        <SlotSlotChannelParent data={slotChannelParentList} onChange={this.slotChannelParentChangeHandle} />
                        {
                            slotChannelList.length === 0 ? null : <SlotSlotChannel data={slotChannelList} />
                        }
                        <SlotShield onChange={this.shieldChangeHandle} />
                        {
                            showBlackList ? <SlotBlackIndustry data={classBlackList} /> : null
                        }
                    </SlotWell>
                    <SlotWell dot title="选择模版" subTitle="请点击缩略图预览样式，根据广告位尺寸比例推荐适配较好的样式">
                        {classId ? <SlotTemplates classId={classId} onChange={this.templatesChangeHandle} /> : null}
                        {templates.length === 0 ? null : <SlotTemplatesConfig templates={templates} />}
                        <SlotSubmit className={styles.well} onCancel={this.cancelHandle} text={isEdit ? '完成修改' : '完成添加'} />
                    </SlotWell>
                </SlotList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(SlotOperate)
