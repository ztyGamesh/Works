/**
 * @class 上传CSV
 */
import React from 'react'
import { message } from 'antd'
import { FileCsv, FileDownloadCsv } from '../../../components/File'
import { validateField } from './'
import FileModal from './ToolKeywordsModal'
import moment from 'moment'
import requestStorage from '../../../utils/requestStorage'

//广告组总上限
const MAX_GROUP = 10
//计划总上限
const MAX_PLAN = 1000
//关键词总上限
const MAX_WORD = 100000
//单计划中关键词上限
const MAX_PLAN_WORD = 1000

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //打开上传结果
            showModal: false,
            //上传成功关键词数量
            successSize: 0,
            //关键词被覆盖数量
            overrideSize: 0,
            //上传失败关键词数量
            errorSize: 0,
            //上传失败关键词下载地址
            errorPath: false
        }
    }

    /**
     * @method saveKeywordsHandle 读取关键词
     */
    saveKeywordsHandle = async (e) => {
        const { saveData, onUpdate, oldData = [], setLoading } = this.props
        if (e === false || e.length === 0 || typeof onUpdate !== 'function') {
            return false
        }
        const lines = e[0]
        //表头
        const [
            header_group_name = '',
            header_plan_name = '',
            header_word = '',
            header_match_type = '',
            header_price = '',
            header_link = '',
            header_status = '',
            header_purpose = '',
            header_app_pkg = '',
            header_download_link = ''
        ] = lines[0] || []
        if (!(
            header_group_name.includes('组名') &&
            header_plan_name.includes('计划名称') &&
            header_word.includes('关键词名称') &&
            header_match_type.includes('匹配方式') &&
            header_price.includes('出价') &&
            header_link.includes('落地页URL') &&
            header_status.includes('启用/暂停') &&
            header_purpose.includes('推广目的') &&
            header_app_pkg.includes('应用包名称') &&
            header_download_link.includes('下载链接')
        )) {
            message.error('文件表头格式错误！')
            return false
        }
        typeof setLoading === 'function' && setLoading(true)
        const key = +new Date() + '_'
        //错误信息
        const error = []
        //旧关键词信息
        const oldWords = {}
        //新关键词信息（新关键词可以覆盖旧关键词，两者分开统计）
        const words = {}
        //广告组信息
        const groupInfo = {}
        //广告计划信息
        const planInfo = {}
        //广告组计数
        let groupNum = 0
        //广告计划计数
        let planNum = 0
        //关键词计数
        let wordNum = 0
        //被覆盖的关键词数量
        let overrideWordNum = 0
        //旧数据写入temp
        oldData.forEach((t, index) => {
            const { group_name, plan_name, word, match_type, price, link, status, purpose, app_pkg, download_link } = t
            //写入旧关键词信息，统计关键词数量
            if (oldWords[group_name]) {
                if (oldWords[group_name][plan_name]) {
                    //旧关键词信息使用对象存储，保存索引，用于新词覆盖时的查找
                    oldWords[group_name][plan_name].push({ word, index })
                    wordNum++
                } else {
                    oldWords[group_name][plan_name] = [{ word, index }]
                    wordNum++
                }
            } else {
                oldWords[group_name] = {}
                oldWords[group_name][plan_name] = [{ word, index }]
                wordNum++
            }
            //写入广告组信息，统计广告组数量
            if (!groupInfo[group_name]) {
                groupInfo[group_name] = { purpose: purpose === 'landing' ? '落地页' : purpose === 'download' ? '应用下载' : purpose }
                groupNum++
            }
            // else {
            //     // 广告组信息有重复组，则信息相同，不需要再写入信息和统计数量
            // }
            //写入广告计划信息，统计广告计划数量
            if (planInfo[group_name]) {
                if (!planInfo[group_name][plan_name]) {
                    planInfo[group_name][plan_name] = { app_pkg, download_link }
                    planNum++
                }
                // else {
                //     // 计划信息有重复计划，则信息相同，不需要再写入信息和统计数量
                // }
            } else {
                planInfo[group_name] = {}
                planInfo[group_name][plan_name] = { app_pkg, download_link }
                planNum++
            }
        })
        //新数据
        const data = lines.reduce((res, t, index) => {
            if (index === 0) {
                return res
            }
            const [group_name = '', plan_name = '', word = '', match_type = '', price = '', link = '', status = '', purpose = '', app_pkg = '', download_link = ''] = t
            const text = [group_name, plan_name, word, match_type, price, link, status, purpose, app_pkg, download_link]
            if (wordNum >= MAX_WORD) {
                error.push(text.concat(`关键词上限为${MAX_WORD}个`))
                return res
            }
            // if (!groupInfo[group_name]) {
            //     if (groupNum >= MAX_GROUP) {
            //         error.push(text.concat(`广告组上限为${MAX_GROUP}个`))
            //         return res
            //     }
            // }
            if (!(planInfo[group_name] && planInfo[group_name][plan_name])) {
                if (planNum >= MAX_PLAN) {
                    error.push(text.concat(`计划上限为${MAX_PLAN}个`))
                    return res
                }
            }
            if (words[group_name] && words[group_name][plan_name]) {
                if (words[group_name][plan_name].length >= MAX_PLAN_WORD) {
                    error.push(text.concat(`一个计划中的关键词上限为${MAX_PLAN_WORD}个`))
                    return res
                }
            }
            if (false === validateField('word', word)) {
                error.push(text.concat('关键词不能为空，最多20个汉字（英文、标点、数字算半个汉字）'))
                return res
            }
            //新关键词中不能有重复关键词
            if (words[group_name] && words[group_name][plan_name]) {
                if (words[group_name][plan_name].includes(word)) {
                    error.push(text.concat('一个计划中的关键词重复'))
                    return res
                }
            }
            if (false === validateField('group_name', group_name)) {
                error.push(text.concat('组名不能为空，最多25个汉字（英文、标点、数字算半个汉字）'))
                return res
            }
            if (false === validateField('plan_name', plan_name)) {
                error.push(text.concat('计划名不能为空，最多25个汉字（英文、标点、数字算半个汉字）'))
                return res
            }
            if (false === validateField('match_type', match_type)) {
                error.push(text.concat('匹配方式错误，规范为：短语精确包含、精确匹配、前缀匹配'))
                return res
            }
            if (false === validateField('price', price)) {
                error.push(text.concat('出价错误，最多2位小数，范围为：0.01～999.99'))
                return res
            }
            if (false === validateField('link', link)) {
                error.push(text.concat('URL格式错误，以http（https）开头的有效着落页'))
                return res
            }
            if (false === validateField('status', status)) {
                error.push(text.concat('状态错误，规范为：启用、暂停（为空默认启用）'))
                return res
            }
            if (false === validateField('purpose', purpose)) {
                error.push(text.concat('推广目的错误，规范为：落地页、应用下载'))
                return res
            }
            if (groupInfo[group_name]) {
                if (groupInfo[group_name].purpose !== purpose) {
                    error.push(text.concat('相同广告组推广目的必须相同'))
                    return res
                }
            }
            if (false === validateField('app_pkg', app_pkg, purpose)) {
                error.push(text.concat(purpose === '落地页' ?
                    '落地页广告，应用包名必须为空' :
                    '应用下载广告，应用包名不能为空'
                ))
                return res
            }
            if (planInfo[plan_name]) {
                if (planInfo[plan_name].app_pkg !== app_pkg) {
                    error.push(text.concat('相同广告计划应用包名必须相同'))
                    return res
                }
            }
            if (false === validateField('download_link', download_link, purpose)) {
                error.push(text.concat(purpose === '落地页' ?
                    '落地页广告，下载链接必须为空' :
                    '下载链接错误，以http（https）开头的下载链接'
                ))
                return res
            }
            if (planInfo[group_name] && planInfo[group_name][plan_name]) {
                if (planInfo[group_name][plan_name].download_link !== download_link) {
                    error.push(text.concat('相同广告计划下载链接必须相同'))
                    return res
                }
            }
            //新数据写入temp
            //写入新关键词，更新关键词数量
            if (words[group_name]) {
                if (words[group_name][plan_name]) {
                    words[group_name][plan_name].push(word)
                    wordNum++
                } else {
                    words[group_name][plan_name] = [word]
                    wordNum++
                }
            } else {
                words[group_name] = {}
                words[group_name][plan_name] = [word]
                wordNum++
            }
            //写入广告组信息
            if (!groupInfo[group_name]) {
                groupInfo[group_name] = { purpose }
                groupNum++
            }
            //写入广告计划信息
            if (planInfo[group_name]) {
                if (!planInfo[group_name][plan_name]) {
                    planInfo[group_name][plan_name] = { app_pkg, download_link }
                    planNum++
                }
            } else {
                planInfo[group_name] = {}
                planInfo[group_name][plan_name] = { app_pkg, download_link }
                planNum++
            }
            //处理正确数据
            if (oldWords[group_name] && oldWords[group_name][plan_name]) {
                const obj = oldWords[group_name][plan_name].find(t => t.word === word)
                //旧关键词中有重复关键词，执行覆盖操作
                if (obj) {
                    //oldData为父组件state数据，此处直接修改，无需setState，后续父组件刷新表格操作会更新视图
                    oldData[obj.index] = {
                        key: key + index,
                        group_name,
                        plan_name,
                        word,
                        status: '暂停' === status ? 'pause' : 'active',
                        price: (+price).toFixed(2),
                        match_type: '前缀匹配' === match_type ? '3' :
                            '精确匹配' === match_type ? '2' :
                                '短语精确包含' === match_type ? '1' :
                                    match_type,
                        link,
                        purpose: '落地页' === purpose ? 'landing' : '应用下载' === purpose ? 'download' : purpose,
                        app_pkg,
                        download_link
                    }
                    //覆盖操作，不计入新词，更新数量信息
                    overrideWordNum++
                    wordNum--
                    return res
                }
            }
            //新词，返回正确数据
            return res.concat({
                key: key + index,
                group_name,
                plan_name,
                word,
                status: '暂停' === status ? 'pause' : 'active',
                price: (+price).toFixed(2),
                match_type: '前缀匹配' === match_type ? '3' :
                    '精确匹配' === match_type ? '2' :
                        '短语精确包含' === match_type ? '1' :
                            match_type,
                link,
                purpose: '落地页' === purpose ? 'landing' : '应用下载' === purpose ? 'download' : purpose,
                app_pkg,
                download_link
            })
        }, [])
        typeof saveData === 'function' && await saveData(data)
        typeof onUpdate === 'function' && onUpdate(true)
        this.setState({
            successSize: data.length,
            overrideSize: overrideWordNum,
            errorSize: error.length
        })
        await requestStorage.setItem('keywordsErrorRows', error)
        if (error.length) {
            const errorPath = await FileDownloadCsv.receivePath('失败下载 ' + moment().format('YYYYMMDDHHmmss'), [[
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
            sessionStorage.setItem('keywordsErrorHref', errorPath)
            this.setState({ errorPath })
        }
        this.setState({
            showModal: true
        })
        typeof setLoading === 'function' && setLoading(false)
    }

    render() {
        return (
            <React.Fragment>
                <FileCsv text="上传CSV" onChange={this.saveKeywordsHandle} />
                {/* 上传结果信息 */}
                <FileModal showModal={this.state.showModal}
                    success={this.state.successSize}
                    error={this.state.errorSize}
                    override={this.state.overrideSize}
                    download={this.state.errorPath}
                    onCancel={e => this.setState({ showModal: false })} />
            </React.Fragment>
        )
    }
}