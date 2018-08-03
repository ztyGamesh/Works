import React, { Component } from 'react';
import { Table } from 'antd';

import {connect} from 'react-redux';

const columns = [
{
  title: '排名',
  dataIndex: 'rank',
},
{
  title: '文章类型',
  dataIndex: 'type',
},
{
  title: '标题',
  dataIndex: 'title',
},
{
  title: '分类',
  dataIndex: 'tag_name',
},
{
  title: '阅读量',
  dataIndex: 'clk',
},
{
  title: '平均阅读时长(秒)',
  dataIndex: 'avg_time_length',
},
{
  title: '完成度',
  dataIndex: 'avg_readover',
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
      console.log(this.props.mediaIncome,"hahhahhahahaha")
        this.setState({
            data: this.init(this.props.mediaIncome)
        })
    }

    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
      console.log(nextProps,"hahhahhahahaha")
        this.setState({
            data: this.init(nextProps.mediaIncome)
        })
    }
    init(x) {
      if (!x) {
        return 
      }
      return x.map((item,index) => {
        return Object.assign({key: item.article_id}, item)
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
        mediaIncome: state.contentDashboardReducers.article.data.rows
    }
}
export default connect(
    mapStateToProps
)(DashboardTable);
