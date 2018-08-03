/**
 * @class 时段选择器
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Function} onChange change事件
 * 
 * @method validate(value:Array)
 * @param {String} value 当前输入框值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 */
import React from 'react'
import { Form, DatePicker, Icon } from 'antd'
import moment from 'moment'
import styles from './FormHour.less'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

export default class extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        const {
            disabled,
            required,
            label,
            field,
            placeholder = '',
            extra,
            validate,
            onChange,
            initialValue = [],
            disabledDate,
            full
        } = this.props
        const itemProps = {
            required,
            label: label === true ? ' ' : label,
            colon: label !== true,
            extra: <div style={extraStyle}>{extra}</div>,
            ...readStyle(label, full)
        }
        return (
            <FormItem {...itemProps}>
                {getFieldDecorator(field, {
                    rules: [{
                        validator: validateFieldData(validate)
                    }],
                    initialValue
                })(
                    <Comp disabled={disabled}
                        onChange={onChange} />
                )}
            </FormItem>
        )
    }
}

class Comp extends React.Component {
    getSelectline = () => {
        const { value = [] } = this.props
        const arr = [<div className={styles.info} key="30"></div>]
        for (let i = 0; i < 24; i++) {
            const flag = value.length === 7 && value.every((t = []) => t.includes(i))
            arr.push(<div className={styles.arrow + (flag ? ' active' : '')} key={i} onClick={e => this.clickSelectHandle(i)}>↓</div>)
        }
        return arr
    }

    getLine = (line) => {
        const { value = [] } = this.props
        const data = value[line] || []
        const arr = [
            <div className={styles.info} key="30" onClick={e => this.clickLineHandle(line)}>
                <div className={styles.box + (data.length === 24 ? ' active' : '')}>
                    <div className={styles.infocheck}></div>
                </div>
                <div>星期{['一', '二', '三', '四', '五', '六', '七'][line]}</div>
            </div>
        ]
        for (let i = 0; i < 24; i++) {
            arr.push(<div className={styles.box + (data.includes(i) ? ' active' : '')} key={i} onClick={e => this.clickItemHandle(line, i)}>{i}</div>)
        }
        return arr
    }

    changeHandle = (e) => {
        typeof this.props.onChange === 'function' && this.props.onChange(e)
    }

    clickItemHandle = (line, index) => {
        const { value = [] } = this.props
        const obj = [...value]
        const data = obj[line] ? [...obj[line]] : []
        const m = data.indexOf(index)
        if (m !== -1) {
            data.splice(m, 1)
        } else {
            data.push(index)
        }
        obj[line] = data.sort()
        this.changeHandle(obj)
    }

    clickSelectHandle = (index) => {
        const { value = [] } = this.props
        const obj = [...value]
        if (obj.length === 7 && obj.every((t = []) => t.includes(index))) {
            for (let i = 0; i < 7; i++) {
                const data = obj[i] ? [...obj[i]] : []
                const m = data.indexOf(index)
                if (m !== -1) {
                    data.splice(m, 1)
                }
                obj[i] = data.sort()
            }
        } else {
            for (let i = 0; i < 7; i++) {
                const data = obj[i] ? [...obj[i]] : []
                if (!data.includes(index)) {
                    data.push(index)
                }
                obj[i] = data.sort()
            }
        }
        this.changeHandle(obj)
    }

    clickLineHandle = (line) => {
        const { value = [] } = this.props
        const obj = [...value]
        const data = obj[line] ? [...obj[line]] : []
        if (data.length === 24) {
            data.splice(0)
        } else {
            data.splice(0)
            for (var i = 0; i < 24; i++) {
                data.push(i)
            }
        }
        obj[line] = data.sort()
        this.changeHandle(obj)
    }

    clickAllHandle = () => {
        const obj = []
        for (let i = 0; i < 7; i++) {
            const data = []
            for (let j = 0; j < 24; j++) {
                data.push(j)
            }
            obj.push(data)
        }
        this.changeHandle(obj)
    }

    clickWorkHandle = () => {
        const obj = []
        for (let i = 0; i < 5; i++) {
            const data = []
            for (let j = 0; j < 24; j++) {
                data.push(j)
            }
            obj.push(data)
        }
        for (let i = 5; i < 7; i++) {
            obj.push([])
        }
        this.changeHandle(obj)
    }

    clickWeekendHandle = () => {
        const obj = []
        for (let i = 0; i < 5; i++) {
            obj.push([])
        }
        for (let i = 5; i < 7; i++) {
            const data = []
            for (let j = 0; j < 24; j++) {
                data.push(j)
            }
            obj.push(data)
        }
        this.changeHandle(obj)
    }

    render() {
        return (
            <div className={`ant-input ${styles.body}`}>
                <div className={styles.header}>
                    <div className={styles.select}>
                        <div onClick={this.clickAllHandle}><a>全部时间</a></div>
                        <div onClick={this.clickWorkHandle}><a>工作日</a></div>
                        <div onClick={this.clickWeekendHandle}><a>周末</a></div>
                    </div>
                    <div className={styles.legend}>
                        <div className={styles.box + ' active'}></div>
                        <div className={styles.legendtext}>投放时间段</div>
                        <div className={styles.box}></div>
                        <div className={styles.legendtext}>暂停时间段</div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.line}>{this.getSelectline()}</div>
                    <div className={styles.line}>{this.getLine(0)}</div>
                    <div className={styles.line}>{this.getLine(1)}</div>
                    <div className={styles.line}>{this.getLine(2)}</div>
                    <div className={styles.line}>{this.getLine(3)}</div>
                    <div className={styles.line}>{this.getLine(4)}</div>
                    <div className={styles.line}>{this.getLine(5)}</div>
                    <div className={styles.line}>{this.getLine(6)}</div>
                </div>
            </div>
        )
    }
}