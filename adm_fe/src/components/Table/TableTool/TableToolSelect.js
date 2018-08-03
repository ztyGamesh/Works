/**
 * @class 单元格 下拉选项
 * 
 * @prop {Object} row 当前行数据
 * @prop {String} value 当前值
 * @prop {Array} config 选项配置
 * @prop {Object} config[] {label:String,text:String}
 * @prop {Function} onClick 编辑，完成并刷新表格
 * 
 * @method onClick
 * @param {String} value 编辑框值
 * @param {Object} row 当前行数据
 */
import React from 'react'
import { Menu, Dropdown, Button, Icon } from 'antd'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value || ''
        }
    }

    clickHandle = async (e) => {
        const value = e.key
        if (value === this.props.value) {
            return
        }
        this.setState({ value })
        const { row, onClick, onUpdate } = this.props
        if (typeof onClick === 'function') {
            await onClick(value, row)
        }
        if (typeof onUpdate === 'function') {
            await onUpdate()
        }
    }

    render() {
        const { checkedKeys, checkedRows, onUpdate, config } = this.props
        const selectedObj = config.find(t => t.value == this.state.value)
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Dropdown overlay={
                    <Menu style={{
                        textAlign: 'center'
                    }} onClick={this.clickHandle}>
                        {
                            config.map(t => {
                                const { value, text } = t
                                return <Menu.Item key={value}>{text}</Menu.Item>
                            })
                        }
                    </Menu>
                }>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Button>
                            {selectedObj && selectedObj.text || ''}
                            <Icon type="down" />
                        </Button>
                    </div>
                </Dropdown>
            </div>
        )
    }
}