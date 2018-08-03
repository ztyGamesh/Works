/**
 * @class Form列表
 * 
 * @prop {Function} onSubmit 点击提交数据时调用
 * @prop {Object} initData 初始化数据，约定：初始化之前设置为null
 * @prop {Object} view 页面存储信息
 * 
 * @method onSubmit(values:Promise|Boolean)
 * @param {Promise|false} values 校验错误时返回false，校验通过为当前表单数据
 */
import React from 'react'
import { Form } from 'antd'

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isInit: false
        }
    }

    componentDidMount() {
        this.initFormData(this.props.initData)
    }

    componentWillReceiveProps(nextProps) {
        this.initFormData(nextProps.initData)
    }

    initFormData = async (data) => {
        if (!this.state.isInit && data !== null) {
            setTimeout(() => {
                this.props.form.setFieldsValue(data)
                this.setState({ isInit: true })
            }, 0)
        }
    }


    submitHandle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const { onSubmit, form } = this.props
        if (typeof onSubmit === 'function') {
            onSubmit(new Promise((resolve, reject) =>
                form.validateFieldsAndScroll(null, { first: true, force: true }, (errors, values) => {
                    if (errors === null) {
                        resolve(values)
                    } else {
                        this.focusHandle(errors)
                        resolve(false)
                    }
                })
            ))
        }
    }

    /**
     * @method focusHandle 聚焦
     */
    focusHandle = async (errors = {}, parentFields = '') => {
        if (Object.keys(errors).length === 0) {
            return
        }
        const field = Object.keys(errors)[0]
        const obj = errors[field]
        if (obj && obj.errors) {
            const ref = this.state[parentFields + field]
            if (ref && typeof ref.focus === 'function') {
                setTimeout(() => {
                    ref.focus()
                }, 0)
            }
        } else {
            this.focusHandle(obj, parentFields + field + '.')
        }
    }

    /**
     * @method addRefsHandle 保存dom节点，用于错误时聚焦
     */
    addRefsHandle = (field, ref) => {
        const obj = {}
        obj[field] = ref
        this.setState(obj)
    }

    render() {
        const { className, style, children, form, view } = this.props
        return (
            <div className={className} style={style}>
                <Form onSubmit={this.submitHandle}>
                    {
                        React.Children.map(children, (child, index) => {
                            if (!child) {
                                return null
                            }
                            if (typeof child.type === 'string') {
                                return child
                            }
                            return (
                                <div style={{ width: '100%' }}>
                                    {
                                        React.cloneElement(child, {
                                            form,
                                            addRef: this.addRefsHandle,
                                            view
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </Form>
            </div>
        )
    }
}