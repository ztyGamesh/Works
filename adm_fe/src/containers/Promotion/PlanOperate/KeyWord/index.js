/**
 * 
 */
import React from 'react'
import { message } from 'antd'

import KeyWord from './KeyWord'
import KeyWordDeny from './KeyWordDeny'
import KeyWordSug from './KeyWordSug'
import KeyWordSugDeny from './KeyWordSugDeny'

export {
    KeyWord,
    KeyWordDeny,
    KeyWordSug,
    KeyWordSugDeny
}

/**
 * @method getKeywordFormFiles 从文件数据中获取最新关键词
 * @param {*} files 
 * @param {*} oldValue 
 * @param {*} max 
 */
export function getKeywordFormFiles(files, oldValue, max) {
    const data = files.reduce((r, t = []) => {
        return r.concat(t)
    }, [])
    //已拼接的数据
    const temp = oldValue.split('\n').reduce((r, t) => {
        const v = t.trim()
        if (v !== '') {
            r.push(v)
        }
        return r
    }, [])
    const newValue = data.reduce((r, t = []) => {
        const v = t[0] || ''
        if (v !== '' && !temp.includes(v)) {
            temp.push(v)
            return r + v + '\n'
        }
        return r
    }, oldValue !== '' && !oldValue.endsWith('\n') ? oldValue + '\n' : oldValue)
    const keyword = newValue.endsWith('\n') ? newValue.slice(0, -1) : newValue
    if (max && keyword.split('\n').length > max) {
        message.warning(`关键词超过${max}个，文件导入失败`)
        return false
    }
    return keyword
}

/**
 * @method validateField 校验关键词文件数据
 */
export function validateField(field, value = '') {
    const v = value.trim()
    switch (field) {
        case 'word': {
            const length = v.replace(/[\u2E80-\u9FFF]/g, '**').length
            return length > 0 && length <= 40
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
        default:
            return true
            break
    }
}