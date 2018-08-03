/**
 * @class 面包屑
 */
import React from 'react'
import { Breadcrumb } from 'antd'

export default class extends React.Component {
    render() {
        const { className, toGroup, group, toPlan, text, view = {} } = this.props
        const { pid } = view
        // 总广告创意列表，不显示
        if (pid === '') {
            return null
        }
        return (
            <div className={className} style={{ width: '100%', backgroundColor: '#fff', padding: 24 }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="javascript:;" onClick={toGroup}>广告组列表</a>
                    </Breadcrumb.Item>
                    {text ?
                        <Breadcrumb.Item>
                            <a href="javascript:;" onClick={toPlan}>{group}</a>
                        </Breadcrumb.Item> : null}
                    {text ? <Breadcrumb.Item>{text}</Breadcrumb.Item> : null}
                </Breadcrumb>
            </div>
        )
    }
}