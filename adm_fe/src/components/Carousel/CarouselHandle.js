/**
 * @class 带手柄的左右切换轮播
 */
import React from 'react'
import { Icon } from 'antd'
import styles from './CarouselHandle.less'

export default class extends React.Component {
    constructor(props) {
        super(props)
        const { data = [], size = 1, render, itemKey, center } = props
        const all = data.length
        this.state = {
            width: props.width,
            render,
            size,
            showSize: size,
            itemKey,
            center,
            data,
            all,
            left: false,
            right: all > size,
            index: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data = [], index, onChange } = nextProps
        const { showSize } = this.state
        const all = data.length
        if (typeof onChange === 'function') {
            //onChange和index配合使用（数据更新不自动返回第一页）
            this.setState({
                data,
                all,
                left: index > 0,
                right: index + showSize < all,
                index: index
            })
        } else if (this.state.data !== data) {
            //数据更新自动返回第一页
            this.setState({
                data,
                all,
                index: 0,
                left: false,
                right: showSize < all
            })
        }
    }

    leftHandle = () => {
        const { width, all, index } = this.state
        const bodyWidth = this.refs.body.getBoundingClientRect().width
        const showSize = bodyWidth / width | 0 || 1
        let newIndex = index - showSize
        if (newIndex < 0) {
            newIndex = 0
        }
        if (typeof this.props.onChange === 'function') {
            this.setState({
                showSize
            }, () => {
                this.props.onChange(newIndex)
            })
        } else {
            this.setState({
                showSize,
                left: newIndex > 0,
                right: newIndex + showSize < all,
                index: newIndex
            })
        }
    }

    rightHandle = () => {
        const { width, all, index } = this.state
        const bodyWidth = this.refs.body.getBoundingClientRect().width
        const showSize = bodyWidth / width | 0 || 1
        let newIndex = index + showSize
        if (newIndex >= all) {
            newIndex = index
        }
        if (typeof this.props.onChange === 'function') {
            this.setState({
                showSize
            }, () => {
                this.props.onChange(newIndex)
            })
        } else {
            this.setState({
                showSize,
                left: newIndex > 0,
                right: newIndex + showSize < all,
                index: newIndex
            })
        }
    }

    componentWillMount() {
        window.addEventListener('resize', this.resizeHandle)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandle)
    }

    resizeHandle = () => {
        const { width, all, size, index } = this.state
        const bodyWidth = this.refs.body.getBoundingClientRect().width
        const distance = all - index
        if (size < distance) {
            this.setState({ right: true })
        } else {
            this.setState({ right: width * distance > bodyWidth })
        }
    }

    render() {
        const { width, size, left, right, index, itemKey, data, render, center = true } = this.state
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
                    width: width * size + 48
                }}>
                    <div className={styles.view} ref="body">
                        <div className={styles.content} style={{
                            transition: '300ms',
                            transform: `translateX(-${width * index}px)`
                        }}>
                            {
                                data.map((item, key) => (
                                    <div className={styles.item} key={item[itemKey] || key} style={{ width }}>
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