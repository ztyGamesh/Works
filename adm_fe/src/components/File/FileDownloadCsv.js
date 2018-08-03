/**
 * @class 下载CSV文件
 * @description 服务器生成，实现大量数据下载
 * 
 * @prop {Array} data 数据，data[]:Array，一行数据，data[][]:String，单元格，约定：数据更新前设置null
 * @prop {String} text 按钮文本
 * @prop {String} file 文件名称，默认：“download”
 * 
 * @api
 * @method receivePath 获取下载链接
 * @param {String} file 文件名称，默认：“download”
 * @param {Array} data 数据
 * @returns {String|Boolean} 下载地址，false：获取失败
 */
import React from 'react'
import { receiveCsvPath } from './'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isInit: false,
            href: 'javascript:;'
        }
    }

    componentWillMount() {
        if (this.props.data !== null) {
            this.createText(this.props.data)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isInit) {
            return
        }
        if (nextProps.data !== null) {
            this.createText(nextProps.data)
        }
    }

    createText = async (data = []) => {
        await this.setState({ isInit: true })
        const { file = 'download' } = this.props
        const href = await receiveCsvPath(file + '.csv', data)
        if (href !== false) {
            this.setState({ href })
        }
    }

    render() {
        const { text } = this.props
        return (
            <a target="_blank" href={this.state.href}>{text}</a>
        )
    }

    static receivePath = (file = 'download', data = []) => {
        return receiveCsvPath(file + '.csv', data)
    }
}