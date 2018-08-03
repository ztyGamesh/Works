/**
 * @description 请求
 * @param {Object} data 参数
 * @param {Function} formatter 数据格式化
 * @param {Boolean} error 是否提示错误信息
 */
import React from 'react'
import { message } from 'antd'
import { BUSINESSAPIHOST } from '../../../../../common/env'
import request from '../../../../../utils/request'

/**
 * @method readResult 处理查询结果
 */
function readResult(res, formatter, error) {
    if (res && res.status === 1) {
        return typeof formatter === 'function' ? formatter(res.data) : res.data
    } else if (error) {
        message.error(res && res.msg || '服务器异常')
    }
    console.error('[REQUEST:]', res && res.msg || '服务器异常')
    return false
}

/**
 * @method list 列表
 */
export async function list(data = {}, formatter, error) {
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/getStatusAndPriceConf`,
        method: 'get',
        data
    })
    return readResult(res, formatter, error)
}

/**
 * @method editStatus 编辑状态
 */
export async function editStatus(value = '', row = {}) {
    const req = {
        uid: row.uid || '',
        status: value
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/saveStatus`,
        method: 'post',
        data: req
    })
    return readResult(res, null, true)
}

/**
 * @method formatterCooperateEdit 封装合作方式
 */
function formatterCooperateEdit(value, row = {}) {
    const data = {
        uid: row.uid,
        cooperate_mode: value, //合作方式
        price: row.price, //底价
        media_share: row.media_share,//媒体分成比例
        profit_rate: row.profit_rate,//最低利润率
        profit_price: row.profit_price,//广告成本
    }
    //初始化：底价、媒体分成比例、最低利润率
    if (data.cooperate_mode == 0 || data.cooperate_mode == 4 || data.cooperate_mode == 5) {
        data.media_share = '0'
    } else if (data.cooperate_mode == 1) {
        data.price = '0'
    } else if (data.cooperate_mode == 3) {
        data.media_share = '100'
        data.profit_rate = '0'
    } else if (data.cooperate_mode == 6) {
        data.media_share = '0'
        data.profit_rate = '20'
    } else if (data.cooperate_mode == 7) {
        data.price = '0'
        data.media_share = '50'
    }
    //计算：广告成本
    if (data.profit_rate == 100) {
        data.profit_price = '0.00'
    } else {
        data.profit_price = (data.price / (1 - (data.profit_rate) / 100)).toFixed(2)
    }
    return data
}

/**
 * @method formatterEdit 底价、媒体分成比例、最低利润率、广告成本
 */
function formatterEdit(field = '', value = '', row = {}) {
    const data = {
        uid: row.uid,
        cooperate_mode: row.cooperate_mode, //合作方式
        price: row.price, //底价
        media_share: row.media_share,//媒体分成比例
        profit_rate: row.profit_rate,//最低利润率
        profit_price: row.profit_price,//广告成本
    }
    //更新：修改的数据
    if (['price', 'media_share', 'profit_rate'].includes(field)) {
        data[field] = value
    }
    //计算：广告成本
    if (data.profit_rate == 100) {
        data.profit_price = '0.00'
    } else {
        data.profit_price = (data.price / (1 - (data.profit_rate) / 100)).toFixed(2)
    }
    return data
}

/**
 * @method editCooperateMode 编辑合作方式
 */
export async function editCooperateMode(value = '', row = {}) {
    const req = formatterCooperateEdit(value, row)
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/savePriceConf`,
        method: 'post',
        data: req
    })
    return readResult(res, null, true)
}

/**
 * @method editPrice 编辑底价
 */
export async function editPrice(value = '', row = {}) {
    if (!value) {
        message.warning('底价(元/CPM)不能为空')
        return false
    }
    if (isNaN(value)) {
        message.warning('输入格式错误')
        return false
    }
    if (value == 0 || value < 0) {
        message.warning('底价设置需大于0！')
        return false
    }
    const req = formatterEdit('price', value, row)
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/savePriceConf`,
        method: 'post',
        data: req
    })
    return readResult(res, null, true)
}

/**
 * @method editMediaShare 编辑媒体分成
 */
export async function editMediaShare(value = '', row = {}) {
    if (!value) {
        message.warning('媒体分成比例不能为空')
        return false
    }
    if (isNaN(value)) {
        message.warning('输入格式错误')
        return false
    }
    if (value < 0 || value > 100 || value == 0) {
        message.warning('媒体分成比例范围是：大于0且小于等于100%')
        return false
    }
    if (row.cooperate_mode == 7) {
        if (!/^\d*$/g.test(value)) {
            message.warning('cpc底价+分成模式：媒体分成比例必须为整数')
            return false
        }
    }
    const req = formatterEdit('media_share', value, row)
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/savePriceConf`,
        method: 'post',
        data: req
    })
    return readResult(res, null, true)
}

/**
 * @method editProfitRate 编辑最低利润率
 */
export async function editProfitRate(value = '', row = {}) {
    if (!value) {
        message.warning('最低利润率不能为空')
        return false
    }
    if (isNaN(value)) {
        message.warning('输入格式错误')
        return false
    }
    if (value < -100 || value > 99.99) {
        message.warning('最低利润率的范围是：-100% ~ 99.99%')
        return false
    }
    const req = formatterEdit('profit_rate', value, row)
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/savePriceConf`,
        method: 'post',
        data: req
    })
    return readResult(res, null, true)
}

/**
 * @method receiveWhiteList 获取保护策略列表
 * @param {String} slot_id 广告位UID
 */
export async function receiveWhiteList(slot_id = '', formatter, error) {
    const req = { slot_id }
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/getWhiteList`,
        method: 'get',
        data: req
    })
    return readResult(res, formatter, error)
}

/**
 * @method submitWhiteList 提交保护策略列表
 */
export async function submitWhiteList(slot_id = '', client_id = '', formatter, error) {
    const req = {
        client_id,
        slot_id
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/addWhiteList`,
        method: 'post',
        data: req
    })
    return readResult(res, formatter, error)
}