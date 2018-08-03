/**
 * @description 批量操作
 */
import React from 'react'
import { message } from 'antd'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

/**
 * @method batchActive 批量启用
 */
export async function batchActive(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告创意后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'active',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/batchUpdate`,
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
        message.warning('请选择一个或多个广告创意后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'pause',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/batchUpdate`,
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
        message.warning('请选择一个或多个广告创意后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'delete',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method openTitle 打开批量修改创意标题/描述
 */
export function openTitle(ids, rows, update) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告创意后再进行该操作')
        return false
    }
    if (rows.some(t => t.promote_type == 2)) {
        message.warning('动态商品广告不支持此功能！')
        return false
    }
    if (rows.some(t => t.ad_scene == 2)) {
        message.warning('搜索广告不支持此功能！')
        return false
    }
}

/**
 * @method batchTitle 批量修改创意标题/描述
 */
export async function batchTitle(ids, rows, values) {
    const data = await values
    if (data === false) {
        return false
    }
    const { title, description } = data
    if (!(title || description)) {
        message.warning('请至少输入一项！')
        return false
    }
    const req = {
        ids,
        type: 'material',
        material: {
            title,
            description
        }
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/batchUpdate`,
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
 * @method openUrl 打开批量修改URL
 */
export function openUrl(ids, rows, update) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告创意后再进行该操作')
        return false
    }
    if (rows.some(t => t.promote_type == 2)) {
        message.warning('动态商品广告不支持此功能！')
        return false
    }
    if (rows.some(t => t.ad_scene == 2)) {
        message.warning('搜索广告不支持此功能！')
        return false
    }
}

/**
 * @method batchUrl 批量修改URL
 */
export async function batchUrl(ids, rows, values) {
    const data = await values
    if (data === false) {
        return false
    }
    const { link, monitoring_url, landing } = data
    if (!(link || monitoring_url || landing)) {
        message.warning('请至少输入一项！')
        return false
    }
    const req = {
        ids,
        type: 'url',
        url: {
            link,
            monitoring_url,
            landing
        }
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/batchUpdate`,
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
        message.warning('请选择一个或多个广告创意后再进行该操作')
        return false
    }
    if (rows.some(t => t.promote_type == 2)) {
        message.warning('动态商品广告不支持此功能！')
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
    if (rows.some(t => {
        if (t.ad_scene == 2 && t.material) {
            const title = t.material.title || ''
            const start = title.indexOf('%%')
            const end = title.indexOf('%%', start + 2)
            if (start > -1 && end > -1) {
                return true
            }
        }
        return false
    })) {
        message.warning('使用关键词通配符的创意不支持此功能')
        return false
    }
}

/**
 * @method receiveGroupList 批量复制获取广告组列表
 */
export async function receiveGroupList(search = '', data = {}) {
    const req = {
        plan: 1,
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
            label: t.group_name,
            children: t.child.map(s => ({
                value: s.plan_id,
                label: s.plan_name
            }))
        }))
    }
    return false
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
        cid: ids,
        pid: data.pid
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/batchCopy`,
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
