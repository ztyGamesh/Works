/**
 * @class 页面 媒体管理-媒体列表
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './MediaList.less'
import { TableBase, Links, LinkShow, LinkEdit, Switch } from '../../../../components/Table'
import { Modal, Button } from 'antd'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'

const ADMIN_ROLE = 0

class MediaList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            role: null,
            showVisible: false,
            modalData: {
                uid: ''
            },
            columns: [
                {
                    title: '媒体名称',
                    dataIndex: 'name',
                    width: 120
                }, {
                    title: '媒体类型',
                    dataIndex: 'type'
                }, {
                    title: '媒体状态',
                    dataIndex: 'status',
                    render: (value, row, index) => (
                        <Switch
                            value={value}
                            disabled={this.state.role !== ADMIN_ROLE}
                            onClick={e => this.changeSwitchHandle('status', e, row)}
                            config={[
                                { text: '启用', value: 'active' },
                                { text: '冻结', value: 'pause' }
                            ]}
                        />
                    )
                }, {
                    title: '媒体分类',
                    dataIndex: 'class_name'
                }, {
                    title: '媒体账户',
                    dataIndex: 'medium_name'
                }, {
                    title: 'deepleaper负责人',
                    dataIndex: 'duty_user'
                }, {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    sorter: true
                }, {
                    title: '创建/修改人',
                    dataIndex: 'createUserName'
                }, {
                    title: '操作',
                    dataIndex: 'uid',
                    render: (value, rows, index) => (
                        <Links>
                            <LinkShow onClick={e => this.showHandle(value)} />
                            {
                                this.state.role === ADMIN_ROLE ? <LinkEdit onClick={e => this.editHandle(value)} /> : null
                            }
                        </Links>
                    )
                }
            ]
        }
    }

    componentWillMount() {
        const { role } = this.props
        if (role || role === 0) {
            this.setState({ role })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { role } = nextProps
        if (role || role === 0) {
            this.setState({ role })
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        // console.log('获取列表参数====>', params)
        const { pageSize, current, filters } = params
        const req = {
            search: params.searchText,
            sort: params.sorter.field,
            order: params.sorter.order,
            limit: pageSize,
            offset: pageSize * (current - 1)
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/media`,
            method: 'get',
            data: req
        })
        console.log('list====>', req, res)
        if (res) {
            return {
                rows: res.rows,
                total: res.total
            }
        }
    }

    /**
     * @method changeSwitchHandle 开关组件点击事件，更新数据
     */
    changeSwitchHandle = async (field, value, row) => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/status`,
            method: 'post',
            data: {
                uid: row.uid,
                field,
                status: value
            }
        })
        if (res.status === 1) {
            // alert('成功')
            return
        }
        // alert('失败')
    }

    addHandle = () => {
        const { history } = this.state
        history.push('/media/media/operate')
    }

    showHandle = (uid = '') => {
        this.setState({
            showVisible: true,
            modalData: { uid }
        })
    }

    editHandle = (uid) => {
        const { history } = this.state
        history.push('/media/media/operate/' + uid)
    }

    render() {
        const { columns, showVisible, modalData, role } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase
                        columns={columns}
                        add="添加媒体"
                        canAdd={role === ADMIN_ROLE}
                        search="媒体名称"
                        onAdd={this.addHandle}
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                        init={role !== null}
                    />
                    <Modal title="查看媒体ID"
                        visible={showVisible}
                        onCancel={e => this.setState({ showVisible: false })}
                        footer={<Button onClick={e => this.setState({ showVisible: false })}>关 闭</Button>}
                    >
                        <div className={styles.line}>
                            <div>媒体ID：</div>
                            <div>{modalData.uid}</div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    role: state.user.role
})

export default connect(mapStateToProps)(MediaList)
