/**
 * @class 广告计划添加、编辑页面
 */
import React, { Component } from 'react';
import styles from './PlanOperate.less'
import { Form, message, Tag } from 'antd'
import {
    PlanList,
    PlanWell,
    PlanBreadcrumb,
    PlanGroupName,
    PlanName,
    PlanProductGroup,
    PlanProductGroupOperate,
    PlanPlatform,
    PlanDownloadLink,
    PlanAppPkg,
    PlanDirectContainer,
    PlanArea,
    PlanPlatformLanding,
    PlanNetwork,
    PlanMediaSlotTarget,
    PlanKeyWord,
    PlanChannelClass,
    PlanTagTarget,
    PlanCategoryTarget,
    PlanCycle,
    PlanHourTarget,
    PlanBudget,
    PlanBidType,
    PlanPrice,
    PlanFrequency,
    PlanSpeed,
    PlanSubmit
} from '../../../../containers/Promotion/PlanOperate'
import Tools from '../../../../containers/Promotion/Tools/Tools'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'
import moment from 'moment'
import * as requests from './flow/requests'
import * as formatters from './flow/formatters'

class PlanOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //广告组ID
            gid: props.match.params.gid || '',
            //广告计划ID
            pid: props.match.params.pid || '',
            //初始化数据
            initData: null,
            //===== =====
            //推广目的
            purpose: 'landing',
            //推广类型
            promote_type: 1,
            //广告形式
            ad_scene: 1,
            //广告组列表
            groupList: [],
            //复制定向时广告组列表
            groupListDirect: [],
            //商品组列表
            promoteGroupList: [],
            //地域列表
            areaList: [],
            //定向媒体列表
            mediaList: [],
            //频道分类列表
            channelList: [],
            //行为定向列表
            tagList: [],
            //兴趣标签列表
            categoryList: [],
            //===== =====
            //已选商品组
            productGroupInfo: null,
            //显示商品组操作
            productGroupType: '',
            //feeds列表
            feedsList: [],
            //schema列表
            schemaList: [],
            //商品组添加状态
            addProductGroupStatus: '',
            addProductGroupResult: {},
            //商品组编辑状态
            modifyProductGroupStatus: '',
            modifyProductGroupResult: {},
            //===== =====
            //显示地域选择
            showArea: false,
            //显示落地页平台选择
            showPlatformLanding: false,
            //显示网络选择
            showNetwork: false,
            //显示广告位定向选择
            showMediaSlotTarget: false,
            //显示频道分类定向选择
            showChannelClass: false,
            //显示广告行为定向选择
            showTagTarget: false,
            //显示用户兴趣标签定向选择
            showCategoryTarget: false,
            //显示时段定向选择
            showHourTarget: false,
            //===== =====
            loading: true,
            //===== 面包屑初始化 =====
            iGroupName: '',
            iGid: ''
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        //获取广告组信息，初始化面包屑
        await this.receiveGroupInfo(this.state.gid, true)
        //获取广告组列表
        const groupList = formatters.groupList(await requests.receiveGroupList('', 0, {}))
        //获取地域列表
        const areaList = formatters.areaList(await requests.receiveAreaList())
        //获取媒体列表
        const mediaList = formatters.mediaList(await requests.receiveMediaList())
        //获取频道分类列表
        const channelList = formatters.channelList(await requests.receiveChannelList())
        //获取广告行为定向列表
        const tagList = formatters.tagList(await requests.receiveTagList())
        //获取用户兴趣标签列表
        const categoryList = formatters.categoryList(await requests.receiveCategoryList())
        //获取feeds列表
        const feedsList = formatters.feedsList(await requests.receiveFeedsList())
        await this.setState({
            groupList,
            areaList,
            mediaList,
            channelList,
            tagList,
            categoryList,
            feedsList
        })
        const { pid } = this.state
        if (pid) {//编辑
            const res = await requests.receivePlanInfo(pid)
            if (res) {
                this.initDataHandle(res, true)
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
            const { gid, pid, purpose, promote_type, ad_scene } = this.state
            const req = {
                group_id: gid,
                name: data.name || '',
                area: (data.area || []).join(','),
                network: (data.network || []).join(','),
                // 媒体广告位定向去掉
                // media_slot_target: [],
                // media_slot_target: formatters.mediaSlotValue(data.media_slot_target),
                key_word: (data.key_word || []).map(t => {
                    return {
                        ...t,
                        audit_status: undefined
                    }
                }),
                channel_class: (data.channel_class || []).join(','),
                tag_target: (data.tag_target || []).join(','),
                category_target: (data.category_target || []).join(','),
                s: data.cycle[0].format("YYYY-MM-DD"),
                e: data.cycle[1].format("YYYY-MM-DD"),
                hour_target: formatters.hourValue(data.hour_target),
                budget: data.budget || '',
                bid_type: data.bid_type || '',
                price: data.price || '',
                frequency: data.frequency || '',
                frequency_status: data.frequency ? 'on' : 'off',
                speed: data.speed || '',
                app_store_id: data.app_store_id || '',
                product_group: data.product_group || '',
                app_pkg: data.app_pkg || '',
                download_link: data.download_link || ''
            }
            if (ad_scene == 1) {
                req.media_slot_target = formatters.mediaSlotValue(data.media_slot_target)
            }
            if (purpose === 'download') {
                req.platform = data.platform || ''
            } else {
                req.platform = (data.platform_landing || []).join(',')
            }
            if (pid) {
                req.id = pid
            }
            this.setState({ loading: true })
            const res = await requests.submitData(req, true)
            console.log('submit=====>', data, req, res)
            if (res !== false) {
                message.success(pid ? '修改成功' : '添加成功')
                this.setState({ loading: false })
                if (pid) {
                    this.toPlanHandle(gid)
                } else {
                    this.toAddCreativeHandle(res)
                }
            } else {
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
     * @method toAddCreativeHandle 新建计划
     */
    toAddCreativeHandle = (pid) => {
        this.props.history.push(`/promotion/creative/operate/${pid}`)
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data 
     */
    initDataHandle = async (data = {}) => {
        const { purpose, promote_type, ad_scene } = this.state
        //显示地域选择
        let showArea = false
        //显示落地页平台选择
        let showPlatformLanding = false
        //显示网络选择
        let showNetwork = false
        //显示广告位定向选择
        let showMediaSlotTarget = false
        //显示频道分类定向选择
        let showChannelClass = false
        //显示广告行为定向
        let showTagTarget = false
        //显示用户兴趣标签定向
        let showCategoryTarget = false
        //显示时段定向选择
        let showHourTarget = false
        const initData = {
            group_id: (data.group_id || this.state.gid) + '',
            name: data.name || '',
            area_select: 0,
            // 媒体广告位定向去掉
            // media_slot_target_select: 0,
            cycle: data.s && data.e ? [moment(data.s), moment(data.e)] : [moment(), moment()],
            hour_target_select: 0,
            budget: data.budget || '',
            speed: data.speed || 'cs',
            key_word: data.key_word || []
        }
        if (data.area) {
            initData.area_select = 1
            initData.area = data.area.split(',')
            showArea = true
        }
        // 媒体广告位定向去掉
        // if (data.media_target) {
        //     initData.media_slot_target_select = 1
        //     initData.media_slot_target = formatters.mediaSlotList(data.media_slot_target)
        //     showMediaSlotTarget = true
        // }
        const hour_target = data.hour_target
        if (hour_target && ![1, 2, 3, 4, 5, 6, 7].every(t => {
            return hour_target[t] && hour_target[t].length === 24
        })) {
            initData.hour_target_select = 1
            initData.hour_target = [1, 2, 3, 4, 5, 6, 7].map(t => {
                return hour_target[t]
            })
            showHourTarget = true
        }
        if (promote_type == 1) {
        } else {
            initData.product_group = data.product_group || ''
        }
        if (purpose === 'download') {
            initData.platform = data.platform || ''
            initData.app_pkg = data.app_pkg || ''
            initData.download_link = data.download_link || ''
        }
        if (purpose === 'landing' && ad_scene == 1) {
            if (data.platform) {
                initData.platform_landing_select = 1
                initData.platform_landing = data.platform.split(',')
                showPlatformLanding = true
            } else {
                initData.platform_landing_select = 0
            }
        }
        if (ad_scene == 1) {
            if (data.media_target) {
                initData.media_slot_target_select = 1
                initData.media_slot_target = formatters.mediaSlotList(data.media_slot_target)
                showMediaSlotTarget = true
            }
            if (data.network) {
                initData.network_select = 1
                initData.network = data.network.split(',')
                showNetwork = true
            } else {
                initData.network_select = 0
            }
            if (data.channel_class) {
                initData.channel_class_select = 1
                initData.channel_class = data.channel_class.split(',')
                showChannelClass = true
            } else {
                initData.channel_class_select = 0
            }
            if (data.tag_target) {
                initData.tag_target_select = 1
                initData.tag_target = data.tag_target.map(t => t.level2)
                showTagTarget = true
            } else {
                initData.tag_target_select = 0
            }
            if (data.category_target) {
                initData.category_target_select = 1
                initData.category_target = data.category_target.map(t => t.level2)
                showCategoryTarget = true
            } else {
                initData.category_target_select = 0
            }
            initData.price = data.price || ''
            initData.bid_type = data.bid_type || 'cpm'
            initData.frequency = data.frequency ? data.frequency.join(',') : ''
        } else {
            initData.bid_type = data.bid_type || 'cpc'
        }
        await this.setState({
            showArea,
            showPlatformLanding,
            showNetwork,
            showMediaSlotTarget,
            showChannelClass,
            showTagTarget,
            showCategoryTarget,
            showHourTarget
        })
        console.log('receive=====>', data)
        console.log('init=====>', initData)
        await this.setState({ initData, loading: false })
        this.changeProductGroupHandle(initData.product_group)
        // 数据渲染后，通过触发滚动条事件更新底部工具箱状态
        Tools.scrollView()
    }

    /**
     * @method receiveGroupInfo 获取广告组信息
     * @param {String} gid 广告组ID
     * @param {Boolean} init true:初始化时更新面包屑
     */
    receiveGroupInfo = async (gid, init) => {
        const res = await requests.receiveGroupInfo(gid)
        let groupListDirect = []
        let promoteGroupList = []
        if (res.promote_type == 1) {
            //普通创意广告获取媒体定向广告组列表
            groupListDirect = formatters.planList(await requests.receiveGroupList('', 1, res))
        } else {
            //动态商品广告获取商品组列表
            promoteGroupList = formatters.promoteGroupList(await requests.receivePromoteGroupList(gid))
        }
        await this.setState({
            gid,
            purpose: res.purpose || '',
            promote_type: res.promote_type || '',
            ad_scene: res.ad_scene || '',
            groupListDirect,
            promoteGroupList,
            iGroupName: init === true && res.name || this.state.iGroupName,
            iGid: init === true && gid || this.state.iGid
        })
        if (!init && res.ad_scene == 2) {
            //更新计费方式
            await this.props.form.setFieldsValue({ bid_type: 'cpc' })
        }
    }

    /**
     * @description 商品组相关
     */
    /**
     * @method changeProductGroupHandle 选择商品组
     */
    changeProductGroupHandle = async (e) => {
        if (!e) {
            return
        }
        //查看商品组界面状态：show
        this.setState({
            modifyProductGroupStatus: 'show',
            modifyProductGroupResult: {}
        })
        //获取商品组信息
        const res = await requests.receivePromoteGroupInfo(e)
        this.setState({
            productGroupInfo: res || [],
            //关闭商品组操作界面
            productGroupType: ''
        })
        //获取商品组计算结果
        const size = await requests.receiveProductGroupCount(e)
        //查看商品组界面状态：show-calc
        this.setState({
            modifyProductGroupStatus: 'show-calc',
            modifyProductGroupResult: {
                download: `${BUSINESSAPIHOST}/dmc/downloadProducts?groupId=${e}`,
                size: size || 0
            }
        })
        //更新关键词中schema列表
        const schemaList = await requests.receiveSchemaByGroup(e)
        this.setState({
            schemaList: schemaList || []
        })
    }

    /**
     * @method addProductGroupHandle 新建商品组
     */
    addProductGroupHandle = async (filter) => {
        const { gid } = this.state
        const fields = ['product_group_name', 'product_group_mfeedId']
        this.props.form.validateFields(fields, {}, async (errors, values) => {
            if (errors === null) {
                this.setState({
                    //新建商品组界面状态：add-ing
                    addProductGroupStatus: 'add-ing'
                })
                //提交新建商品组
                const res = await requests.saveProductGroup('', { ...values, filter })
                if (res !== false) {
                    this.setState({
                        //新建商品组界面状态：add-end
                        addProductGroupStatus: 'add-end',
                        //查看商品组界面状态：show
                        modifyProductGroupStatus: 'show',
                        modifyProductGroupResult: {}
                    })
                    //获取新建后该商品组ID
                    const productGroupId = res.groupId
                    //更新商品组列表
                    const promoteGroupList = formatters.promoteGroupList(await requests.receivePromoteGroupList(gid))
                    await this.setState({ promoteGroupList })
                    //新建的商品组为选中
                    await this.props.form.setFieldsValue({ product_group: productGroupId })
                    //获取商品组计算结果
                    const size = await requests.receiveProductGroupCount(productGroupId)
                    this.setState({
                        //新建商品组界面状态：add-calc
                        addProductGroupStatus: 'add-calc',
                        addProductGroupResult: {
                            download: `${BUSINESSAPIHOST}/dmc/downloadProducts?groupId=${productGroupId}`,
                            size: size || 0
                        },
                        //查看商品组界面状态：show-calc
                        modifyProductGroupStatus: 'show-calc',
                        modifyProductGroupResult: {
                            download: `${BUSINESSAPIHOST}/dmc/downloadProducts?groupId=${productGroupId}`,
                            size: size || 0
                        }
                    })
                } else {
                    //新建商品组界面状态：可提交
                    this.setState({ addProductGroupStatus: '' })
                }
            }
        })
    }

    /**
     * @method modifyProductGroupHandle 修改商品组
     */
    modifyProductGroupHandle = async (filter) => {
        const { gid } = this.state
        const fields = ['product_group_name', 'product_group_mfeedId', 'product_group']
        this.props.form.validateFields(fields, {}, async (errors, values) => {
            if (errors === null) {
                //查看商品组界面状态：modify-ing
                this.setState({ modifyProductGroupStatus: 'modify-ing' })
                //提交修改商品组
                const res = await requests.saveProductGroup(values.product_group_mfeedId, { ...values, filter })
                if (res !== false) {
                    this.setState({
                        //查看商品组界面状态：modify-end
                        modifyProductGroupStatus: 'modify-end'
                    })
                    //获取修改后该商品组ID
                    const productGroupId = res.groupId
                    //更新商品组列表
                    const promoteGroupList = formatters.promoteGroupList(await requests.receivePromoteGroupList(gid))
                    await this.setState({ promoteGroupList })
                    //修改的商品组为选中
                    await this.props.form.setFieldsValue({ product_group: productGroupId })
                    //获取商品组计算结果
                    const size = await requests.receiveProductGroupCount(productGroupId)
                    this.setState({
                        //查看商品组界面状态：modify-calc
                        modifyProductGroupStatus: 'modify-calc',
                        modifyProductGroupResult: {
                            download: `${BUSINESSAPIHOST}/dmc/downloadProducts?groupId=${productGroupId}`,
                            size: size || 0
                        }
                    })
                } else {
                    //查看商品组界面状态：可提交
                    this.setState({ modifyProductGroupStatus: '' })
                }
            }
        })
    }

    /**
     * @method submitDirectHandle 复制定向
     */
    submitDirectHandle = async (data) => {
        const { purpose, promote_type, ad_scene } = this.state
        //显示地域选择
        let showArea = false
        //显示落地页平台选择
        let showPlatformLanding = false
        //显示网络选择
        let showNetwork = false
        //显示广告位定向选择
        let showMediaSlotTarget = false
        //显示频道分类定向选择
        let showChannelClass = false
        //显示广告行为定向
        let showTagTarget = false
        //显示用户兴趣标签定向
        let showCategoryTarget = false
        const initData = {
            area_select: 0,
            // media_slot_target_select: 0,
            cycle: data.s && data.e ? [moment(data.s), moment(data.e)] : [moment(), moment()],
            key_word: data.key_word || []
        }
        if (data.area) {
            initData.area_select = 1
            initData.area = data.area.split(',')
            showArea = true
        }
        // if (data.media_target) {
        //     initData.media_slot_target_select = 1
        //     initData.media_slot_target = formatters.mediaSlotList(data.media_slot_target)
        //     showMediaSlotTarget = true
        // }
        if (purpose === 'landing' && ad_scene == 1) {
            if (data.platform) {
                initData.platform_landing_select = 1
                initData.platform_landing = data.platform.split(',')
                showPlatformLanding = true
            } else {
                initData.platform_landing_select = 0
            }
        }
        if (ad_scene == 1) {
            if (data.media_target) {
                initData.media_slot_target_select = 1
                initData.media_slot_target = formatters.mediaSlotList(data.media_slot_target)
                showMediaSlotTarget = true
            }
            if (data.network) {
                initData.network_select = 1
                initData.network = data.network.split(',')
                showNetwork = true
            } else {
                initData.network_select = 0
            }
            if (data.channel_class) {
                initData.channel_class_select = 1
                initData.channel_class = data.channel_class.split(',')
                showChannelClass = true
            } else {
                initData.channel_class_select = 0
            }
            if (data.tag_target) {
                initData.tag_target_select = 1
                initData.tag_target = data.tag_target.map(t => t.level2)
                showTagTarget = true
            } else {
                initData.tag_target_select = 0
            }
            if (data.category_target) {
                initData.category_target_select = 1
                initData.category_target = data.category_target.map(t => t.level2)
                showCategoryTarget = true
            } else {
                initData.category_target_select = 0
            }
        }
        await this.setState({
            showArea,
            showPlatformLanding,
            showNetwork,
            showMediaSlotTarget,
            showChannelClass,
            showTagTarget,
            showCategoryTarget
        })
        this.props.form.setFieldsValue(initData)
    }

    render() {
        const {
            gid,
            pid,
            initData,
            purpose,
            promote_type,
            ad_scene,
            groupList,
            groupListDirect,
            promoteGroupList,
            areaList,
            mediaList,
            channelList,
            tagList,
            categoryList,
            //已选商品组信息
            productGroupInfo,
            //显示商品组操作
            productGroupType,
            //feeds列表
            feedsList,
            //schema列表
            schemaList,
            //商品组添加状态
            addProductGroupStatus,
            addProductGroupResult,
            //商品组编辑状态
            modifyProductGroupStatus,
            modifyProductGroupResult,
            //===== =====
            //显示地域选择
            showArea,
            //显示落地页平台选择
            showPlatformLanding,
            //显示网络选择
            showNetwork,
            //显示广告位定向选择
            showMediaSlotTarget,
            //显示频道分类定向选择
            showChannelClass,
            //显示广告行为定向选择
            showTagTarget,
            //显示用户兴趣标签定向选择
            showCategoryTarget,
            //显示时段定向选择
            showHourTarget,
            loading,
            iGroupName,
            iGid
        } = this.state
        //页面状态
        const isEdit = pid !== ''
        const view = {
            purpose,
            ad_scene,
            promote_type
        }
        return (
            <div className={styles.body}>
                <PlanBreadcrumb className={styles.header}
                    toGroup={e => this.toGroupHandle()}
                    group={iGroupName}
                    toPlan={e => this.toPlanHandle(iGid)}
                    text={isEdit ? '修改广告计划' : '添加广告计划'} />
                <PlanList className={styles.content}
                    onSubmit={this.submitHandle}
                    initData={initData}
                    view={view}
                    {...this.props}>
                    <PlanWell>
                        {/* 广告组 */}
                        <PlanGroupName disabled={isEdit}
                            data={groupList}
                            onChange={e => this.receiveGroupInfo(e)} />
                        {/* 广告计划 */}
                        <PlanName />
                        {/* 商品组 */}
                        {promote_type == 1 ? null :
                            <PlanProductGroup canAdd={!isEdit}
                                onAdd={e => this.setState({
                                    //显示新建商品组
                                    productGroupType: 'add',
                                    //新建商品组界面状态：可提交
                                    addProductGroupStatus: '',
                                    addProductGroupResult: {}
                                })}
                                onModify={e => {
                                    this.props.form.validateFields(['product_group'], {}, async (errors) => {
                                        if (errors === null) {
                                            //在商品组切换时已经初始化修改商品组状态
                                            this.setState({
                                                //显示修改商品组
                                                productGroupType: 'modify'
                                            })
                                        }
                                    })
                                }}
                                receiveData={promoteGroupList}
                                onSelectChange={this.changeProductGroupHandle}
                            />}
                    </PlanWell>
                    {
                        productGroupType === 'add' ? <PlanProductGroupOperate key="add"
                            receiveData={feedsList}
                            nameList={promoteGroupList}
                            onSelectChange={requests.receiveSchemaByFeed}
                            onSubmit={this.addProductGroupHandle}
                            onCancel={e => this.setState({ productGroupType: '' })}
                            status={addProductGroupStatus}
                            result={addProductGroupResult} /> : null
                    }
                    {
                        productGroupType === 'modify' ? <PlanProductGroupOperate key="modify"
                            isEdit
                            initData={productGroupInfo}
                            resetStatus={e => this.setState({ modifyProductGroupStatus: '' })}
                            receiveData={feedsList}
                            nameList={promoteGroupList}
                            onSelectChange={requests.receiveSchemaByFeed}
                            onSubmit={this.modifyProductGroupHandle}
                            onCancel={e => this.setState({ productGroupType: '' })}
                            status={modifyProductGroupStatus}
                            result={modifyProductGroupResult} /> : null
                    }
                    {purpose === 'download' ? <PlanWell title="设置下载链接">
                        <PlanPlatform />
                        <PlanDownloadLink />
                        <PlanAppPkg />
                    </PlanWell> : null}
                    <PlanWell title="设置投放定向">
                        {promote_type == 1 ?
                            <PlanDirectContainer more={{
                                //data
                                purpose,
                                promote_type,
                                ad_scene,
                                groupListDirect,
                                areaList,
                                mediaList,
                                channelList,
                                tagList,
                                categoryList,
                                //method
                                receiveDirect: requests.receivePlanInfo,
                                //operate
                                submit: this.submitDirectHandle
                            }} /> : null}
                        <PlanArea receiveData={areaList} showDetail={showArea} onSelectChange={e => this.setState({ showArea: !!e })} />
                        {purpose === 'landing' && ad_scene == 1 ? <PlanPlatformLanding showDetail={showPlatformLanding} onSelectChange={e => this.setState({ showPlatformLanding: !!e })} /> : null}
                        {ad_scene == 1 ? <PlanNetwork showDetail={showNetwork} onSelectChange={e => this.setState({ showNetwork: !!e })} /> : null}
                        {ad_scene == 1 ? <PlanMediaSlotTarget receiveData={mediaList} showDetail={showMediaSlotTarget} onSelectChange={e => this.setState({ showMediaSlotTarget: !!e })} onDetailSearch={requests.receiveMediaSlotInfo} /> : null}
                        <PlanKeyWord ad_scene={ad_scene} promote_type={promote_type} schemaList={schemaList} submitKeywordNew={e => requests.submitKeywordNew(pid)} />
                        {ad_scene == 1 ? <PlanChannelClass receiveData={channelList} showDetail={showChannelClass} onSelectChange={e => this.setState({ showChannelClass: !!e })} /> : null}
                        {ad_scene == 1 ? <PlanTagTarget receiveData={tagList} showDetail={showTagTarget} onSelectChange={e => this.setState({ showTagTarget: !!e })} /> : null}
                        {ad_scene == 1 ? <PlanCategoryTarget receiveData={categoryList} showDetail={showCategoryTarget} onSelectChange={e => this.setState({ showCategoryTarget: !!e })} /> : null}
                    </PlanWell>
                    <PlanWell title="设置投放预算">
                        <PlanCycle />
                        <PlanHourTarget showDetail={showHourTarget} onSelectChange={e => this.setState({ showHourTarget: !!e })} />
                        <PlanBudget />
                        <PlanBidType disabled={isEdit || ad_scene == 2} />
                        <PlanPrice />
                    </PlanWell>
                    <PlanWell title="高级设置">
                        {ad_scene == 1 ? <PlanFrequency /> : null}
                        <PlanSpeed />
                    </PlanWell>
                    <PlanSubmit onClick={e => this.setState({ productGroupType: '' })} onCancel={e => this.toPlanHandle(iGid)} text={isEdit ? '保存修改' : '完成并继续'} />
                </PlanList>
                {isEdit ? <Tools history={this.props.history} /> : null}
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(PlanOperate)
