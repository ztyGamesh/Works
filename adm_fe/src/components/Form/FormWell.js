/**
 * @class 表单分块
 * 
 * @prop {Boolean} dot 点
 * @prop {String} title 标题
 * @prop {String} subTitle 副标题
 * 
 * @ignore
 * @prop {Boolean} modal
 */
import React from 'react'
import { DividerBase } from '../Divider'

export default class extends React.Component {
    render() {
        const { className, children, title, subTitle, dot, form, addRef, space = 24, modal, view } = this.props
        const nstyle = modal ? {
            marginBottom: 0,
            padding: space === undefined ? '24px 24px 0' : space,
            maxHeight: '60vh',
            overflow: 'auto'
        } : {}
        return (
            <div style={{
                width: '100%',
                background: '#fff',
                textAlign: 'center',
                marginBottom: 24,
                padding: space,
                ...nstyle
            }}>
                <DividerBase dot={dot} title={title} subTitle={subTitle} />
                <div className={className}>
                    {
                        React.Children.map(children, (child, index) => {
                            if (!child) {
                                return null
                            }
                            if (typeof child.type === 'string') {
                                return child
                            }
                            return React.cloneElement(child, { form, addRef, view })
                        })
                    }
                </div>
            </div>
        )
    }
}
