/**
 * 创意审核列表
 * 下拉框，多选字段
 * 是写在组件里，还是单独写，这个地方要再仔细看一下
 */

import React, {Component} from 'react'
import styles from './CooperateList.less'
import {TableBase, Links, LinkShow, LinkEdit,LinkPid} from '../../../../components/Table'
import {Modal, Button, Icon, Menu, Dropdown} from 'antd'
import {BUSINESSAPIHOST} from '../../../../common/env'
import request from '../../../../utils/request'


export default class CooperateList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            modalData: {
                uid: ''
            },
            userId:null,
            columns: [
                {
                    title: '内容合作名称',
                    dataIndex: 'cooperate_name',
                    width: 120,
                }, {
                    title: '接入应用',
                    dataIndex: 'media_name',

                }, {
                    title: '接入方式',
                    dataIndex: 'use_mode',

                }, {
                    title: '创建时间',
                    dataIndex: 'create_time'
                }, {
                    title: '操作',
                    dataIndex: 'uid',
                    render: (value, rows, index) => {
                        var isEdit = 0 ;
                            if(rows.tb_media == null
                            || rows.tb_media == ''
                            || rows.tb_pid == null
                            || rows.tb_pid == ''
                            || rows.tb_app_key == null
                            || rows.tb_app_key == ''
                            || rows.tb_app_secret == null
                            || rows.tb_app_secret == ''){
                                isEdit = 0

                            }
                            else {
                                isEdit = 1
                            }
                            return(
                                <Links>
                                    <LinkShow onClick={e => this.showHandle(rows)}/>
                                    <LinkPid text={ isEdit ? '修改pid' : '关联pid'} onClick={e => this.editHandle(value,isEdit)}/>
                                </Links>
                            )

                    }
                }
            ]
        }
    }

    componentWillMount() {
        const { userId } = this.props
        if (userId || userId === 0) {
            this.setState({ userId })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { userId } = nextProps
        if (userId || userId === 0) {
            this.setState({ userId })
        }
    }


    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async(params) => {
        console.log('获取列表参数====>', params)
        const {pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/feeds/getFeeds`,
            method: 'get',
            data: {
                // uid: this.props.userId,
                search: params.searchText,
                sort: params.sorter.field,
                order: params.sorter.order,
                limit: pageSize,
                offset: pageSize * (current - 1),
                ...filters
            }
        })

        if (res) {
            return {
                rows: res.data.rows,
                total: res.data.total
            }
        }
    }


    addHandle = () => {
        const {history} = this.state
        history.push('/media/cooperate/addCooperate')
    }

    showHandle = async(data = {}) => {
        console.log('showHandle',data)
        const res = await request({
            url: `${BUSINESSAPIHOST}/feeds/getFeeds`,
            method: 'get',
            data: {
                uid: data.uid,

            }
        })
        if(res){
            console.log('show  res',res)
            // var medias = [];
            // res.data.media.map((currentValue, index)=>{
            //     medias.push(currentValue.name)
            // })
            // console.log('medias',medias)
            this.setState({
                showVisible: true,
                modalData: {
                    cooperate_name: res.data.cooperate_name || '',
                    uid: res.data.uid || '',
                    media_name: res.data.media_name || '',
                    media_uid:res.data.media_uid || '',
                }
            })
        }


    }

    //改成关联PID
    editHandle = (uid , isEdit) => {
        const {history} = this.state
        isEdit
            ? history.push('/media/cooperate/pidCooperate/' + uid +"/"+ isEdit)
            : history.push('/media/cooperate/pidCooperate/' + uid )
    }


    render() {
        const {columns, showVisible, modalData,userId} = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="新建内容合作"
                        search="内容合作名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                        // init={userId !== null}
                    />
                    <Modal title="内容合作信息"
                           visible={showVisible}
                           onCancel={e => this.setState({showVisible: false})}
                           footer={<Button onClick={e => this.setState({showVisible: false})}>关 闭</Button>}
                    >

                        <div className={styles.line}>
                            <div>内容合作名称：</div>
                            <div>{modalData.cooperate_name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>内容合作ID：</div>
                            <div>{modalData.uid}</div>
                        </div>
                        <div className={styles.line}>
                            <div>应用名称：</div>
                            <div>{modalData.media_name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>应用ID：</div>
                            <div>{modalData.media_uid}</div>
                        </div>

                    </Modal>

                </div>
            </div>
        )
    }
}


