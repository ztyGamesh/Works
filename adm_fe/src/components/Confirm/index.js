/**
 * @class confirm组件
 * 
 * @prop {Function} onClick
 * 
 * @method onClick(confirm)
 * @param {Function} confirm
 * 
 * @method confirm 唤起对话框
 * @returns {Boolean} Promise
 */
import React from 'react'
import { Popconfirm } from 'antd'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      title: '',
      confirmHandle: null
    }
  }

  clickHandle = () => {
    const { onClick } = this.props
    if (typeof onClick === 'function') {
      onClick((title) => {
        return new Promise(resolve => {
          this.setState({
            show: true,
            title,
            confirmHandle: resolve
          })
        })
      })
    }
  }

  changeShowHandle = (show) => {
    if (!show) {
      this.setState({ show: false })
    }
  }

  confirmHandle = () => {
    typeof this.state.confirmHandle === 'function' && this.state.confirmHandle(true)
  }

  cancelHandle = () => {
    typeof this.state.confirmHandle === 'function' && this.state.confirmHandle(false)
  }

  render() {
    return (
      <Popconfirm title={this.state.title}
        visible={this.state.show}
        onVisibleChange={this.changeShowHandle}
        onConfirm={this.confirmHandle}
        onCancel={this.cancelHandle}
        okText="确定"
        cancelText="取消"
        onClick={this.clickHandle}>
        {
          this.props.children
        }
      </Popconfirm>
    )
  }
}