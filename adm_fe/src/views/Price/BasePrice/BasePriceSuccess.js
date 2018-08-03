/**
 * @class 页面 底价设定成功页
 */
import React, { Component } from 'react'
import styles from './BasePrice.less'
import { TableBase, Batchs, BatchLink ,Cell ,BatchA} from '../../../components/Table'
import {BasePriceBreadcrumb} from '../../../containers/Price/BasePrice'
import {batchDelete} from './BasePriceSucessBatch'
import {message} from 'antd'
import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'

export default class BasePriceSuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            uid: props.match.params.id || '',
            href:'',
            columns: [
                {
                    title: 'query',
                    dataIndex: 'query',
                }, {
                    title: '底价',
                    dataIndex: 'price',
                    render: (value, row, index) => {
                        value = parseFloat(value).toFixed(1)
                        return (
                            <Cell value={value} row={row} edit limit={16}
                                  onEdit={this.editName} />
                        )
                    }
                }, {
                    title: '设定时间',
                    dataIndex: 'edit_time',

                }, {
                    title: '所属文件',
                    dataIndex: 'filename',
                }
            ],
        }
    }

    componentWillMount() {
        this.setState({
            href:`${BUSINESSAPIHOST}/queryprice/download?offset=0&limit=10000&upload_status=success`
        })
    }
    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        const { uid } = this.state;
        console.log('获取列表参数====>', params)
        const {pageSize, current, filters} = params
        const req = {
            limit: pageSize,
            offset: pageSize * (current - 1),
            upload_status:'success',
            word:params.searchText,
            filename:uid,
            ...filters
        }

        const res = await request({
            url: `${BUSINESSAPIHOST}/queryprice/search`,
            method: 'get',
            data: req
        })
        console.log('list====>', req, res)
        if (res) {
            return {
                rows: res.data.rows,
                total: res.data.total
            }
        }
    }

    /**
     * @method editName 修改底价
     */
       editName =async (value, row) => {
           // 底价应该有个限制规则
       if(value < 0 || value > 10000){
           message.error('底价设置范围是0-10000')
           return;
       }
        var reqs = [];
        const req = {
            query: row.query,
            price: value,
        }
        reqs.push(req);
        const res = await request({
            url: `${BUSINESSAPIHOST}/queryprice/batchUpdate`,
            method: 'post',
            data: reqs
        })
       if(res.status == 1){
           message.success('修改成功')
       }else {
           message.error(res && res.msg || '服务器异常')
       }
    }

    /**
     * @method cancelHandle 取消
     */
    cancelHandle = () => {
        this.props.history.push('/price/basePrice')
    }

    render() {
        const { columns } = this.state
        return (
            <div className={styles.body}>
                {/*<BasePriceBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={'底价设定成功页'} />*/}
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        search="搜索query"
                        onUpdate={this.updateHandle}
                        canCheck
                        rowKey={'id'}
                        extra={
                            <Batchs>
                                <BatchLink text="删除" onClick={batchDelete} confirm="已选中#length个querry，删除后将不能恢复，确定删除吗？" />
                                <BatchA
                                    href={this.state.href}
                                    text="下载最新一万条"
                                />
                            </Batchs>
                        }
                    />
                </div>
            </div>
        )
    }
}
