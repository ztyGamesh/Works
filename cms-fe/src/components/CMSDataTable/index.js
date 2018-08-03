import React, {Component} from 'react';
import {Table, DatePicker, Input, Badge, Pagination} from 'antd';
import moment from 'moment';

const {RangePicker} = DatePicker;
const Search = Input.Search;

/** 列表组件，包含搜索框和日期选择
 *  props参数列表：
 *      columns: array, 列表配置，对照Ant-design Table配置，对筛选字段做默认行为的请设置props.filters属性
 *      data: array, 当前页表格需要渲染的数据
 *      dataCounts: number, 总数据合计个数
 *      loading: boolean, 是否显示“正在加载”样式
 *      updateData: function(object), 可选，刷新数据的行为，参数为object
 *      pageSize: number || 5, 可选，缺省为5，每页数据个数
 *      filters: object || {}, 可选，缺省为{}，筛选字段，该字段在columns中应设置filters
 *          filters结构：{key: value,...}, key：字段名, value：array，字段值的范围
 *      sorter: object || {}, 可选，缺省为{}，默认的排序行为（当表头没有触发排序行为时）
 *          sorter结构：{
 *              field: string, 排序的字段
 *              order: string, 排序的规则，descend/ascend，默认ascend
 *          }
 *      firstPage: boolean 可选，缺省为false，分页器是否显示第一页
 *      extra: string, 可选，缺省为''，在表格上边添加的组件
 * updateData参数（object）属性解析：
 *      searchText: string, 当前查询的关键词
 *      beginTime: number, 时间区间开始，秒值
 *      endTime: number, 时间区间结束，秒值
 *      pagination: object, 分页信息
 *          paging结构：{
 *              size: number, 每页数据个数
 *              number: number, 当前页码
 *           },
 *      sorter: object, 排序信息
 *          sorter结构：{
 *              field: string, 排序的字段
 *              order: string, 排序的规则
 *           },
 *      filters: object, 筛选信息
 *          filters结构：{key: value,...}, key：字段名, value：array，字段值的范围
 */
class DataTable extends Component {
    constructor() {
        super()
        this.state = {
            columns: [],
            data: [],
            dataCounts: 0,
            loading: false,
            searchText: '',//搜索
            beginTime: '',//时间开始
            endTime: '',//时间结束
            pagination: {},//分页每页大小
            filters: {},//筛选
            sorter: {},//排序
            defaultSorter: {},//默认的排序
            extra: '',//在表格上边添加的组件
        };
    }

    componentWillMount() {
        console.log(this.props.backInfo);
        // const filters = this.props.filters || {};
        const filters = !this.props.backInfo ? {} : {
            // beginTime: this.props.backInfo.beginTime,
            // endTime: this.props.backInfo.endTime,
            filterUser: this.props.backInfo.filterUser,
            channel: this.props.backInfo.channel,
            auditStatus: this.props.backInfo.auditStatus,
            contentUid: this.props.backInfo.contentUid
            // keyWord: this.props.backInfo.keyWord
        };
        const columns = this.props.columns.map(t =>
            filters[t.key] ? {...t, filteredValue: filters[t.key]} : {...t}
        );
        this.setState({
            columns: columns,
            data: this.props.data,
            dataCounts: this.props.dataCounts,
            loading: this.props.loading,
            pagination: {
                pageSize: this.props.pageSize || 10,
                current: this.props.backInfo ? this.props.backInfo.paging.number : 1,
                total: this.props.dataCounts,
            },
            filters: filters,
            sorter: this.props.sorter || {},
            defaultSorter: this.props.sorter || {},
            extra: this.props.extra || '',
        }, () => {
            this.updateData();
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.backInfo);
        console.log("-----------------");
        const filters = this.state.filters;
        const columns = nextProps.columns.map(t =>
            filters[t.key] ? {...t, filteredValue: filters[t.key]} : {...t}
        );
        const pagination = {
            ...this.state.pagination,
            total: nextProps.dataCounts,
        };

        if (nextProps.firstPage) {
            pagination.current = 1;
        }
        this.setState({
            columns: columns,
            data: nextProps.data,
            dataCounts: nextProps.dataCounts,
            loading: nextProps.loading,
            pagination: pagination,
            extra: nextProps.extra || '',
            searchCondition: nextProps.searchCondition
        });

    }

    //日期变化回调
    dateChanged(date, dateString) {
        console.log(date)
        this.setState({
            beginTime: date.length === 2
                ? date[0].startOf('day').format('X')
                : '',
            endTime: date.length === 2
                ? date[1].endOf('day').format('X')
                : '',
            pagination: {
                ...this.state.pagination,
                current: 1,
            },
        }, () => {
            this.updateData();
        });
    }

    //搜索变化回调
    onSearch(text) {
        this.setState({
            searchText: text,
            pagination: {
                ...this.state.pagination,
                current: 1,
            },
            searchCondition: this.props.searchCondition,
            level: this.props.level
        }, () => {
            this.updateData();
        });
    }

    //table回调 包括翻页||筛选||排序
    handleTableChange(pagination, filters, sorter) {
        console.log(this.props.searchCondition);
        this.setState({
            pagination: {
                ...this.state.pagination,
                ...pagination,
            },
            filters: {
                ...this.state.filters,
                ...filters,
            },
            sorter: {
                ...this.state.defaultSorter,
                ...sorter,
            },
            searchCondition: this.props.searchCondition,
            level: this.props.level
        }, () => {
            this.updateData();
        });
    }

    updateData() {
        if (!this.props.updateData) return;
        const params = {
            searchText: this.state.searchText,
            beginTime: this.state.beginTime,
            endTime: this.state.endTime,
            pagination: {
                size: this.state.pagination.pageSize,
                number: this.state.pagination.current,
            },
            sorter: {
                field: this.state.sorter.field || '',
                order: 'descend' === this.state.sorter.order ? 'desc' : 'asc',
            },
            filters: this.state.filters,
            searchCondition: this.state.searchCondition,
            searchLevel: this.state.level,
        };
        this.props.updateData(params);
    }

    showQuickJumper(page) {
        console.log(page);
        this.setState({
            ...this.state,
            pagination: {
                ...this.state.pagination,
                current: page
            },
            level: this.props.level
        }, () => {
            this.updateData();
        });
    }

    render() {
        return (
            <div style={{
                margin: 50
            }}>
                <center>
                    <Search placeholder="搜索" style={{
                        width: 250,
                        margin: 10
                    }} onSearch={this.onSearch.bind(this)}/>
                    {/* 日期显示空间需要根据配置项hiddenDate来控制*/}
                    {
                        this.props.hiddenDate ? null :
                        <RangePicker ranges={{
                            '全部': [],
                            '今天': [
                            moment().startOf('day'), moment().endOf('day')
                            ],
                            '本月': [moment().startOf('month'), moment().endOf('month')]
                        }} format={'YYYY/MM/DD'} onChange={this.dateChanged.bind(this)} style={{
                            margin: 10
                        }}/>
                    }
                    <Badge count={this.state.dataCounts} overflowCount={Number.MAX_VALUE} showZero={true} style={{
                        backgroundColor: '#0F81D4',
                        margin: 10
                    }}/>
                    {this.state.extra || null}
                </center>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    onChange={this.handleTableChange.bind(this)}
                    // pagination={this.state.pagination}
                    pagination={false}
                    loading={this.state.loading}
                />
                <Pagination
                    showQuickJumper
                    defaultCurrent={this.props.backInfo ? this.props.backInfo.paging.number : 1}
                    total={this.state.pagination.total}
                    onChange={this.showQuickJumper.bind(this)}
                    style={{float: "right"}}
                />
            </div>
        )
    }
};

export default DataTable;
