/**
 * @class 分割线
 * 
 * @prop {Boolean} dot 点
 * @prop {String} title 标题
 * @prop {String} subTitle 副标题
 */
import React from 'react'
import { Divider } from 'antd'

export default class extends React.Component {
    render() {
        const { title, subTitle, dot } = this.props
        return title || subTitle ? (
            <div style={{ padding: '0 24px 24px' }}>
                <Divider>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: '1' }}>
                        {dot ? <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1890ff' }}></div> : null}
                        {title ? <div style={{ padding: '0 6px', fontWeight: 'normal', color: '#1890ff', fontSize: 14 }}>{title}</div> : null}
                        {subTitle ? <div style={{ padding: '0 6px', color: '#c2c2c2', fontSize: 10 }}>{subTitle}</div> : null}
                    </div>
                </Divider>
            </div>
        ) : null

    }
}