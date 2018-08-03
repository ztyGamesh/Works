/**
 * @description 数据列表基础操作、单字段查询
 * @prop {ReactNode} this.props.children 报表工具栏
 * @prop {Array} columns antd要求的列格式
 * @prop {Function} onUpdate 列表请求数据时调用
 * @prop {Object} sorter 默认排序方式
 *
 * @description sorter
 * @prop {String} field 排序字段
 * @prop {String} order 排序方式，枚举：['desc', 'asc']
 *
 * @description onUpdate
 * @method onUpdate(params:Object)
 * @param {Object} params
 * @prop {Number} pageSize 一页数据数量
 * @prop {Number} current 当前页码，从1开始
 * @prop {Object} filters 筛选值 @example {field:['1', '3']} 筛选字段field的值为1和3
 * @prop {Object} sorter 排序信息 @example {field: 'field', order: 'desc'} 按字段field倒序排序
 * @returns {Object|Promise} 列表数据信息
 * @prop {Array} rows 数据
 * @prop {Number} total 总数
 */
import React, { Component } from 'react'
import styles from './index.less'
import { Table, Pagination} from 'antd'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            add: props.add,
            onAdd: props.onAdd,
            onUpdate: props.onUpdate,
            data: [],
            loading: false,
            columns: props.columns.map(item => {
                const { render } = item
                return {
                    ...item,
                    width: item.width || 100,
                    //重写render，为组件绑定onUpdate
                    render: typeof render === 'function' ? (value, row, index) => {
                        const comp = render(value, row, index)
                        if (typeof comp === 'string' || typeof comp === 'number' || typeof comp === "object") {
                            return comp
                        }
                        return comp && React.cloneElement(render(value, row, index), {
                            onUpdate: this.updateHandle
                        })
                    } : null
                }
            }),
            defaultSorter: props.sorter || {},
            total: 0,
            pageSize: props.sorter.limit || 50,
            current: 1,
            filters: props.filters || {},
            sorter: {}
        }
    }

    /**
     * @method updateHandle 刷新
     * @param {Boolean} isFirst 是否跳转第一页
     */
    updateHandle = async (isFirst) => {
        const { onUpdate, pageSize, current, filters, sorter, defaultSorter } = this.state
        const nowCurrent = isFirst ? 1 : current
        const sorterField = sorter.field || defaultSorter.field || ''
        const sorterOrder = sorter.order || (defaultSorter.order ? defaultSorter.order + 'end' : '')
        const sorterBegin = sorter.begin || (defaultSorter.begin ? defaultSorter.begin: '')
        const sorterEnd = sorter.end || (defaultSorter.end ? defaultSorter.end : '');
        const sorterSlot = sorter.slot || (defaultSorter.slot ? defaultSorter.slot : "");
        const sorterSlotClass = sorter.slot_class || (defaultSorter.slot_class ? defaultSorter.slot_class : "");
        const sorterDimension = sorter.dimension || (defaultSorter.dimension ? defaultSorter.dimension : '');
        if (typeof onUpdate === 'function') {
            this.setState({ loading: true, data: [], total: 0, current: nowCurrent })
            const { rows, total } = await onUpdate({
                pageSize,
                current: nowCurrent,
                filters,
                sorter: {
                    field: sorterField,
                    order: sorterOrder === 'descend' ? 'desc' : sorterOrder === 'ascend' ? 'asc' : '',
                    begin: sorterBegin,
                    end: sorterEnd,
                    slot: sorterSlot,
                    slot_class: sorterSlotClass,
                    dimension: sorterDimension
                }
            }) || {}
            this.setState({ loading: false, data: rows, total ,current: nowCurrent})
        }
    }

    /**
     * @method changeHandle 表格操作时，保存表格信息，并更新列表
     * @param {Object} pagination 分页信息
     * @param {Object} filters 筛选信息
     * @param {Object} sorter 排序信息
     */
    changeHandle = async (pagination = {}, filters, sorter) => {
        await this.setState({
            pageSize: this.state.pageSize,
            current: this.state.current,
            filters,
            // 保证分页筛选的传参正确
            sorter: {
                ...this.state.sorter,
                order: sorter.order,
                field: sorter.field
            }
        })
        this.updateHandle()
    }
    changePageHandle=(page, pageSize)=>{
       this.setState({
            pageSize: pageSize,
            current: page
        },() => {
            this.updateHandle()
        })
    }
    componentWillReceiveProps(nextProps) {
        // 每次日期选择器被触发 根据新的查询条件重新渲染列表
        this.setState({
            sorter: nextProps.sorter,
            columns: nextProps.columns,
            current: 1
        },() =>{
            this.updateHandle()
        })
    }
    async componentWillMount() {
        this.updateHandle(true)
        //异步加载筛选条件
        const { columns } = this.state
        const newColumns = []
        for (var i = 0, l = columns.length; i < l; i++) {
            const item = columns[i]
            newColumns.push({
                ...item,
                filters: typeof item.filters === 'function' ? await item.filters() : item.filters
            })
        }
        this.setState({ columns: newColumns })
    }

    render() {

        const { current, total, pageSize, columns, loading, data } = this.state
        // console.log("内部的",columns)
        const { canAdd = true } = this.props
        return (
            <div className={styles.body}>
                <div className={styles.line}>
                    {/* 外部传进来的工具栏组件 this.props.children */}
                    {this.props.children}
                </div>
                <div style={{ width: '100%' }}>
                    <Table columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={false}
                        // pagination={{
                        //     current,
                        //     pageSize: 50,
                        //     total,
                        //     hideOnSinglePage: true
                        // }}
                        // 记得给渲染的data加uid属性。
                        rowKey={'uid'}
                        // scroll={{ x: true, y: 513 }}
                        onChange={this.changeHandle}
                        locale={{
                            filterTitle: '筛选',
                            filterConfirm: '确定',
                            filterReset: '重置',
                            emptyText: '暂无数据'
                        }}
                    />
                    <Pagination 
                        onChange={this.changePageHandle} 
                        pageSize={pageSize} 
                        total={total} 
                        current={current}
                        style={{float: "right",marginTop: "10px"}}
                        showQuickJumper={true}
                    />
                </div>
            </div>
        )
    }
}
