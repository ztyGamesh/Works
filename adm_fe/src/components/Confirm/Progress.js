/**
 * @class 显示进度条
 */
import React from 'react'
import { Modal, Progress, Button, Icon } from 'antd'

const MIN = 5
const MAX = 100

export default class extends React.Component {
  render() {
    const { type, content, percent, onCancel } = this.props
    const t = +percent
    if (percent === false) {
      return null
    }
    return (
      <Modal visible
        width={416}
        footer={null}
        closable={false}
        maskClosable={false}
        keyboard={false}>
        <div style={{ padding: '8px 0 0 8px' }}>
          <div style={{ paddingBottom: 24, display: 'flex', alignItems: 'center' }}>
            {
              type === 'info' ?
                <Icon type="info-circle" style={{ fontSize: 22, color: '#1890ff' }} /> :
                type === 'success' ?
                  <Icon type="check-circle" style={{ fontSize: 22, color: '#52c41a' }} /> :
                  type === 'error' ?
                    <Icon type="close-circle" style={{ fontSize: 22, color: '#f5222d' }} /> :
                    type === 'warning' ?
                      <Icon type="exclamation-circle" style={{ fontSize: 22, color: '#faad14' }} /> :
                      null
            }
            <div style={{ paddingLeft: 12 }}>{content}</div>
          </div>
          {
            percent === true ?
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={onCancel}>知道了</Button>
              </div>
              :
              <Progress percent={t < MIN ? MIN : t > MAX ? MAX : t} status="active" showInfo={false} />
          }
        </div>
      </Modal>
    )
  }
}