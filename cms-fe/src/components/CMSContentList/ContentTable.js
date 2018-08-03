import React, {Component} from 'react';
import {message} from 'antd';
import moment from 'moment';
import {DP_POST} from '../../utils/fetch';

import DataTable from '../CMSDataTable';
//列描述
const columns = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
    }, {
        title: 'ID',
        dataIndex: 'uid',
        key: 'uid'
    }, {
        title: '来源',
        dataIndex: 'source',
        key: 'source'
    }, {
        title: '评分',
        dataIndex: 'score',
        key: 'score',
        sorter: true,
    }, {
        title: '入库时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width: 130
    }, {
        title: '来源分类',
        dataIndex: 'category',
        key: 'category'
    }, {
        title: '已利用',
        dataIndex: 'isUsed',
        key: 'isUsed',
        filters: [
            {
                text: '是',
                value: '1'
            }, {
                text: '否',
                value: '0'
            }
        ],
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [
            {
                text: '可利用',
                value: '1'
            }, {
                text: '已放弃',
                value: '0'
            }
        ],
        width: 60
    }, {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 110,
    }, {
        title: 'URL',
        dataIndex: 'url',
        key: 'url'
    }
];

class MaterialTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataCounts: 0,
            loading: false,
            //表格信息
            info: {},
        }
    }

    //更新请求数据
    updateData(params) {
        this.setState({
            loading: true,
            info: params,
        });
        const url = SERVICE_API_URL + '/api/content/list';
        const option = {
            keyWord: params.searchText,
            beginTime: params.beginTime,
            endTime: params.endTime,
            paging: {
                ...params.pagination,
                ...params.sorter,
            },
            isUsed: [],
            status: [],
            ...params.filters,
        };
        console.log(option);
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                const info = [];
                for (let i = 0; i < json.data.data.length; i++) {
                    const data = json.data.data[i];
                    const {uid, isUsed, createTime, status, url} = data;
                    const action = status ?
                        <span>
                            <a onClick={this.cellActionPreviewSecondEdit.bind(this, data)}>二次创作</a>
                            <span className="ant-divider"/>
                            <a onClick={this.cellActionGiveUp.bind(this, data)}>放弃</a>
                        </span> :
                        <span>
                            <a onClick={this.cellActionGiveUp.bind(this, data)}>启用</a>
                        </span>;
                    var obj = {
                        ...data,
                        key: uid,
                        isUsed: isUsed ? '是' : '否',
                        createTime: moment(createTime * 1000).format('YYYY/MM/DD HH:mm:ss'),
                        status: 0 === status ? '已放弃' : '可利用',
                        url: <a href={url}>{url}</a>,
                        action: action,
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
                this.setState({loading: false});
            }
        });
    }

    //二次创作
    cellActionPreviewSecondEdit(cellData) {
        console.log(cellData)
        this.props.history.push('/compose/secondCreation', {
            cellData: cellData
        })
    }

    //放弃
    cellActionGiveUp(cellData) {
        this.setState({loading: true});
        const url = SERVICE_API_URL + '/api/content/updateStatus';
        const option = {
            status: cellData.status ? '0' : '1',
            uids: [cellData.uid]
        };
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                this.updateData(this.state.info);
            } else {
                console.log("上下线失败");
                message.info('获取数据失败');
                console.log(json);
                this.setState({loading: false});
            }
        });
    }

    render() {
        const props = {
            columns: columns,
            data: this.state.data,
            dataCounts: this.state.dataCounts,
            loading: this.state.loading,
            updateData: this.updateData.bind(this),
            pageSize: 10,
            filters: {
                status: ['1'],
            },
            sorter: {
                field: 'createTime',
                order: 'descend',
            },
        };
        return (
            <DataTable {...props}/>
        );
    }
}

export default MaterialTable;
