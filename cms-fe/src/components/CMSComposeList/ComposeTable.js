import React, {Component} from 'react';
import {Radio, message} from 'antd';
import moment from 'moment';
import {DP_POST} from '../../utils/fetch';

import DataTable from '../CMSDataTable';

const RadioGroup = Radio.Group;
//列描述
const columnsOthers = [
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
    }, {
        title: 'ID',
        dataIndex: 'uid',
        key: 'uid'
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
    }, {
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
        title: '来源分类',
        key: 'category',
        dataIndex: 'category',
    }, {
        title: '拒绝理由',
        dataIndex: 'comment',
        key: 'comment'
    }, {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width: 45,
    }, {
        title: 'URL',
        dataIndex: 'url',
        key: 'url'
    }
];

const columns = columnsOthers.map(t =>
    'auditStatus' === t.key ? {
        ...t,
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
            }, {
                text: '未提交',
                value: '0'
            }
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
            //查看其他人作品
            otherUser: false,
            //是否返回第一页
            firstPage: false,
        }
    }

    componentWillMount() {
        //获取分类列表
        const url = SERVICE_API_URL + "/api/category/levelTop";
        DP_POST(url, {body: ''}).then((res) => {
            if (res.status === 'ok') {
                const filters = res.data.map(t => {
                    return {
                        text: t.level1,
                        value: t.code,
                    }
                });
                const columns = this.state.columns.map(t =>
                    'category' === t.key ? {
                        ...t,
                        filters: filters,
                    } : {...t}
                );
                const columnsOthers = this.state.columnsOthers.map(t =>
                    'category' === t.key ? {
                        ...t,
                        filters: filters,
                    } : {...t}
                );
                this.setState({
                    columns: columns,
                    columnsOthers: columnsOthers,
                });
            }
        })
    }

    //更新请求数据
    updateData(params, firstPage = false) {
        this.setState({
            loading: true,
            info: params,
            firstPage: firstPage,
        });
        const url = SERVICE_API_URL + '/api/compose/list';
        const option = {
            keyWord: params.searchText,
            beginTime: params.beginTime,
            endTime: params.endTime,
            createUser: JSON.parse(sessionStorage.token).user,
            otherUser: this.state.otherUser,
            paging: {
                ...params.pagination,
                ...params.sorter,
                //返回第一页
                number: firstPage ? 1 : params.pagination.number,
            },
            auditStatus: [],
            contentUid: [],
            category: [],
            ...params.filters,
        };
        //查看其他人作品只查看通过作品
        if (this.state.otherUser) {
            option.auditStatus = ['3'];
        }
        console.log(option);
        DP_POST(url, {body: option}).then((json) => {
            if (json.status === "ok") {
                const info = [];
                for (let i = 0; i < json.data.data.length; i++) {
                    const data = json.data.data[i];
                    const {uid, auditStatus, category, contentUid, type, updateTime} = data;
                    const action = (!this.state.otherUser && (0 === auditStatus || 2 === auditStatus)) ?
                        <a onClick={this.cellActionEdit.bind(this, data)}>编辑</a> :
                        <a onClick={this.cellActionEdit.bind(this, data)}>查看</a>;
                    var obj = {
                        ...data,
                        key: uid,
                        auditStatus: 0 === auditStatus ? '未提交' :
                            1 === auditStatus ? '待审核' :
                                2 === auditStatus ? '拒绝' : '通过',
                        category: category || '无',
                        contentUid: contentUid ? '非原创' : '原创',
                        type: 1 === type ? '图文' :
                            2 === type ? '图集' : 3 === type ? '视频' : '',
                        updateTime: moment(updateTime * 1000).format('YYYY/MM/DD HH:mm:ss'),
                        url: '',//json.data.data[i].url,
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
                this.setState({
                    loading: false,
                });
            }
        });
    }

    //编辑
    cellActionEdit(cellData) {
        if (!this.state.otherUser && (0 === cellData.auditStatus || (2 === cellData.auditStatus))) {
            switch (cellData.type) {
                case 1:
                    this.props.history.push('/compose/add', {
                        cellData: cellData
                    });
                    break;
                case 2:
                    this.props.history.push('/compose/pic', {
                        cellData: cellData
                    });
                    break;
                case 3:
                    this.props.history.push('/compose/video', {
                        cellData: cellData
                    });
                    break;
            }
        } else {
            this.props.history.push('/compose/detail', {
                cellData: cellData
            });
        }
    }

    handleUserChanged(e) {
        this.setState({
            otherUser: e.target.value,
        }, () => this.updateData(this.state.info, true));
    }

    render() {
        const props = {
            columns: this.state.otherUser ? this.state.columnsOthers : this.state.columns,
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
            extra:
                <RadioGroup onChange={this.handleUserChanged.bind(this)} value={this.state.otherUser}>
                    <Radio value={false}>自己作品</Radio>
                    <Radio value={true}>其他人作品</Radio>
                </RadioGroup>
        };
        return (
            <DataTable {...props}/>
        );
    }
}

export default CreationTable;
