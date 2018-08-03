/**
 * @class 页面 审核管理-关键词审核
 */
import React, {Component} from 'react'

import styles from './KeyWord.less'
import {TableBase, Batchs, BatchLink} from '../../../components/Table'
import {BUSINESSAPIHOST} from '../../../common/env'
import {batchDelete, batchPass, batchReject} from './KeyWordBatch'
import {Tabs, Modal, Button, Icon, Menu, Dropdown, Input, DatePicker} from 'antd'
import request from '../../../utils/request'
import locale from 'antd/lib/date-picker/locale/zh_CN';

const TabPane = Tabs.TabPane;
import moment from 'moment';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;

function todaySubtract(x) {
    return moment().subtract(x, 'days');
}
function formateTime (times) {
    const time = new Date(times);
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
}
export default class KeyWord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            value: [todaySubtract(0), todaySubtract(0)],
            value2: [todaySubtract(0), todaySubtract(0)],

            // showVisible: false,
            begin:'',
            end:'',
            begin2:'',
            end2:'',
            noPass:false,
            pass:false,
            tabId:1,
            columns: [
                {
                    title: '关键词名称',
                    dataIndex: 'word',
                }, {
                    title: '操作',
                    dataIndex: 'corporation_name',
                    render:(value, rows, index)=>{
                        return(
                            <div>
                                <div onClick={e => this.passHandle(rows)} className={styles.optBtn}>通过</div>
                                <div onClick={e => this.noPassHandle(rows)} className={styles.optBtn}>不通过</div>
                            </div>
                        )
                    }

                }, {
                    title: '算法结果',
                    dataIndex: 'category',
                    filters: [
                        // { text: '正常', value: '0' },
                        { text: '垃圾信息', value: '1' },
                        { text: '谩骂', value: '2' },
                        // { text: '色情', value: '3' },
                        // { text: '恐暴', value: '4' },
                        // { text: '涉政', value: '5' },

                    ],
                    render:(value,rows,index)=>{
                        var res;
                        switch (value){
                            // case '0':
                            //     res = '正常';
                            //     break;
                            case '1':
                                res = '垃圾信息';
                                break;
                            case '2':
                                res = '谩骂';
                                break;
                            // case '3':
                            //     res = '色情';
                            //     break;
                            // case '4':
                            //     res = '恐暴';
                            //     break;
                            // case '5':
                            //     res = '涉政';
                            //     break;
                        }
                        return(
                            <div>{res}</div>
                        )
                    }
                },
                {
                    title: '审核时间',
                    dataIndex: 'edit_time',
                }

            ],
            noPass_columns: [
                {
                    title: '关键词名称',
                    dataIndex: 'word',
                }, {
                    title: '审核结果',
                    dataIndex: 'category',
                    filters: [
                        // { text: '正常', value: '0' },
                        { text: '垃圾信息', value: '1' },
                        { text: '谩骂', value: '2' },
                        // { text: '色情', value: '3' },
                        // { text: '恐暴', value: '4' },
                        // { text: '涉政', value: '5' },

                    ],
                    render:(value,rows,index)=>{
                        var res;
                        switch (value){
                            // case '0':
                            //     res = '正常';
                            //     break;
                            case '1':
                                res = '垃圾信息';
                                break;
                            case '2':
                                res = '谩骂';
                                break;
                            // case '3':
                            //     res = '色情';
                            //     break;
                            // case '4':
                            //     res = '恐暴';
                            //     break;
                            // case '5':
                            //     res = '涉政';
                            //     break;
                        }
                        return(
                            <div>{res}</div>
                        )
                    }

                },{
                    title: '审核状态',
                    dataIndex: 'audit_status',
                    render:(value, rows, index)=>{
                        return(
                            <div>未通过</div>
                        )
                    }
                }, {
                    title: '审核时间',
                    dataIndex: 'edit_time',
                },{
                    title: '操作',
                    dataIndex: 'id',
                    render:(value, rows, index)=>{
                        return(
                            <div onClick={e => this.passHandle(rows)} className={styles.optBtn}>通过</div>
                        )
                    }

                }
            ],
            pass_columns: [
                {
                    title: '关键词名称',
                    dataIndex: 'word',
                }, {
                    title: '审核状态',
                    dataIndex: 'audit_status',
                    render:(value, rows, index)=>{
                        return(
                            <div>通过</div>
                        )
                    }
                }, {
                    title: '通过时间',
                    dataIndex: 'edit_time',
                },{
                    title: '操作',
                    dataIndex: 'id',
                    render:(value, rows, index)=>{
                        return(
                            <div onClick={e => this.noPassHandle(rows)} className={styles.optBtn}>不通过</div>
                        )
                    }

                }
            ],
        }
    }



    componentWillMount() {
        this.setState({
            begin:formateTime(todaySubtract(0)),
            end:formateTime(todaySubtract(0)),
            begin2:formateTime(todaySubtract(0)),
            end2:formateTime(todaySubtract(0)),
        })
        console.log('time',formateTime(todaySubtract(0)))

    }



    /**
     * @method updateHandle(params:Object) 获取待复审数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async(params) => {
        console.log('待复审列表参数====>', params)
        const { pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/wordaudit/search`,
            method: 'get',
            data: {
                audit_status: 3,
                word: params.searchText,
                begin:'',
                end:'',
                // sort: params.sorter.field,
                // order: params.sorter.order,
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
    /**
     * @method noPassUpdateHandle(params:Object) 获取复审不通过数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    noPassUpdateHandle = async (params) => {
        console.log('复审不通过列表参数====>', params)
        this.setState({
            noPass:true,
        })
        const { pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/wordaudit/search`,
            method: 'get',
            data: {
                audit_status: 4,
                begin:this.state.begin,
                end:this.state.end,
                word: params.searchText,
                // sort: params.sorter.field,
                // order: params.sorter.order,
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
    /**
     * @method passUpdateHandle(params:Object) 获取复审通过数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    passUpdateHandle = async (params) => {
        console.log('复审通过列表参数====>', params)
        this.setState({
            pass:true,
        })
        const { pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/wordaudit/search`,
            method: 'get',
            data: {
                audit_status: 2,
                begin:this.state.begin2,
                end:this.state.end2,
                word: params.searchText,
                // sort: params.sorter.field,
                // order: params.sorter.order,
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

    /**
     * @method passHandle(params:Object) 审核通过操作
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    passHandle = async (rows) => {

        const req = [];
        req.push(rows.word);
        const res = await request({
            url: `${BUSINESSAPIHOST}/wordaudit/batchPass`,
            method: 'post',
            data: req
        })
        console.log(req)
        // console.log('list====>', req, res)
        if (res) {
           console.log('passHandle',res)
            // this.state.update1();
            const {tabId} = this.state;
            tabId == 1 ? this.state.update1() : tabId == 2 ? this.state.update2() : this.state.update3();
            // this.state.update();
        }

    }
    /**
     * @method passHandle(params:Object) 审核不通过操作
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    noPassHandle = async (rows) => {
        const req = [];
        req.push(rows.word);
        const res = await request({
            url: `${BUSINESSAPIHOST}/wordaudit/batchReject`,
            method: 'post',
            data: req
        })
        console.log(req)
        // console.log('list====>', req, res)
        if (res) {
            console.log('noPassHandle',res)
            const {tabId} = this.state;
            tabId == 1 ? this.state.update1() : tabId == 2 ? this.state.update2() : this.state.update3();

            // this.state.update();
        }
    }


    dateChange = async (dates, dateString)=> {
        // 如果存才获取数据的函数，则将操作后的时间对象返回给getResult函数
        if (this.props.getResult) {
            this.props.getResult(dates, dateString)
        }
        console.log('dates',dates)
        console.log('dateString',dateString)
        await this.setState({
            value: dates,
            begin:dateString[0],
            end:dateString[1],
        })
        const {tabId} = this.state;
        tabId == 1 ? this.state.update1() : tabId == 2 ? this.state.update2() : this.state.update3();
    }

    dateChange2 = async (dates, dateString)=> {
        // 如果存才获取数据的函数，则将操作后的时间对象返回给getResult函数
        if (this.props.getResult) {
            this.props.getResult(dates, dateString)
        }
        console.log('dates',dates)
        console.log('dateString',dateString)
        await this.setState({
            value2: dates,
            begin2:dateString[0],
            end2:dateString[1],
        })
        const {tabId} = this.state;
        tabId == 1 ? this.state.update1() : tabId == 2 ? this.state.update2() : this.state.update3();
    }


    callback = (key)=> {
        this.setState({
            tabId:key,
        })
        console.log('key',key)
        if(this.state.noPass && key == 2){
            this.state.update2()
        }else if(this.state.pass && key == 3){
            this.state.update3()
        }else if(key == 1){
            this.state.update1()
        }
        // key == 1 ? this.state.update1() : key == 2 ? this.state.update2() : this.state.update3();
        // this.state.update();
    }
    render() {
        const {
            columns,
            noPass_columns,
            pass_columns,
        } = this.state

        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <Tabs onChange={this.callback} type="card">
                        <TabPane tab="待复审" key="1">
                            <TableBase
                             columns={columns}
                             search="查找关键词"
                             rowKey={'id'}
                             canCheck
                             saveUpdate={e=>this.setState({update1: e})}
                             // onAdd={this.addHandle}
                             onUpdate={this.updateHandle}
                             sorter={{ field: 'create_time', order: 'desc' }}
                             date={
                                 <Batchs>
                                     <BatchLink text="批量通过" onClick={batchPass}  />
                                     <BatchLink text="批量不通过" onClick={batchReject}  />
                                 </Batchs>
                             }
                            />
                        </TabPane>
                        <TabPane tab="复审不通过" key="2">
                            <TableBase
                                columns={noPass_columns}
                                search="查找关键词"
                                rowKey={'id'}
                                onUpdate={this.noPassUpdateHandle}
                                saveUpdate={e=>this.setState({update2: e})}
                                date={
                                    <Batchs>
                                        <RangePicker
                                            defaultValue={[todaySubtract(0), todaySubtract(0)]}
                                            onChange={this.dateChange.bind(this)}
                                            value={this.state.value}
                                            allowClear={true}
                                            locale={locale}
                                            ranges={
                                                {
                                                    "昨天":[todaySubtract(1),todaySubtract(1)],
                                                    "过去7天": [todaySubtract(7),todaySubtract(1)],
                                                    "过去14天": [todaySubtract(14),todaySubtract(1)],
                                                    "过去21天": [todaySubtract(21),todaySubtract(1)],
                                                    "过去30天": [todaySubtract(30),todaySubtract(1)],
                                                    "上个月": [
                                                        moment().subtract(1,"month").subtract(moment().date() - 1,'days'),
                                                        moment().subtract(moment().date(), 'days')]
                                                }
                                            }
                                            disabledDate={(current) => {
                                                return current > moment().subtract(0, 'days').endOf("day")
                                            }}
                                        />
                                    </Batchs>
                                }
                            />
                        </TabPane>
                        <TabPane tab="复审通过" key="3">
                            <TableBase
                                columns={pass_columns}
                                search="查找关键词"
                                rowKey={'id'}
                                onUpdate={this.passUpdateHandle}
                                saveUpdate={e=>this.setState({update3: e})}
                                date={
                                    <Batchs>
                                        <RangePicker
                                            defaultValue={[todaySubtract(0), todaySubtract(0)]}
                                            onChange={this.dateChange2.bind(this)}
                                            value={this.state.value2}
                                            allowClear={true}
                                            locale={locale}
                                            ranges={
                                                {
                                                    "昨天":[todaySubtract(1),todaySubtract(1)],
                                                    "过去7天": [todaySubtract(7),todaySubtract(1)],
                                                    "过去14天": [todaySubtract(14),todaySubtract(1)],
                                                    "过去21天": [todaySubtract(21),todaySubtract(1)],
                                                    "过去30天": [todaySubtract(30),todaySubtract(1)],
                                                    "上个月": [
                                                        moment().subtract(1,"month").subtract(moment().date() - 1,'days'),
                                                        moment().subtract(moment().date(), 'days')]
                                                }
                                            }
                                            disabledDate={(current) => {
                                                return current > moment().subtract(0, 'days').endOf("day")
                                            }}
                                        />
                                    </Batchs>
                                }
                            />

                        </TabPane>
                    </Tabs>

                </div>
            </div>
        )
    }
}