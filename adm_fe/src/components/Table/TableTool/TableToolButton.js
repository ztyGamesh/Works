/**
 * @class 按钮组件
 * 
 * @see ArouseModal
 * @prop {String|React.Element} label =>text
 * @default refresh=false 不自动刷新表格
 */
import React from 'react'
import styles from './style.less'
import { Button } from 'antd'
import { ArouseModal } from './TableToolModal'

export default class extends React.Component {
    render() {
        const { label, disabled, checkedKeys, checkedRows, onUpdate, onClick, confirm, modal } = this.props
        return (
            <ArouseModal
                checkedKeys={checkedKeys}
                checkedRows={checkedRows}
                onUpdate={onUpdate}
                onClick={disabled ? null : onClick}
                confirm={confirm}
                modal={modal}
                text={
                    typeof label === 'string' ?
                        <Button icon="plus" type="primary" disabled={disabled}>
                            {label}
                        </Button> :
                        label && React.cloneElement(label, { checkedKeys, checkedRows, onUpdate })
                } />
        )
    }
}
