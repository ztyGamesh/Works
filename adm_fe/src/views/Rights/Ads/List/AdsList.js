/**
 * 广告主账户列表页
 */

import React, {Component} from 'react'
// import {connect} from 'react-redux';
import styles from './AdsList.less'
import {TableBase, Links, LinkShow, LinkEdit, LinkAttached} from '../../../../components/Table'
import {Modal, Button, Icon, Menu, Dropdown,Input ,message} from 'antd'
const { TextArea } = Input;
import {BUSINESSAPIHOST} from '../../../../common/env'
import request from '../../../../utils/request'


class AdsList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            showAttached:false,
            showAttachedDetail:false,
            modalData: {
                uid: ''
            },
            attachedList: [],
            attachedTitle:0,
            init:true,
            advertiser:'',
            dmc_accounts:[],
            textAreaVal:'',
            columns: [
                {
                    title: '账户名',
                    dataIndex: 'name',
                    width: 120,
                }, {
                    title: '状态',
                    dataIndex: 'pause',
                    sorter: true,
                    render: (value, row, index) => (
                        <A value={value} row={row} index={index}/>
                    )

                },{
                    title: '公司名称',
                    dataIndex: 'corporation_name',
                },  {
                    title: '邮箱',
                    dataIndex: 'mail'
                }, {
                    title: '手机号码',
                    dataIndex: 'tel'
                }, {
                    title: '媒体名单',
                    dataIndex: 'media_name'
                }, {
                    title: '关联状态',
                    dataIndex: 'dmc_attached',
                    render: (value, row, index) => (
                       value == 1
                           ? '已关联'
                           : '未关联'
                    )
                },
                {
                    title: 'DMC关联',
                    dataIndex: 'dmc_attached_1',
                    render: (value, rows, index) => (
                        rows.dmc_attached == 0
                            ?
                            <Links>
                                <LinkAttached onClick={e => this.addAttachedHandle(rows)}/>
                            </Links>
                            :
                            <Links>
                                <LinkShow onClick={e => this.showAttachedHandle(rows)}/>
                                <LinkEdit onClick={e => this.editAttachedHandle(rows)}/>
                            </Links>
                    )
                },
                {
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


    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async(params) => {
        console.log('获取列表参数====>',params)
        const {pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/clientuserlist`,
            method: 'get',
            data: {
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

    //新建广告主账户
    addHandle = () => {
        const {history} = this.state
        history.push('/rights/Ads/operate')
    }
    //查看广告主账户
    showHandle = async(data = {}) => {
        // console.log('showHandle',data)
        const res = await request({
            url: `${BUSINESSAPIHOST}/user/userdetail`,
            method: 'get',
            data: {
                uid: data.uid,

            }
        })
        if(res){
            // console.log('show  res',res)
            var medias = [];
            res.data.media.map((currentValue, index)=>{
                medias.push(currentValue.name)
            })
            // console.log('medias',medias)
            this.setState({
                showVisible: true,
                modalData: {
                    name: res.data.name || '',
                    mail: res.data.mail || '',
                    tel: res.data.tel || '',
                    corporation_name:res.data.corporation_name || '',
                    media:medias.join('、')
                }
            })
        }
    }
    //修改广告主账户
    editHandle = (uid) => {
        const {history} = this.state
        history.push('/rights/Ads/operate/' + uid)
    }


    //查看关联
    showAttachedHandle = async(data = {}) => {

        // console.log('showAttachedHandle',data)
        this.setState({
            showAttachedDetail:true,
        })
        const res = await request({
            url: `${BUSINESSAPIHOST}/dmc/getAttachAccount`,
            method: 'get',
            data: {
                advertiser: data.mail,
            }
        })
        if(res){
            this.setState({
                attachedList:res.data
            })
        }
    }
    //DMC关联
    addAttachedHandle= async(data={})=>{
        // console.log('add',data)
        this.setState({
            showAttached:true,
            attachedTitle:0,
            advertiser:data.mail
        })
    }
    //关联输入
    textAreaBlurHandle= async(e)=>{
        console.log(e.target.value)
        var aaa =e.target.value.trim().split('\n');
        await this.setState({
            dmc_accounts: aaa
        })
    }
    textAreaChangeHandle= async(e)=>{
        console.log(e.target.value)
        var aaa =e.target.value.trim().split('\n');
        await this.setState({
            dmc_accounts: aaa,
            textAreaVal:e.target.value
        })
    }
    //修改关联
    editAttachedHandle= async(data={})=>{
        console.log('edit',data,this)
        this.setState({
            showAttached:true,
            attachedTitle:1,
            advertiser:data.mail
        })
        const res = await request({
            url: `${BUSINESSAPIHOST}/dmc/getAttachAccount`,
            method: 'get',
            data: {
                advertiser: data.mail,
            }

        })
        if(res){
            console.log('editAttachedHandle res',res)
            await this.setState({
                textAreaVal:res.data.join('\n')
            })
        }
    }

    //关联提交
    attactAccountSubmit = async(e)=>{
        console.log('data',this, e)
        const res = await request({
        url: `${BUSINESSAPIHOST}/dmc/attachAccount`,
        method: 'post',
        data: {
            advertiser: this.state.advertiser,
            dmc_accounts:this.state.dmc_accounts

            }

        })
        if(res){
            console.log('submit res',res)
            await this.setState({
                init:true
            })
            message.success( this.state.attachedTitle == 0 ? '关联成功' : '修改成功')
            this.state.update();
        }
        else {
            message.error(res && res.msg || '服务器异常')

        }
        await this.setState({
            showAttached:false
        })
    }

    render() {
        const {columns,
            showVisible,
            modalData,
            showAttached,
            attachedTitle,
            attachedList,
            showAttachedDetail,
            init,
            textAreaVal
        } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="添加广告主账户"
                        search="搜索广告主账户"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'pause', order: 'desc' }}
                        init={init}
                        saveUpdate={e=>this.setState({update: e})}

                    />
                    <Modal title="广告主账户信息"
                           visible={showVisible}
                           onCancel={e => this.setState({showVisible: false})}
                           footer={<Button onClick={e => this.setState({showVisible: false})}>关 闭</Button>}
                    >
                        <div className={styles.line}>
                            <div>账户名：</div>
                            <div>{modalData.name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>公司名称：</div>
                            <div>{modalData.corporation_name}</div>
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
                            <div>配置媒体名单：</div>
                            <div>{modalData.media}</div>
                        </div>
                    </Modal>
                    <Modal title={attachedTitle == 0 ? '新建关联' : '修改关联'}
                           visible={showAttached}
                           onCancel={e => this.setState({showAttached: false})}
                           footer={
                               <div>
                                   <Button onClick={e => this.setState({showAttached: false})}>关 闭</Button>
                                   <Button onClick={this.attactAccountSubmit}>提 交</Button>
                               </div>
                           }
                    >
                        <div className={styles.line}>
                            <TextArea autosize={{minRows: 10}}
                                      placeholder="可以输入多个DMC账户，以回车键隔开"
                                        onBlur={this.textAreaBlurHandle}
                                      onChange={this.textAreaChangeHandle}
                                      value={ textAreaVal}
                            />
                        </div>
                    </Modal>
                    <Modal title={'查看关联'}
                           visible={showAttachedDetail}
                           onCancel={e => this.setState({showAttachedDetail: false})}
                           footer={
                               <div>
                                   <Button onClick={e => this.setState({showAttachedDetail: false})}>关 闭</Button>
                               </div>
                           }
                    >
                            <div className={styles.line2}>
                                {
                                    attachedList.map(
                                        item => <div key={item}>{item}</div>
                                    )
                                }
                            </div>
                    </Modal>
                </div>
            </div>
        )
    }
}


export default AdsList

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
