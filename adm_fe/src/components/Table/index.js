/**
 * @description 表格组件
 */
import TableBase from './TableBase/TableBase'
import {
	Cell,
	Switch,
	Select,
	Modal,
	Links,
	Link,
	LinkShow,
	LinkEdit,
	LinkAdd,
	LinkAttached,
    LinkPid,
	Batchs,
	BatchLink,
	BatchSelect,
	BatchOption,
    BatchA,
    BatchDown
} from './TableTool'

import TableForReport from './TableForReport';
export {
    //表格
    TableBase,
    //单元格：文本裁剪、修改、链接
    Cell,
    //单元格：开关
    Switch,
    //单元格：下拉框
    Select,
    //模态框
    Modal,
    //单元格：链接组
    Links,
    //单元格：链接
    Link,
    //单元格：操作-查看
    LinkShow,
    //单元格：操作-编辑
    LinkEdit,
    //单元格：操作-添加
    LinkAdd,
    LinkAttached,
    //批量操作组
    Batchs,
    //直接批量操作
    BatchLink,
    //下拉选择批量操作
    BatchSelect,
    //下拉选择批量操作子选项
    BatchOption,
    TableForReport,
    BatchA,
    BatchDown,
    LinkPid
}

/**
 * @method initPageData 筛选数据
 * @description 数据量太大，排序需优化
 */
export function initPageData(d = [], { keyword, search, filters = {}, sort, order, sortType }) {
    const filtersKey = Object.keys(filters)
    const data = d.filter(t => {
        if (keyword) {
            const v = t[keyword]
            if (v.indexOf(search) === -1) {
                return false
            }
        }
        for (let i = filtersKey.length; i--;) {
            const field = filtersKey[i]
            const values = filters[filtersKey] || []
            if (values.length > 0) {
                const v = t[field]
                if (!values.includes(v)) {
                    return false
                }
            }
        }
        return true
    })
    if (sort) {
        console.time('sort')
        if (sortType === 'number') {//数字类型
            if (order === 'desc') {
                data.sort((t1, t2) => {
                    const v1 = t1[sort]
                    const v2 = t2[sort]
                    if (v1 === '') {
                        return -1
                    }
                    if (v2 === '') {
                        return 1
                    }
                    return v2 - v1 || 1
                })
            } else {
                data.sort((t1, t2) => {
                    const v1 = t1[sort]
                    const v2 = t2[sort]
                    if (v1 === '') {
                        return -1
                    }
                    if (v2 === '') {
                        return 1
                    }
                    return v1 - v2 || 1
                })
            }
        } else {//其他
            if (order === 'desc') {
                data.sort((t1, t2) => {
                    const v1 = t1[sort]
                    const v2 = t2[sort]
                    if (v1 === '') {
                        return -1
                    }
                    if (v2 === '') {
                        return 1
                    }
                    if (v2 > v1) {
                        return 1
                    } else {
                        return -1
                    }
                })
            } else {
                data.sort((t1, t2) => {
                    const v1 = t1[sort]
                    const v2 = t2[sort]
                    if (v1 === '') {
                        return -1
                    }
                    if (v2 === '') {
                        return 1
                    }
                    if (v1 > v2) {
                        return 1
                    } else {
                        return -1
                    }
                })
            }
        }
        console.timeEnd('sort')
    }
    return data
}
