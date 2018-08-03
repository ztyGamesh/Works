/**
 * 财务-媒体提现(未完成)
 */

import React, {Component} from 'react'

import styles from './ConfirmChargeList.less'
import {TableBase, Links, LinkShow, LinkEdit,LinkPid} from '../../../../components/Table'
import {Modal, Button, Icon, Menu, Dropdown, Input, message, DatePicker} from 'antd'
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import {BUSINESSAPIHOST} from '../../../../common/env'
import request from '../../../../utils/request'


const data = [
    {
        name:'111',
        corporation_name:'1111',
        mail:'333@33.com',
        create_time:'2018-01-01',
        status:'un_pay',
        pay_time:'2018-01-08',
        account:'10000',
        id:'1001',
    },
    {
        name:'2222',
        corporation_name:'222',
        mail:'333@33.com',
        create_time:'2018-01-01',
        status:'paid',
        pay_time:'2018-01-08',
        account:'10000',
        id:'1002',
    }
]

class ConfirmChargeList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            modalData: {

            },
            time:'',
            textAreaVal:'',
            columns: [
                {
                    title: '账户名',
                    dataIndex: 'name',
                    width: 120,
                }, {
                    title: '公司名称',
                    dataIndex: 'corporation_name',

                },
                {
                    title: '邮箱',
                    dataIndex: 'mail'
                }, {
                    title:'申请日期',
                    dataIndex:'create_time',
                    sorter: true,
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    // sorter: true,
                    filters: [
                        {text: '已付款', value: 'paid'},
                        {text: '代付款', value: 'un_pay'},
                    ],
                    render: (value, row, index) => (
                        value == 'paid' ? '已付款' : '代付款'
                    )

                },{
                    title:'付款日期',
                    dataIndex:'pay_time',
                },

                {
                    title: '提现金额',
                    dataIndex: 'account'
                },  {
                    title: '操作',
                    dataIndex: 'id',
                    render: (value, rows, index) => (
                        rows.status == 'un_pay'
                            ?
                            <Links>
                                <LinkPid text='付款' onClick={e => this.payHandle(rows)}/>
                            </Links>
                            : rows.status == 'paid'
                                ?
                                <Links>
                                    <LinkPid text='查看' onClick={e => this.showHandle(rows)}/>
                                </Links>
                                :''
                    )
                }
            ]
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     * '4fc68ee9-f239-4440-a36c-d17ef402asdx'
     */
    updateHandle = async(params) => {
        console.log('获取列表参数====>', params)
        const {pageSize, current, filters,status} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/drawlist`,
            method: 'get',
            data: {
                sort: params.sorter.field,
                order: params.sorter.order,
                limit: pageSize,
                offset: pageSize * (current - 1),
                status:status,
                ...filters
            }
        })

        if (res) {
            // return {
            //     rows: data,
            //     total: 2
            // }
            return {
                rows: res.rows,
                total: res.total
            }
        }
    }

    showHandle = async(data = {}) => {
        console.log('showHandle',data)
        this.state.history.push(`/charge/confirmCharge/operate/${data.id}`)
    }
    payHandle = (rows)=>{
        this.setState({
            showVisible:true,
            modalData:{
                corporation_name:rows.corporation_name,
                account:rows.account,
                id:rows.id
            }
        })
    }
    textAreaChangeHandle= async(e)=>{
        await this.setState({
            comment: e.target.value,
            textAreaVal:e.target.value
        })
    }

    paySubmit = async()=>{
        // var req = {
        //     'id': this.state.modalData.id,
        //     'pay_time': this.state.time,
        //     'comment': this.state.textAreaVal
        // }
        // console.log('req',req)
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/paytomedia`,
            method: 'post',
            data: {
                'id': this.state.modalData.id,
                'pay_time': this.state.time,
                'comment': this.state.textAreaVal
            }
        })
        if(res && res.status === 1){
            console.log('res',res)
            message.success('付款成功')
            this.setState({
                showVisible:false
            })

        }else {
            message.error(res && res.msg || '服务器异常')

        }
    }

     onChange = (date, dateString) => {
        console.log(date, dateString);
        this.setState({
            time:dateString
        })

    }

    render() {
        const {columns, showVisible, modalData,userId,textAreaVal,time} = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                        rowKey={'id'}
                    />
                    <Modal title="付款"
                           visible={showVisible}
                           onCancel={e => this.setState({showVisible: false})}
                           footer={
                               <div>
                                   <Button onClick={e => this.setState({showReason: false})}>关 闭</Button>
                                   <Button onClick={this.paySubmit}>提 交</Button>
                               </div>
                           }
                    >

                        <div className={styles.line}>
                            <div>公司名：</div>
                            <div>{modalData.corporation_name}</div>
                        </div>
                        <div className={styles.line}>
                            <div>提现金额：</div>
                            <div>{modalData.account}</div>
                        </div>
                        <div className={styles.line}>
                            <div>打款时间：</div>
                            <DatePicker onChange={this.onChange} />
                        </div>
                        <div className={styles.line}>
                            <div>财务备注：</div>
                            <TextArea autosize={{minRows: 3}}
                                      placeholder="请输入财务备注"
                                      onChange={this.textAreaChangeHandle}
                                      value={ textAreaVal}
                            />
                        </div>

                    </Modal>

                </div>
            </div>
        )
    }
}


export default ConfirmChargeList


