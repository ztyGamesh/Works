/**
 * @description 批量操作
 */
import React from 'react'
import { message } from 'antd'
import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'

/**
 * @method batchDelete 批量删除
 */
export async function batchDelete(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个querry后再进行该操作')
        return false
    }
    const req=[];
    rows.map((current,index)=>{
        req.push(current.query)
    })

    const res = await request({
        url: `${BUSINESSAPIHOST}/queryprice/batchDelete`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}


export async function batchPass(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个关键词后再进行该操作')
        return false
    }
    const req=[];
    rows.map((current,index)=>{
        req.push(current.word)
    })

    const res = await request({
        url: `${BUSINESSAPIHOST}/wordaudit/batchPass`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}
export async function batchReject(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择一个或多个关键词后再进行该操作')
        return false
    }
    const req=[];
    rows.map((current,index)=>{
        req.push(current.word)
    })

    const res = await request({
        url: `${BUSINESSAPIHOST}/wordaudit/batchReject`,
        method: 'post',
        data: req
    })
    console.log('submit=====>', req, res)
}