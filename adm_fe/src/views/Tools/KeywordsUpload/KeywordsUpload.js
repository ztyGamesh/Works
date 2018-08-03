/**
 * @class 关键词页面
 * 
 * @description 流量预估
 * @description 读取关键词上传页面中已选关键词数据：state.keywordsUploadReducers.rows
 * @description 清除关键词上传页面中已选数据，在componentWillUnmount中使用：import { keywordsUploadInit } from 'src/views/Tools/KeywordsUpload/flow/KeywordsUploadActions'
 * @description 通过storage取值：JSON.parse(sessionStorage.keywordsSelectRows || '[]')
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Popover, Icon, Button, Modal } from 'antd'
import styles from './KeywordsUpload.less'
import { TableBase, Switch, Select, Cell, Batchs, BatchLink, initPageData } from '../../../components/Table'
import {
    KeywordsUploadCsv,
    KeywordsSubmitModal
} from '../../../containers/Tool/ToolKeywordsUpload'
import { FileCreateCsv, FileDownloadCsv } from '../../../components/File'
import moment from 'moment'
import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'
import Loading from '../../../components/Loading/Loading'
import Progress from '../../../components/Confirm/Progress'
import { keywordsUploadInit, keywordsUploadChangeRows, keywordsUploadChangeInited } from './flow/KeywordsUploadActions'
import requestStorage from '../../../utils/requestStorage'

//单次上传个数
const MAX_WORD_NUM = 5000

class KeywordsUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '组名',
                    dataIndex: 'group_name',
                    prompt: {
                        content: '最多25个汉字'
                    }
                },
                {
                    title: '计划名称',
                    dataIndex: 'plan_name',
                    prompt: {
                        content: '最多25个汉字'
                    }
                },
                {
                    title: '关键词名称',
                    dataIndex: 'word',
                    prompt: {
                        content: '每个关键词最多20个汉字（英文、标点、数字算半个汉字）'
                    }
                }, {
                    title: '匹配方式',
                    dataIndex: 'match_type',
                    prompt: {
                        content: '短语精确包含、精确匹配、前缀匹配'
                    },
                    render: (value, row, index) => {
                        return value == 3 ? '前缀匹配' :
                            value == 2 ? '精确匹配' :
                                value == 1 ? '短语精确包含' :
                                    value
                    }
                }, {
                    title: '出价（元）',
                    dataIndex: 'price',
                    prompt: {
                        content: '0.01～999.99'
                    }
                }, {
                    title: '落地页URL',
                    dataIndex: 'link',
                    prompt: {
                        content: '填写以http（https）开头的有效着落页'
                    }
                }, {
                    title: '启用/暂停（默认为启用）',
                    dataIndex: 'status',
                    render: (value, row, index) => {
                        return 'active' === value ? '启用' : 'pause' === value ? '暂停' : value
                    }
                }, {
                    title: '推广目的',
                    dataIndex: 'purpose',
                    render: (value, row, index) => {
                        return 'landing' === value ? '落地页' : 'download' === value ? '应用下载' : value
                    },
                    prompt: {
                        content: '落地页、应用下载'
                    }
                }, {
                    title: '应用包名称',
                    dataIndex: 'app_pkg',
                    prompt: {
                        content: '应用包名称'
                    }
                }, {
                    title: '下载链接',
                    dataIndex: 'download_link',
                    prompt: {
                        content: '填写以http（https）开头的有效下载链接'
                    }
                }
            ],
            data: [],
            init: false,
            loading: true,
            progressContent: '',
            progressPercent: false,
            progressType: '',
            update: () => { }
        }
    }

    async componentWillMount() {
        //保留：(reducer)清空表格已选数据
        // this.props.keywordsUploadInit()
        let data = []
        if (!this.props.inited) {
            //系统初次进入该页面
            this.props.keywordsUploadChangeInited()
        } else {
            data = await requestStorage.getItem('keywordsSuccessRows') || []
        }
        this.setState({ data, init: true, loading: false })
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { searchText, pageSize, current, filters, sorter } = params
        const req = {
            keyword: '',
            search: searchText,
            filters,
            sort: sorter.field,
            order: sorter.order,
            sortType: 'price' === sorter.field ? 'number' : ''
        }
        const res = initPageData(this.state.data, req)
        return {
            rows: res.slice((current - 1) * pageSize, current * pageSize),
            total: res.length
        }
    }

    /**
     * @method readFileHandle 读取文件
     */
    readFileHandle = (newData) => {
        const data = [...this.state.data, ...newData]
        requestStorage.setItem('keywordsSuccessRows', data)
        this.setState({
            data
        })
    }

    /**
     * @method deleteHandle 删除
     */
    deleteHandle = (keys, rows, update) => {
        if (keys.length === 0) {
            message.warning('请选择一个或多个关键词后再进行该操作')
            return false
        }
        const { data } = this.state
        for (let i = rows.length; i--;) {
            const index = data.indexOf(rows[i])
            if (index > -1) {
                data.splice(index, 1)
            }
        }
        requestStorage.setItem('keywordsSuccessRows', data)
    }

    /**
     * @method clearHandle 清空
     */
    clearHandle = (keys, rows, update) => {
        const { data } = this.state
        data.splice(0)
        requestStorage.setItem('keywordsSuccessRows', [])
    }

    /**
     * @method toTrafficHandle 新窗口打开流量预估
     */
    toTrafficHandle = async (keys, rows = [], update) => {
        if (keys.length === 0) {
            message.warning('请选择一个或多个关键词后再进行该操作')
            return false
        }
        //保存表格已选数据
        sessionStorage.setItem('keywordsSelectRows', JSON.stringify(rows))
        //保留：(reducer)保存表格已选数据
        await this.props.keywordsUploadChangeRows(rows)
        window.open('#/tools/trafficForecast')
        // this.props.history.push('/tools/trafficForecast')
        return false
    }

    /**
     * @method openSubmitHandle 判断是否可打开确定上传模态框
     */
    openSubmitHandle = (keys, rows, update) => {
        if (!this.state.data || this.state.data.length === 0) {
            message.warning('请上传关键词后再进行该操作')
            return false
        }
    }

    /**
     * @method receiveSubmitData 上传的关键词中具体信息
     */
    receiveSubmitData = async (keys, rows, update) => {
        this.setState({ loading: true })
        const req = (this.state.data || []).map(t => {
            const { group_name, plan_name, word, match_type, price, link, status, purpose, app_pkg, download_link } = t
            return { group_name, plan_name, word, match_type, price, link, status, purpose, app_pkg, download_link }
        })
        const res = await request({
            url: `${BUSINESSAPIHOST}/tool/countUploadKeywords`,
            method: 'post',
            data: req
        })
        if (res && res.status === 1) {
            this.setState({ loading: false })
            return res.data
        } else {
            message.error(res && res.msg || '服务器异常')
        }
        this.setState({ loading: false })
        return false
    }

    /**
     * @method submitHandle 确定上传
     */
    submitHandle = async (keys, rows, values) => {
        this.setState({
            progressContent: '正在上传关键词...',
            progressPercent: 0,
            progressType: 'info'
        })
        const data = this.state.data || []
        const results = { failure_cnt: 0, success_cnt: 0, failure_rows: [] }
        const { length } = data
        for (let i = 0; i < length; i += MAX_WORD_NUM) {
            const req = data.slice(i, i + MAX_WORD_NUM).map(t => {
                const { group_name, plan_name, word, match_type, price, link, status, purpose, app_pkg, download_link } = t
                return { group_name, plan_name, word, match_type, price, link, status, purpose, app_pkg, download_link }
            })
            const res = await request({
                url: `${BUSINESSAPIHOST}/tool/uploadKeywords`,
                method: 'post',
                data: req
            })
            if (res && res.status === 1) {
                const { failure_cnt = 0, success_cnt = 0, failure_rows = [] } = res.data
                results.failure_cnt += failure_cnt
                results.success_cnt += success_cnt
                results.failure_rows.push(...failure_rows)
            }
            const percent = (i + MAX_WORD_NUM) * 100 / length
            this.setState({
                progressPercent: percent
            })
        }
        if (true) {
            const { failure_cnt, success_cnt, failure_rows = [] } = results
            const msg = `${success_cnt}个关键词添加成功，${failure_cnt}个关键词添加失败`
            const error = failure_rows.map(t => {
                const {
                    app_pkg,
                    download_link,
                    group_name,
                    link,
                    match_type,
                    plan_name,
                    price,
                    purpose,
                    reason,
                    status,
                    target_type,
                    word
                } = t
                const i_match_type = 3 == match_type ? '前缀匹配' :
                    2 == match_type ? '精确匹配' :
                        1 == match_type ? '短语精确包含' : match_type
                const i_status = 'pause' === status ? '暂停' : '启用'
                const i_purpose = 'landing' === purpose ? '落地页' :
                    'download' === purpose ? '应用下载' : purpose
                return [
                    group_name,
                    plan_name,
                    word,
                    i_match_type,
                    price,
                    link,
                    i_status,
                    i_purpose,
                    app_pkg,
                    download_link,
                    reason
                ]
            })
            if (failure_cnt) {
                const errorPath = await FileDownloadCsv.receivePath('上传失败下载 ' + moment().format('YYYYMMDDHHmmss'), [[
                    '组名',
                    '计划名称',
                    '关键词名称',
                    '匹配方式',
                    '出价（元）',
                    '落地页URL',
                    '启用/暂停（默认为启用）',
                    '推广目的',
                    '应用包名称',
                    '下载链接',
                    '失败原因'
                ]].concat(error))
                await requestStorage.setItem('keywordsSubmitErrorRows', error)
                sessionStorage.setItem('keywordsSubmitErrorHref', errorPath)
            }
            if (success_cnt && !failure_cnt) {
                this.setState({
                    progressPercent: true,
                    progressContent: <div>{msg}</div>,
                    progressType: 'success'
                })
            } else if (failure_cnt && !success_cnt) {
                this.setState({
                    progressPercent: true,
                    progressContent: <div>{msg}，<a href="#/tools/keywordsUpload/submitError" target="_blank">查看</a></div>,
                    progressType: 'warning'
                })
            } else {
                this.setState({
                    progressPercent: true,
                    progressContent: <div>{msg}，<a href="#/tools/keywordsUpload/submitError" target="_blank">查看</a></div>,
                    progressType: 'error'
                })
            }
            requestStorage.setItem('keywordsSuccessRows', [])
            await this.setState({
                data: []
            })
            this.state.update()
        } else {
            message.error(res && res.msg || '服务器异常')
            return false
        }
    }

    render() {
        const { columns, data, init } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase columns={columns}
                        onUpdate={this.updateHandle}
                        rowKey="key"
                        canCheck
                        init={init}
                        pageSize={100}
                        saveUpdate={e => this.setState({ update: e })}
                        extra={
                            <Batchs full={6}>
                                <KeywordsUploadCsv oldData={data} saveData={this.readFileHandle} setLoading={e => this.setState({ loading: e })} />
                                <div>
                                    <Popover placement="bottom" trigger="hover" title="文件及格式要求" content={
                                        <div className={styles.prompt}>
                                            <div className={styles['prompt-header']}>上传规则</div>
                                            <div>仅支持csv文件导入。</div>
                                            <div>一个计划中的关键词上限为1000个。</div>
                                            <div>表格10共列，从左至右分别是，组名，计划名称、关键词名称，匹配方式，出价，落地页URL，启用/暂停，推广目的，应用包名称，下载链接。表格中前6列中，每一列都为必填字段。缺少必填字段都会报错。</div>
                                            <div>一次最多上传10万个关键词。</div>
                                            <div>推广目的如果是落地页，应用包名称和下载链接可以为空，如果不为空，报错处理。如果推广目的是落地页，应用包名称和下载链接不可以为空，如果为空，报错处理。</div>
                                            <div className={styles['prompt-header']}>默认字段</div>
                                            <div>投放周期：默认为一个月</div>
                                            <div>计划日预算默认为50元</div>
                                            <div>组日预算默认为50元</div>
                                            <div>启用暂停如果没填，默认为启用</div>
                                            <div>投放速度默认为匀速投放</div>
                                            <div>如果推广目的是应用下载，平台默认字段为android</div>
                                        </div>
                                    }>
                                        <Icon type="question-circle-o" />
                                    </Popover>
                                </div>
                                <div style={{ padding: '6px 12px' }}>
                                    <FileCreateCsv text="下载模板" file={'模板下载 ' + moment().format('YYYYMMDDHHmmss')}
                                        data={[
                                            [
                                                '组名',
                                                '计划名称',
                                                '关键词名称',
                                                '匹配方式',
                                                '出价',
                                                '落地页URL',
                                                '启用/暂停',
                                                '推广目的',
                                                '应用包名称',
                                                '下载链接'
                                            ]
                                        ]} />
                                </div>
                                <BatchLink text="删除" onClick={this.deleteHandle} confirm="已选中#length个关键词，确定删除吗？" />
                                <BatchLink text="清空" onClick={this.clearHandle} confirm="确定要清空所有关键词吗？" clickNoChecked={false} />
                                <BatchLink text="流量预估" onClick={this.toTrafficHandle} />
                                <BatchLink text={<Button type="primary">确定上传</Button>} onClick={this.openSubmitHandle} modal={
                                    <KeywordsSubmitModal onSubmit={this.submitHandle}
                                        receiveData={this.receiveSubmitData} />
                                } />
                            </Batchs>
                        }
                    />
                </div>
                {
                    this.state.loading ? <Loading /> : null
                }
                <Progress type={this.state.progressType}
                    percent={this.state.progressPercent}
                    content={this.state.progressContent}
                    onCancel={e => this.setState({ progressPercent: false })} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        inited: state.keywordsUploadReducers.inited
    }
}

const mapDispatchToProps = (dispatch) => ({
    keywordsUploadInit: () => dispatch(keywordsUploadInit()),
    keywordsUploadChangeRows: (rows) => dispatch(keywordsUploadChangeRows(rows)),
    keywordsUploadChangeInited: () => dispatch(keywordsUploadChangeInited())
})

export default connect(mapStateToProps, mapDispatchToProps)(KeywordsUpload)