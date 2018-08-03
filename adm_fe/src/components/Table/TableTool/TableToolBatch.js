/**
 * @description 批量操作组件
 */
import React from 'react'
import { Menu, Dropdown, Button, Icon } from 'antd'
import Confirm from '../../Confirm'
import { ArouseModal } from './TableToolModal'
import styles from './style.less'

/**
 * @class 组
 */
export default class extends React.Component {
    render() {
        const { checkedKeys, checkedRows, onUpdate, full } = this.props
        return (
            <div style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                {
                    React.Children.map(this.props.children, (child, index) => (
                        <div key={index} style={{
                            padding: '0 3px',
                            flexShrink: 0,
                            ...(full === index ? {
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }: {})
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
 * @prop {Boolean} clickNoChecked 没有选择数据时是否跳过二次确认，默认为true，@description 批量操作时，无选择校验由onClick完成
 * @default refresh=true 自动刷新表格
 */
export class BatchLink extends React.Component {
    render() {
        const { checkedKeys, checkedRows, onUpdate, onClick, text, confirm, modal, clickNoChecked = true } = this.props
        return (
            <ArouseModal refresh
                clickNoChecked={clickNoChecked}
                checkedKeys={checkedKeys}
                checkedRows={checkedRows}
                onUpdate={onUpdate}
                onClick={onClick}
                confirm={confirm}
                modal={modal}
                text={
                    <div style={{ padding: '6px 12px' }}>
                        <a>{text}</a>
                    </div>
                } />
        )
    }
}

/**
 * @class 下拉框组件
 */
export class BatchSelect extends React.Component {
    render() {
        const { checkedKeys, checkedRows, onUpdate, text, children } = this.props
        return (
            <Dropdown trigger={["click"]} overlay={
                <Menu style={{maxHeight:'300px',overflow:'scroll'}}>
                    {
                        React.Children.map(children, child => (
                            <Menu.Item>
                                {
                                    child && React.cloneElement(child, { checkedKeys, checkedRows, onUpdate })
                                }
                            </Menu.Item>
                        ))
                    }
                </Menu>
            }>
                <Button>
                    {text}
                    <Icon type="down" />
                </Button>
            </Dropdown>
        )
    }
}

/**
 * @class 下拉框子组件
 * 
 * @see ArouseModal
 * @default refresh=true 自动刷新表格
 */
export class BatchOption extends React.Component {
    render() {
        const { checkedKeys, checkedRows, onUpdate, onClick, text, confirm, modal } = this.props
        return (
            <ArouseModal refresh
                text={text}
                checkedKeys={checkedKeys}
                checkedRows={checkedRows}
                onUpdate={onUpdate}
                onClick={onClick}
                confirm={confirm}
                modal={modal} />
        )
    }
}

export class BatchA extends React.Component {
    render() {
        const { href, text } = this.props;
        return (
            <a href={href}>
                {text}
            </a>
        )
    }
}

export class BatchDown extends React.Component {
    render() {
        const { href, text ,disabled} = this.props;
        return (
        <input
            className={ disabled == "" ? styles.input_button : styles.input_button_false}
            type="button"
            disabled={disabled}
            value={text}
            onClick={()=>{
                window.location.href = href;
            }}
        />
        )
    }
}
