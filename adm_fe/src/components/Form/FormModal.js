/**
 * @class 表单组件 - 在模态框中使用
 * 
 * @prop {Boolean} showModal 模态框显示状态
 * @prop {Function} onCancel 关闭模态框
 * @prop {String} modalTitle 标题
 * @prop {Boolean} isSubmit 是否启用“确定”按钮，默认为false
 * @prop {Function} onInit 初始化数据，模态框打开时被调用
 * @prop {Function} onSubmit 提交
 * @prop {Number} width 宽度
 * 
 * @method onSubmit(values)
 * @param {Object|Boolean} values 表单数据，false：数据校验失败
 * @returns {Boolean} flase：无，other：关闭模态框
 */
import React from 'react'
import { Button, Modal } from 'antd'
import { FormList, FormWell } from './'

export default class extends React.Component {
    submitHandle = async (e) => {
        const { isSubmit, onCancel, onSubmit } = this.props
        if (!isSubmit) { return }
        if (typeof onSubmit === 'function') {
            if (false !== await onSubmit(e)) {
                typeof onCancel === 'function' && onCancel()
            }
        } else {
            typeof onCancel === 'function' && onCancel()
        }
    }
    render() {
        const { showModal, modalTitle, onCancel, isSubmit = false, children, width, space } = this.props
        const props = {
            ...this.props,
            onSubmit: this.submitHandle,
            children: [].concat(
                <FormWell modal space={space} children={children} />
            ).concat(
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderTop: '1px solid #e8e8e8'
                }}>
                    <Button onClick={onCancel}>关闭</Button>
                    {isSubmit === false ? null : <div style={{ width: '18px' }}></div>}
                    {isSubmit === false ? null : <Button type="primary" htmlType="submit">确定</Button>}
                </div>
            )
        }
        return (
            <Modal width={width}
                bodyStyle={{ padding: 0 }}
                title={modalTitle}
                visible={showModal}
                onCancel={onCancel}
                footer={null}
                maskClosable={false}
                destroyOnClose>
                <ModalForm {...props} />
            </Modal>
        )
    }
}

class ModalForm extends React.Component {
    componentWillMount() {
        const { onInit } = this.props
        typeof onInit === 'function' && onInit()
    }

    render() {
        return (
            <FormList {...this.props} />
        )
    }
}