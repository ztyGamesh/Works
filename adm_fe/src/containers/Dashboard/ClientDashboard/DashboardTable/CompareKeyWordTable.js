import React, { Component } from 'react';
import { Table } from 'antd';
import {connect} from 'react-redux';
import styles from "./index.less";
const columns = [
{
  title: '关键词',
  dataIndex: 'name',
  width: "100px"
},
{
  title: '花费(元)',
  dataIndex: 'income',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.income - b.income,
},
{
  title: '展现量',
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
            data: this.init(this.props.compare)
        })
    }

    componentDidMount() {
        /*对关键词表格的size=small样式修正*/
        var tables = Array.prototype.slice.apply(document.getElementsByClassName("ant-table-small"));
        tables.forEach((table) => {
            table.style.borderRadius = "0px";
            table.style.border = "1px solid transparent";
        })
    }
    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: this.init(nextProps.compare)
        })
    }
    init(x) {
        return x.map((item,index) => {
            return Object.assign({key: index, name: item.word}, item)
        })
    }
    render() {
        return (
            <div>
                <Table
                    title={() => {
                        let sameDay = this.props.time.begin === this.props.time.end;
                        let resultTime;
                        if (sameDay) {
                            resultTime = this.props.time.begin;
                        } else {
                            resultTime = this.props.time.begin + "至" + this.props.time.end;
                        }
                        return resultTime;
                    }}
                    size="small"
                    columns={columns}
                    dataSource={this.state.data}
                    onChange={onChange}
                    pagination={{'hideOnSinglePage': true,'defaultPageSize': 20}}
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
        compare: state.clientDashboardReducers.wordTop.compare,
        time: state.clientDashboardReducers.time.compare
    }
}
export default connect(
    mapStateToProps
)(DashboardTable);
