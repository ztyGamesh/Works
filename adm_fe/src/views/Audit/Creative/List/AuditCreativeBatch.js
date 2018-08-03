/**
 * @description 批量操作
 */
import React from 'react'
import { message } from 'antd'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

/**
 * @method batchDelete 批量内审
 */
export async function batchDeepleaper(ids, rows) {
    if (ids.length === 0) {
        message.warning('请选择需要审核的创意')
        return false
    }
    const req=[];
    rows.map((current,index)=>{
        req.push(current.query)
    })

    // const res = await request({
    //     url: `${BUSINESSAPIHOST}/queryprice/batchDelete`,
    //     method: 'post',
    //     data: req
    // })
    console.log('submit=====>', req, res)
}


