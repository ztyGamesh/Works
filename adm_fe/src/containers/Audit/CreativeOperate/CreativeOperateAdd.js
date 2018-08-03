/**
 * @class
 */
import React from 'react'
import { Button, message, Icon } from 'antd'
import { FormTabs } from '../../../components/Form'
import { CarouselHandle } from '../../../components/Carousel'
import Confirm from '../../../components/Confirm'
import { CreativeMaterial, CreativePreview } from './'

export default class extends React.Component {
    constructor(props) {
        super(props)
        const { config = [] } = props
        const keys = config.reduce((r, t) => {
            const { name, slot_class } = t
            r[slot_class] = name + '/.$' + slot_class
            return r
        }, {})
        this.state = {
            keys,
            activeKey: keys[config[0] && config[0].slot_class]
        }
    }

    changeHandle = (activeKey) => {
        this.setState({ activeKey })
    }

    changeTabHandle = (key) => {
        this.setState({ activeKey: this.state.keys[key] })
    }

    render() {
        const { ad_scene, promote_type, schemaList, config = [] } = this.props
        return (
            <div style={{ position: 'relative', top: -24, paddingRight: 24 }}>
                <FormTabs activeKey={this.state.activeKey}
                    onChange={this.changeHandle}
                    tabs={config.map(t => t.name)}
                    tabPosition="left"
                    {...this.props}>
                    {
                        config.map(t => {
                            const { child = [] } = t
                            return (
                                <Item config={child}
                                    name={t.name}
                                    slot_class={t.slot_class}
                                    key={t.slot_class}
                                    changeTab={this.changeTabHandle}
                                    ad_scene={ad_scene}
                                    promote_type={promote_type}
                                    schemaList={schemaList}
                                />
                            )
                        })
                    }
                </FormTabs>
            </div>
        )
    }
}

class Item extends React.Component {
    constructor(props) {
        super(props)
        const { config = [], schemaList } = props
        const keys = config.reduce((r, t) => {
            const { template_name, template } = t
            r[template] = template_name + '/.$' + template
            return r
        }, {})
        this.state = {
            keys,
            activeKey: keys[config[0] && config[0].template]
        }
    }

    changeHandle = (activeKey) => {
        this.setState({ activeKey })
    }

    changeTabHandle = (key) => {
        this.setState({ activeKey: this.state.keys[key] })
    }

    render() {
        const { ad_scene, promote_type, schemaList, config = [], name, slot_class, changeTab } = this.props
        return (
            <FormTabs activeKey={this.state.activeKey}
                onChange={this.changeHandle}
                tabs={config.map(t => t.template_name)}
                {...this.props}>
                {
                    config.map(t => {
                        return (
                            <Setting slot_name={name}
                                slot_class={slot_class}
                                setting={t}
                                key={t.template}
                                changeTab={changeTab}
                                changeSubTab={this.changeTabHandle}
                                ad_scene={ad_scene}
                                promote_type={promote_type}
                                schemaList={schemaList}
                            />
                        )
                    })
                }
            </FormTabs>
        )
    }
}

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            index: 0,
            all: 0
        }
    }

    clickHandle = (e) => {
        console.log(e)
        const { data, all } = this.state
        if (all >= 25) {
            message.warning('最多25个创意！')
            return
        }
        const key = `new_${+new Date()}`
        this.setState({
            data: [...data, {
                ...e,
                index: key,
                //校验错误时修改轮播显示
                changeIndex: async () => {
                    const { changeTab, changeSubTab, slot_class, setting = {} } = this.props
                    const { template } = setting
                    const index = this.state.data.findIndex(t => t.index === key)
                    await changeTab(slot_class)
                    await changeSubTab(template)
                    if (index !== -1) {
                        this.changeHandle(index)
                    }
                }
            }],
            all: all + 1,
            index: all
        })
    }

    renderCarouse = (props) => {
        return (
            <div style={{ width: '100%' }}>
                <div style={{
                    width: '100%',
                    height: 24,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <Confirm onClick={e => this.deleteHandle(e, props.index)}>
                        <Icon style={{ cursor: 'pointer' }} type="close-circle-o" />
                    </Confirm>
                </div>
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: 0, flexGrow: 1 }}>
                        <CreativeMaterial {...props} />
                    </div>
                    <div style={{ flexShrink: 0, padding: '4px 0 0 12px' }}>
                        <CreativePreview {...props} />
                    </div>
                </div>
            </div>
        )
    }

    changeHandle = (index) => {
        this.setState({ index })
    }

    deleteHandle = async (e, key) => {
        if (false === await e('是否删除此创意？')) {
            return
        }
        const data = [...this.state.data]
        const index = data.findIndex(t => t.index === key)
        if (index === -1) {
            return
        }
        data.splice(index, 1)
        const all = data.length
        this.setState({
            data,
            all,
            index: index === all ? index - 1 : index
        })
    }

    render() {
        const { index, all, data } = this.state
        const showIndex = all === 0 ? 0 : index + 1
        return (
            <div style={{ width: '100%', paddingBottom: 24, minHeight: 600 }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingLeft: 24
                }}>
                    <Button onClick={e => this.clickHandle(this.props)}>添加</Button>
                    <div style={{ paddingLeft: 12 }}>{showIndex}/{all}</div>
                </div>
                <CarouselHandle center={false}
                    width={700}
                    size={1}
                    index={index}
                    onChange={this.changeHandle}
                    itemKey="index"
                    data={data}
                    render={this.renderCarouse} />
            </div>
        )
    }
}