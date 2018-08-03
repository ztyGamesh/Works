/**
 * @class 关键词页面-错误
 */
import React, { Component } from 'react'
import styles from './KeywordsUpload.less'
import { TableBase, Batchs } from '../../../components/Table'
import requestStorage from '../../../utils/requestStorage'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '组名称',
                    dataIndex: '0'
                },
                {
                    title: '计划名称',
                    dataIndex: '1'
                },
                {
                    title: '关键词名称',
                    dataIndex: '2'
                }, {
                    title: '匹配方式',
                    dataIndex: '3'
                }, {
                    title: '出价（元）',
                    dataIndex: '4'
                }, {
                    title: '落地页URL',
                    dataIndex: '5'
                }, {
                    title: '启用/暂停（默认为启用）',
                    dataIndex: '6'
                }, {
                    title: '推广目的',
                    dataIndex: '7'
                }, {
                    title: '应用包名称',
                    dataIndex: '8'
                }, {
                    title: '下载链接',
                    dataIndex: '9'
                }, {
                    title: '失败原因',
                    dataIndex: '10'
                }
            ],
            data: [],
            init: false,
            href: 'javascript:;'
        }
    }

    async componentWillMount() {
        const error = await requestStorage.getItem('keywordsSubmitErrorRows') || []
        const href = sessionStorage.keywordsSubmitErrorHref
        const key = +new Date() + '_'
        this.setState({
            data: error.map((t, index) => {
                return {
                    ...t,
                    key: key + index
                }
            }),
            init: true,
            href
        })
    }

    updateHandle = (params = {}) => {
        const { pageSize, current } = params
        const { data } = this.state
        return {
            rows: data.slice((current - 1) * pageSize, current * pageSize),
            total: data.length
        }
    }

    render() {
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase columns={this.state.columns}
                        onUpdate={this.updateHandle}
                        rowKey="key"
                        init={this.state.init}
                        extra={
                            <Batchs>
                                <a style={{ marginLeft: 6 }} target="_blank" href={this.state.href}>下载</a>
                            </Batchs>
                        }
                    />
                </div>
            </div>
        )
    }
}