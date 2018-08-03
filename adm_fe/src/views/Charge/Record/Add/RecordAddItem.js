/**
 * 添加充值记录
 * */

import React, { Component } from 'react';

import styles from './RecordAddItem.less'
import { Form, message } from 'antd'
import {
    RecordList,
    RecordWell,
    RecordName,
    RecordCorporation,
    RecordChargeMoney,
    RecordBreadcrumb,
    RecordSubmit,
    readLevelInfo,
    removeLevelInfo
} from '../../../../containers/Charge/Record'
import { BUSINESSAPIHOST } from '../../../../common/env'
import request from '../../../../utils/request'
import Loading from '../../../../components/Loading/Loading'


class RecordAddItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //初始化数据
            initData: null,
            loading: false,
            nameList: [],
            dataList:[],
            cor_name:'',


        }
    }

    /**
     * @description 初始化数据
     */
    async componentWillMount() {
        await this.receiveMedium()

        //新建
        // this.initDataHandle()
    }

    /**
     * @method submitHandle 提交
     * @param {Object} values
     */
    submitHandle = async (values) => {
        const res = await values
        if (res) {
            const data = {
                client: res.name,
                // corporation: res.corporation,
                charge_money: res.charge_money,

            }

            // this.setState({ loading: true })

            console.log(data)
            await this.adduserAPI(data)

        }

    }
    /**
     * @method initDataHandle 添加媒体账户
     * @param {Object} data
     */
    adduserAPI = async (values) => {
        const req = await values;
        console.log('adduserAPI', req)
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/adcharge`,
            method: 'post',
            data: req,
        })
        // var uid = req.uid;
        if (res.status === 1 && res.data) {
            message.success('添加成功')

            // this.setState({ loading: false })

            console.log('添加成功')
            this.props.history.push('/charge/record')

        }else {
            this.setState({ loading: false })
            message.error(res && res.msg || '服务器异常')

            console.log('res',res)
        }
    }

    /**
     * @method cancelHandle 取消
     */
    cancelHandle = () => {
        this.props.history.goBack()
    }

    /**
     * @method initDataHandle 初始化数据
     * @param {Object} data
     */
    initDataHandle = async (data = {}) => {
        console.log('新建',data.medium)
        var initData = {
            name: '',
            corporation:'',
            charge_money:''
        }

        this.setState({ initData })
    }




    /**
     * @method receiveMedium 获取联盟媒体列表
     */
    receiveMedium = async () => {
        const res = await request({
            url: `${BUSINESSAPIHOST}/charge/clientlist`,
            method: 'post',
            data:{}
        })
        if (res.status === 1 && res.data) {
            var nameArr = [];
            var dataArr = [];
            for(var i in res.data){
                nameArr.push({
                    value: res.data[i].uid,
                    label: res.data[i].name +  '(' + res.data[i].mail + ')'
                })
                dataArr.push({
                    value: res.data[i].uid,
                    corporation_name: res.data[i].corporation_name,
                })
            }

            this.setState({
                nameList:nameArr,
                dataList:dataArr
                }
            )
        }
    }

    nameChangeHandle=(e)=>{
        console.log('e',e)
        this.state.dataList.map((item)=>{
            if(item.value == e){
                this.setState({
                    corporation:item.corporation_name,
                    cor_name:item.corporation_name

                })
            }
        })

    }


    render() {
        const {
            initData,
            loading,
            nameList,
            cor_name

        } = this.state
        console.log('cor_name',cor_name)
        console.log('RecordCorporation',this.state.corporation)

        return (
            <div className={styles.body}>
                <RecordBreadcrumb className={styles.header} onCancel={this.cancelHandle} text={'添加充值记录'} />
                <RecordList className={styles.content} onSubmit={this.submitHandle} initData={initData} {...this.props}>
                    <RecordWell className={styles.well} >
                        <RecordName data={nameList} onChange={this.nameChangeHandle}/>
                        <RecordCorporation initialValue={cor_name}/>
                        <RecordChargeMoney/>
                    </RecordWell>

                    <RecordSubmit onCancel={this.cancelHandle} text={'完成添加'}/>
                </RecordList>
                {
                    loading ? <Loading /> : null
                }
            </div>
        )
    }
}
export default  Form.create()(RecordAddItem)
