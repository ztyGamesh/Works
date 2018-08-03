/**
 * @class 带手柄的左右切换轮播
 */
import React from 'react'
import { Icon } from 'antd'
import styles from './CarouselHandleSingle.less'

export default class extends React.Component {
    constructor(props) {
        super(props)
        const { data = [], index = 0, render, itemKey, center } = props
        const all = data.length
        this.state = {
            render,
            itemKey,
            center,
            data,
            all,
            left: false,
            right: index < all - 1,
            index: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data = [], index, onChange } = nextProps
        const all = data.length
        if (typeof onChange === 'function') {
            //onChange和index配合使用（数据更新不自动返回第一页）
            this.setState({
                data,
                all,
                left: index > 0,
                right: index < all - 1,
                index
            })
        } else if (this.state.data !== data) {
            //数据更新自动返回第一页
            this.setState({
                data,
                all,
                index: 0,
                left: false,
                right: index < all - 1
            })
        }
    }

    leftHandle = () => {
        const { all, index } = this.state
        let newIndex = index - 1
        if (newIndex < 0) {
            newIndex = 0
        }
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(newIndex)
        } else {
            this.setState({
                left: newIndex > 0,
                right: newIndex < all - 1,
                index: newIndex
            })
        }
    }

    rightHandle = () => {
        const { all, index } = this.state
        let newIndex = index + 1
        if (newIndex >= all) {
            newIndex = index
        }
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(newIndex)
        } else {
            this.setState({
                left: newIndex > 0,
                right: newIndex < all - 1,
                index: newIndex
            })
        }
    }

    render() {
        const { left, right, index, itemKey, data, render, center = true } = this.state
        return (
            <div className={styles.body} style={{
                justifyContent: center ? 'center' : 'flex-start'
            }}>
                <div style={{
                    visibility: left ? 'visible' : 'hidden'
                }} className={styles.btn} onClick={this.leftHandle}>
                    <Icon type="left" />
                </div>
                <div className={styles.main} style={{
                    width: '100%'
                }}>
                    <div className={styles.view}>
                        <div className={styles.content} style={{
                            transition: '300ms',
                            transform: `translateX(-${index}00%)`
                        }}>
                            {
                                data.map((item, key) => (
                                    <div className={styles.item} key={item[itemKey] || key} style={{ width: '100%' }}>
                                        {
                                            typeof render === 'function' ? render(item) : null
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div style={{
                    visibility: right ? 'visible' : 'hidden'
                }} className={styles.btn} onClick={this.rightHandle}>
                    <Icon type="right" />
                </div>
            </div>
        )
    }
}