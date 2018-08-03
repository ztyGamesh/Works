/**
 * @class 审核状态
 */
import React from 'react'
import { Icon, Tooltip } from 'antd'

export default class extends React.Component {
    getStatus = (value) => {
        switch (value) {
            case 'audit':
                return '审核中'
                break;
            case 'reject':
                return '审核拒绝'
                break
            case 'pass':
                return '审核通过'
                break
            case 'wait':
                return '待审核'
                break
            default:
                return '-'
                break
        }
    }

    render() {
        const { value, comment } = this.props
        const status = this.getStatus(value)
        const title = comment || comment === 0 ? comment : '获取审核拒绝原因失败'
        const style = { width: 90, textAlign: 'center' }
        if ('reject' === value) {
            return <div style={style}>
                <Tooltip title={title}>
                    <Icon type="info-circle-o" style={{ marginRight: 3, cursor: 'pointer' }} />
                </Tooltip>
                {status}
            </div>
        }
        return <div style={style}>{status}</div>

    }
}