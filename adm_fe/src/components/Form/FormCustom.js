/**
 * @class 自定义组件，与Form数据双向绑定
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Object} config 双向绑定配置
 * @prop {String} initialValue 默认值
 * 
 * @method validate(value:String)
 * @param {String} value 当前输入框值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 */
import React from 'react'
import { Form } from 'antd'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        const {
            required,
            label,
            field = 'custom_' + + new Date() + '_' + Math.random(),
            extra,
            validate,
            config,
            children,
            initialValue = '',
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
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 41
                }}>
                    {React.Children.count(children) === 1 ? getFieldDecorator(field, {
                        rules: [{
                            validator: validateFieldData(validate)
                        }],
                        initialValue,
                        ...config
                    })(
                        children
                    ) : null}
                </div>
            </FormItem>
        )
    }
}