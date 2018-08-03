/**
 * @class 广告组添加、编辑页面
 */
import React, { Component } from 'react';
import styles from './GroupOperate.less'
import { Form, message } from 'antd'
import {
    GroupList,
    GroupWell,
    GroupBreadcrumb,
    GroupName,
    GroupAdScene,
    GroupPromoteType,
    GroupPurpose,
    GroupBudget,
    GroupSubmit
} from '../../../../containers/Promotion/GroupOperate'
import Tools from '../../../../containers/Promotion/Tools/Tools'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'

class GroupOperate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //广告组ID
            gid: props.match.params.gid || '',
            //初始化数据
            initData: null,
            //===== =====
            loading: true
        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        const { gid } = this.state
        if (gid) {//编辑
            const res = await request({
                url: `${BUSINESSAPIHOST}/promotion/fetchadgroup`,
                method: 'get',
                data: { id: gid }
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
            const { gid } = this.state
            const req = {
                name: data.name,
                purpose: data.purpose,
                budget: data.budget,
                promote_type: data.promote_type,
                ad_scene: data.ad_scene
            }
            this.setState({ loading: true })
            if (gid) {
                req.id = gid
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/promotion/adgroupsave`,
                method: 'post',
                data: req
            })
            console.log('submit=====>', req, res)
            if (res && res.status === 1) {
                message.success(gid ? '修改成功' : '添加成功')
                this.setState({ loading: false })
                if (gid) {
                    this.toGroupHandle()
                } else {
                    this.toAddPlanHandle(res.data)
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
     * @method toAddPlanHandle 新建计划
     */
    toAddPlanHandle = (gid) => {
        this.props.history.push(`/promotion/plan/operate/${gid}`)
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data 
     */
    initDataHandle = async (data = {}) => {
        const initData = {
            name: data.name || '',
            purpose: data.purpose || 'landing',
            promote_type: +data.promote_type || 1,
            ad_scene: +data.ad_scene || 2,
            budget: data.budget || ''
        }
        console.log('receive=====>', data)
        console.log('init=====>', initData)
        await this.setState({ initData, loading: false })
        //数据渲染后，通过触发滚动条事件更新底部工具箱状态
        Tools.scrollView()
    }

    render() {
        const {
            gid,
            initData,
            loading
        } = this.state
        //页面状态
        const isEdit = gid !== ''
        return (
            <div className={styles.body}>
                <GroupBreadcrumb className={styles.header}
                    toGroup={e => this.toGroupHandle()}
                    text={isEdit ? '修改广告组' : '添加广告组'} />
                <GroupList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <GroupWell className={styles.well}>
                        <GroupName />
                        <GroupAdScene disabled={isEdit} />
                        <GroupPromoteType disabled={isEdit} />
                        <GroupPurpose disabled={isEdit} />
                        <GroupBudget />
                        <GroupSubmit onCancel={e => this.toGroupHandle()} text={isEdit ? '保存修改' : '完成并继续'} />
                    </GroupWell>
                </GroupList>
                <Tools history={this.props.history} />
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}

export default Form.create()(GroupOperate)
