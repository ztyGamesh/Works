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
        message.warning('请选择一个或多个广告组后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'active',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adgroup/batchUpdate`,
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
        message.warning('请选择一个或多个广告组后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'pause',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adgroup/batchUpdate`,
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
        message.warning('请选择一个或多个广告组后再进行该操作')
        return false
    }
    const req = {
        ids,
        status: 'delete',
        type: 'status'
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adgroup/batchUpdate`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method openBudget 打开批量修改日预算
 */
export function openBudget(ids, rows, update) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个广告组后再进行该操作')
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
        url: `${BUSINESSAPIHOST}/adgroup/batchUpdate`,
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
        message.warning('请选择一个或多个广告组后再进行该操作')
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
        gid: ids,
        recurse: data.recurse
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adgroup/batchCopy`,
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
