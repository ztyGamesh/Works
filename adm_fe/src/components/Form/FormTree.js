/**
 * @class 树形选择框
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Array} data 可选数据配置
 * @prop {Function} onChange change事件
 * @prop {Array} initialValue 默认值
 * @prop {Boolean} multiple 是否多选，默认为true
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
import { Form, Tree, Radio } from 'antd'
import { validateFieldData, extraStyle, readStyle, removeLevelInfo, readLevelInfo } from './FormUtil'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
import styles from './FormTree.less'

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
            multiple = true,
            initialValue = multiple ? [] : '',
            full,
            height = 'auto'
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
                <div className="ant-input" style={{
                    width: '100%',
                    height,
                    maxHeight: 400,
                    overflow: 'auto',
                    display: 'block'
                }}>
                    {getFieldDecorator(field, {
                        rules: [{
                            validator: validateFieldData(validate)
                        }],
                        initialValue
                    })(
                        <TreeBox disabled={disabled} onChange={onChange} data={data} multiple={multiple} />
                    )}
                </div>
            </FormItem>
        ) : null
    }
}

class TreeBox extends React.Component {
    /**
     * @method renderTreeNodes 渲染树
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
     * @method renderRadioTreeNodes 渲染树
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
     * @method changeHandle 树选中事件
     */
    changeHandle = (e) => {
        typeof this.props.onChange === 'function' && this.props.onChange(
            //只返回叶子节点信息
            removeLevelInfo(this.props.data, e)
        )
    }

    render() {
        const { disabled, onChange, data, value, multiple } = this.props
        return multiple ? (
            <Tree disabled={disabled}
                checkable
                selectable={false}
                onCheck={this.changeHandle}
                checkedKeys={value}
                defaultExpandAll>
                {
                    this.renderTreeNodes(data)
                }
            </Tree>
        ) : (
                <Radio.Group disabled={disabled} onChange={e => onChange(e.target.value)} value={value}>
                    <Tree selectable={false} defaultExpandAll>
                        {
                            this.renderRadioTreeNodes(data)
                        }
                    </Tree>
                </Radio.Group>
            )
    }
}