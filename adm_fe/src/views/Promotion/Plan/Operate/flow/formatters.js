/**
 * @description 格式化
 */
import React from 'react'
import { Tag } from 'antd'

/**
 * @method groupList 广告组列表
 */
export function groupList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.group_id,
            label: t.group_name
            // <div className={this.className}>
            //     <div>{t.group_name}</div>
            //     <Tag>{t.purpose === 'download' ? '应用下载' :
            //         t.purpose === 'landing' ? '落地页' : ''}</Tag>
            // </div>
        }))
    }
    return []
}

/**
 * @method planList 广告计划列表
 */
export function planList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.group_id,
            label: t.group_name,
            children: t.child.map(s => ({
                value: s.plan_id,
                label: s.plan_name
            }))
        }))
    }
    return []
}

/**
 * @method areaList 地域列表
 */
export function areaList(data) {
    if (data) {
        let temp = []
        return Object.keys(data).reduce((r, k) => {
            const t = data[k] || {}
            if (t.parent) {
                temp.push({
                    label: t.name,
                    value: k + ''
                })
            } else {
                temp = []
                r.push({
                    label: t.name,
                    value: k + '',
                    children: temp
                })
            }
            return r
        }, [])
    }
    return []
}

/**
 * @method mediaList 媒体列表
 */
export function mediaList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.bundle_id,
            label: t.media_name
        }))
    }
    return []
}

/**
 * @method mediaSlotList 媒体广告位列表
 */
export function mediaSlotList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.bundle_id,
            label: t.media_name,
            children: t.slots.map(s => ({
                value: s.slot_id,
                label: s.slot_name
            }))
        }))
    }
    return []
}

/**
 * @method channelList 频道分类列表
 */
export function channelList(data) {
    if (data) {
        let temp = []
        return Object.keys(data).reduce((r, k) => {
            const t = data[k] || {}
            if (t.parent) {
                temp.push({
                    label: t.name,
                    value: k + ''
                })
            } else {
                temp = []
                r.push({
                    label: t.name,
                    value: k + '',
                    children: temp
                })
            }
            return r
        }, [])
    }
    return []
}

/**
 * @method tagList 行为定向列表
 */
export function tagList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.code,
            label: t.name,
            children: t.child.map(s => ({
                value: s.code,
                label: s.name
            })).filter(s => s.value !== t.code)
        }))
    }
    return []
}

/**
 * @method categoryList 兴趣标签列表
 */
export function categoryList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.code,
            label: t.name,
            children: t.child.map(s => ({
                value: s.code,
                label: s.name
            })).filter(s => s.value !== t.code)
        }))
    }
    return []
}

/**
 * =========================
 * 
 * @description 动态商品广告
 */

/**
 * @method feedsList feeds列表
 */
export function feedsList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            label: t.name,
            value: t.mfeedId
        }))
    }
    return []
}

/**
 * @method promoteGroupList 商品组列表
 */
export function promoteGroupList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            label: t.name,
            value: t.groupId
        }))
    }
    return []
}

/**
 * =========================
 * 
 * @description submit
 */

/**
 * @method mediaSlotValue 媒体广告位定向
 */
export function mediaSlotValue(data) {
    if (data instanceof Array) {
        return data.reduce((r, t) => {
            r[t.value] = (t.children || []).map(s => s.value).join(',')
            return r
        }, {})
    }
    return {}
}


/**
 * @method hourValue 时段定向
 */
export function hourValue(data) {
    if (data instanceof Array) {
        return data.reduce((r, t = [], index) => {
            if (t.length) {
                r[index + 1] = t
            }
            return r
        }, {})
    }
    return {
        1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        7: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    }
}