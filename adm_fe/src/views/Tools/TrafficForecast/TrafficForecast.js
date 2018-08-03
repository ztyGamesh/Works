/**
 * @class 页面 流量预估
 */
import React, { Component } from 'react'
import {connect} from 'react-redux';

import styles from './TrafficForecast.less'
import { TableBase, Batchs  ,BatchA,BatchDown} from '../../../components/Table'

import {FileCsv} from '../../../components/File'
import { message,Popover,Icon} from 'antd'

import { BUSINESSAPIHOST } from '../../../common/env'
import request from '../../../utils/request'
import { keywordsUploadInit } from '../KeywordsUpload/flow/KeywordsUploadActions'
import Loading from '../../../components/Loading/Loading'



//上传query去重
function unique(old_data) {
    var new_data=[];
    for (var i = 0; i < old_data.length; i++) {
        for (var j = i+1; j < old_data.length; j++) {
            if(old_data[i]===old_data[j]){
                ++i;
            }
        }
        new_data.push(old_data[i]);
    }
    return new_data;
}

class TrafficForecast extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            loading:false,
            isShow:'disabled',
            columns: [
                {
                    title: '关键词',
                    dataIndex: 'word',
                },
                {
                    title: '建议出价(元)',
                    dataIndex: 'price',
                    render: (value, row, index) => {
                        value = parseFloat(value);
                        if(value == 0){
                            value = Math.random()/10 + 1.11;
                        }
                        value = value.toFixed(2)

                        return value;
                    }
                },
                {
                    title: '短语匹配预估展现量',
                    dataIndex: 'imp',
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
                }, {
                    title: '预估搜索量',
                    dataIndex: 'frequency',
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
            ],
            data:[],//流量预估返回的数据集合
            dataWords:{},//关键词的集合
            href:'',
        }
    }

    componentWillMount() {
        //从sessionStorage中拿数据
        var sessionData = JSON.parse(sessionStorage.keywordsSelectRows || '[]');
        console.log('sessionData',JSON.parse(sessionStorage.keywordsSelectRows || '[]') )
        var props_data = {}
        props_data.words = []
        sessionData.map((item,index)=>{
            props_data.words.push(item.word)
        })
        //要从reducer里面拿数据
        // this.props.keywordsUploadReducers.map((item,index)=>{
        //     props_data.words.push(item.word)
        // })
        this.setState({
            dataWords:props_data
        })
        sessionStorage.setItem('keywordsSelectRows', '')
    }

    componentWillUnmount(){
        // keywordsUploadInit();
        sessionStorage.setItem('keywordsSelectRows', '')
        this.setState({
            isShow:'disabled',
        })

    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async (params) => {
        console.log('uodate_params',params)
        const { pageSize, current } = params;

        const req = {
            limit: pageSize,
            offset: pageSize * (current - 1),
            sort: params.sorter.field,
            order: params.sorter.order,
            words:this.state.dataWords.words,
        }

        var  words = JSON.stringify(this.state.dataWords);
        this.setState({
            href:`${BUSINESSAPIHOST}/tool/downloadPredictTraffic`,
        })

        const res = await request({
            url: `${BUSINESSAPIHOST}/tool/predictTraffic`,
            method: 'post',
            data: req
        })
        if (res.status == 1) {
            this.setState({
                data:res.data,
            })
        }

        return {
            rows: this.state.data.rows,
            total: this.state.data.total
        }
    }
    //上传文件
    uploadHandle = async (e, names) =>{
        //这是上传一个文件获取的数据
        var allData = e[0]
        var datas = {};
        // datas.filename = names[0].substring(0,names[0].length - 4);
        datas.words = [];
        //e[0]是文件里的数据，传给后端接口，然后获取参数渲染表格
        for(var i = 0; i < allData.length; i++){
            var allDetail = allData[i];
            datas.words.push(allDetail[0]);
        }
        datas.words = unique(datas.words);
        if(datas.words.length > 1000){
            message.error( '一次最多查询1000个关键词');
            return false;
        }
        this.setState({
            dataWords:datas,
        })
        datas.limit = 10;
        datas.offset = 0;
        console.log('href',this.state.href)
        this.setState({ loading: true })

        const res = await request({
            url: `${BUSINESSAPIHOST}/tool/predictTraffic`,
            method: 'post',
            data: datas
        })
        if (res.status == 1) {
            this.setState({ loading: false })
            message.success( '上传成功')
            this.setState({
                data:res.data,
                isShow:'',
            })
            await this.state.update();

        }else {
            message.error(res && res.msg || '服务器异常')
        }
    }

    render() {
        const { columns ,
            loading,
            isShow
        } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <div className={styles.inlineFile}>
                            <FileCsv text={'上传关键词文件'}
                                     size={1}
                                     onChange={this.uploadHandle}
                            />
                        </div>
                        <div className={styles.inlineNotice}>
                            <Popover placement="right" trigger="hover" title="上传关键词说明" content={
                                <div style={{ fontSize: 14, lineHeight: '20px', width: 220 }}>
                                    1、文件格式为csv文件<br/>
                                    2、一次最多查询1000个关键词
                                </div>
                            }>
                                <Icon type="question-circle-o" />
                            </Popover>
                        </div>

                    </div>

                    <TableBase
                        columns={columns}
                        onUpdate={this.updateHandle}
                        rowKey={'index'}
                        sorter={{ field: '', order: '' }}
                        saveUpdate={e=>this.setState({update: e})}
                        extra={
                            <Batchs>
                                <BatchDown
                                    href={this.state.href}
                                    text="下载全部"
                                    disabled={isShow}
                                />
                            </Batchs>
                        }
                    />
                </div>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    return{
        keywordsUploadReducers: state.keywordsUploadReducers.rows,
    }
}
export default connect(mapStateToProps,null)(TrafficForecast)