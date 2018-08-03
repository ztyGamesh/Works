import React, {Component} from 'react';
import {Button, message} from 'antd';
import moment from 'moment';
import {DP_POST} from '../../utils/fetch';

import DataTable from '../CMSDataTable';
import ComposePreview from '../CMSComposePreview';
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
        title: '文章来源',
        dataIndex: 'source',
        key: 'source',
        filters: [
            {
                text: 'alibaba',
                value: 'alibaba'
            },
            {
                text: 'deepleaper',
                value: 'deepleaper'
            }
        ]
    },{
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        width: 130,
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [
            {
                text: '在线',
                value: '1'
            }, {
                text: '离线',
                value: '0'
            }
        ]
    },{
        title: '类型',
        key: 'type',
        dataIndex: 'type',
        filters: [
            {
                text: '图文',
                value: '1'
            },
            {
                text: '图集',
                value: '2',
            },
            {
                text: '视频',
                value: '3'
            }
        ]
    }, {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 80,
    }, {
        title: 'URL',
        dataIndex: 'url',
        key: 'url'
    }
];

class PublishTable extends Component {

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

    updateData(params) {
        this.setState({
            loading: true,
            info: params,
        });
        const url = SERVICE_API_URL + '/api/composePublish/list';
        const option = {
            keyWord: params.searchText,
            beginTime: params.beginTime,
            endTime: params.endTime,
            paging: {
                ...params.pagination,
                ...params.sorter,
            },
            ...params.filters,
        };
        console.log(option);
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                const info = [];
                for (let i = 0; i < json.data.data.length; i++) {
                    const data = json.data.data[i];
                    const {uid, updateTime, status, type} = data;
                    const action = status
                        ? <span>
                            <ComposePreview uid={uid} type={'a'}/>
                            <span className="ant-divider"/>
                            <a onClick={this.cellActionOutline.bind(this, data)}>下线</a>
                        </span>
                        : <span>
                            <ComposePreview uid={uid} type={'a'}/>
                            <span className="ant-divider"/>
                            <a onClick={this.cellActionOnline.bind(this, data)}>上线</a>
                        </span>;
                    var obj = {
                        ...data,
                        key: uid,
                        updateTime: moment(updateTime * 1000).format('YYYY/MM/DD HH:mm:ss'),
                        status: status ? '在线' : '离线',
                        type: 1 === type ? '图文' :
                            2 === type ? '图集' : 3 === type ? '视频' : '',
                        action: action,
                        url: '',//<a href={url}>{url}</a>,
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

    //下线
    cellActionOutline(cellData) {
        cellData.token = this.props.token;
        cellData.online = false;
        this.onLineChanged(cellData);
    }

    //上线
    cellActionOnline(cellData) {
        cellData.token = this.props.token;
        cellData.online = true;
        this.onLineChanged(cellData);
    }

    //上下线刷新列表
    onLineChanged(cellData) {
        this.setState({loading: true});
        const url = SERVICE_API_URL + '/api/composePublish/publish';
        const option = {
            publishUser: cellData.publishUser,
            type: cellData.online ? 'online' : 'offline',
            uids: [cellData.uid],
        };
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                this.updateData(this.state.info);
            } else {
                message.info('获取数据失败');
                this.setState({loading: false});
            }
        });
    }

    //预览
    cellActionPreview() {
    }

    //批量上下线
    allOnlineChanged() {
    }

    render() {
        const props = {
            columns: columns,
            data: this.state.data,
            dataCounts: this.state.dataCounts,
            loading: this.state.loading,
            updateData: this.updateData.bind(this),
            pageSize: 10,
            sorter: {
                field: 'updateTime',
                order: 'descend',
            },
            firstPage: false,
            extra: [
                <Button onClick={this.allOnlineChanged.bind(this, 'on')} type="primary" size="small" key={'btnOn'}
                        style={{
                            margin: 10
                        }}>
                    全部上线
                </Button>,
                <Button onClick={this.allOnlineChanged.bind(this, 'off')} type="primary" size="small" key={'btnOff'}
                        style={{
                            margin: 10
                        }}>
                    全部下线
                </Button>
            ]
        };
        return (
            <DataTable {...props}/>
        );
    }
}

export default PublishTable;
