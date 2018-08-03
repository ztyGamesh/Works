/**
 * @description 表格编辑操作
 */
import React from 'react'
import { message } from 'antd'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

/**
 * @method editStatus 修改状态
 */
export async function editStatus(value, row) {
    const req = {
        ids: row.id,
        status: value
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/adcreativeupdatestatus`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
    } else {
        message.warning(res && res.msg || '服务器异常')
    }
}

/**
 * @method editName 修改广告创意
 */
export async function editName(value, row) {
    const length = value.replace(/[\u2E80-\u9FFF]/g, '**').length
    if (length === 0) {
        message.warning('名称不能为空')
        return false
    }
    if (length > 50) {
        message.warning('50个字符以内，中文为2个字符')
        return false
    }
    const req = {
        type: 'name',
        id: row.id,
        name: value
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/update`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
    } else {
        message.warning(res && res.msg || '服务器异常')
        return false
    }
}

/**
 * @method editTitle 修改标题
 */
export async function editTitle(value, row) {
    const length = value.length
    if (length === 0) {
        message.warning('标题不能为空')
        return false
    }
    if (length < 2 || length > 23) {
        message.warning('2-23个字符以内')
        return false
    }
    const req = {
        type: 'material',
        id: row.id,
        material: {
            title: value
        }
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/update`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
    } else {
        message.warning(res && res.msg || '服务器异常')
        return false
    }
}

/**
 * @method editUrl 修改Url
 */
export async function editUrl(value, row) {
    if (!/^(http:\/\/|https:\/\/){1}/.test(value)) {
        message.warning('请填写以http://，https://开头的有效着陆页')
        return false
    }
    const req = {
        type: 'url',
        id: row.id,
        url: {
            link: value
        }
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adcreative/update`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
    if (res && res.status === 1) {
    } else {
        message.warning(res && res.msg || '服务器异常')
        return false
    }
}