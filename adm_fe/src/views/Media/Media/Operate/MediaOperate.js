/**
 * @class 媒体添加、编辑页面
 */
import React, { Component } from 'react';
import styles from './MediaOperate.less'
import { Form, message } from 'antd'
import {
    MediaList,
    MediaWell,
    MediaBreadcrumb,
    MediaName,
    MediaType,
    MediaPlatform,
    MediaMedium,
    MediaClass,
    MediaBundleId,
    MediaURL,
    MediaKeywords,
    MediaIntro,
    MediaShield,
    MediaBlackIndustry,
    MediaLinkman,
    MediaTel,
    MediaDutyUser,
    MediaSubmit
} from '../../../../containers/Media/MediaOperate'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class MediaOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //媒体UID
            uid: props.match.params.id || '',
            //初始化数据
            initData: null,
            //媒体类型是否为应用
            showPlatform: false,
            //是否屏蔽行业
            showBlackList: false,
            //===== =====
            //媒体账号列表
            mediumList: [],
            //媒体分类列表
            classList: [],
            //黑名单分类列表
            classBlackList: [],
            //===== =====
            loading: false
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        const { uid } = this.state
        await this.receiveMedium()
        await this.receiveClass()
        await this.receiveBlackClass()
        if (uid) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/media/getMedia`,
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
            const { uid, showPlatform, showBlackList } = this.state
            const req = {
                name: data.name,
                type: data.type,
                medium: data.medium,
                class: data.class,
                keywords: data.keywords,
                intro: data.intro,
                linkman: data.linkman,
                tel: data.tel,
                duty_user: data.duty_user
            }
            if (showPlatform) {
                req.platform = data.platform
                req.bundle_id = data.bundle_id
            } else {
                req.bundle_id = data.url
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
                url: `${BUSINESSAPIHOST}/media/mediaadd`,
                method: 'post',
                data: req
            })
            console.log('submit=====>', req, res)
            if (res && res.status === 1) {
                message.success(uid ? '修改成功' : '添加成功')
                this.setState({ loading: false })
                this.props.history.push('/media/media')
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
        this.props.history.push('/media/media')
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data 
     */
    initDataHandle = async (data = {}) => {
        const showPlatform = data.type === 3
        const showBlackList = !!data.black_industry
        const initData = {
            name: data.name || '',
            type: data.type || 2,
            medium: data.medium || '',
            class: data.class || '',
            keywords: data.keywords || '',
            intro: data.intro || '',
            linkman: data.linkman || '',
            tel: data.tel || '',
            duty_user: data.duty_user || ''
        }
        if (showPlatform) {
            initData.platform = data.platform || 'android'
            initData.bundle_id = data.bundle_id || ''
        } else {
            initData.url = data.bundle_id || ''
        }
        if (showBlackList) {
            initData.shield = 1
            initData.black_industry = data.black_industry.split(',')
        } else {
            initData.shield = 0
        }
        await this.setState({ showPlatform, showBlackList })
        console.log('receive=====>', data)
        console.log('init=====>', initData)
        this.setState({ initData })
    }

    /**
     * @method typeChangeHandle 媒体类型切换
     */
    typeChangeHandle = async (e) => {
        const showPlatform = e.target.value === 3
        await this.setState({ showPlatform })
        showPlatform && this.props.form.setFieldsValue({ platform: 'android' })
    }

    /**
     * @method shieldChangeHandle 行业屏蔽切换
     */
    shieldChangeHandle = (e) => {
        const showBlackList = e.target.value === 1
        this.setState({ showBlackList })
    }

    /**
     * @method receiveMedium 获取媒体账户
     */
    receiveMedium = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/getmedium`,
            method: 'post'
        })
        if (res && res.status === 1) {
            this.setState({
                mediumList: res.data.map(t => ({
                    value: t.id,
                    label: t.name
                }))
            })
        }
    }

    /**
     * @method receiveClass 获取媒体分类
     */
    receiveClass = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/category`,
            method: 'get'
        })
        if (res && res.status === 1) {
            const { data } = res
            this.setState({
                classList: Object.keys(data).map(t => {
                    const obj = data[t]
                    return {
                        value: t,
                        label: t,
                        children: Object.keys(obj).map(s => ({
                            value: obj[s],
                            label: s
                        }))
                    }
                })
            })
        }
    }

    /**
     * @method receiveBlackClass 获取黑名单分类列表
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
            showPlatform,
            showBlackList,
            mediumList,
            classList,
            classBlackList,
            loading
        } = this.state
        //页面状态
        const isEdit = uid !== ''
        return (
            <div className={styles.body}>
                <MediaBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={isEdit ? '修改媒体' : '添加媒体'} />
                <MediaList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <MediaWell className={styles.well}>
                        <MediaName />
                        <MediaType disabled={isEdit} onChange={this.typeChangeHandle} />
                        {
                            showPlatform ? <MediaPlatform disabled={isEdit} /> : null
                        }
                        <MediaMedium disabled={isEdit} data={mediumList} />
                        <MediaClass data={classList} />
                        {
                            showPlatform ? <MediaBundleId disabled={isEdit} /> : <MediaURL disabled={isEdit} />
                        }
                        <MediaKeywords />
                        <MediaIntro />
                        <MediaShield onChange={this.shieldChangeHandle} />
                        {
                            showBlackList ? <MediaBlackIndustry data={classBlackList} /> : null
                        }
                        <MediaLinkman />
                        <MediaTel />
                        <MediaDutyUser />
                        <MediaSubmit onCancel={this.cancelHandle} text={isEdit ? '完成修改' : '完成添加'} />
                    </MediaWell>
                </MediaList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(MediaOperate)
