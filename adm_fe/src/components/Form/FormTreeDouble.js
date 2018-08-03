/**
 * @class 双树形选择框
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Array} data 可选数据配置
 * @prop {Function} onChange change事件
 * @prop {String} initialValue 默认值
 * @prop {Boolean:true} multiple 是否多选，默认为true
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
import { Form, Tree, Icon, Radio } from 'antd'
import { validateFieldData, extraStyle, readStyle, removeLevelInfo, readLevelInfo } from './FormUtil'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
import styles from './FormTreeDouble.less'

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
            multiple = true,
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
                        multiple={multiple}
                        data={data} />
                )}
            </FormItem>
        ) : null
    }
}

class TreeDouble extends React.Component {
    /**
     * @method renderTreeNodes 渲染左侧树
     */
    renderTreeNodes = (data) => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.label} key={item.value} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode title={item.label} key={item.value} dataRef={item} />
        })
    }

    /**
     * @method renderRadioTreeNodes 渲染左侧树（单选）
     */
    renderRadioTreeNodes = (data) => {
        return data.map(item => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode title={item.label} key={item.value} dataRef={item}>
                        {this.renderRadioTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode className={styles.radio} title={
                <Radio value={item.value}>{item.label}</Radio>
            } key={item.value} dataRef={item} />
        })
    }

    /**
     * @method renderCloseTreeNodes 渲染右侧树
     */
    renderCloseTreeNodes = (data) => {
        const { multiple } = this.props
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode className={styles.close + ' ' + (multiple ? '' : styles.closeradio)}
                        title={
                            <div className={styles.closebody}>
                                <div title={item.label}>{item.label}</div>
                                {
                                    multiple ?
                                        <Icon type="close" onClick={e => this.closeHandle(e, item.value, item.children)} /> :
                                        null
                                }

                            </div>
                        } key={item.value} dataRef={item}>
                        {this.renderCloseTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode className={styles.close + ' ' + (multiple ? '' : styles.closeradio + ' ' + styles.radio)}
                title={
                    <div className={styles.closebody}>
                        <div title={item.label}>{item.label}</div>
                        {
                            multiple ?
                                <Icon type="close" onClick={e => this.closeHandle(e, item.value)} /> :
                                null
                        }
                    </div>
                } key={item.value} dataRef={item} />
        })
    }

    /**
     * @method getSelectedData 获取左侧选中的节点信息
     */
    getSelectedData = (info = [], value = []) => {
        //叶子节点所在分支信息
        var values = readLevelInfo(info, value)
        function fun(info) {
            const temp = []
            for (var i = 0, l = info.length; i < l; i++) {
                var item = info[i]
                if (values.includes(item.value)) {
                    if (item.children && item.children.length) {
                        temp.push({
                            value: item.value,
                            label: item.label,
                            children: fun(item.children)
                        })
                    } else {
                        temp.push({
                            value: item.value,
                            label: item.label
                        })
                    }
                }
            }
            return temp
        }
        var arr = fun(info)
        return arr
    }

    /**
     * @method changeHandle 左侧树选中事件
     */
    changeHandle = (e) => {
        typeof this.props.onChange === 'function' && this.props.onChange(
            //只返回叶子节点信息
            removeLevelInfo(this.props.data, e)
        )
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
            const v = oldValue[i]
            if (!closeValues.includes(v)) {
                newValue.push(v)
            }
        }
        const { data, onChange } = this.props
        typeof onChange === 'function' && onChange(removeLevelInfo(data, newValue))
    }

    /**
     * @method clearHandle 右侧树清空
     */
    clearHandle = (e) => {
        e.stopPropagation()
        typeof this.props.onChange === 'function' && this.props.onChange([])

    }

    render() {
        const { disabled, onChange, data, value, multiple } = this.props
        const selectedData = this.getSelectedData(data, value)
        return (
            <div className={`ant-input ` + styles.body}>
                <div className={styles.header}>
                    <div>待选择项</div>
                    <div>
                        <div>已选择</div>
                        {
                            multiple ?
                                <a onClick={this.clearHandle}>全部清除</a> :
                                null
                        }
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <div>
                            {multiple ?
                                <Tree disabled={disabled}
                                    checkable
                                    selectable={false}
                                    onCheck={this.changeHandle}
                                    checkedKeys={value}
                                    allowClear={false}>
                                    {
                                        this.renderTreeNodes(data)
                                    }
                                </Tree> :
                                <Radio.Group disabled={disabled}
                                    onChange={e => onChange([e.target.value])}
                                    value={value && value[0]}>
                                    <Tree selectable={false}>
                                        {
                                            this.renderRadioTreeNodes(data)
                                        }
                                    </Tree>
                                </Radio.Group>
                            }
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div>
                            <Tree checkable={false}
                                selectable={false}
                                allowClear={false}>
                                {
                                    this.renderCloseTreeNodes(selectedData)
                                }
                            </Tree>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}