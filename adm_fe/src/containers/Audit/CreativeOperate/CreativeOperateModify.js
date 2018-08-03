
/**
 * @class
 */
import React from 'react'
import { message } from 'antd'
import { CreativeMaterial, CreativePreview } from './'

export default class extends React.Component {
    render() {
        const { slot_class, template_class, config = [], initData } = this.props
        const slot = config.find(t => t.slot_class === slot_class) || {}
        const setting = (slot.child || []).find(t => t.template === template_class)
        const props = {
            ...this.props,
            setting
        }
        return initData ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingRight: 48 }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '66%', paddingRight: 48 }}>
                        <CreativeMaterial {...props} isEdit />
                    </div>
                    <div style={{ width: '34%', paddingRight: 48 }}>
                        <CreativePreview {...props} isEdit />
                    </div>
                </div>
            </div>
        ) : null
    }
}
