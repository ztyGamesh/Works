/**
 * @class 双树形选择框 - 带搜索框
 * @description 只支持一级搜索
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Array} data 可选数据配置
 * @prop {Function} onChange change事件
 * @prop {String} initialValue 默认值
 * 
 * @method validate(value:Any)
 * @param {Array} value 选中的值，叶子节点数组
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 * 
 * @description data[]
 * @prop {Any} value 值
 * @prop {String} label 文本
 * @prop {Array} children 子节点
 */
import React from 'react'
import { Form, Tree, Icon, Input } from 'antd'
import { validateFieldData, extraStyle, readStyle, removeLevelInfo, readLevelInfo } from './FormUtil'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
import styles from './FormTreeDoubleSearch.less'

export default class extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        const {
            disabled,
            required,
            label,
            field,
            extra,
            data = [],
            validate,
            onChange,
            initialValue = [],
            search,
            onSearch,
            searchPlaceholder,
            full
        } = this.props
        const itemProps = {
            required,
            label: label === true ? ' ' : label,
            colon: label !== true,
            extra: <div style={extraStyle}>{extra}</div>,
            ...readStyle(label, full)
        }
        return data.length ? (
            <FormItem {...itemProps}>
                {getFieldDecorator(field, {
                    rules: [{
                        validator: validateFieldData(validate)
                    }],
                    initialValue
                })(
                    <TreeDouble disabled={disabled}
                        onChange={onChange}
                        search={search}
                        onSearch={onSearch}
                        searchPlaceholder={searchPlaceholder}
                        data={data} />
                )}
            </FormItem>
        ) : null
    }
}

class TreeDouble extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //搜索获取的数据
            more: {}
        }
    }

    /**
     * @method renderTreeNodes 渲染左侧树
     */
    renderTreeNodes = (data) => {
        const { search, searchPlaceholder, value = [] } = this.props
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.label} key={item.value}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode title={item.label} key={item.value}>
                <TreeNode title={search} key={item.value + '_select'} />
                {
                    value.map(t => t.value).includes(item.value) ?
                        <TreeNode disableCheckbox
                            disabled
                            title={<Input ref={item.value + '_ref'}
                                className={styles.input}
                                placeholder={searchPlaceholder}
                                onBlur={e => this.searchHandle(e, item.value)}
                                onPressEnter={e => this.searchHandle(e, item.value)}
                            />}
                            key={item.value + '_input'}
                        /> : null
                }
            </TreeNode>
        })
    }

    /**
     * @method renderCloseTreeNodes 渲染右侧树
     */
    renderCloseTreeNodes = (data) => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={
                        <div className={styles.closebody}>
                            <div title={item.label}>{item.label}</div>
                            <Icon type="close" onClick={e => this.closeHandle(e, item.value, item.children)} />
                        </div>
                    } key={item.value} className={styles.close}>
                        {this.renderCloseTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode title={
                <div className={styles.closebody}>
                    <div title={item.label}>{item.label}</div>
                    <Icon type="close" onClick={e => this.closeHandle(e, item.value)} />
                </div>
            } key={item.value} className={styles.close} />
        })
    }

    /**
     * @method changeHandle 左侧树选中事件
     */
    changeHandle = (e = []) => {
        const { more = [] } = this.state
        Object.keys(more).forEach(t => {
            if (!e.includes(t)) {
                more[t].splice(0)
            }
        })
        this.saveData(this.props.data, e)
    }

    /**
     * @method closeHandle 右侧树点击删除节点
     */
    closeHandle = (e, value, children = []) => {
        e.stopPropagation()
        const closeValues = [value]
        const fun = (children = []) => {
            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i]
                closeValues.push(child.value)
                if (child.children) {
                    fun(child.children)
                }
            }
        }
        fun(children)
        const oldValue = this.props.value
        const newValue = []
        for (let i = 0, l = oldValue.length; i < l; i++) {
            const v = oldValue[i].value
            if (!closeValues.includes(v)) {
                newValue.push(v)
            }
        }
        const { more = {} } = this.state
        if (more[value]) {
            more[value].splice(0)
        } else {
            Object.values(more).forEach((t = []) => {
                const index = t.findIndex(s => s.value === value)
                if (index !== -1) {
                    t.splice(index, 1)
                }
            })
        }
        this.saveData(this.props.data, newValue, value)
    }

    /**
     * @method clearHandle 右侧树清空
     */
    clearHandle = async (e) => {
        e.stopPropagation()
        await this.setState({ more: {} })
        typeof this.props.onChange === 'function' && this.props.onChange([])
    }

    /**
     * @method searchHandle 搜索
     */
    searchHandle = async (e, value) => {
        e.preventDefault()
        e.stopPropagation()
        const _this = e.target
        const { onSearch } = this.props
        if (typeof onSearch === 'function') {
            const res = await onSearch(_this.value, value) || []
            _this.value = res.map(t => t.value).join(',')
            this.state.more[value] = res
            this.saveData(this.props.data, this.props.value.map(t => t.value))
        }
    }

    /**
     * @method saveData 统一调用onChange
     */
    saveData = (data = [], v = [], close = '') => {
        const { onChange, value } = this.props
        const { more = {} } = this.state
        if (typeof onChange === 'function') {
            onChange(v.reduce((r, t) => {
                let obj = value.find(s => s.value === t) || data.find(s => s.value === t)
                if (obj) {
                    r.push({
                        ...obj,
                        children: (more[t] || obj.children || []).filter(s => s.value !== close)
                    })
                }
                return r
            }, []))
        }
    }

    render() {
        const { disabled, onChange, data, value } = this.props
        return (
            <div className={`ant-input ` + styles.body}>
                <div className={styles.header}>
                    <div>待选择项</div>
                    <div>
                        <div>已选择</div>
                        <a onClick={this.clearHandle}>全部清除</a>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <div>
                            <Tree disabled={disabled}
                                checkable
                                selectable={false}
                                onCheck={this.changeHandle}
                                checkedKeys={value.map(t => t.value)}
                                allowClear={false}>
                                {
                                    this.renderTreeNodes(data)
                                }
                            </Tree>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div>
                            <Tree checkable={false}
                                selectable={false}
                                allowClear={false}>
                                {
                                    this.renderCloseTreeNodes(value)
                                }
                            </Tree>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}