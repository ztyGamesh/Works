import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';

import {Button, Table} from 'antd';
import GoodsInfo from '../../../components/CMSGoodsImport/GoodsInfo';
import GoodsOperate from '../../../components/CMSGoodsImport/GoodsOperate';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

import {INITDATA} from "../../../reducers/goodsImport";

import {DP_POST} from '../../../utils/fetch';

class GoodsImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            refresh: true,
            autoImportGoods: [],
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                }, {
                    title: 'PID',
                    dataIndex: 'pid'
                },{
                    title: '推广位名称',
                    dataIndex: 'pidName'
                }
            ]
        }
    }

    componentWillMount() {
        // const url = SERVICE_API_URL + '/api/taobaoPid/list';
        // DP_POST(url).then((res) => {
        //     this.props.initData({list: res.data});
        //     this.setState({
        //         list: res.data,
        //     });
        // });
        const url = SERVICE_API_URL + '/api/goods/autoImportGoods';
        const option = {
            isStart: false
        }
        DP_POST(url, {body: option})
            .then((res) => {
                if (res.status === "ok") {
                    const {data} = res;
                    console.log(data);
                    data.forEach((data, index) => {
                        // 将key转成字符串形式
                        data.key = ++index + ""
                    })
                    this.setState({
                        autoImportGoods: data,
                    })
                }
            })
    }

    handleRefresh() {
        this.setState({refresh: !this.state.refresh})
    }

    autoImportGoods() {
        const url = SERVICE_API_URL + '/api/goods/autoImportGoods';
        const option = {
            isStart: true
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === "ok") {
                const {data} = res;
                console.log(data);
                data.forEach((data, index) => {
                    // 将key转成字符串形式
                    data.key = ++index + ""
                })
                this.setState({
                    autoImportGoods: data,
                    disabled: true,
                    message: "自动导入已开始，请及时查看邮件"
                })
            }
        })
    }
    render() {
        return (
            <div style={{width: "100%", "margin": "0 20px"}}>
                <Button
                    disabled={this.state.disabled}
                    onClick={this.autoImportGoods.bind(this)
                    }>商品自动导入</Button>
                {/* 文件信息 */}
                {/* <GoodsInfo list={this.state.list} refresh={this.state.refresh}/> */}
                {/* 分析上传 */}
                {/* <GoodsOperate {...this.props} refresh={this.handleRefresh.bind(this)}/> */}
                {this.state.message}
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.autoImportGoods}
                    bordered
                    style={{background: "white",width:"80%",padding:"10px"}}
                />
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        list: state.goodsImport.list,
    }
}

const mapDispatchtoProps = (dispatch) => {
    return {
        initData: (newData) => {
            dispatch(INITDATA(newData))
        }
    }
}

GoodsImport = connect(mapStateToProps, mapDispatchtoProps)(GoodsImport);

GoodsImport = wrapWithAccessionPermission(GoodsImport);
export default GoodsImport;
