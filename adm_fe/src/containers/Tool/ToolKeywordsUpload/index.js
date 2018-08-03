/**
 * @description tool 批量上传关键词
 */
import React from 'react'

import KeywordsUploadCsv from './ToolKeywordsUploadCsv'
import KeywordsSubmitModal from './ToolKeywordsSubmitModal'

export {
    KeywordsUploadCsv,
    KeywordsSubmitModal
}

/**
 * @method validateField 校验关键词文件数据
 */
export function validateField(field, value = '', compare = '') {
    const v = value.trim()
    switch (field) {
        case 'word': {
            const length = v.replace(/[\u2E80-\u9FFF]/g, '**').length
            return length > 0 && length <= 40
        }
            break
        case 'group_name': {
            const length = v.replace(/[\u2E80-\u9FFF]/g, '**').length
            return length > 0 && length <= 50
        }
            break
        case 'plan_name': {
            const length = v.replace(/[\u2E80-\u9FFF]/g, '**').length
            return length > 0 && length <= 50
        }
            break
        case 'match_type':
            return ['精确匹配', '短语精确包含', '前缀匹配'].includes(v)
            break
        case 'price':
            return /^[0-9]{1,3}(|\.[0-9]{0,2})$/.test(v) && v >= 0.01
            break
        case 'link':
            return /^(https?:\/\/){1}/.test(v)
            break
        case 'status':
            return ['启用', '暂停', ''].includes(v)
            break
        case 'purpose':
            return ['落地页', '应用下载'].includes(v)
            break
        case 'app_pkg':
            return '落地页' === compare ? v === '' : v !== ''
            break
        case 'download_link':
            return '落地页' === compare ? v === '' : /^(https?:\/\/){1}/.test(v)
            break
        default:
            return true
            break
    }
}

/**
 * @ignore remove 不需要容错处理
 * 
 * @method formatterField 关键词容错处理
 * @param {String} field 要处理的字段
 * @param {String} value 处理前数据
 * @returns {String} 处理后数据
 */
export function formatterField(field, value = '') {
    const ov = value.trim()
    switch (field) {
        case 'price':
            const v = (+ov || 0).toFixed(2)
            return v < 0.01 ? '0.01' : v > 999.99 ? '999.99' : v
            break
        case 'link':
            return ov.replace(/(^h?t?t?p?(s?):?\/\/)|^/g, 'http$2://')
            break
        default:
            return ov
            break
    }
}
