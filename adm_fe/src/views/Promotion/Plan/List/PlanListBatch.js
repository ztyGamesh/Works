/**
 * @description 批量操作
 */
import React from 'react'
import { message, Modal } from 'antd'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

/**
 * @method batchActive 批量启用
 */
export async function batchActive(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'active',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method batchPause 批量暂停
 */
export async function batchPause(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'pause',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method batchDelete 批量删除
 */
export async function batchDelete(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'delete',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method openPrice 打开批量出价
 */
export function openPrice(ids, rows, update) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
    if (rows.some(t => t.ad_scene == 2)) {
        message.warning('搜索广告不支持此功能！')
        return false
    }
}

/**
 * @method batchPrice 批量修改出价
 */
export async function batchPrice(ids, rows, values) {
    const data = await values
    if (data === false) {
        return false
    }
    const req = {
        ids,
        price: data.price,
        type: 'price'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
        message.success('修改成功')
    } else {
        message.error(res && res.msg || '服务器异常')
        return false
    }
}

/**
 * @method openBudget 打开批量修改日预算
 */
export function openBudget(ids, rows, update) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
}

/**
 * @method batchBudget 批量修改日预算
 */
export async function batchBudget(ids, rows, values) {
    const data = await values
    if (data === false) {
        return false
    }
    const req = {
        ids,
        budget: data.budget,
        type: 'budget'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
        message.success('修改成功')
    } else {
        message.error(res && res.msg || '服务器异常')
        return false
    }
}

/**
 * @method openCopy 打开批量复制
 */
export function openCopy(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
    const purposes = Array.from(new Set(rows.map(t => t.purpose)))
    if (1 !== purposes.length) {
        message.warning('推广目的必须一致！')
        return false
    }
    const promote_types = Array.from(new Set(rows.map(t => t.promote_type)))
    if (1 !== promote_types.length) {
        message.warning('推广类型必须一致！')
        return false
    }
    const ad_scenes = Array.from(new Set(rows.map(t => t.ad_scene)))
    if (1 !== ad_scenes.length) {
        message.warning('广告形式必须一致！')
        return false
    }
}

/**
 * @method batchCopy 批量复制
 */
export async function batchCopy(ids, rows, values) {
    const data = await values
    if (data === false) {
        return false
    }
    const req = {
        pid: ids,
        gid: data.gid,
        recurse: data.recurse
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/batchCopy`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
        message.success('复制成功')
    } else {
        message.error(res && res.msg || '服务器异常')
        return false
    }
}

/**
 * @method openKeyword 打开批量添加关键词
 */
export function openKeyword(ids, rows, update) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告计划后再进行该操作')
        return false
    }
    if (rows.some(t => t.promote_type == 2)) {
        message.warning('搜索广告不支持此功能！')
        return false
    }
    if (rows.some(t => t.ad_scene == 2)) {
        message.warning('搜索广告不支持此功能！')
        return false
    }
}

/**
 * @method batchKeyword 批量添加关键词
 */
export async function batchKeyword(ids, rows, values) {
    const data = await values
    if (data === false) {
        return false
    }
    const { keyword, denykeyword, oldkeywords } = data
    const kwStr = keyword.trim()
    const dkwStr = denykeyword.trim()
    if (kwStr === '' && dkwStr === '') {
        message.warning('请输入关键词')
        return false
    }
    //封装关键词
    function turn(word, target_type) {
        return { word, target_type, match_type: 1 }
    }
    //新关键词
    const nkw = kwStr === '' ? [] : kwStr.split('\n').reduce((r, t) => {
        const word = t.trim()
        return r.includes(word) ? r : r.concat(word)
    }, [])
    //新否定关键词
    const ndkw = dkwStr === '' ? [] : dkwStr.split('\n').reduce((r, t) => {
        const word = t.trim()
        return r.includes(word) ? r : r.concat(word)
    }, [])
    //错误信息
    const error = { keyword: [], denykeyword: [] }
    //提交的数据
    const plans = Object.keys(oldkeywords).reduce((r, t) => {
        const kwTemp = []
        const dkwTemp = []
        //提交的关键词
        const kw = []
        //提交的否定关键词
        const dkw = []
        //添加旧关键词、旧否定关键词
        oldkeywords[t].forEach(s => {
            const { target_type, word } = s
            if (target_type == 1) {
                if (!kwTemp.includes(word)) {
                    kwTemp.push(word)
                    kw.push(turn(word, 1))
                }
            } else {
                if (!dkwTemp.includes(word)) {
                    dkwTemp.push(word)
                    dkw.push(turn(word, 2))
                }
            }
        })
        //添加新关键词
        nkw.forEach(word => {
            if (!kwTemp.includes(word)) {
                kwTemp.push(word)
                kw.push(turn(word, 1))
            }
        })
        //添加新否定关键词
        ndkw.forEach(word => {
            if (!dkwTemp.includes(word)) {
                dkwTemp.push(word)
                dkw.push(turn(word, 2))
            }
        })
        const planObj = rows.find(s => s.id == t)
        const planName = planObj && planObj.name || ''
        if (kw.length > 1000) {
            error.keyword.push(planName)
        } else {
            r[t] = (r[t] || []).concat(kw)
        }
        if (dkw.length > 1000) {
            error.denykeyword.push(planName)
        } else {
            r[t] = (r[t] || []).concat(dkw)
        }
        return r
    }, {})
    console.log(plans)
    let msg = ''
    if (error.keyword.length) {
        msg += `关键词批量添加到“${error.keyword.join('”、“')}”${error.keyword.length}个广告计划时关键词个数超出1000个，添加失败。`
    }
    if (error.denykeyword.length) {
        msg += `否定关键词批量添加到“${error.denykeyword.join('”、“')}”${error.denykeyword.length}个广告计划时关键词个数超出1000个，添加失败。`
    }
    if (Object.keys(plans).length === 0) {
        message.warning(msg + '请删减后再上传！')
        return false
    }
    return new Promise(resolve => {
        Modal.confirm({
            okText: '确认',
            cancelText: '取消',
            title: msg ? `${msg}如需继续添加到其他计划，请单击“确认”，如需返回修改，请点击“取消”。` : '确认上传关键词？',
            onCancel: () => {
                resolve(false)
            },
            onOk: async () => {
                const req = {
                    type: 'word',
                    plans
                }
                const res = await request({
                    url: `${BUSINESSAPIHOST}/adplan/batchUpdate`,
                    method: 'post',
                    data: req
                })
                console.log('submit=====>', req, res)
                if (res && res.status === 1) {
                    message.success('添加成功')
                    resolve()
                } else {
                    message.error(res && res.msg || '服务器异常')
                    resolve(false)
                }
            }
        })
    })
}

/**
 * @method receiveGroupList 新建、批量复制时获取广告组列表
 */
export async function receiveGroupList(search = '', data = {}) {
    const req = {
        plan: 0,
        search: search,
        purpose: data.purpose || '',
        promote_type: data.promote_type || '',
        ad_scene: data.ad_scene || ''
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adgroup/groups`,
        method: 'get',
        data: req
    })
    console.log('search=====>', req, res)
    if (res && res.status === 1) {
        return res.data.map(t => ({
            value: t.group_id,
            label: t.group_name
        }))
    }
    return false
}

/**
 * @method receiveKeyword 获取旧关键词
 * @param {*} ids 
 */
export async function receiveKeyword(ids) {
    const req = {
        ids,
        target_type: 0
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adplan/keywords`,
        method: 'get',
        data: req
    })
    if (res && res.status === 1) {
        return res.data
    }
    return false
}