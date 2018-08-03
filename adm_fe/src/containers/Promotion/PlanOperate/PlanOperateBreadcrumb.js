/**
 * @class 面包屑
 */
import React from 'react'
import { Breadcrumb } from 'antd'

export default class extends React.Component {
    render() {
        const { className, toGroup, group, toPlan, text } = this.props
        return (
            <div className={className} style={{ width: '100%', backgroundColor: '#fff', padding: 24 }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="javascript:;" onClick={toGroup}>广告组列表</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="javascript:;" onClick={toPlan}>{group}</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{text}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        )
    }
}