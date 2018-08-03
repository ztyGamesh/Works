/**
 * @class 媒体审核状态
 */
import React from 'react'
import { Popover } from 'antd'
import styles from './CreativeListCellAuditOthers.less'
import { CreativeAuditStatus } from './'

export default class extends React.Component {
    render() {
        const { value, row = {} } = this.props
        if (!(value instanceof Array) || value.length === 0) {
            return null
        }
        return (
            <Popover content={
                <div className={styles.body}>
                    <div>
                        {
                            value.map((t, index) =>
                                <div className={styles.line} key={index}>
                                    <div>{t.name}</div>
                                    <div>
                                        <CreativeAuditStatus value={t.audit_status} comment={t.comment} />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            } trigger="hover">
                <div style={{ textDecoration: 'underline', cursor: 'pointer' }}>详情</div>
            </Popover>
        )
    }
}