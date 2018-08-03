/**
 * @description 数据列表基础操作、单字段查询
 * @prop {String|Boolean} search 查询框提示文本|是否启用搜索框
 * @prop {String} add 添加按钮文本
 * @prop {Function} onAdd 添加按钮点击事件
 * @prop {React.Element} addModal 模态框
 * @prop {Array} columns antd要求的列格式
 * @prop {Function} onUpdate 列表请求数据时调用
 * @prop {Object} sorter 默认排序方式
 * @prop {Boolean} canAdd 添加按钮是否可点击（不影响渲染），默认为true
 * @prop {Boolean} canCheck 是否启用选择器
 * @prop {Function} onCheck 选择器点击事件
 * @prop {String} rowKey 数据唯一标识，默认为“uid”
 * @prop {Boolean} init 无设置时自动初始化表格，如需异步初始化表格，初始化之前需设置为flase
 *
 * @prop {Function} saveUpdate 获取表格刷新方法 @example <TableBase saveUpdate={e=>this.setState({update: e})}/>；刷新：this.state.update()
 * 
 * @method onAdd(checkedKeys,checkedRows,onUpdate)
 * @param {Array} checkedKeys 批量选中的单元值
 * @param {Array} checkedRows 批量选中的行值
 * @param {Function} onUpdate 刷新表格
 * @returns {Boolean} addModal模式：false：无，other：打开模态框；
 * @returns {Boolean} 其他模式：false：无，other：刷新表格；
 * 
 * @description sorter
 * @prop {String} field 排序字段
 * @prop {String} order 排序方式，枚举：['desc', 'asc']
 * 
 * @description onUpdate
 * @method onUpdate(params:Object)
 * @param {Object} params
 * @prop {String} searchText 搜索值
 * @prop {Number} pageSize 一页数据数量
 * @prop {Number} current 当前页码，从1开始
 * @prop {Object} filters 筛选值 @example {field:['1', '3']} 筛选字段field的值为1和3
 * @prop {Object} sorter 排序信息 @example {field: 'field', order: 'desc'} 按字段field倒序排序
 * @returns {Object|Promise} 列表数据信息
 * @prop {Array} rows 数据
 * @prop {Number} total 总数
 * @prop {React.Element} extra 额外组件，渲染在表格上边
 * @prop {React.Element} date 额外组件，用来放日期组件的，顺着添加、搜索框向后排
 *
 * @description columns[]
 * @param {Object} prompt 提示 {title: String, content: React.Element|String}
 * @param {Function|Array} filters @returns {Array|Promise}
 * @param {Boolean} renderFilters 是否以filters的映射关系渲染列，columns[].render无效
 * @param {Array} filteredValue 这里的filteredValue只有初始化时生效
 */
import React, { Component } from 'react'
import styles from './TableBase.less'
import { Table, LocaleProvider, Popover, Icon } from 'antd'
import { Button, Search } from '../TableTool'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

export default class extends Component {
    constructor(props) {
        super(props)
        //提取初始的筛选值
        const filters = {}
        const columns = props.columns.map(item => {
            const { render, dataIndex, filteredValue } = item
            if (filteredValue instanceof Array) {
                filters[dataIndex] = filteredValue
            }
            return {
                ...item,
                title: item.prompt ? <div>
                    <span>{item.title}</span>
                    <Popover placement="bottom" trigger="hover"
                        title={item.prompt.title}
                        content={item.prompt.content}>
                        <Icon style={{ marginLeft: 6 }} type="question-circle-o" />
                    </Popover>
                </div> : item.title,
                width: item.width || 100,
                //重写render，为组件绑定onUpdate
                render: typeof render === 'function' ? (value, row, index) => {
                    const comp = render(value, row, index)
                    //空值处理
                    if (comp === null || comp === undefined || comp === '') {
                        return '-'
                    }
                    //字面量
                    if (['string', 'number', 'boolean'].includes(typeof comp)) {
                        return comp
                    }
                    //原生组件
                    if (comp && typeof comp.type === 'string') {
                        return comp
                    }
                    //react组件
                    return comp && React.cloneElement(comp, {
                        onUpdate: this.updateHandle,
                        checkedKeys: this.state.checkedListKeys,
                        checkedRows: this.state.checkedList
                    })
                } : (value, row, index) => {
                    if (value === null || value === undefined || value === '') {
                        return '-'
                    }
                    return value
                }
            }
        })
        this.state = {
            add: props.add,
            search: props.search,
            onAdd: props.onAdd,
            onUpdate: props.onUpdate,
            data: [],
            loading: false,
            columns,
            defaultSorter: props.sorter || {},
            total: 0,
            searchText: '',
            pageSize: props.pageSize || 10,
            current: 1,
            filters,
            sorter: {},
            // maxHeight: 'calc(100vh - 230px)',
            //是否已经初始化表格
            isInited: false,
            //已选数据
            checkedListKeys: [],
            checkedList: [],
            //渲染完表格后被调用
            onUpdateEnd: props.onUpdateEnd
        }
    }

    /**
     * @method updateHandle 刷新
     * @param {Boolean} isFirst 是否跳转第一页
     */
    updateHandle = async (isFirst) => {
        if (!this.state.isInited) {
            return
        }
        const { onUpdate, searchText, pageSize, current, filters = {}, sorter = {}, defaultSorter, onUpdateEnd } = this.state
        const nowCurrent = isFirst ? 1 : current
        const sorterField = sorter.field || defaultSorter.field || ''
        const sorterOrder = sorter.order || (defaultSorter.order ? defaultSorter.order + 'end' : '')
        if (typeof onUpdate === 'function') {
            this.setState({ loading: true, data: [], total: 0, current: nowCurrent })
            const { rows = [], total } = await onUpdate({
                searchText,
                pageSize,
                current: nowCurrent,
                filters,
                sorter: {
                    field: sorterField,
                    order: sorterOrder === 'descend' ? 'desc' : sorterOrder === 'ascend' ? 'asc' : ''
                }
            }) || {}
            if (nowCurrent > 1 && rows.length === 0) {
                //当前页不是首页并且没有数据，则跳转首页
                this.updateHandle(true)
            } else {
                await this.setState({ loading: false, data: rows, total: total | 0, checkedListKeys: [], checkedList: [] })
                typeof onUpdateEnd === 'function' && await onUpdateEnd()
            }
        }
    }

    /**
     * @method saveSearchText 保存搜索框数据
     * @param {String} searchText 
     */
    saveSearchText = (searchText) => {
        this.setState({ searchText })
    }

    /**
     * @method changeHandle 表格操作时，保存表格信息，并更新列表
     * @param {Object} pagination 分页信息
     * @param {Object} filters 筛选信息
     * @param {Object} sorter 排序信息
     */
    changeHandle = async (pagination = {}, filters, sorter) => {
        //filters使用默认值，filters组件受控，需主动更新filteredValue
        const columns = this.state.columns.map(t => {
            const { dataIndex } = t
            if (t.filters) {
                return {
                    ...t,
                    filteredValue: filters[dataIndex] || []
                }
            }
            return t
        })
        await this.setState({
            pageSize: pagination.pageSize,
            current: pagination.current,
            filters,
            sorter,
            columns
        })
        this.updateHandle()
    }

    async componentWillMount() {
        const { saveUpdate } = this.props
        typeof saveUpdate === 'function' && saveUpdate(this.updateHandle)
        if (this.props.init !== false) {
            await this.setState({ isInited: true })
            this.updateHandle(true)
        }
        //异步加载筛选条件
        const { columns } = this.state
        const newColumns = []
        for (var i = 0, l = columns.length; i < l; i++) {
            const item = columns[i]
            const newFilters = typeof item.filters === 'function' ? await item.filters() : item.filters
            newColumns.push({
                ...item,
                filters: newFilters,
                //以filters的映射关系重写render
                render: item.renderFilters ? (value, row, index) => {
                    const obj = newFilters.find(t => t.value === value)
                    return obj ? obj.text : '-'
                } : item.render,
                align: 'center'
            })
        }
        this.setState({ columns: newColumns })
    }


    async componentWillReceiveProps(nextProps) {
        if (!this.state.isInited && nextProps.init !== false) {
            await this.setState({ isInited: true })
            this.updateHandle(true)
        }
    }

    checkHandle = (keys, rows) => {
        this.setState({ checkedListKeys: keys, checkedList: rows })
    }

    componentDidMount() {
        this.resetMaxHeight()
    }

    resetMaxHeight = () => {
        // console.dir(this.refs.content)
    }

    render() {
        const { current, total, pageSize, add, search, columns, loading, data, onAdd, maxHeight, checkedListKeys } = this.state
        const { canAdd = true, rowKey = 'uid', canCheck, extra = null, date = null, extraAfter, addModal, resetField = {} } = this.props
        const newColumns = columns.map(t => {
            const field = t.dataIndex
            const newName = resetField[field]
            if (newName) {
                return {
                    ...t,
                    title: newName
                }
            }
            return t
        })
        return (
            <LocaleProvider locale={zh_CN}>
                <div className={styles.body}>
                    <div className={styles.box}>
                        <div className={styles.line + (extraAfter ? ' auto' : '')}  >
                            {
                                add ? <Button label={add} onClick={onAdd} disabled={!canAdd}
                                    modal={addModal}
                                    onUpdate={this.updateHandle}
                                    checkedKeys={this.state.checkedListKeys}
                                    checkedRows={this.state.checkedList}
                                /> : null
                            }
                            {
                                add ? <div className={styles.hold} /> : null
                            }
                            {
                                search ? <Search label={search}
                                    onChange={this.saveSearchText}
                                    onSearch={e => this.updateHandle(true)}
                                /> : null
                            }
                            <div className={styles.hold} />
                            {date && <div className=''>{
                                React.cloneElement(date, {
                                    onUpdate: this.updateHandle,
                                    checkedKeys: this.state.checkedListKeys,
                                    checkedRows: this.state.checkedList
                                })
                            }</div>}
                        </div>
                        {extra && <div className={styles.line + (extraAfter ? ' auto' : '')}
                            style={{ paddingRight: 0 }}>{
                                React.cloneElement(extra, {
                                    onUpdate: this.updateHandle,
                                    checkedKeys: this.state.checkedListKeys,
                                    checkedRows: this.state.checkedList
                                })
                            }</div>}
                    </div>
                    <div ref="content" className={styles.content}>
                        <Table columns={newColumns}
                            dataSource={data}
                            loading={loading}
                            pagination={{
                                current,
                                pageSize,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '30', '50', '100'],
                                total,
                                showTotal: (total, range = []) => {
                                    return `第${range[0]}到第${range[1]}条记录，总共${total}条记录`
                                }
                            }}
                            rowKey={rowKey}
                            scroll={{ x: true, y: maxHeight }}
                            onChange={this.changeHandle}
                            rowSelection={canCheck ? {
                                // fixed: true,
                                selections: false,
                                selectedRowKeys: checkedListKeys,
                                onChange: this.checkHandle
                            } : undefined}
                        />
                    </div>
                </div>
            </LocaleProvider>
        )
    }
}
