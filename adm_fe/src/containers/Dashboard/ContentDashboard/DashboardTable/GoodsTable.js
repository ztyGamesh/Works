import React, { Component } from 'react';
import { Table } from 'antd';
import {connect} from 'react-redux';
import {strToPercent} from "../../../../utils/aboutReportUtils.js"
const columns = [
{
  title: '排名',
  dataIndex: 'rank',
},
{
  title: '商品ID',
  dataIndex: 'goods_id',
},
{
  title: '商品名称',
  dataIndex: 'name',
},
{
  title: '价格(元)',
  dataIndex: 'price',
},
{
  title: '收入比率(%)',
  dataIndex: 'rato',
  render: function(data) {
    return strToPercent(data)
  }
},
{
  title: '点击量',
  dataIndex: 'clk',
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
            data: this.init(this.props.slotIncome)
        })
    }
    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: this.init(nextProps.slotIncome)
        })
    }
    init(x) {
      if (!x) {
        return 
      }
      return x.map((item,index) => {
          return Object.assign({key: item.goods_id}, item)
      })
    }
    render() {
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    onChange={onChange}
                    pagination={{
                      defaultPageSize: 10,
                      hideOnSinglePage: true,
                      showQuickJumper: true,
                      showSizeChanger: true
                    }}
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
        slotIncome: state.contentDashboardReducers.goods.data.rows
    }
}
export default connect(
    mapStateToProps
)(DashboardTable);
