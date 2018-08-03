/**
 * @description 请求
 * @param {Object} data 参数
 * @param {Function}  数据格式化
 * @param {Boolean} error 是否提示错误信息
 */
import React from 'react'
import { message } from 'antd'
import { BUSINESSAPIHOST } from '../../../../../common/env'
import request from '../../../../../utils/request'

/**
 * @method readResult 处理查询结果
 */
function readResult(res, error) {
    if (res && res.status === 1) {
        return res.data
    } else if (error) {
        message.error(res && res.msg || '服务器异常')
    }
    console.error('[REQUEST:]', res && res.msg || '服务器异常')
    return false
}

/**
 * @method submitData 提交
 */
export async function submitData(data = {}, error) {
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/adplansave`,
        method: 'post',
        data
    })
    return readResult(res, error)
}

/**
 * @method receiveGroupList 获取广告组列表
 * @param {String} search 搜索
 * @param {Number} plan 是否查询计划
 */
export async function receiveGroupList(search = '', plan = 0, data = {}, error) {
    const req = {
        plan,
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
    return readResult(res, error)
}

/**
 * @method receiveGroupInfo 获取广告组信息
 * @param {String} gid 广告组ID
 */
export async function receiveGroupInfo(gid = '', error) {
    const req = {
        id: gid
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/fetchadgroup`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receivePlanInfo 获取广告计划信息
 * @param {String} pid 广告计划ID
 */
export async function receivePlanInfo(pid = '', error) {
    const req = {
        id: pid
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/fetchadplan`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveAreaList 获取地域列表
 */
export async function receiveAreaList(error) {
    const req = {}
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/geo`,
        method: 'post',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveMediaList 获取媒体列表
 */
export async function receiveMediaList(error) {
    const req = {}
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/fetchusermediatarget`,
        method: 'post',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveChannelList 获取频道分类列表
 */
export async function receiveChannelList(error) {
    const req = {}
    const res = await request({
        url: `${BUSINESSAPIHOST}/user/getchannelclass`,
        method: 'post',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveTagList 获取行为定向列表
 */
export async function receiveTagList(error) {
    const req = { level: 2 }
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/tag`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveCategoryList 获取兴趣标签列表
 */
export async function receiveCategoryList(error) {
    const req = { level: 2 }
    const res = await request({
        url: `${BUSINESSAPIHOST}/promotion/articleCategory`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveMediaSlotInfo 媒体广告位定向，查询广告位
 */
export async function receiveMediaSlotInfo(media = '', slot_id = '', error) {
    const req = {
        slot_id,
        bundle_id: media
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/slot/getSlotNames`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * =========================
 * 
 * @description 动态商品广告
 */

/**
 * @method receiveFeedsList 获取feeds列表
 */
export async function receiveFeedsList(error) {
    const req = {}
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/listmFeeds`,
        method: 'post',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receivePromoteGroupList 获取商品组列表
 * @param {String} gid 广告组ID
 */
export async function receivePromoteGroupList(gid = '', error) {
    const req = { groupId: gid }
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/listGroups`,
        method: 'post',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receivePromoteGroupInfo 获取商品组信息
 * @param {String} groupId 商品组ID
 */
export async function receivePromoteGroupInfo(groupId = '', error) {
    const req = { groupId }
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/getGroupInfo`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveProductGroupCount 获取商品组商品数量
 * @param {String} groupId 商品组ID
 */
export async function receiveProductGroupCount(groupId = '', error) {
    const req = { groupId }
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/getProductCount`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveSchemaByGroup 获取Schema列表
 * @param {String} groupId 商品组ID
 */
export async function receiveSchemaByGroup(groupId = '', needSample = false, error) {
    const req = {
        groupId,
        needSample
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/getSchemaByGroup`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method saveProductGroup 保存商品组信息
 */
export async function saveProductGroup(mfeedId = '', data = {}, error) {
    const req = {
        mfeedId,
        name: data.product_group_name || '',
        mfeedId: data.product_group_mfeedId || '',
        filter: data.filter || []
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/saveGroup`,
        method: 'post',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method receiveSchemaByFeed 获取Schema列表
 * @param {String} mfeedId
 */
export async function receiveSchemaByFeed(mfeedId, error) {
    const req = { mfeedId }
    const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/getSchemaByFeed`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}

/**
 * @method submitKeywordNew 更新关键词is_new
 * @param {String} pid 计划ID
 */
export async function submitKeywordNew(pid, error) {
    if (pid === '') {
        return
    }
    const req = {
        event_type: 3,
        data: pid
    }
    const res = await request({
        url: `${BUSINESSAPIHOST}/event/report`,
        method: 'get',
        data: req
    })
    return readResult(res, error)
}