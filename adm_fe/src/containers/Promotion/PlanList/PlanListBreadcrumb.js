/**
 * @class 面包屑
 */
import React from 'react'
import { Breadcrumb } from 'antd'

export default class extends React.Component {
    render() {
        const { className, toGroup, text, view = {} } = this.props
        const { gid } = view
        // 总广告计划列表，不显示
        if (gid === '') {
            return null
        }
        return (
            <div className={className} style={{ width: '100%', backgroundColor: '#fff', padding: 24 }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="javascript:;" onClick={toGroup}>广告组列表</a>
                    </Breadcrumb.Item>
                    {text ? <Breadcrumb.Item>{text}</Breadcrumb.Item> : null}
                </Breadcrumb>
            </div>
        )
    }
}