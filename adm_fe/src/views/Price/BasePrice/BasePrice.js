/**
 * @class 页面 底价设置
 */
import React, { Component } from 'react'
import styles from './BasePrice.less'
import { TableBase} from '../../../components/Table'
import {FileCsv} from '../../../components/File'
import { message} from 'antd'
import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'
import Loading from '../../../components/Loading/Loading'



//上传query去重
function unique(old_data) {
    var new_data=[];
    for (var i = 0; i < old_data.length; i++) {
        for (var j = i+1; j < old_data.length; j++) {
            if(old_data[i].query===old_data[j].query){
                ++i;
            }
        }
        new_data.push(old_data[i]);
    }
    return new_data;
}


export default class BasePrice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            loading:false,

            columns: [
                {
                    title: '文件名',
                    dataIndex: 'filename',
                }, {
                    title: 'query个数',
                    dataIndex: 'total',
                    render:(value, rows, index)=>{
                        return(
                            <div>总数{value}|成功{rows.success}|失败{rows.failure}</div>
                        )
                    }
                }, {
                    title: '上传时间',
                    dataIndex: 'upload_time',

                }, {
                    title: '操作',
                    dataIndex: 'id',
                    render: (value, rows, index) => (
                        <div>
                            <div onClick={e => this.setSuccessHandle(rows)} className={styles.optBtn}>查看设定成功</div>
                            <div onClick={e => this.setFailureHandle(rows)} className={styles.optBtn}>查看设定失败</div>
                        </div>
                    )
                }
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
        const req = {
            limit: pageSize,
            offset: pageSize * (current - 1),
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/queryprice/listUploadedFiles`,
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
    uploadHandle = async (e, names) =>{
        this.setState({ loading: true })

        //这是上传一个文件获取的数据
        var allData = e[0]
        var datas = {};
        datas.filename = names[0].substring(0,names[0].length - 4);
        datas.items = [];
        //e[0]是文件里的数据，传给后端接口，然后获取参数渲染表格
        for(var i = 0; i < allData.length; i++){
            var allDetail = allData[i];
            var details = {};
            details.query = allDetail[0];
            details.price = allDetail[1];
            datas.items.push(details);
        }

        datas.items = unique(datas.items);

        const res = await request({
            url: `${BUSINESSAPIHOST}/queryprice/saveByFile`,
            method: 'post',
            data: datas
        })
        console.log('list====>', datas, res)
        if (res.status == 1) {
            this.setState({ loading: false })
            message.success( '上传成功')
            this.state.update();
        }else {
            message.error(res && res.msg || '服务器异常')
        }
    }


    //查看设定成功页
    setSuccessHandle = (rows) => {
        const { history } = this.state
        history.push('/price/basePriceSuccess/' + rows.filename)

    }
    //查看设定失败页
    setFailureHandle = (rows) => {
        const { history } = this.state
        history.push('/price/basePriceFail/' + rows.filename)

    }

    render() {
        const { columns , loading} = this.state
        return (
            <div className={styles.body}>

                <div className={styles.content}>
                    <div className={styles.title}>
                        <FileCsv text={'上传query底价设定文件'}
                                 size={1}
                                 onChange={this.uploadHandle}
                        />
                    </div>
                    <TableBase
                        columns={columns}
                        onUpdate={this.updateHandle}
                        rowKey={'id'}
                        saveUpdate={e=>this.setState({update: e})}
                    />
                </div>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}
