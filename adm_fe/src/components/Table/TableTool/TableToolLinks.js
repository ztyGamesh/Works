/**
 * @description 链接组件
 */
import React from 'react'
import { Tooltip } from 'antd'
import styles from './style.less'
import { ArouseModal } from './TableToolModal'

export default class extends React.Component {
    render() {
        const { checkedKeys, checkedRows, onUpdate } = this.props
        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {
                    React.Children.map(this.props.children, (child, index) => (
                        <div key={index} style={{
                            padding: '2px 3px'
                        }}>
                            {
                                //空值处理
                                !child ? null :
                                    //原生组件
                                    typeof child.type === 'string' ? child :
                                        //react组件
                                        React.cloneElement(child, { checkedKeys, checkedRows, onUpdate })
                            }
                        </div>
                    ))
                }
            </div>
        )
    }
}

/**
 * @class 链接组件
 * 
 * @see ArouseModal
 * @prop {String} title 提示
 * @default refresh=false 不自动刷新表格
 */
export class Link extends React.Component {
    render() {
        const { checkedKeys, checkedRows, onUpdate, onClick, title, text, confirm, modal } = this.props
        const comp = typeof text === 'string' ? <a>{text}</a> : text
        return (
            <ArouseModal isCellData
                checkedKeys={checkedKeys}
                checkedRows={checkedRows}
                onUpdate={onUpdate}
                onClick={onClick}
                confirm={confirm}
                modal={modal}
                title={title}
                text={comp} />
        )
    }
}

/**
 * @class 列表页-操作-查看
 * 
 * @description 待UI优化，仅文本相同不可重用
 * 
 * @see Link
 */
export class LinkShow extends React.Component {
    render() {
        return (
            <Link {...this.props} text={'查看'} />
        )
    }
}

/**
 * @class 列表页-操作-编辑
 * 
 * @description 待UI优化，仅文本相同不可重用
 * 
 * @see Link
 */
export class LinkEdit extends React.Component {
    render() {
        return (
            <Link {...this.props} text={'编辑'} />
        )
    }
}

/**
 * @class 列表页-操作-添加
 * 
 * @description 待UI优化，仅文本相同不可重用
 * 
 * @see Link
 */
export class LinkAdd extends React.Component {
    render() {
        return (
            <Link {...this.props} text={'添加'} />
        )
    }
}

export class LinkAttached extends React.Component {
    render() {
        const { title, onClick } = this.props
        return (
            <Tooltip title={title}>
                <a onClick={onClick}>关联</a>
            </Tooltip>
        )
    }
}

/**
 * @class 列表页-操作-关联pid
 *
 * @description 待UI优化，仅文本相同不可重用
 *
 * @see Link
 */
export class LinkPid extends React.Component {
    render() {
        const { text } = this.props
        return (
            <Link {...this.props} text={text} />
        )
    }
}
