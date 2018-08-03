/**
 * @class 表格启用模态框
 * 
 * @prop {String} title 标题，可使用#length占位符，更换已选数据的长度
 * @prop {Boolean} isSubmit 是否启用“确定”按钮
 * @prop {Function} onInit 初始化数据，模态框打开时被调用
 * @prop {Function} onSubmit 提交
 * 
 * @method onSubmit(checkedKeys,checkedRows,values)
 * @param {Array} checkedKeys 批量选中的单元值
 * @param {Array} checkedRows 批量选中的行值
 * @param {Object|Boolean} values 表单数据，false时，数据校验失败
 * @returns {Boolean} flase：无，other：关闭模态框，并刷新表格
 */
import React from 'react'
import { message, Form, Input, Tooltip } from 'antd'
import { FormModal } from '../../Form'
import Confirm from '../../Confirm'
import styles from './style.less'

export default class extends React.Component {
    initHandle = () => {
        const { onInit } = this.props
        typeof onInit === 'function' && onInit()
    }

    submitHandle = async (values) => {
        const { checkedKeys, checkedRows, onUpdate, onSubmit, unUp, isCellData } = this.props
        if (typeof onSubmit === 'function') {
            if (false === await onSubmit(checkedKeys, checkedRows, values)) {
                return false
            } else {
                onUpdate()
                //表格数据，不需要关闭模态框，刷新表格是会清除模态框
                if (isCellData) {
                    return false
                }
            }
        }
    }

    render() {
        const { title = '', checkedKeys = [] } = this.props
        const size = checkedKeys.length
        const props = {
            ...this.props,
            modalTitle: typeof title === 'string' ? title.replace(/#length/g, size) : title,
            onInit: this.initHandle,
            onSubmit: this.submitHandle
        }
        return (
            <FormModal {...props} />
        )
    }
}

/**
 * @class 唤起表格模态框
 * 
 * @ignore 表格组件统一底层组件，不作为表格组件直接使用
 * 
 * @description 表格组件中唤起模态框统一属性
 * @prop {String|React.Element} text 渲染
 * @prop {String} confirm 启用二次提示的文本，点击确定后调用onClick点击事件，可使用#length占位符，更换已选数据的长度
 * @prop {React.Element|Boolean} modal 模态框
 * @prop {Function} onClick 点击事件
 * @prop {Boolean} refresh 不使用模态框时，onClick不返回false时是否自动刷新表格
 * 
 * @class modal 可直接使用TableToolModal，自定义模态框必须能接收“showModal、onCancel”并实现
 * @prop {Boolean} showModal 模态框显示状态
 * @prop {Function} onCancel 关闭模态框
 * @prop {Array} checkedKeys 批量选中的单元值
 * @prop {Array} checkedRows 批量选中的行值
 * @prop {Function} onUpdate 刷新表格
 * 
 * @method onClick(checkedKeys,checkedRows,onUpdate)
 * @param {Array} checkedKeys 批量选中的单元值
 * @param {Array} checkedRows 批量选中的行值
 * @param {Function} onUpdate 刷新表格
 * @returns {Boolean} modal模式：false：无，other：打开模态框；
 * @returns {Boolean} refresh模式：false：无，other：刷新表格；
 * @returns {Boolean} 其他模式：无；
 * 
 * @ignore 表格组件封装中使用的额外属性
 * @prop {Boolean} clickNoChecked 没有选择数据时是否跳过二次确认
 */
export class ArouseModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showVisible: false
        }
    }

    clickHandle = async (e) => {
        const { checkedKeys, checkedRows, onUpdate, onClick, confirm = '', modal, clickNoChecked, refresh } = this.props
        if (typeof onClick === 'function') {
            if (confirm && typeof e === 'function') {
                const size = checkedKeys.length
                if (clickNoChecked && size === 0 || await e(confirm.replace(/#length/g, size))) {
                    if (false !== await onClick(checkedKeys, checkedRows, onUpdate)) {
                        modal ? this.setState({ showVisible: true }) : (refresh && onUpdate())
                    }
                }
            } else {
                if (false !== await onClick(checkedKeys, checkedRows, onUpdate)) {
                    modal ? this.setState({ showVisible: true }) : (refresh && onUpdate())
                }
            }
        }
    }

    cancelHandle = () => {
        this.setState({ showVisible: false })
    }

    render() {
        const { checkedKeys, checkedRows, onUpdate, text, title, confirm = '', modal, isCellData } = this.props
        const comp = confirm ? (
            <Confirm onClick={this.clickHandle}>
                <div>{text}</div>
            </Confirm>
        ) : <div onClick={this.clickHandle}>{text}</div>
        return (
            <div>
                {title ? <Tooltip title={title}>{comp}</Tooltip> : comp}
                {
                    modal ? React.cloneElement(modal, {
                        checkedKeys, checkedRows, onUpdate,
                        onCancel: this.cancelHandle,
                        showModal: this.state.showVisible,
                        isCellData: isCellData
                    }) : null
                }
            </div>
        )
    }
}