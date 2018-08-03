import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './CoverView.less'
import {strToPercent} from "../../../../utils/aboutReportUtils.js"

import { connect } from 'react-redux';
const columns = [
  { title: <span className={styles.title}>{'日期'}</span>,dataIndex: 'dateTime',align:'center',key:'dateTime'},
  { title: <span className={styles.title}>{'消费'}</span>, dataIndex: 'cost',align:'center',key:'cost'},
  { title: <span className={styles.title}>{'媒体收入'}</span>, dataIndex: 'media_income',align:'center',key:'media_income'},
  { title: <span className={styles.title}>{'列表页PV'}</span>, dataIndex: 'list_pv',align:'center',key:'list_pv'},
  { title: <span className={styles.title}>{'列表页内容CTR'}</span>, dataIndex: 'list_content_ctr',align:'center',key:'list_content_ctr'},
  { title: <span className={styles.title}>{'列表页广告CTR'}</span>, dataIndex: 'list_ad_ctr',align:'center',key:'list_ad_ctr'},
  { title: <span className={styles.title}>{'详情页PV'}</span>, dataIndex: 'detail_pv',align:'center',key:'detail_pv'},
  { title: <span className={styles.title}>{'详情页广告CTR'}</span>, dataIndex: 'detail_ad_ctr',align:'center',key:'detail_ad_ctr'},
  { title: <span className={styles.title}>{'商品CTR'}</span>, dataIndex: 'goods_ctr',align:'center',key:'goods_ctr'},
  { title: <span className={styles.title}>{'商品成交量'}</span>, dataIndex: 'goods_vol',align:'center',key:'goods_vol'},
  { title: <span className={styles.title}>{'佣金'}</span>, dataIndex: 'payment',align:'center',key:'payment'},
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
        // console.log(this.props.coverview,"data++++");
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
        const current = x[0];
        const compare = x[1];

        if (current.begin === current.end) {
            current.dateTime = current.begin
        } else {
            current.dateTime = <div style={{textAlign: "left"}}>
                <span>{current.begin}</span>&nbsp;至
                <br/>
                <span>{current.end}</span>
            </div>
        }
        if (compare.begin === compare.end) {
            compare.dateTime = compare.begin
        } else {
            compare.dateTime = <div style={{textAlign: "left"}}>
                <span>{compare.begin}</span>&nbsp;至
                <br/>
                <span>{compare.end}</span>
            </div>
        }
        // 对null的数据做处理，使其显示为0
        for (let i in current) {
            if (current[i] == null) {
                current[i] = 0
            }
            if (i.includes("ctr")) {
                current[i] = strToPercent(current[i]) + "%";
            }
        }
        for (let i in compare) {
            if (compare[i] == null) {
                compare[i] = 0
            }
            if (i.includes("ctr")) {
                compare[i] = strToPercent(compare[i]) + "%";
            }            
        }
        current.key = 1;
        compare.key = 2;

        data.push(current);
        data.push(compare);
        console.log(data)
        return data;
    }
    render() {
        return (
            <div>
                <Table
                    size="middle"
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
        coverview: state.contentDashboardReducers.coverView.data
    }
}

export default connect(
    mapStateToProps
)(CoverView)
