/**
 * @class 关键词 - 搜索广告 - 品牌
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
            }
            return false
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
        rows.forEach(t => t.status = 'active')
    }

    batchPause = (keys, rows, update) => {
        if (keys.length === 0) {
            message.warning('请至少选择一条数据进行操作')
            return false
        }
        rows.forEach(t => t.status = 'pause')
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
                                                <div>3、表格共1列，从左到右分别是：关键词；</div>
                                                <div>4、关键词：每个关键词最多20个汉字（英文、标点、数字算半个汉字）；</div>
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
        const error = { empty: 0, repeat: [], word: [] }
        const words = []
        const data = lines.reduce((res, t, index) => {
            const [word = ''] = t
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
            words.push(word)
            return res.concat({
                key: key + index,
                word,
                status: 'active'
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