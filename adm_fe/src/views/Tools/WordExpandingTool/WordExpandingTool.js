/**
 * @class 页面 流量预估
 */
import React, { Component } from 'react'
import styles from './WordExpandingTool.less'
import { TableBase, Batchs, BatchLink  ,BatchA,BatchSelect,BatchOption,BatchDown} from '../../../components/Table'
import {batchDelete} from './WordExpandingToolBatch'

import { message, Checkbox, Select} from 'antd'
const Option = Select.Option;

import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'

export default class WordExpandingTool extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            checked:false,
            unique:0,
            href:'',
            words:'',
            isShow:'disabled',
            columns: [
                {
                    title: '关键词',
                    dataIndex: 'query',
                },
                 {
                    title: '预估搜索量',
                    dataIndex: 'frequency',
                    sorter: true,
                     render: (value, row, index) => {
                         value = parseFloat(value);
                         if(value < 5){
                             return '<5'
                         }else if(value > 20000){
                             return '>2W'
                         }
                         else {
                             return value;
                         }

                     }
                },
                {
                    title: '建议出价(元)',
                    dataIndex: 'price',
                    sorter: true,
                    render: (value, row, index) => {
                        value = parseFloat(value);
                        if(value == 0){
                            value = Math.random()/10 + 1.11;
                        }
                        value = value.toFixed(2)

                        return value;
                    }
                },
            ],
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        console.log('获取列表参数====>', params)
        const { pageSize, current } = params
        await this.setState({
            words:params.searchText
        })

        params.searchText != ""
            ?this.setState({isShow:''})
            :this.setState({isShow:'disabled'})


        const req = {
            word: params.searchText,
            sort: params.sorter.field,
            order: params.sorter.order,
            unique:this.state.unique,
            limit: pageSize,
            offset: pageSize * (current - 1),
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/tool/expandWords`,
            method: 'get',
            data: req
        })
        await this.setState({
            href: `${BUSINESSAPIHOST}/tool/downloadExpandWords?word=${this.state.words}&unique=${this.state.unique}&sorter=${params.sorter.field}&order=${params.sorter.order}`,
        })

        console.log('href',this.state.href)
        console.log('list====>', req, res)
        if (res.data) {
            return {
                rows: res.data.rows,
                total: res.data.total
            }
        }
    }

    CheckboxChange = async (e)=>{

        await this.setState({
            checked: e.target.checked,
        });

        this.state.checked
            ? this.setState({
            unique: 1,
        })
            :this.setState({
            unique: 0,
        })
        await  this.state.update();

        console.log('checked',this.state.checked,this.state.unique)
    }
    render() {
        const {
            columns ,
            checked,
            isShow
        } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        search="搜索关键词"
                        onUpdate={this.updateHandle}
                        rowKey={'id'}
                        sorter={{ field: 'frequency', order: 'desc' }}
                        saveUpdate={e=>this.setState({update: e})}
                        extra={
                            <Batchs>
                                <Checkbox onChange={this.CheckboxChange}
                                          checked={checked}
                                >与账户去重</Checkbox>
                                <BatchDown
                                    href={this.state.href}
                                    text="下载全部"
                                    disabled={isShow}
                                />
                            </Batchs>
                        }
                    />
                </div>
            </div>
        )
    }
}
