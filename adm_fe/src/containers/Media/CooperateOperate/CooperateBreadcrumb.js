/**
 * @class 面包屑
 */
import React from 'react'
import { Breadcrumb } from 'antd'

export default class extends React.Component {
    render() {
        const { className, onCancel, text } = this.props
        return (
            <div className={className} style={{ width: '100%', backgroundColor: '#fff', padding: 24 }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="javascript:;" onClick={onCancel}>内容合作</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{text}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        )
    }
}