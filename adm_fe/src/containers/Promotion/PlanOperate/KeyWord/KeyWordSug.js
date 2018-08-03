/**
 * @class 关键词 - 搜索广告
 */
import React from 'react'
import { message, Form, Tooltip, Popover, Icon } from 'antd'
import styles from './style.less'
import { TableBase, Switch, Select, Cell, Batchs, BatchSelect, BatchOption, initPageData, Modal } from '../../../../components/Table'
import { FormStorage, FormInput, FormSelect } from '../../../../components/Form'
import { FileCsv } from '../../../../components/File'
import { validateField } from './'

const REJECT_LIST = {
    '0': '正常',
    '1': '垃圾信息',
    '2': '谩骂',
    '3': '色情',
    '4': '恐暴',
    '5': '涉政'
}

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '关键词名称',
                    dataIndex: 'word',
                    width: 130,
                    render: (value, row, index) => {
                        if (row.audit_status == 0 || row.audit_status == 3) {
                            return value
                        }
                        return <Cell edit value={value} tag={row.is_new == 1 && '新'}
                            onEdit={e => this.editFieldHandle('word', e, row)} />
                    }
                }, {
                    title: '使用状态',
                    dataIndex: 'status',
                    width: 80,
                    filters: [
                        { text: '启用', value: 'active' },
                        { text: '暂停', value: 'pause' }
                    ],
                    render: (value, row, index) => {
                        if (row.audit_status == 0 || row.audit_status == 3 || row.audit_status == 4 || row.audit_status == 5) {
                            return '-'
                        }
                        return <Switch value={value}
                            onClick={e => row.status = e}
                            config={[
                                { text: '启用', value: 'active' },
                                { text: '暂停', value: 'pause' }
                            ]}
                        />
                    }
                }, {
                    title: '审核状态',
                    dataIndex: 'audit_status',
                    width: 70,
                    render: (value, row, index) => {
                        if (value == 0 || value == 3) {
                            return <div>审核中</div>
                        }
                        if (value == 4 || value == 5) {
                            return <Tooltip title={REJECT_LIST[row.category] || '获取拒绝原因失败'}>
                                <div>拒绝</div>
                            </Tooltip>
                        }
                        if (value == 1 || value == 2) {
                            return <div>通过</div>
                        }
                    }
                }, {
                    title: '出价（元）',
                    dataIndex: 'price',
                    width: 130,
                    sorter: true,
                    render: (value, row, index) => {
                        if (row.audit_status == 0 || row.audit_status == 3) {
                            return value
                        }
                        return <Cell edit value={value}
                            onEdit={e => this.editFieldHandle('price', e, row)} />
                    }
                }, {
                    title: '匹配方式',
                    dataIndex: 'match_type',
                    width: 130,
                    filters: [
                        { text: '短语精确包含', value: '1' },
                        { text: '精确匹配', value: '2' },
                        { text: '前缀匹配', value: '3' }
                    ],
                    render: (value, row, index) => {
                        if (row.audit_status == 0 || row.audit_status == 3) {
                            return value == 3 ? '前缀匹配' :
                                value == 2 ? '精确匹配' :
                                    '短语精确包含'
                        }
                        return <Select value={value}
                            onClick={e => row.match_type = e}
                            config={[
                                { text: '短语精确包含', value: '1' },
                                { text: '精确匹配', value: '2' },
                                { text: '前缀匹配', value: '3' }
                            ]} />
                    }
                }, {
                    title: '落地页URL',
                    dataIndex: 'link',
                    width: 130,
                    render: (value, row, index) => {
                        if (row.audit_status == 0 || row.audit_status == 3) {
                            return value
                        }
                        return <Cell edit value={value} limit={24}
                            onEdit={e => this.editFieldHandle('link', e, row)} />
                    }
                }
            ],
            data: props.initData && props.initData.keywordsug,
            init: props.initData !== null
        }
    }

    componentWillReceiveProps(nextProps) {
        const { initData } = nextProps
        if (this.state.init || this.state.data !== null || initData === null) {
            return
        }
        const key = +new Date() + '_'
        this.setState({
            data: (initData.keywordsug || []).map((t, index) => {
                return {
                    key: key + index,
                    ...t
                }
            }), init: true
        })
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { searchText, pageSize, current, filters, sorter } = params
        const req = {
            keyword: 'word',
            search: searchText,
            filters,
            sort: sorter.field,
            order: sorter.order,
            sortType: 'price' === sorter.field ? 'number' : ''
        }
        const { data } = this.state
        this.props.form.setFieldsValue({ keywordsug: data })
        const res = initPageData(data, req)
        return {
            rows: res.slice((current - 1) * pageSize, current * pageSize),
            total: res.length
        }
    }

    /**
     * @method readFileHandle 读取文件
     */
    readFileHandle = (data) => {
        this.setState({ data })
    }

    /**
     * @method editFieldHandle 单一编辑
     */
    editFieldHandle = (field, value, row) => {
        if (false === validateField(field, value)) {
            switch (field) {
                case 'word':
                    message.warning('关键词字数为1~20个字')
                    break
                case 'price':
                    message.warning('出价范围在0.01～999.99之间，最多两位小数')
                    break
                case 'link':
                    message.warning('URL地址格式错误')
                    break
            }
            return false
        }
        if (field === 'word') {
            const { data } = this.state
            const key = row.key
            if (data.some(t => t.word === value && t.key !== key)) {
                message.warning('关键词不能重复')
                return false
            }
            // 更新了新词则重置审核状态
            if (value !== row.word) {
                row.audit_status = undefined
            }
        }
        row[field] = value
    }

    batchDelete = (keys, rows, update) => {
        if (keys.length === 0) {
            message.warning('请至少选择一条数据进行操作')
            return false
        }
        const { data } = this.state
        for (let i = rows.length; i--;) {
            const index = data.indexOf(rows[i])
            if (index !== -1) {
                data.splice(index, 1)
            }
        }
    }

    batchActive = (keys, rows, update) => {
        if (keys.length === 0) {
            message.warning('请至少选择一条数据进行操作')
            return false
        }
        if (rows.some(t => t.audit_status == 0 || t.audit_status == 3)) {
            message.warning('审核中的关键词暂不支持此操作')
            return false
        }
        if (rows.some(t => t.audit_status == 4 || t.audit_status == 5)) {
            message.warning('拒绝的关键词暂不支持此操作')
            return false
        }
        rows.forEach(t => t.status = 'active')
    }

    batchPause = (keys, rows, update) => {
        if (keys.length === 0) {
            message.warning('请至少选择一条数据进行操作')
            return false
        }
        if (rows.some(t => t.audit_status == 0 || t.audit_status == 3)) {
            message.warning('审核中的关键词暂不支持此操作')
            return false
        }
        if (rows.some(t => t.audit_status == 4 || t.audit_status == 5)) {
            message.warning('拒绝的关键词暂不支持此操作')
            return false
        }
        rows.forEach(t => t.status = 'pause')
    }

    openBatch = (keys, rows, update) => {
        if (keys.length === 0) {
            message.warning('请至少选择一条数据进行操作')
            return false
        }
        if (rows.some(t => t.audit_status == 0 || t.audit_status == 3)) {
            message.warning('审核中的关键词暂不支持此操作')
            return false
        }
    }

    batchPrice = async (keys, rows, values) => {
        const data = await values
        if (data === false) {
            return false
        }
        rows.forEach(t => t.price = data.price)
    }

    batchMatch = async (keys, rows, values) => {
        const data = await values
        if (data === false) {
            return false
        }
        rows.forEach(t => t.match_type = data.match_type)
    }

    batchLink = async (keys, rows, values) => {
        const data = await values
        if (data === false) {
            return false
        }
        rows.forEach(t => t.link = data.link)
    }

    render() {
        const { columns, init } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.table}>
                    <TableBase columns={columns}
                        onUpdate={this.updateHandle}
                        init={init}
                        rowKey="key"
                        search="搜索关键词"
                        canCheck
                        extraAfter
                        extra={
                            <Batchs>
                                <BatchSelect text="批量操作">
                                    <BatchOption text="修改出价"
                                        onClick={this.openBatch}
                                        modal={<PriceModal onSubmit={this.batchPrice} />} />
                                    <BatchOption text="修改匹配方式"
                                        onClick={this.openBatch}
                                        modal={<MatchModal onSubmit={this.batchMatch} />} />
                                    <BatchOption text="修改URL地址"
                                        onClick={this.openBatch}
                                        modal={<LinkModal onSubmit={this.batchLink} />} />
                                    <BatchOption text="启用" onClick={this.batchActive} />
                                    <BatchOption text="暂停" onClick={this.batchPause} />
                                    <BatchOption text="删除" onClick={this.batchDelete} />
                                </BatchSelect>
                                <CsvComp saveData={this.readFileHandle} />
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translateY(-50%)' }}>
                                        <Popover placement="bottom" trigger="hover" title="文件及格式要求" content={
                                            <div style={{ fontSize: 14, lineHeight: '20px' }}>
                                                <div>1、支持csv文件导入；</div>
                                                <div>2、计划关键词上限为1000个；</div>
                                                <div>3、表格共4列，从左到右分别是：关键词、出价、匹配方式、URL地址；</div>
                                                <div>4、关键词：每个关键词最多20个汉字（英文、标点、数字算半个汉字）；</div>
                                                <div>5、出价：0.01～999.99；</div>
                                                <div>6、匹配方式：精确匹配、短语精确包含。二选一，单选；</div>
                                                <div>7、URL地址：填写以http（https）开头的有效着陆页。</div>
                                            </div>
                                        }>
                                            <Icon type="question-circle-o" />
                                        </Popover>
                                    </div>
                                </div>
                            </Batchs>
                        }
                    />
                </div>
                <FormStorage field="keywordsug" {...this.props} />
            </div>
        )
    }
}

/**
 * @class 上传CSV
 */
class CsvComp extends React.Component {
    constructor(props) {
        super(props)
    }

    saveKeywordsHandle = async (e) => {
        const { saveData, onUpdate } = this.props
        if (e === false || e.length === 0 || typeof onUpdate !== 'function') {
            return false
        }
        const lines = e[0]
        const key = +new Date() + '_'
        const error = { empty: 0, repeat: [], word: [], price: [], match_type: [], link: [] }
        const words = []
        const data = lines.reduce((res, t, index) => {
            const [word = '', price = '', match_type = '', link = ''] = t
            if (word === '') {
                error.empty++
                return res
            }
            if (words.includes(word)) {
                error.repeat.push(word)
                return res
            }
            if (false === validateField('word', word)) {
                error.word.push(word)
                return res
            }
            if (false === validateField('price', price)) {
                error.price.push(word)
                return res
            }
            if (false === validateField('match_type', match_type)) {
                error.match_type.push(word)
                return res
            }
            if (false === validateField('link', link)) {
                error.link.push(word)
                return res
            }
            words.push(word)
            return res.concat({
                key: key + index,
                word,
                status: 'active',
                price,
                match_type: '前缀匹配' === match_type ? '3' :
                    '精确匹配' === match_type ? '2' :
                        '短语精确包含' === match_type ? '1' :
                            match_type,
                link
            })
        }, [])
        if (error.empty) {
            message.warning(`有${error.empty}个关键词名称为空，请重新上传`)
            return false
        }
        if (error.repeat.length) {
            message.warning(`关键词${this.formatErrMsg(error.repeat, true)}重复，请重新上传`)
            return false
        }
        if (error.word.length) {
            message.warning(`关键词${this.formatErrMsg(error.word)}字数不能超过20个，请重新上传`)
            return false
        }
        if (error.price.length) {
            message.warning(`关键词${this.formatErrMsg(error.price)}出价范围0.01~999.99，最多两位小数，请重新上传`)
            return false
        }
        if (error.match_type.length) {
            message.warning(`关键词${this.formatErrMsg(error.match_type)}匹配方式错误，请重新上传`)
            return false
        }
        if (error.link.length) {
            message.warning(`关键词${this.formatErrMsg(error.link)}URL地址格式错误，请重新上传`)
            return false
        }
        if (data.length > 1000) {
            message.warning('关键词数量不能超过1000个，请重新上传')
            return false
        }
        typeof saveData === 'function' && await saveData(data)
        typeof onUpdate === 'function' && onUpdate(true)
    }

    formatErrMsg(words = [], repeat) {
        const ws = repeat ? words.filter((t, i) => words.indexOf(t) === i) : words
        const arr = ws.slice(0, 5)
        return arr.map(t => {
            return `“${t.length > 7 ? t.slice(0, 5) + '……' : t}”`
        }).join('、') + (ws.length > 5 ? '等' : '')
    }

    render() {
        return (
            <FileCsv style={{ marginLeft: 18 }} text="上传CSV" onChange={this.saveKeywordsHandle} />
        )
    }
}

class PriceModal extends React.Component {
    render() {
        return (
            <Modal title="修改出价" isSubmit {...this.props}>
                <FormInput required
                    label="出价(元)"
                    field="price"
                    validate={
                        (value) => {
                            if (false === validateField('price', value)) {
                                return '出价范围在0.01～999.99之间，最多两位小数'
                            }
                        }
                    } />
            </Modal>
        )
    }
}

PriceModal = Form.create()(PriceModal)

class MatchModal extends React.Component {
    render() {
        return (
            <Modal title="修改匹配方式" isSubmit {...this.props} >
                <FormSelect required
                    label="匹配方式"
                    field="match_type"
                    data={[
                        { label: '短语精确包含', value: '1' },
                        { label: '精确匹配', value: '2' },
                        { label: '前缀匹配', value: '3' }
                    ]}
                    validate={
                        (value) => {
                            if (!value) {
                                return '请选择匹配方式'
                            }
                        }
                    } />
            </Modal>
        )
    }
}

MatchModal = Form.create()(MatchModal)

class LinkModal extends React.Component {
    render() {
        return (
            <Modal title="修改URL" isSubmit {...this.props}>
                <FormInput required
                    label="URL"
                    field="link"
                    validate={
                        (value) => {
                            if (false === validateField('link', value)) {
                                return 'URL地址格式错误'
                            }
                        }
                    } />
            </Modal>
        )
    }
}

LinkModal = Form.create()(LinkModal)