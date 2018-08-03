/**
 * @description 广告创意新建、编辑页面组件
 */
import React from 'react'
import { Popover, Icon } from 'antd'
const READ_URL = '//static.adm.deepleaper.com/material/'

import {
    FormList as CreativeList,
    FormWell as CreativeWell,
    readLevelInfo,
    removeLevelInfo
} from '../../../components/Form'
import CreativeBreadcrumb from './CreativeOperateBreadcrumb'
import CreativePlanName from './CreativeOperatePlanName'
import CreativeSlotClass from './CreativeOperateSlotClass'
import CreativeTemplateClass from './CreativeOperateTemplateClass'
import CreativeAdd from './CreativeOperateAdd'
import CreativeModify from './CreativeOperateModify'
import CreativeMaterial from './CreativeOperateMaterial'
import CreativePreview from './CreativeOperatePreview'
import CreativeAdSource from './CreativeOperateAdSource'
import CreativeExtend from './CreativeOperateExtend'
import CreativeAppName from './CreativeOperateAppName'
import CreativeAppExtend from './CreativeOperateAppExtend'
import CreativeLink from './CreativeOperateLink'
import CreativeAppLink from './CreativeOperateAppLink'
import CreativeDeeplink from './CreativeOperateDeeplink'
import CreativeMonitoringUrl from './CreativeOperateMonitoringUrl'
import CreativeLanding from './CreativeOperateLanding'
import CreativeSubmit from './CreativeOperateSubmit'

export {
    CreativeList,
    CreativeWell,
    CreativeBreadcrumb,
    CreativePlanName,
    CreativeSlotClass,
    CreativeTemplateClass,
    CreativeAdd,
    CreativeModify,
    CreativeMaterial,
    CreativePreview,
    CreativeAdSource,
    CreativeExtend,
    CreativeAppName,
    CreativeAppExtend,
    CreativeLink,
    CreativeAppLink,
    CreativeDeeplink,
    CreativeMonitoringUrl,
    CreativeLanding,
    CreativeSubmit,
    //utils
    readLevelInfo,
    removeLevelInfo
}

/**
 * @method validateAField 校验商品组单字段
 * @returns 0：未使用字段，1：单字段为整个字符串，false：不合格
 */
export function validateAField(value) {
    var start = value.indexOf('[:')
    var end = value.indexOf(':]')
    if (start === -1 || end === -1) {
        return 0
    }
    if (start === 0 && end === value.length - 2) {
        return 1
    }
    return false
}

/**
 * @method getKeyword 获取关键词通配符
 */
export function getKeyword(value = '') {
    var start = value.indexOf('%%')
    var end = value.indexOf('%%', start + 2)
    if (start !== -1 && end !== -1) {
        return value.slice(start + 2, end)
    }
    return ''
}

/**
 * @method createInsertSchema 构建商品组通配符
 */
export function createInsertSchema(schemaList = [], type = '') {
    if (type === '') {
        return {
            type: 'select',
            label: '插入商品组字段',
            config: schemaList.map(t => ({
                label: t.display,
                value: `[:${t.display}:]`
            }))
        }
    }
    return {
        type: 'select',
        label: '插入商品组字段',
        config: schemaList.reduce((r, t) => {
            if (t.type === type) {
                r.push({
                    label: t.display,
                    value: `[:${t.display}:]`
                })
            }
            return r
        }, [])
    }
}

//关键词通配符
export const insertKeyword = {
    type: 'button',
    label: '使用关键词通配符',
    config: {
        value: '%%%%',
        distance: -2
    }
}

//用户通配符
export const insertUser = {
    type: 'select',
    label: <div style={{ position: 'relative' }}>
        <div>插入用户通配符</div>
        <div style={{ position: 'absolute', right: -14, top: 0 }}>
            <Popover placement="right" trigger="hover" title="用户通配符说明" content={<div style={{ fontSize: 14, lineHeight: '20px' }}>
                <div>
                    <span style={{ fontWeight: '800' }}>年：</span>
                    <span>[:年:]最火热的车型都在这里了</span>
                </div>
                <div>2018年展示的广告：2018年最热门的车型都在这里了！</div>
                <div>2017年展示的广告：2017年最热门的车型都在这里了！</div>
                <div style={{ paddingTop: 12 }}>
                    <span style={{ fontWeight: '800' }}>月：</span>
                    <span>[:月:]北京各区房价新鲜出炉，点击查看。</span>
                </div>
                <div>2月份展示的广告：2月北京各区房价新鲜出炉，点击查看。</div>
                <div>3月份展示的广告：3月北京各区房价新鲜出炉，点击查看。</div>
                <div style={{ paddingTop: 12 }}>
                    <span style={{ fontWeight: '800' }}>周：</span>
                    <span>唯品会冬装甩卖，仅限[:周:]</span>
                </div>
                <div>周一展示的广告：唯品会冬装甩卖，仅限周一。</div>
                <div>周日展示的广告：唯品会冬装甩卖，仅限周日。</div>
                <div style={{ paddingTop: 12 }}>
                    <span style={{ fontWeight: '800' }}>日：</span>
                    <span>[:日:]北京各区房价新鲜出炉，点击查看。</span>
                </div>
                <div>10号展示的广告：本月10号北京各区房价新鲜出炉，点击查看。</div>
                <div>3号展示的广告：本月3号北京各区房价新鲜出炉，点击查看。</div>
            </div>}>
                <Icon type="question-circle-o" />
            </Popover>
        </div>
    </div>,
    config: [
        {
            label: '年',
            value: '[:年:]'
        }, {
            label: '月',
            value: '[:月:]'
        }, {
            label: '周',
            value: '[:周:]'
        }, {
            label: '日',
            value: '[:日:]'
        }
    ]
}

/**
* @method validateInsert 校验关键词通配符、商品组字段
 * @returns Object：{info: Boolean,data:String}
        */
export function validateInsert(value = '') {
    var start = value.indexOf('%%')
    var end = value.indexOf('%%', start + 2)
    var nstart = value.indexOf('%%', end + 2)
    var nend = value.indexOf('%%', nstart + 2)
    if (start + 2 === end) {
        return { info: false, data: '请输入关键词通配符' }
    }
    if (nstart !== -1 && nend !== -1) {
        return { info: false, data: '只能使用一个关键词通配符' }
    }
    if (start !== -1 && end !== -1) {
        return { info: true, data: value.slice(0, start) + value.slice(end + 2) }
    }
    return { info: true, data: value }
}

/**
 * @method placeInsert 预览中通配符、商品组字段替换
 */
export function placeInsert(value = '', type, ad_scene, promote_type, schemaList = []) {
    if (promote_type == 1) {
        //图片直接加域名处理
        if (['pic', 'pic1', 'pic2', 'pic3'].includes(type)) {
            return value && READ_URL + value
        }
    }
    //关键词通配符处理后的字符串
    let nValue = ''
    if (ad_scene == 1) {
        if (promote_type == 1) {
            //普通文本
            return value
        } else {
            nValue = value
        }
    } else {
        function readKw(v) {
            const start = v.indexOf('%%');
            const end = v.indexOf('%%', start + 2);
            if (start > -1 && end > -1) {
                nValue += v.slice(0, start)
                readKw(v.slice(end + 2));
            } else {
                nValue += v
            }
        }
        readKw(value)
        if (promote_type == 1) {
            return nValue
        }
    }
    //商品组字段处理后的字符串
    let newValue = ''
    const date = new Date()
    //商品组字段：创意标题添加用户通配符
    const fieldsList = type === 'title' ? schemaList.concat([
        { display: '年', sample: [date.getFullYear() + '年'] },
        { display: '月', sample: [(date.getMonth() + 1) + '月'] },
        { display: '周', sample: ['周' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]] },
        { display: '日', sample: ['本月' + date.getDate() + '日'] }
    ]) : [...schemaList]
    function read(v) {
        const start = v.indexOf('[:')
        const end = v.indexOf(':]', start + 2)
        if (start > -1 && end > -1) {
            const fields = v.slice(start + 2, end)
            const fieldsInfo = fieldsList.find(function (t) {
                return t.display === fields
            })
            if (fieldsInfo) {
                newValue += v.slice(0, start) + (fieldsInfo.sample && fieldsInfo.sample[
                    //示例有三个，组图时分别显示，其他显示第一个
                    type === 'pic2' ? 1 : type === 'pic3' ? 2 : 0
                ] || '')
                read(v.slice(end + 2))
            } else {
                newValue += v
            }
        } else {
            newValue += v
        }
    }
    read(nValue)
    return newValue
}
