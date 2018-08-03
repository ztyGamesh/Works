// 每条商品的展示项目
// 1.图片 2.标题 3.url 4.价格 5.销量 6.佣金 7.佣金比例 8.添加状态
import React, {Component} from 'react';
import {Radio, message, Button} from 'antd';
import moment from 'moment';
import {DP_POST} from '../../utils/fetch';

import DataTable from '../CMSDataTable';

const RadioGroup = Radio.Group;
//列描述

const columnsOthers = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 130
    }, {
        title: '图片',
        dataIndex: 'cover',
        key: 'cover',
        width: 130,
        render: (text) => {
            return <img src={text} style={{width: "80px",height: "80px"}}></img>
        }
    }, {
        title: '价格(元)',
        dataIndex: 'price',
        key: 'price',
        sorter: true,
        width: 130,
        render: (price) => {
            return (price/100)
        }
    }, {
        title: '销量',
        dataIndex: 'sale',
        sorter: true,
        key: 'sale',
    }, {
        title: '佣金(元)',
        key: 'income',
        sorter: true,
        dataIndex: 'income',
        render: (price) => {
            return (price/100)
        }
    }, {
        title: '佣金比例(%)',
        key: 'income_rate',
        sorter: true,
        dataIndex: 'income_rate',
        render: (rate) => {
            return (rate/100)
        }
    }, {
        title: '状态',
        key: 'isChosen',
        dataIndex: 'isChosen',
        width: 60,
        render: (isChosen) => {
            if (isChosen === 'FALSE') {
                return <span>未添加</span>
            } else if (isChosen === 'TRUE') {
                return <span>已添加</span>
            }
        }
    },{
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 60
    }, {
        title: '商品详情页',
        dataIndex: 'url',
        key: 'url',
        render: (url) => {
            return <Button onClick={() => {
                window.open(url)
            }}>点击跳转</Button>
        }
    },
];

const columns = columnsOthers.map(t =>
    'isAdd' === t.key ? {
        ...t,
        filters: [
            {
                text: '已添加',
                value: '1'
            }, {
                text: '未添加',
                value: '0'
            },
        ]
    } : {...t}
);

class CreationTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: columns,
            columnsOthers: columnsOthers,
            data: [],
            dataCounts: 0,
            loading: false,
            //表格信息
            info: {},
            //是否返回第一页
            firstPage: false,
            //是否选择商品分类
            searchStart: false,
            // 商品的查询条件
            searchCondition: null,
            // 商品的level
            searchLevel: 0
        }
    }


    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.searchCondition);
        // console.log(this.state.searchCondition);
        if (nextProps.searchCondition !== this.state.searchCondition) {
            this.setState({
                firstPage: true
            })
        }
        if (nextProps.searchCondition) {
            this.setState({
                searchCondition: nextProps.searchCondition,
                searchLevel: nextProps.searchLevel,
                searchStart: true,
            }, () => {
                const params = {
                    searchText: '',
                    pagination: {
                        size: 10,
                        number: 1,
                    },
                    sorter: {
                        field: '',
                        order: 'asc',
                    },
                    filters: '',
                    searchCondition: this.state.searchCondition,
                    searchLevel: this.state.searchLevel
                };
                this.updateData(params)
            })

        }
    }

    //更新请求数据
    updateData(params, firstPage = false) {
        console.log(params);
        this.setState({
            loading: true,
            info: params,
            firstPage: firstPage,
        });
        // // 商品列表数据接口
        const url = SERVICE_API_URL + '/api/goodsLibrary/getGoods';
        const option = {
            searchText: params.searchText || "",
            paging: {
                ...params.pagination,
                ...params.sorter,
                //返回第一页
                number: firstPage ? 1 : params.pagination.number,
            },
            ...params.filters,
            sorter: {
                ...params.sorter
            },
            searchCondition: params.searchCondition,
            level: params.searchLevel,
            user_uid: JSON.parse(sessionStorage.token).user

        };
        console.log(option);
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                console.log(json);
                const info = [];
                for (let i = 0; i < json.data.data.length; i++) {
                    const data = json.data.data[i];
                    //title src price sales commission scale isAdd url from data
                    const {cover, income, income_rate, isChosen, price, sale, title, url, uid} = data;
                    const action = isChosen === "FALSE"
                    ? <Button onClick={this.handleAddCommodity.bind(this, uid)}>添加</Button>
                    : <Button style={{color:"black", background:"gray"}}>已添加</Button>;
                    var obj = {
                        ...data,
                        key: uid,
                        action: action
                        // 更新每个数据
                    }
                    info.push(obj);
                }
                this.setState({
                    data: info,
                    dataCounts: json.data.total,
                    loading: false,
                });
            } else {
                message.info('获取数据失败');
                this.setState({
                    loading: false,
                });
            }
        });
    }

    handleAddCommodity (uid) {
        // http://localhost:7011/api/goodsLibrary/addFavorite
        // {
        //     "user_uid":"user25",
        //     "goods_uid":"06b6ad3b-c067-11e7-a469-00163e32dad0"
        // }
        const url = SERVICE_API_URL + '/api/goodsLibrary/addFavorite';
        const option = {
            "user_uid": JSON.parse(sessionStorage.token).user,
            "goods_uid": uid
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === "ok") {
                message.success("商品添加成功,状态已改变")
                var tempData = this.state.data.map((item) => {
                    if (item.uid === uid) {
                        item.isChosen = "TRUE"
                    }
                    return item
                })
                this.setState({
                    data: tempData
                })
            }
        })
    }
    render() {
        const props = {
            columns: this.state.columns,
            data: this.state.data,
            dataCounts: this.state.dataCounts,
            loading: this.state.loading,
            updateData: this.updateData.bind(this),
            pageSize: 10,
            sorter: {
                field: 'updateTime',
                order: 'descend',
            },
            firstPage: this.state.firstPage,
            hiddenDate: true,
            searchCondition: this.state.searchCondition,
            level: this.state.searchLevel
        };
        const initProps = {
            columns: [],
            hiddenDate: true
        };
        return (
            this.state.searchStart ? <DataTable {...props}/>: <DataTable {...initProps}/>
        );
    }
}

export default CreationTable;
