/**
 * @class 关键词设置
 */
import React from 'react'
import { Input, Button, Form, message, Popover, Icon } from 'antd'
import { FormCustom, FormModal, FormTabs } from '../../../components/Form'
import { KeyWord, KeyWordDeny, KeyWordSug, KeyWordSugDeny } from './KeyWord'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            config: {
                label: '关键词设置',
                field: 'key_word',
                full: true,
                validate: (value) => {
                    const { ad_scene, promote_type } = this.props
                    if (ad_scene == 2
                        //  && promote_type == 1
                        ) {
                        if (!value.some(t => t.target_type == 1)) {
                            return '请添加关键词'
                        }
                    }
                },
                initialValue: []
            }
        }
    }

    render() {
        const { ad_scene, promote_type } = this.props
        return (
            <React.Fragment>
                <FormCustom required={ad_scene == 2 && promote_type == 1} {...this.state.config} {...this.props}>
                    <Info {...this.props} />
                </FormCustom>
            </React.Fragment>
        )
    }
}

class Info extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showSetting: false
        }
    }

    clickHandle = () => {
        this.setState({ showSetting: true })
    }

    /**
     * @method cancelHandle 取消模态框
     */
    cancelHandle = () => {
        this.setState({ showSetting: false })
        const { submitKeywordNew } = this.props
        if (typeof submitKeywordNew === 'function') {
            submitKeywordNew()
        }
    }

    /**
     * @method submitHandle 关闭关键词模态框，更新关键词数据
     */
    submitHandle = async (values) => {
        const data = await values
        const { ad_scene, submitKeywordNew } = this.props
        if (ad_scene == 1) {
            const kw = this.filterData(data.keyword, word => ({
                word,
                target_type: 1,
                match_type: 1
            }))
            const dkw = this.filterData(data.denykeyword, word => ({
                word,
                target_type: 2,
                match_type: 1
            }))
            const key_word = [].concat(kw, dkw)
            this.props.form.setFieldsValue({ key_word })
        } else {
            const kw = (data.keywordsug || []).map(t => {
                return {
                    word: t.word,
                    status: t.status,
                    price: t.price,
                    match_type: +t.match_type,
                    target_type: 1,
                    link: t.link,
                    audit_status: t.audit_status
                }
            })
            const dkws1 = this.validateDenyKeywordSug(data.denykeywordsug1, word => ({
                word,
                target_type: 2,
                match_type: 1
            }))
            if (dkws1 === false) {
                return false
            }
            const dkws2 = this.validateDenyKeywordSug(data.denykeywordsug2, word => ({
                word,
                target_type: 2,
                match_type: 2
            }))
            if (dkws2 === false) {
                return false
            }
            const key_word = [].concat(kw, dkws1, dkws2)
            this.props.form.setFieldsValue({ key_word })
            if (typeof submitKeywordNew === 'function') {
                submitKeywordNew()
            }
        }
    }

    /**
     * @method filterData textarea数据去重去空
     */
    filterData = (str = '', fun = e => e) => {
        if (str.trim() === '') {
            return []
        }
        const temp = []
        return str.split('\n').reduce((r, t) => {
            const value = t.trim()
            if (value !== '' && !temp.includes(value)) {
                temp.push(value)
                r.push(fun(value))
            }
            return r
        }, [])
    }

    /**
     * @method validateDenyKeywordSug 校验搜索广告否定关键词后封装数据
     */
    validateDenyKeywordSug = (str = '', fun = e => e) => {
        if (str.trim() === '') {
            return []
        }
        const arr = str.split('\n')
        const res = []
        const temp = []
        for (let i = 0, l = arr.length; i < l; i++) {
            const value = arr[i].trim()
            if (value !== '') {
                if (value.replace(/[\u2E80-\u9FFF]/g, '**').length > 40) {
                    message.warning('每个否定关键字最多20个汉字（英文、标点、数字算半个汉字）')
                    return false
                }
                if (temp.includes(value)) {
                    message.warning('相同匹配方式的否定关键字不能重复：' + value)
                    return false
                }
                res.push(fun(value))
                temp.push(value)
            }
        }
        return res
    }

    render() {
        const { ad_scene, promote_type, schemaList } = this.props
        const all = this.props.value || []
        const num = all.filter(t => t.target_type == 1).length
        const info = `已有${num}个关键词，${all.length - num}个否定关键词`
        return (
            <div style={{ width: '100%', position: 'relative' }}>
                {/* <Input.Group compact style={{ display: 'flex' }}>
                    <Input style={{ width: 0, flexGrow: 1 }} value={info} disabled />
                    <Button style={{ flexShrink: 0 }} onClick={this.clickHandle}>设置</Button>
                </Input.Group> */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" style={{ flexShrink: 0 }} onClick={this.clickHandle}>设置</Button>
                    <div style={{ padding: '0 12px' }}>{info}</div>
                    <div>
                        <Popover placement="top" trigger="hover" title="关键词填写说明" content={
                            <div style={{ fontSize: 14, lineHeight: '20px', width: 220 }}>
                                为了保证投放效果，填写的关键词需要与推广的产品相关联，并且保证计划下关键词数在1000个以内。
                            </div>
                        }>
                            <Icon type="question-circle-o" />
                        </Popover>
                    </div>
                </div>
                <Modal ad_scene={ad_scene} promote_type={promote_type} schemaList={schemaList}
                    all={all}
                    onSubmit={this.submitHandle}
                    showModal={this.state.showSetting}
                    onCancel={this.cancelHandle} />
                {/* <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)' }}>
                    <Popover placement="top" trigger="hover" title="关键词填写说明" content={
                        <div style={{ fontSize: 14, lineHeight: '20px', width: 220 }}>
                            为了保证投放效果，填写的关键词需要与推广的产品相关联，并且保证计划下关键词数在1000个以内。
                    </div>
                    }>
                        <Icon type="question-circle-o" />
                    </Popover>
                </div> */}
            </div>
        )
    }
}

class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initData: null,
            activeKey: '',
            kwTags: [],
            dkwTags: [],
            kwsTags: [],
            dkwsTags1: [],
            dkwsTags2: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.showModal) {
            this.setState({
                initData: null,
                activeKey: ''
            })
        }
    }

    openHandle = () => {
        const { ad_scene, all = [] } = this.props
        const kw = []
        const dkw = []
        const kws = []
        const dkws1 = []
        const dkws2 = []
        const kwTags = []
        const dkwTags = []
        const kwsTags = []
        const dkwsTags1 = []
        const dkwsTags2 = []
        all.forEach(t => {
            if (t.target_type == 1) {
                t.is_new == 1 && kwTags.push(kw.length)
                kw.push(t.word)
                t.is_new == 1 && kwsTags.push(kws.length)
                kws.push(t)
            } else {
                t.is_new == 1 && dkwTags.push(dkw.length)
                dkw.push(t.word)
                if (t.match_type == 1) {
                    t.is_new == 1 && dkwsTags1.push(dkws1.length)
                    dkws1.push(t.word)
                } else {
                    t.is_new == 1 && dkwsTags2.push(dkws2.length)
                    dkws2.push(t.word)
                }
            }
        })
        if (ad_scene == 1) {
            const initData = {
                keyword: kw.join('\n'),
                denykeyword: dkw.join('\n')
            }
            this.setState({
                initData,
                kwTags,
                dkwTags,
                kwsTags,
                dkwsTags1,
                dkwsTags2
            })
        } else {
            const initData = {
                keywordsug: kws,
                denykeywordsug1: dkws1.join('\n'),
                denykeywordsug2: dkws2.join('\n')
            }
            this.setState({
                initData,
                kwTags,
                dkwTags,
                kwsTags,
                dkwsTags1,
                dkwsTags2
            })
        }
    }

    render() {
        const { ad_scene, promote_type, schemaList } = this.props
        const select = promote_type == 1 ? false : (schemaList || []).map(t => ({
            value: `[:${t.display}:]`,
            label: t.display
        }))
        const activeKey = this.state.activeKey || '添加关键词/.$' + (ad_scene == 1 ? '+' : 'sug+')
        const {
            kwTags,
            dkwTags,
            kwsTags,
            dkwsTags1,
            dkwsTags2
        } = this.state
        return (
            <FormModal {...this.props}
                isSubmit
                width={600}
                initData={this.state.initData}
                onInit={this.openHandle}
                space="0 24px"
                width={805}
                modalTitle={<div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <div>添加关键词</div>
                    <div style={{ fontSize: 12, paddingLeft: 12 }}>请您认真复核将使用的关键词，确保其不违法、侵权，且与您的网页信息相关！</div>
                </div>}
            >
                <FormTabs activeKey={activeKey}
                    onChange={activeKey => this.setState({ activeKey })}
                    tabs={['添加关键词', '添加否定关键词']}>
                    {
                        ad_scene == 1 ?
                            <KeyWord key="+" max={1000} select={select}
                                keywordTags={kwTags} /> :
                            <KeyWordSug key="sug+" initData={this.state.initData} />
                    }
                    {
                        ad_scene == 1 ?
                            <KeyWordDeny key="-" max={1000}
                                denykeywordTags={dkwTags} /> :
                            <KeyWordSugDeny key="sug-" max1={200} max2={200}
                                denykeywordsugTags1={dkwsTags1}
                                denykeywordsugTags2={dkwsTags2} />
                    }
                </FormTabs>
            </FormModal>
        )
    }
}

Modal = Form.create()(Modal)