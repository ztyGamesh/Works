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
        title: '作者筛选→',
        dataIndex: 'filterUser',
        key: 'filterUser'
    },{
        title: '作者',
        dataIndex: 'createUser',
        key: 'createUser'
    }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        width: 130,
    }, {
        title: '状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        filters: [
            {
                text: '通过',
                value: '3'
            }, {
                text: '拒绝',
                value: '2'
            }, {
                text: '待审核',
                value: '1'
            },
        ]
    }, {
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
    },{
        title: '是否原创',
        key: 'contentUid',
        dataIndex: 'contentUid',
        filters: [
            {
                text: '原创',
                value: '0',
            }, {
                text: '非原创',
                value: '1',
            }
        ]
    }, {
        title: '推荐平台',
        key: 'channel',
        dataIndex: 'channel'
    }, {
        title: '来源分类',
        key: 'category',
        dataIndex: 'category'
    }, {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 45,
    }, {
        title: 'URL',
        dataIndex: 'url',
        key: 'url'
    }, {
        title: '审核人',
        dataIndex: 'auditor',
        key: 'auditor'
    }
];

class AuditTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: columns,
            data: [],
            dataCounts: 0,
            loading: false,
            //表格信息
            info: {},
        }
    }

    componentWillMount() {
        //获取推荐平台列表
        const url = SERVICE_API_URL + "/api/channel/list";
        DP_POST(url, {body: ''}).then((res) => {
            if (res.status === 'ok') {
                const filters = res.data.map(t => ({
                    text: t.name,
                    value: t.id,
                }));
                const columns = this.state.columns.map(t =>
                    'channel' === t.key ? {
                        ...t,
                        filters: filters,
                    } : {...t}
                );
                this.setState({
                    columns: columns,
                });
            }
        })

        const userUrl = SERVICE_AUTH_URL + "/User/GetUserList";
        DP_POST(userUrl, {body: ''}).then((res) => {
            if (res.status === 'ok') {
                const userFilters = res.data.map((userId) => {
                    return {
                        text: userId,
                        value: userId
                    }
                })
                const userColumns = this.state.columns.map(t =>
                    'filterUser' === t.key ? {
                        ...t,
                        filters: userFilters
                    } : { ...t }
                );
                this.setState({
                    columns: userColumns
                })
            }
        })
    }


    //更新请求数据
    updateData(params) {
        this.setState({
            loading: true,
            info: params,
        });
        const url = SERVICE_API_URL + '/api/audit/list';
        let option = {
            keyWord: params.searchText,
            beginTime: params.beginTime,
            endTime: params.endTime,
            paging: {
                ...params.pagination,
                ...params.sorter,
            },
            auditStatus: [],
            channel: [],
            ...params.filters,
        };
        //过滤未提交
        if (0 === option.auditStatus.length) {
            option.auditStatus = ['1', '2', '3'];
        }
        console.log(option);
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                const info = [];
                for (let i = 0; i < json.data.data.length; i++) {
                    const data = json.data.data[i];
                    //把上一次的查询条件挂在到返回的数据上面
                    data.lastSearchCondition = option;
                    const {uid, auditStatus, category, contentUid, updateTime, type} = data;
                    const action = <a onClick={this.cellActionEdit.bind(this, data)}>编辑</a>;
                    var obj = {
                        ...data,
                        key: uid,
                        auditStatus: 1 === auditStatus ? '待审核' :
                            2 === auditStatus ? '拒绝' : '通过',
                        category: category || '无',
                        contentUid: contentUid ? '非原创' : '原创',
                        type: 1 === type ? '图文' :
                            2 === type ? '图集' : 3 === type ? '视频': '',
                        updateTime: moment(updateTime * 1000).format('YYYY/MM/DD HH:mm:ss'),
                        url: '',//<a href={url}>{url}</a>,
                        auditor: 'auditor',//......
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

    //编辑
    cellActionEdit(cellData) {
        switch (cellData.type) {
            case 1:
                this.props.history.push('/audit/detail', {
                    cellData: cellData
                });
                break;
            case 2:
                this.props.history.push('/audit/pic', {
                    cellData: cellData
                });
                break;
            case 3:
                this.props.history.push('/audit/video', {
                    cellData: cellData
                });
                break;
        }
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
            backInfo: this.props.location.state ? this.props.location.state.backInfo : null
        };
        return (
            <DataTable {...props}/>
        );
    }
}

export default AuditTable;
