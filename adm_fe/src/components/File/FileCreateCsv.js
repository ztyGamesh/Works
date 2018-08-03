/**
 * @class 生成CSV文件
 * @description 小量数据，前端可直接，无法支持大量数据
 * 
 * @prop {Array} data 数据，data[]:Array，一行数据，data[][]:String，单元格
 * @prop {String} text 按钮文本
 * @prop {String} file 文件名称，默认：“download”
 */
import React from 'react'
const CODE = 'gb2312'
const BOM = '\ufeff'

export default class extends React.Component {
    createText = () => {
        const { data = [] } = this.props
        const str = data.map((item = []) => {
            return item.map(t => {
                let s = ''
                let flag = false
                for (let i = 0, l = t.length; i < l; i++) {
                    const v = t[i]
                    if (v === ',') {
                        flag = true
                    } else if (v === '"') {
                        s += '"'
                        flag = true
                    }
                    s += v
                }
                return flag ? `"${s}"` : s
            }).join(',')
        }).join('\n')
        return `data:text/csv;charset=${CODE},${BOM}${str}`.trim()
    }

    render() {
        const { text, file = 'download' } = this.props
        return (
            <a download={file + '.csv'} href={this.createText()}>{text}</a>
        )
    }
}