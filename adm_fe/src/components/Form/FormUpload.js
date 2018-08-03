/**
 * @class 上传
 * @prop {Boolean} disabled 是否禁用
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} action 上传地址
 * @prop {String} accept 上传文件类型
 * @prop {Boolean} multiple 是否允许上传多个文件

 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Function} onChange change事件
 *
 * @method validate(value:String)
 * @param {String} value 当前输入框值
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 */
import React from 'react'
import {Form, Upload, Icon, message} from 'antd';
const Dragger = Upload.Dragger;
import {validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item

export default class extends React.Component {
    componentDidMount() {
        const {field, addRef} = this.props
        addRef(field, this.refNode)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {
            name = '',
            multiple,
            action = '',
            disabled,
            required,
            label,
            field,
            placeholder = '',
            extra,
            validate,
            onChange,
            // onRemove,
            initialValue = '',
            accept = '',
            defaultFileList=[],
            fileList=[],
            full
        } = this.props
        const itemProps = {
            required,
            multiple,
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
                    <Dragger disabled={disabled}
                             ref={ref => this.refNode = ref}
                        // autoComplete="off"
                             onChange={onChange}
                             placeholder={placeholder}
                             action={action}
                             accept={accept}
                             name={name}  //原因
                             withCredentials={true} //原因
                             defaultFileList={defaultFileList}
                             fileList={fileList}
                             onRemove={true}
                    >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox"/>
                        </p>
                        <p className="ant-upload-text">拖拽文件或单击选择上传</p>
                        {/*<p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>*/}
                    </Dragger>
                )}
            </FormItem>
        )
    }
}