/**
 * @class 上传并读取CSV
 * 
 * @prop {String} text 按钮文本
 * @prop {Number} max 文件大小限制
 * @prop {Number} size 上传文件列表限制总数量，默认为1，单文件为替换，多文件为叠加
 * @prop {Boolean} fileList 是否显示文件列表，删除文件可释放文件上传数量
 * @prop {Function} onChange 读取所有CSV后调用
 * @prop {Boolean} asyncClose 是否异步关闭loading
 * 
 * @method onChange(value:Array,name:Array,close:Function)
 * @param {Array|Boolean} value false：上传失败；value[]：一篇CSV数据
 * @param {Array} names 文件名列表
 * @param {Function|undefined} close asyncClose模式：关闭loading
 * @returns {Boolean} 自定义校验CSV数据；false：上传失败；
 * 
 * @example <FileCsv text="上传CSV" onChange={e=>console.log(e[0])} fileList size={1} />
 */
import React from 'react'
import styles from './FileCsv.less'
import { Upload, Button, Icon, message, Tag } from 'antd'
const CODE = 'gb2312'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            loading: false
        }
    }

    closeLoadingHandle = () => {
        this.setState({ loading: false })
    }

    changeHandle(e, names = []) {
        const { onChange, asyncClose } = this.props
        if (typeof onChange === 'function') {
            if (asyncClose) {
                return onChange(e, names, this.closeLoadingHandle)
            }
            this.closeLoadingHandle()
            return onChange(e, names, () => { })
        }
        this.closeLoadingHandle()
    }

    /**
     * @method uploadHandle 上传文件
     */
    uploadHandle = async (e, files) => {
        if (files.indexOf(e) !== 0) {
            return
        }
        this.setState({ loading: true })
        const size = +this.props.size | 0 || 1
        const cFiles = []
        const oFiles = [...this.state.files]
        for (let i = 0, l = files.length; i < l; i++) {
            const file = files[i]
            if (file.name.replace(/(.*\.)/g, '') === 'csv') {
                cFiles.push(file)
            }
        }
        if (!cFiles.length) {
            message.error('导入的文件格式错误')
            this.changeHandle(false)
            return
        }
        const nFiles = cFiles.filter(t => {
            if (this.props.max) {
                return t.size <= this.props.max * 1024 * 1024
            }
            return true
        })
        if (!nFiles.length) {
            message.error('导入的文件大小不能超过' + this.props.max + 'M')
            this.changeHandle(false)
            return
        }
        if (size > 1 && oFiles.length + nFiles.length > size) {
            message.error(`导入的文件总数量不能大于${size}个`)
            this.changeHandle(false)
            return
        }
        console.time('CSV')
        const arr = []
        for (let i = 0, l = nFiles.length; i < l; i++) {
            arr.push(await this.readCsv(nFiles[i]))
        }
        const filenames = nFiles.map(t => t.name)
        if (false === await this.changeHandle(arr, filenames)) {
            return
        }
        if (size > 1) {
            this.setState({ files: [...oFiles, ...filenames] })
        } else {
            this.setState({ files: filenames })
        }
        console.timeEnd('CSV')
    }

    /**
     * @method readCsv 读取CSV
     */
    readCsv = (file) => {
        return new Promise(resolve => {
            const fr = new FileReader()
            fr.onload = () => {
                var m = fr.result
                if (m) {
                    var lines = m.split(/\n|\r/)
                    var arr = []
                    for (var i = 0, l = lines.length; i < l; i++) {
                        const line = this.readCsvLine(lines[i])
                        if (line.some(t => t !== '')) {
                            arr.push(line)
                        }
                    }
                    resolve(arr)
                } else {
                    resolve([])
                }
            }
            fr.readAsText(file, CODE)
        })
    }

    /**
     * @method readCsvLine 解析csv一行数据
     */
    readCsvLine = (line) => {
        var arr = []
        function readBuf(value) {
            if (value === '') {
                return
            }
            if (value[0] === ',') {
                arr.push('')
                readBuf(value.slice(1))
                return
            }
            if (value[0] !== '"') {
                var cut = value.indexOf(',')
                if (cut !== -1) {
                    arr.push(value.slice(0, cut).trim())
                    readBuf(value.slice(cut + 1))
                    return
                }
                arr.push(value.trim())
                return
            }
            var buf = ''
            var flag = false
            for (var i = 1, l = value.length; i < l; i++) {
                var v = value[i]
                if (flag) {
                    if (v === ',') {
                        arr.push(buf.trim())
                        readBuf(value.slice(i + 1))
                        return
                    } else {
                        flag = false
                        buf += v
                    }
                } else {
                    if (v === '"') {
                        flag = true
                    } else {
                        buf += v
                    }
                }
            }
            arr.push(buf)
        }
        readBuf(line.trim())
        return arr
    }

    /**
     * @method closeHandle 删除文件
     */
    closeHandle = (index) => {
        const files = [...this.state.files]
        files.splice(index, 1)
        this.setState({ files })
    }

    render() {
        const { style, text, fileList, size } = this.props
        return (
            <div className={styles.body} style={style}>
                <Upload accept=".csv"
                    beforeUpload={this.uploadHandle}
                    customRequest={() => { }}
                    showUploadList={false}
                    multiple={size > 1}>
                    <Button style={{ marginRight: 12 }}>
                        {
                            this.state.loading ?
                                <Icon type="loading" /> :
                                <Icon type="upload" />
                        }
                        {text}
                    </Button>
                </Upload>
                {
                    fileList ? this.state.files.map((t, index) => {
                        return (
                            <div key={t + '_' + index} className={styles.file}>
                                <Tag closable
                                    onClose={e => this.closeHandle(index)}
                                >{t}</Tag>
                            </div>
                        )
                    }) : null
                }
            </div>
        )
    }
}