import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './CoverView.less'

import { connect } from 'react-redux';
const columns = [
  { title: <span className={styles.title}>{'日期'}</span>,dataIndex: 'dateTime',align:'center',key:'dateTime'},
  { title: <span className={styles.title}>{'总花费(元)'}</span>, dataIndex: 'income',align:'center',key:'income'},
  { title: <span className={styles.title}>{'总展现量'}</span>, dataIndex: 'imp',align:'center',key:'imp'},
  { title: <span className={styles.title}>{'总点击量'}</span>, dataIndex: 'clk',align:'center',key:'clk'},
  { title: <span className={styles.title}>{'点击率(%)'}</span>, dataIndex: 'ctr',align:'center',key:'ctr'},
  { title: <span className={styles.title}>{'CPM(元)'}</span>, dataIndex: 'ecpm',align:'center',key:'ecpm'},
  { title: <span className={styles.title}>{'CPC(元)'}</span>, dataIndex: 'ecpc',align:'center',key:'ecpc'},
];

class CoverView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentWillMount() {
        // console.log(this.props.coverview,'coverviewfromReducer')
        this.setState({
            data: this.init(this.props.coverview)
        })
    }
    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: this.init(nextProps.coverview)
        })
    }
    init(x) {
        const data =[];
        // 关于时间这一块的渲染问题
        // 一天  和 一段时间 不同
        //

        if (this.props.time.current.begin === this.props.time.current.end) {
            // 一天
            x.current.dateTime = this.props.time.current.begin;
            x.compare.dateTime = this.props.time.compare.begin;
        } else {
            x.current.dateTime = <div style={{fontSize: "16px"}}>
                <span>{this.props.time.current.begin}</span>至
                <span>{this.props.time.current.end}</span>
            </div>;
            x.compare.dateTime = <div style={{fontSize: "12px"}}>
                <span>{this.props.time.compare.begin}</span>至
                <span>{this.props.time.compare.end}</span>
            </div>;

        }

        x.current.key = 1;
        x.compare.key = 2;
        // 对null的数据做处理，使其显示为0
        for (let i in x.current) {
            if (x.current[i] == null) {
                x.current[i] = 0
            }
        }
        for (let i in x.compare) {
            if (x.compare[i] == null) {
                x.compare[i] = 0
            }
        }
        data.push(x.current)
        data.push(x.compare)
        return data;
    }
    render() {
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    // scroll={{ x: 1500, y: 300 }}
                    pagination={{'hideOnSinglePage': true}}
                    rowClassName={
                        (record,index) => {
                            if (index === 0) {
                                return styles.emphasis
                            } else {
                                return styles.compare
                            }
                        }
                    }
                    // scroll={{ x: 1500}}
                />
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        time: state.clientDashboardReducers.time,
        coverview: state.clientDashboardReducers.coverview
    }
}

export default connect(
    mapStateToProps
)(CoverView)
