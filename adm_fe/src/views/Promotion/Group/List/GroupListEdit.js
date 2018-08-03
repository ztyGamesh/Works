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
        url: `${BUSINESSAPIHOST}/promotion/adgroupupdatestatus`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method editName 修改广告组
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
        url: `${BUSINESSAPIHOST}/adgroup/update`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}

/**
 * @method editBudget 修改日预算
 */
export async function editBudget(value, row) {
    if (!(/^[0-9]{1,10}(|\.[0-9]{0,2})$/.test(value) && value >= 50)) {
        message.warning('请输入最多两位小数的数值！范围：50~9999999999.99')
        return false
    }
    const req = {
        type: 'budget',
        id: row.id,
        budget: value
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/adgroup/update`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}