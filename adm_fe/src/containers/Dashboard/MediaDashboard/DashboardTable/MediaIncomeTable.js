import React, { Component } from 'react';
import { Table } from 'antd';

import {connect} from 'react-redux';

const columns = [
{
  title: '媒体名称',
  dataIndex: 'name',
},
{
  title: '收入(元)',
  dataIndex: 'income',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.income - b.income,
},
{
  title: '曝光量',
  dataIndex: 'imp',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.imp - b.imp,
},
{
  title: '点击量',
  dataIndex: 'clk',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.clk - b.clk,
},
{
  title: '点击率(%)',
  dataIndex: 'ctr',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.ctr - b.ctr,
  // render: (text,record,index) => {
  //     return `${text}%`
  // }
},
{
  title: 'eCPM(元)',
  dataIndex: 'ecpm',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.ecpm - b.ecpm,
},
{
  title: 'eCPC(元)',
  dataIndex: 'ecpc',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.ecpc - b.ecpc,
},
];

function onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter)
}
class DashboardTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentWillMount() {
        this.setState({
            data: this.init(this.props.mediaIncome)
        })
    }

    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: this.init(nextProps.mediaIncome)
        })
    }
    init(x) {
        return x.map((item,index) => {
            return Object.assign({key: index, name: item.media_name}, item)
        })
    }

    render() {
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    onChange={onChange}
                    pagination={{'hideOnSinglePage': true}}
                    locale={{
                        filterTitle: '筛选',
                        filterConfirm: '确定',
                        filterReset: '重置',
                        emptyText: '暂无数据'
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mediaIncome: state.mediaDashboardReducers.income.mediaIncome
    }
}
export default connect(
    mapStateToProps
)(DashboardTable);
