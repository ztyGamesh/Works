/**
 * 财务-充值记录
 */

import React, {Component} from 'react'

import styles from './RecordList.less'
import {TableBase} from '../../../../components/Table'
import {BUSINESSAPIHOST} from '../../../../common/env'
import request from '../../../../utils/request'


class RecordList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            columns: [
                {
                    title: '账户名',
                    dataIndex: 'name',
                    render: (value, row, index) => (
                        row.name + '('+row.mail + ')'
                    )
                }, {
                    title: '公司名',
                    dataIndex: 'corporation_name',
                }, {
                    title: '充值金额',
                    dataIndex: 'charge_money',


                }, {
                    title: '充值日期',
                    dataIndex: 'create_time',
                    sorter: true,
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
        const { current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/chargelist`,
            method: 'get',
            data: {
                search: params.searchText,
                sort: params.sorter.field,
                order: params.sorter.order,
                limit: 50,
                offset: 50 * (current - 1),
                ...filters
            }
        })

        if (res) {
            return {
                rows: res.data.rows,
                total: res.total
            }
        }
    }


    addHandle = () => {
        const {history} = this.state
        history.push('/charge/record/add')
    }


    render() {
        const {columns} = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="添加充值记录"
                        search="账户名称"
                        // rowKey={'client'}

                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                    />

                </div>
            </div>
        )
    }
}


export default RecordList


