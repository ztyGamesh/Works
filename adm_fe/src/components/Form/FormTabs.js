/**
 * @class 表单Tabs
 * 
 * @ignore
 * @prop {Boolean} modal
 */
import React from 'react'
import { Tabs } from 'antd'

export default class extends React.Component {
    render() {
        const { children, form, addRef, tabs, tabPosition, activeKey, onChange, view } = this.props
        return React.Children.count(children) === 0 ? null : (
            <Tabs activeKey={activeKey} onChange={onChange} tabPosition={tabPosition} tabBarStyle={{
                paddingTop: tabPosition === 'left' ? 36 : 0,
                textAlign: 'left'
            }}>
                {
                    React.Children.map(children, (child, index) => {
                        const key = tabs[index]
                        return <Tabs.TabPane forceRender tab={key} key={key}>
                            {
                                !child ? null :
                                    typeof child.type === 'string' ? child :
                                        React.cloneElement(child, { form, addRef, view })
                            }
                        </Tabs.TabPane>
                    })
                }
            </Tabs>
        )
    }
}
