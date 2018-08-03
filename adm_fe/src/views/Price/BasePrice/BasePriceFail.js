/**
 * @class 页面 底价设定失败页
 */
import React, { Component } from 'react'
import styles from './BasePrice.less'
import { TableBase,  Batchs, BatchA} from '../../../components/Table'
import {BasePriceBreadcrumb} from '../../../containers/Price/BasePrice'

import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'

export default class BasePriceFail extends Component {
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
                }, {
                    title: '上传时间',
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
            href:`${BUSINESSAPIHOST}/queryprice/download?offset=0&limit=10000&upload_status=failure`
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
            upload_status:'failure',
            filename:uid,
            word:'',
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

    cancelHandle = () => {
        this.props.history.push('/price/basePrice')
    }

    render() {
        const { columns } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    {/*<BasePriceBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={'底价设定失败页'} />*/}
                    <TableBase
                        columns={columns}
                        onUpdate={this.updateHandle}
                        rowKey={'id'}
                        extra={
                            <Batchs>
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
