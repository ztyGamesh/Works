/**
 * @class 表格组件，可设置裁剪、编辑、链接
 * 
 * @prop {Object} row 当前行数据
 * @prop {String} value 文本
 * @prop {Number} limit 文本裁剪的字符数，中文为2字节
 * @prop {Boolean} link 是否是a标签
 * @prop {Function} onLink a标签点击事件
 * @prop {Boolean} edit 是否可编辑
 * @prop {Function} onEdit 编辑事件
 * 
 * @method onEdit(value,row)
 * @param {String} value 编辑框值
 * @param {Object} row 当前行数据
 * @returns {Boolean} false:编辑框不关闭，other:关闭编辑并刷新表格
 */
import React from 'react'
import { Icon, Input, Tooltip } from 'antd'
import styles from './style.less'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEdit: false,
            value: ''
        }
    }

    openHandle = () => {
        this.setState({
            value: this.props.value,
            isEdit: true
        })
    }

    editHandle = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const { row, onEdit, onUpdate } = this.props
        if (typeof onEdit === 'function' && false !== await onEdit(this.state.value.trim(), row)) {
            this.cancelHandle()
            if (typeof onUpdate === 'function') {
                onUpdate()
            }
        }
    }

    changeHandle = (e) => {
        this.setState({ value: e.target.value })
    }

    cancelHandle = () => {
        this.setState({ isEdit: false })
    }

    limitTextHandle = (text = '', limit) => {
        if (limit) {
            const size = text.replace(/[\u2E80-\u9FFF]/g, '**').length
            if (limit < size - 2) {
                let newText = ''
                for (let i = 0, index = 0; index < limit; i++ , index++) {
                    newText += text[i]
                    if (/[\u2E80-\u9FFF]/g.test(text[i])) {
                        index++
                    }
                }
                return newText + '...'
            }
        }
        return text
    }

    render() {
        const { value, link, edit, limit, onLink, tag } = this.props
        if (value === undefined) {
            return <div>-</div>
        }
        const limitedValue = this.limitTextHandle(value, limit)
        return edit && this.state.isEdit ? (
            <div className={styles['cell-edit']}>
                <Input autoFocus value={this.state.value} onChange={this.changeHandle}
                    onPressEnter={this.editHandle} />
                <div className={styles['cell-edit-operate']}>
                    <Icon type="check" onClick={this.editHandle} />
                    <Icon type="close" onClick={this.cancelHandle} />
                </div>
            </div>
        ) : (
                <div className={styles.cell}>
                    <Tooltip overlayClassName={styles.title} title={value}>
                        {
                            link ?
                                <a className={edit ? styles['edit-line'] : styles.text} onClick={onLink}>{limitedValue}</a> :
                                <span className={edit ? styles['edit-line'] : styles.text}>{limitedValue}</span>
                        }
                    </Tooltip>
                    {edit ? <Icon type="edit" className={styles['cell-icon-edit']} onClick={this.openHandle} /> : null}
                    {tag ? <div className={styles['cell-tag']}><div>{tag}</div></div> : null}
                </div>
            )
    }
}