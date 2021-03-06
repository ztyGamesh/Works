/**
 * @class 上传视频框
 * @prop {Boolean} required label是否带星号
 * @prop {String} label 签名
 * @prop {String} field 字段
 * @prop {String} placeholder placeholder
 * @prop {Function} validate 输入校验
 * @prop {String} extra 提示
 * @prop {Function} onChange change事件
 * @prop {Object} standard 视频标准
 * 
 * @method validate(value:String)
 * @param {String} value 上传视频后视频地址
 * @returns 当校验错误时返回提示的内容，当校验通过时返回值为：[true, undefined, '']
 * 
 * @description standard
 * @prop {Array} format 视频后缀
 * @prop {Number} size 视频大小
 * @prop {Number} width 视频宽度
 * @prop {Number} height 视频高度 width、height必须同时设置
 * @prop {String} scale 视频比例 @example `${width}:${height}`
 * 
 * @example <FormUploadVideo field="img" label placeholder="上传视频"/>
 */
import React from 'react'
import styles from './FormUploadVideo.less'
import { Form, Input, Upload, Icon, message } from 'antd'
import { validateFieldData, extraStyle, readStyle } from './FormUtil'
const FormItem = Form.Item
const Dragger = Upload.Dragger

import { BUSINESSAPIHOST } from '../../common/env'
import request from '../../utils/request'
const UPLOAD_URL = `${BUSINESSAPIHOST}/materiel/uploadfile`
const READ_URL = '//static.adm.deepleaper.com/material/'
const UPLOAD_KEY = 'file_data'

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
            full,
            standard = {}
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
                    <ImgUpload disabled={disabled} onChange={onChange} standard={standard} text={placeholder} />
                )}
            </FormItem>
        )
    }
}

class ImgUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            fileName: ''
        }
    }

    uploadHandle = async (file, files) => {
        if (files.indexOf(file) !== 0) {
            return
        }
        const { format = [], size = 0, scale = '', width = 0, height = 0 } = this.props.standard
        const suffix = file.name.replace(/(.*\.)/g, '')
        const fileSize = file.size
        if (!/video\/.*/.test(file.type)) {
            message.error('视频上传失败：视频格式错误')
            return
        }
        if (format.length && !format.includes(suffix)) {
            message.error('视频上传失败：视频格式错误')
            return
        }
        if (size && fileSize > size) {
            message.error('视频上传失败：上传视频太大')
            return
        }
        this.setState({ loading: true })
        const req = new FormData()
        req.append(UPLOAD_KEY, file)
        const res = await request({
            url: UPLOAD_URL,
            method: 'post',
            data: req
        })
        this.setState({ loading: false })
        if (res && res.status === 1) {
            const { data = {} } = res
            if (width && height) {
                if (!(width > data.width && height > data.height)) {
                    message.error('视频上传失败：视频尺寸不符合规范')
                    return
                }
            }
            if (scale) {
                const [w = 1, h = 1] = scale.split(':')
                if (data.width * h !== data.height * w) {
                    message.error('视频上传失败：视频比例不符合规范')
                    return
                }
            }
            if (typeof this.props.onChange === 'function') {
                this.props.onChange(data.name, {
                    name: data.name,
                    prefix: READ_URL,
                    suffix,
                    width: data.width,
                    height: data.height,
                    size: fileSize
                })
                this.setState({ fileName: file.name })
            }
        } else {
            message.error(res && res.msg || '服务器异常')
        }
    }

    render() {
        const { value, text, disabled } = this.props
        return (
            <Dragger disabled={disabled} accept="video/*" showUploadList={false}
                beforeUpload={this.uploadHandle}
                customRequest={() => { }}>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <div>
                            {
                                this.state.loading ?
                                    <Icon className={styles.before} type="loading" /> :
                                    value ?
                                        <video className={styles.video} controls="controls">
                                            <source src={READ_URL + value} />
                                        </video> :
                                        <Icon className={styles.before} type="plus" />
                            }
                        </div>
                    </div>
                    <div>{value ? this.state.fileName : text}</div>
                </div>
            </Dragger>
        )
    }
}