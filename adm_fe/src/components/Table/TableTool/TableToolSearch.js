/**
 * @class 搜索框组件
 */
import React from 'react'
import styles from './style.less'
import { Input } from 'antd'
const Search = Input.Search

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = { ...props }
    }

    changeHandle = (e) => {
        const { onChange } = this.state
        if (typeof onChange === 'function') {
            onChange(e.target.value)
        }
    }

    render() {
        const { label, onSearch } = this.state
        return (
            <div style={{ width: 210 }}>
                <Search
                    placeholder={label}
                    onChange={this.changeHandle}
                    onSearch={onSearch}
                    enterButton
                    onPressEnter={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (typeof onSearch === 'function') {
                            onSearch(e.target.value)
                        }
                    }}
                />
            </div>
        )
    }
}
