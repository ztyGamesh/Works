/**
 * 媒体账户列表页
 */

import React, {Component} from 'react'
import {connect} from 'react-redux';

import styles from './PublisherList.less'
import {TableBase, Links, LinkShow, LinkEdit} from '../../../../components/Table'
import {Modal, Button, Icon, Menu, Dropdown} from 'antd'
import {BUSINESSAPIHOST} from '../../../../common/env'
import request from '../../../../utils/request'


 class PublisherList extends Component {

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
                    title: '账户名称',
                    dataIndex: 'name',
                    width: 120,
                }, {
                    title: '账户类型',
                    dataIndex: 'media_type',
                    filters: [
                        {text: '媒体', value: 'media'},
                        {text: 'ADX', value: 'adx'},
                    ],
                    render: (value, row, index) => (
                        value == 'media' ? "媒体" : 'ADX'
                    )

                }, {
                    title: '状态',
                    dataIndex: 'pause',
                    sorter: true,
                    filters: [
                        {text: '启用', value: '0'},
                        {text: '冻结', value: '1'},
                        {text: '暂停', value: '2'}
                    ],
                    render: (value, row, index) => (
                           <A value={value} row={row} index={index}/>
                    )

                }, {
                    title: '邮箱',
                    dataIndex: 'mail'
                }, {
                    title: '手机号码',
                    dataIndex: 'tel'
                }, {
                    title: '系统权限',
                    dataIndex: 'allow_platform_role'
                }, {
                    title: '操作',
                    dataIndex: 'uid',
                    render: (value, rows, index) => (
                        <Links>
                            <LinkShow onClick={e => this.showHandle(rows)}/>
                            <LinkEdit onClick={e => this.editHandle(value)}/>
                        </Links>
                    )
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
     * '4fc68ee9-f239-4440-a36c-d17ef402asdx'
     */
    updateHandle = async(params) => {
        console.log('获取列表参数====>', this.props.userId)
        const {pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/childuser`,
            method: 'get',
            data: {
                uid: this.props.userId,
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
                rows: res.rows,
                total: res.total
            }
        }
    }


    addHandle = () => {
        const {history} = this.state
        history.push('/rights/publisher/operate')
    }

    showHandle = async(data = {}) => {
        console.log('showHandle',data)
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/userdetail`,
            method: 'get',
            data: {
                uid: data.uid,

            }
        })
        if(res){
            console.log('show  res',res)
            var medias = [];
            res.data.media.map((currentValue, index)=>{
                medias.push(currentValue.name)
            })
            console.log('medias',medias)
            this.setState({
                showVisible: true,
                modalData: {
                    name: res.data.name || '',
                    mail: res.data.mail || '',
                    tel: res.data.tel || '',
                    media:medias.join('、')
                }
            })
        }


    }

    editHandle = (uid) => {
        const {history} = this.state
        history.push('/rights/publisher/operate/' + uid)
    }


    render() {
        const {columns, showVisible, modalData,userId} = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="添加媒体/平台账户"
                        search="搜索媒体账户"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'pause', order: 'desc' }}
                        init={userId !== null}
                    />
                    <Modal title="媒体账户信息"
                           visible={showVisible}
                           onCancel={e => this.setState({showVisible: false})}
                           footer={<Button onClick={e => this.setState({showVisible: false})}>关 闭</Button>}
                    >

                        <div className={styles.line}>
                            <div>账户名：</div>
                            <div>{modalData.name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>邮件：</div>
                            <div>{modalData.mail}</div>
                        </div>
                        <div className={styles.line}>
                            <div>手机：</div>
                            <div>{modalData.tel}</div>
                        </div>
                        <div className={styles.line}>
                            <div>联盟媒体：</div>
                            <div>{modalData.media}</div>
                        </div>

                    </Modal>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log('state1111111111111',state.user.uid)
    return{
        userId: state.user.uid,
    }
}
export default connect(mapStateToProps,null)(PublisherList)


 class A extends Component {
     /**
      * @method handleMenuClick 开关组件点击事件，更新数据
      */
     handleMenuClick = async(e, rows) => {
         console.log(e.key);
         console.log(rows);
         const res = await request({
             url: `${BUSINESSAPIHOST}/user/changeuserstatus`,
             method: 'post',
             data: {
                 uid:rows.uid,
                 field:'pause',
                 val:e.key,
             }
         })

         if (res.status === 1) {
             console.log('成功')
             console.log('props',this.props)
             this.props.onUpdate();
             return true
         }
         else {

             console.log('失败')
             return false
         }


     }
    render() {
        const { onClick, disabled, index , row , value} = this.props
        return (
            <div>
                <Dropdown overlay={(<Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                    <Menu.Item key="0">启动</Menu.Item>
                    <Menu.Item key="1">冻结</Menu.Item>
                    <Menu.Item key="2">暂停</Menu.Item>
                </Menu>)}
                >
                    <Button style={{marginLeft: 8}}>
                        {
                            value == 0 ? '启动' : value == 1 ? '冻结' : '暂停'
                        }
                        <Icon type="down"/>
                    </Button>
                </Dropdown>
            </div>
        )
    }
}
