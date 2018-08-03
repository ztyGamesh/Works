/**
 * @description 格式化
 */
import React from 'react'
import { Tag } from 'antd'


/**
 * @method categoryList 创意标签列表
 */
export function categoryList(data) {
    if (data instanceof Array) {
        return data.map(t => ({
            value: t.code,
            label: t.name,
            children: t.child ? t.child.map(s => ({
                value: s.code,
                label: s.name,
                children: s.child ? s.child.map(a => ({
                    value: a.code,
                    label: a.name
                })) : ''
            })) : []
        }))
    }
    return []
}

