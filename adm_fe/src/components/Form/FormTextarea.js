/**
 * @class 文本框
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Function} onChange change事件
 * @prop {String} initialValue 默认值
 * @prop {Number} size 框高度（显示的行数），默认为4
 * @prop {Number} max 最多输入的行数
 * @prop {Array} selectData 启用选择器输入，选择器选项，@description selectData[]:{value:String,label:String,distance:Number}
 * @prop {String} selectText 选择器名称
 * @prop {Array} list 插入数据 @description list[]:{type:'button',label:String,config:{value: String,distance:Number}}/{type:'select',label:String,config:[{label:String,value: String,distance:Number},...]}
 * @prop {Boolean} only 只能插入一个数据
 * @prop {Boolean} insertOnly 只能插入，不可手动数据
 * @prop {Boolean} line list选择器与输入框同行
 * @prop {Boolean} count 启用左侧计数器
 * @prop {String} countTag 标签
 * @prop {Array} tags 带标签的行（0为第一行）
 * 
 * @method validate(value:String)
 * @param {String} value 当前输入框值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 */
import React from 'react'
import { Form, Input, Dropdown, Menu, Button } from 'antd'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item
const TextArea = Input.TextArea

export default class extends React.Component {
    componentDidMount() {
        const { field, addRef } = this.props
        addRef(field, this.refNode)
    }

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
            initialValue = '',
            size = 4,
            max,
            selectData,
            selectText,
            list,
            only,
            insertOnly,
            line,
            count,
            countTag,
            tags = [],
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
                    <Text disabled={disabled}
                        ref={ref => this.refNode = ref}
                        placeholder={placeholder}
                        onChange={onChange}
                        max={max}
                        selectText={selectText}
                        selectData={selectData}
                        size={size}
                        list={list}
                        only={only}
                        insertOnly={insertOnly}
                        line={line}
                        count={count}
                        countTag={countTag}
                        tags={tags} />
                )}
            </FormItem>
        )
    }
}

const defaultTop = 5
class Text extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //选择器容器位置，随textarea滚动变化
            top: -defaultTop,
            //选择器位置
            loc: 1,
            //光标位置
            into: 0
        }
    }

    componentDidMount() {
        const { ref } = this.props
        if (typeof ref === 'function') {
            ref(this.refNode)
        }
    }

    changeHandle = (e) => {
        const { onChange, max } = this.props
        let value = e.target.value
        const items = value.split('\n')
        if (max) {
            if (items.length > max) {
                value = items.slice(0, max).join('\n')
            }
        }
        if (typeof onChange === 'function') {
            onChange(value)
        }
    }

    inputHandle = async (v = '', distance = 0) => {
        const { disabled, onChange, value, only } = this.props
        if (disabled) {
            return
        }
        const index = this.state.into
        const newInto = (only ? 0 : index) + v.length + distance
        if (typeof onChange === 'function') {
            await onChange(only ? v : value.slice(0, index) + v + value.slice(index))
        }
        const _this = this.refNode.textAreaRef
        if (this.refNode) {
            this.refNode.focus()
            _this.selectionStart = newInto
            _this.selectionEnd = newInto
        }
    }

    selectHandle = (e) => {
        if (!(this.props.selectData || this.props.list)) {
            return
        }
        const _this = e.target
        const value = _this.value
        const into = _this.selectionEnd
        const loc = value.slice(0, into).split('\n').length || 1
        this.setState({ into, loc })
    }

    scrollHandle = (e) => {
        const _this = e.target
        const tScrollTop = _this.scrollTop
        if (this.props.count && this.refs.count) {
            this.refs.count.scrollTop = tScrollTop
        }
        if (this.props.selectData) {
            this.setState({
                top: -tScrollTop - defaultTop
            })
        }
    }

    renderCount = (tag, tags) => {
        const { value = '' } = this.props
        const num = value.split('\n').length || 1
        const comps = []
        for (let i = 0; i < num; i++) {
            comps.push(
                <div key={i} style={{ position: 'relative' }}>
                    <div style={{ paddingRight: 16 }}>{i + 1}</div>
                    {
                        tag && tags.includes(i) ? <div style={{
                            position: 'absolute',
                            height: '100%',
                            top: 0,
                            right: 0,
                        }}>
                            <div style={{
                                color: 'green',
                                fontSize: 14,
                                lineHeight: '21px',
                                fontWeight: '800',
                                userSelect: 'none'
                            }}>{tag}</div>
                        </div> : null
                    }
                </div>)
        }
        return comps
    }

    render() {
        const { disabled, placeholder, size, value, selectData, selectText, list, insertOnly, line, count, countTag, tags } = this.props
        const pStyle = line ? {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        } : {
                marginTop: size == 1 ? -3 : 0
            }
        const sStyle = line ? {
            flexShrink: 1,
            position: 'relative',
            left: 12
        } : {
                width: 'calc(100% + 12px)',
                paddingTop: 6
            }
        return (
            <div style={{
                padding: size == 1 ? 0 : '6px 0',
                overflow: 'hidden',
                ...pStyle
            }}>
                {
                    selectData ? <div style={{
                        width: '100%',
                        height: 0,
                        position: 'relative',
                        zIndex: 1,
                        top: this.state.top
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: 6,
                            top: 21 * (this.state.loc - 1)
                        }}>
                            <Dropdown disabled={disabled}
                                trigger={['click']}
                                overlay={<Menu style={{ maxHeight: 320, overflow: 'auto' }}>
                                    {
                                        selectData.map(t => {
                                            return <Menu.Item key={t.value}>
                                                <a onClick={e => this.inputHandle(t.value, t.distance)}>{t.label}</a>
                                            </Menu.Item>
                                        })
                                    }
                                </Menu>}>
                                <Button>{selectText}</Button>
                            </Dropdown>
                        </div>
                    </div> : null
                }
                {
                    count ? <div style={{
                        width: '100%',
                        height: 0,
                        position: 'relative',
                        zIndex: 1,
                        top: 1
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: 1,
                            top: 0,
                            height: 21 * size + 8,
                            width: 52,
                            borderRadius: '4px 0 0 4px',
                            backgroundColor: '#f6f6f6',
                            padding: '4px 0'
                        }}>
                            <div ref="count" style={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                lineHeight: '21px',
                                textAlign: 'right'
                            }}>
                                {this.renderCount(countTag, tags)}
                            </div>
                        </div>
                    </div> : null
                }
                <TextArea disabled={insertOnly || disabled}
                    value={value}
                    ref={ref => this.refNode = ref}
                    placeholder={placeholder}
                    onChange={this.changeHandle}
                    autosize={{ minRows: size, maxRows: size }}
                    onSelect={this.selectHandle}
                    onScroll={this.scrollHandle}
                    style={{
                        paddingLeft: count ? 63 : 11,
                        //计数、填词时不允许换行（没键入换行符情况）
                        whiteSpace: count || selectData ? 'nowrap' : undefined
                    }} />
                {
                    list ?
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            ...sStyle
                        }}>
                            {
                                list.map((t, index) => {
                                    const { type, label, config = {} } = t
                                    if (type === 'button') {
                                        return <div style={{ marginRight: 12 }} key={index}>
                                            <Button disabled={disabled} onClick={e => this.inputHandle(config.value, config.distance)}>{label}</Button>
                                        </div>
                                    }
                                    if (type === 'select') {
                                        return <div style={{ marginRight: 12 }} key={index}>
                                            <Dropdown disabled={disabled}
                                                trigger={['click']}
                                                overlay={<Menu style={{ maxHeight: 320, overflow: 'auto' }}>
                                                    {
                                                        config.map(t => {
                                                            return <Menu.Item key={t.value}>
                                                                <a onClick={e => this.inputHandle(t.value, t.distance)}>{t.label}</a>
                                                            </Menu.Item>
                                                        })
                                                    }
                                                </Menu>}>
                                                <Button>{label}</Button>
                                            </Dropdown>
                                        </div>
                                    }
                                    return null
                                })
                            }
                        </div>
                        : null
                }
            </div>
        )
    }
}