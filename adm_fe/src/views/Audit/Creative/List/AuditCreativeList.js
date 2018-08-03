/**
 * 审核管理，创意审核列表页
 */

import React, {Component} from 'react'
import styles from './AuditCreativeList.less'
import {TableBase, Links, LinkShow, LinkEdit,LinkPid,Batchs  ,BatchA,BatchLink,BatchSelect,BatchOption} from '../../../../components/Table'

import {Modal, Button, Icon, Menu, Dropdown,message, Input, Popover, Table} from 'antd'
const { TextArea } = Input;

import {BUSINESSAPIHOST} from '../../../../common/env'
import request from '../../../../utils/request'

var  account_name='媒体账户';
export default class AuditCreativeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            history: props.history,
            showVisible: false,
            configData:[],
            selectedValue:'',
            selectedText: '',
            init: false,
            showModal:false,
            showReason:false,
            textAreaVal:'',//拒绝原因
            comment:'',
            deepleaperArr:[],
            channelArr:[],
            showChannel:false,
            type:'',
            resetField:{},
            columns: [
                {
                    title: '创意名称',
                    dataIndex: 'creative_name',
                }, {
                    title: '审核状态',
                    dataIndex: 'audit_status',
                    filters: [
                        {text: '审核中', value: 'audit'},
                        {text: '审核通过', value: 'pass'},
                        {text: '审核拒绝', value: 'reject'}
                    ],
                    width:130,
                    filterMultiple: false,
                    filteredValue: ['audit'],
                    render: (value, row, index) => (
                        <AuditChange value={value} row={row} index={index}/>
                    )
                }, {
                    title: '',
                    dataIndex: 'other_audit_status',
                    filters: [
                        {text: '待审核', value: 'wait'},
                        {text: '审核中', value: 'audit'},
                        {text: '审核通过', value: 'pass'},
                        {text: '审核拒绝', value: 'reject'}
                    ],
                    width:130,
                    filterMultiple: false,
                    render : (value, row, index) => {
                        if(value !== '-'){
                            return <ChannelChange value={value} row={row} index={index} medium={this.state.selectedValue}/>
                        }
                    }
                }, {
                    title: '账户名称',
                    dataIndex: 'name',
                    width:120,
                },{
                    title: '广告组名称',
                    dataIndex: 'group_name'
                },
                {
                    title: '广告计划名称',
                    dataIndex: 'plan_name'
                },
                {
                    title: '提交时间',
                    dataIndex: 'commit_time'
                },
                {
                    title: '广告行业标签',
                    dataIndex: 'tag'
                },
                {
                    title: '操作',
                    dataIndex: 'id',
                    render: (value, rows, index) => {
                        return(
                            <Links>
                                <LinkShow onClick={e => this.showHandle(rows)}/>
                            </Links>
                        )
                    }
                }
            ],
            deepleaperColumns: [{
                title: '创意名称',
                dataIndex: 'creative_name',
            }, {
                title: '审核状态',
                dataIndex: 'audit_status',
                render: (value, row, index) => (
                    value == 'pass' ? '审核通过' : value == 'audit' ? '审核中' : '审核拒绝'
                )
            }],
            channelColumns:[{
                title: '创意名称',
                dataIndex: 'creative_name',
            }, {
                title: '审核状态',
                dataIndex: 'other_audit_status',
                render: (value, row, index) => {
                    if (value !== '-') {
                       return  value == 'pass' ? '审核通过' : value == 'audit' ? '审核中' : value == 'reject' ? '审核拒绝' : '待审核'
                    }
                    else {
                        return '-'
                    }
                }
            }],
        }
    }

    componentWillMount() {
        this.getAllMedium();
    }

    componentWillReceiveProps(nextProps) {
        // this.state.update();
    }
    getAllMedium = async() =>{
        const res = await request({
            url: `${BUSINESSAPIHOST}/media/getallmedium`,
            method: 'get',
            data: {}
        })
        if(res){
            var data = res.data;
            var dataList=[];
            data.map((item,index)=>{
                var detail = {};
                detail.value = item.uid;
                detail.text = item.name;
                dataList.push(detail)
            })
            await this.setState({
                configData:dataList,
                selectedValue:dataList[0].value + '',
                selectedText: dataList[0].text || '',
                resetField:{
                    other_audit_status:dataList[0].text ,
                }
            })
            account_name = dataList[0].text
            this.setState({init: true})
        }
    }

    /**
     * @method updateHandle(params:Object) 获取数据
     * @param {Object} params TableBase列表组件里赋值
     * @returns {Promise} 数据
     */
    updateHandle = async(params) => {
        const {pageSize, current, filters} = params
        const res = await request({
            url: `${BUSINESSAPIHOST}/audit/adcreativeauditlist`,
            method: 'get',
            data: {
                medium: this.state.selectedValue,
                search: params.searchText,
                sort: params.sorter.field,
                order: params.sorter.order,
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


    showHandle = async(data = {}) => {
        this.state.history.push(`/audit/creative/operate/${data.id}`)

    }

    selectedChangeHandle = (e) =>{
        this.setState({
            selectedText: e.text,
            selectedValue: e.value,
            resetField:{
                other_audit_status:e.text,
            }
            // columns: this.state.columns.map(t => {
            //     if (t.dataIndex === 'other_audit_status') {
            //         return {
            //             ...t,
            //             title: e.text
            //         }
            //     }
            //     return t
            // })
        })
    }

    batchDeepleaper = (ids, rows) =>{
        if (ids.length === 0) {
            message.warning('请选择需要审核的创意')
            return false
        }
        this.setState({
            showModal:true,
            deepleaperArr:rows
        })
    }
    //deepleaper批量审核通过
    deepleaperPass = async() =>{
        var idarr = [];
        this.state.deepleaperArr.map((item)=>{
            idarr.push(item.id);
        })
        var req = {
            'ids': idarr.join(','),
            'audit_status': 'pass',
            'comment': '',
            'tag': ''
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatus`,
            method: 'post',
            data: req
        })
        if(res && res.status === 1){
            this.setState({
                showModal:false
            })
            message.success( 'deepleaper批量审核通过')
            await this.state.update();
        }
        else {
            this.setState({
                showModal:false
            })
            message.error(res && res.msg || '服务器异常')
            return false

        }

    }
    //deepleaper批量审核拒绝
    deepleaperReject = () =>{
        this.setState({
            showModal:false,
            showReason:true,
            type:'deepleaper'
        })
    }
    //deepleaper审核拒绝理由
    reasonSubmit = async ()=>{
        if( this.state.type == 'deepleaper'){
            var idarr = [];
            this.state.deepleaperArr.map((item)=>{
                idarr.push(item.id);
            })
            var req = {
                'ids': idarr.join(','),
                'audit_status': 'reject',
                'comment': this.state.comment,
                'tag': ''
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatus`,
                method: 'post',
                data: req
            })
            if(res && res.status === 1){
                this.setState({
                    showReason:false,
                    showModal:false
                })
                message.success( 'deepleaper批量审核拒绝成功')
                await this.state.update();
            }
            else {
                this.setState({
                    showReason:false,
                    showModal:false
                })
                message.error(res && res.msg || '服务器异常')
                return false

            }

        }else {
            var idarr = [];
            this.state.channelArr.map((item)=>{
                if(item.other_audit_status != 'wait'){
                    idarr.push(item.id);
                }
            })
            var req = {
                'ids': idarr.join(','),
                'audit_status': 'reject',
                'comment': this.state.comment,
                'medium': this.state.selectedValue
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatusothers`,
                method: 'post',
                data: req
            })
            if(res && res.status === 1){
                this.setState({
                    showReason:false,
                    showChannel:false
                })
                message.success( '渠道外批量审核拒绝成功')
                await this.state.update();
            }
            else {
                this.setState({
                    showReason:false,
                    showChannel:false
                })
                message.error(res && res.msg || '服务器异常')
                return false

            }

        }

    }
    //拒绝理由
    textAreaBlurHandle= async(e)=>{
        await this.setState({
            comment: e.target.value
        })

    }
    textAreaChangeHandle= async(e)=>{
        await this.setState({
            comment: e.target.value,
            textAreaVal:e.target.value
        })
    }
    batchChannel=(ids,rows)=>{
        if (ids.length === 0) {
            message.warning('请选择需要审核的创意')
            return false
        }
        this.setState({
            showChannel:true,
            channelArr:rows
        })

    }
    //渠道外批量审核通过
    channelPass = async() =>{
        var idarr = [];
        this.state.channelArr.map((item)=>{
            if(item.other_audit_status != 'wait' ){
                idarr.push(item.id);
            }
        })
        if(idarr.length !== this.state.channelArr.length ){
            message.error('勾选的创意中有"待审核"创意，请先更改为审核中,再执行审核通过操作')
            return false;
        }
        var req = {
            'ids': idarr.join(','),
            'audit_status': 'pass',
            'comment': '',
            'medium': this.state.selectedValue
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatusothers`,
            method: 'post',
            data: req
        })
        if(res && res.status === 1){
            this.setState({
                showChannel:false
            })
            message.success( '渠道外批量审核通过')
            await this.state.update();
        }
        else {
            this.setState({
                showChannel:false
            })

            message.error(res && res.msg || '服务器异常')
            return false

        }

    }
    channelReject = ()=>{
        var idarr = [];
        this.state.channelArr.map((item)=>{
            if(item.other_audit_status != 'wait'){
                idarr.push(item.id);
            }
        })
        if(idarr.length !== this.state.channelArr.length ){
            message.error('勾选的创意中有"待审核"创意，请先更改为审核中,再执行审核拒绝操作')
            return false;
        }
        this.setState({
            showReason:true,
            showChannel:false,
            type:'channel'
        })
    }
    //渠道外批量审核中设置成功
    channelAudit = async() =>{
        var idarr = [];
        this.state.channelArr.map((item)=>{
            if(item.other_audit_status == 'wait'){
                idarr.push(item.id);
            }
        })
        if(idarr.length !== this.state.channelArr.length){
            message.error('当前无选中"待审核"创意')
            return false
        }
        var req = {
            'ids': idarr.join(','),
            'audit_status': 'audit',
            'comment': '',
            'medium': this.state.selectedValue
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatusothers`,
            method: 'post',
            data: req
        })
        if(res && res.status === 1){
            message.success( '渠道外批量审核中设置成功')
            await this.state.update();
        }
        else {
            message.error(res && res.msg || '服务器异常')
            return false

        }
        this.setState({
            showChannel:false
        })
    }
    render() {
        const {
            columns,
            configData,
            selectedValue,
            selectedText,
            showModal,
            showReason,
            textAreaVal,
            init,
            showChannel
        } = this.state
        return (
            <div className={styles.body}>
                <div className={styles.content}>
                    <TableBase init={init}
                       resetField={this.state.resetField}
                        columns={columns}
                        search="请输入创意名称"
                        onUpdate={this.updateHandle}
                        sorter={{ field: 'create_time', order: 'desc' }}
                        canCheck
                        rowKey="id"
                        saveUpdate={e=>this.setState({update: e})}
                        extra={
                            <Batchs>
                                <BatchSelect text={selectedText}>
                                    {
                                        configData.map(t => {
                                            return (
                                                <BatchOption key={t.value}
                                                text={t.text}
                                                onClick={e=>this.selectedChangeHandle(t)}/>
                                            )
                                        })
                                    }
                                </BatchSelect>
                                <BatchLink text="Deepleaper批量操作" onClick={this.batchDeepleaper}  />
                                <BatchLink text="渠道外审批量操作" onClick={this.batchChannel}  />

                            </Batchs>
                        }
                    />
                    <Modal title="Deepleaper内审批量操作"
                           visible={showModal}
                           onCancel={e => this.setState({showModal: false})}
                           footer={
                               <div>
                                   <Button onClick={this.deepleaperPass}>批量审核通过</Button>
                                   <Button onClick={this.deepleaperReject}>批量审核拒绝</Button>
                               </div>
                           }
                    >
                        {
                            <Table columns={this.state.deepleaperColumns}
                                   dataSource={this.state.deepleaperArr}
                                   pagination={false}
                                   rowKey={'id'}
                            />

                        }

                    </Modal>
                    <Modal title="渠道外审批量操作"
                           visible={showChannel}
                           onCancel={e => this.setState({showChannel: false})}
                           footer={
                               <div>
                                   <Button onClick={this.channelPass}>批量审核通过</Button>
                                   <Button onClick={this.channelReject}>批量审核拒绝</Button>
                                   <Button onClick={this.channelAudit}>批量审核中</Button>
                               </div>
                           }
                    >
                        {
                            <Table columns={this.state.channelColumns}
                                   dataSource={this.state.channelArr}
                                   pagination={false}
                                   rowKey={'id'}
                            />
                        }

                    </Modal>
                    <Modal title="审核拒绝原因"
                           visible={showReason}
                           onCancel={e => this.setState({showReason: false})}
                           footer={
                               <div>
                                   <Button onClick={e => this.setState({showReason: false,textAreaVal:''})}>关 闭</Button>
                                   <Button onClick={this.reasonSubmit}>提 交</Button>
                               </div>
                           }
                    >

                        <div className={styles.line}>
                            <TextArea autosize={{minRows: 10}}
                                      placeholder="请输入内审拒绝理由"
                                      onBlur={this.textAreaBlurHandle}
                                      onChange={this.textAreaChangeHandle}
                                      value={ textAreaVal}
                            />
                        </div>

                    </Modal>

                </div>
            </div>
        )
    }
}

class AuditChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showReason:false,
            textAreaVal:'',
            ids:[],
            comment:'',
        }
    }
    /**
     * @method handleMenuClick 开关组件点击事件，更新数据
     */
    handleMenuClick = async(e, rows) => {

        this.setState({
            ids:rows.id
        })
            if(e.key == 'pass'){
            var req = {
                'ids': rows.id,
                'audit_status': 'pass',
                'comment': '',
                'tag': ''
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatus`,
                method: 'post',
                data: req
            })
            if (res && res.status === 1) {
                console.log('props',this.props)
                this.props.onUpdate();
                return true
            }
            else {
                message.error(res && res.msg || '服务器异常')
                return false
            }
        }else if(e.key == 'reject'){
            this.setState({
                showReason:true,
            })

        }

    }
    //deepleaper审核拒绝理由
    reasonSubmit = async ()=>{
            var req = {
                'ids': this.state.ids,
                'audit_status': 'reject',
                'comment': this.state.comment,
                'tag': ''
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatus`,
                method: 'post',
                data: req
            })
            if(res && res.status === 1){
                this.setState({
                    showReason:false,
                })
                message.success( '审核拒绝设置成功')
                await this.props.onUpdate();
            }
            else {
                this.setState({
                    showReason:false,
                })
                message.error(res && res.msg || '服务器异常')
                return false

            }


    }
    //拒绝理由
    textAreaBlurHandle= async(e)=>{
        await this.setState({
            comment: e.target.value
        })

    }
    textAreaChangeHandle= async(e)=>{
        await this.setState({
            comment: e.target.value,
            textAreaVal:e.target.value
        })
    }
    render() {
        const { onClick, disabled, index , row , value, onUpdate} = this.props
        const {showReason,textAreaVal} = this.state
        return (
            <div >
                <Dropdown trigger={["hover"]} overlay={

                    row.audit_status == 'audit'
                        ?
                            <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                                <Menu.Item key="pass">审核通过</Menu.Item>
                                <Menu.Item key="reject">审核拒绝</Menu.Item>
                            </Menu>
                        : row.audit_status == 'pass'
                            ?
                            <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                                    <Menu.Item key="reject">审核拒绝</Menu.Item>
                            </Menu>
                            :  <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                                    <Menu.Item key="pass">审核通过</Menu.Item>
                                </Menu>
                    }
                          // getPopupContainer={() => document.getElementById('area')}

                >
                    <Button style={{marginLeft: 8}}>
                        {
                            value == 'audit'
                                ? '审核中'
                                : value == 'pass'
                                    ? '审核通过'
                                    : (
                                    <div style={{display:'inline-block'}}>
                                        审核拒绝
                                        {
                                            <Popover placement="top" trigger="hover" title="审核拒绝原因" content={
                                                <div style={{ fontSize: 14, lineHeight: '20px', width: 220 }}>
                                                    {row.comment}
                                                </div>
                                            }>
                                                <Icon type="question-circle-o" />
                                            </Popover>
                                        }

                                    </div>

                                )
                        }
                        <Icon type="down"/>
                    </Button>
                </Dropdown>
                <Modal title="审核拒绝原因"
                       visible={showReason}
                       onCancel={e => this.setState({showReason: false})}
                       footer={
                           <div>
                               <Button onClick={e => this.setState({
                                   showReason: false,
                                   textAreaVal:''
                               })}>关 闭</Button>
                               <Button onClick={this.reasonSubmit}>提 交</Button>
                           </div>
                       }
                >

                    <div className={styles.line}>
                            <TextArea autosize={{minRows: 10}}
                                      placeholder="请输入内审拒绝理由"
                                      onBlur={this.textAreaBlurHandle}
                                      onChange={this.textAreaChangeHandle}
                                      value={textAreaVal}
                            />
                    </div>

                </Modal>
            </div>
        )
    }
}
class ChannelChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showReason:false,
            textAreaVal:'',
            ids:[],
            comment:'',
        }
    }
    /**
     * @method handleMenuClick 开关组件点击事件，更新数据
     */
    handleMenuClick = async(e, rows) => {
        this.setState({
            ids:rows.id
        })
        //渠道外审核通过
        if(e.key == 'pass'){
            var req = {
                'ids': rows.id,
                'audit_status': 'pass',
                'comment': '',
                'medium': this.props.medium
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatusothers`,
                method: 'post',
                data: req
            })
            if (res && res.status === 1) {
                console.log('props',this.props)
                this.props.onUpdate();
                return true
            }
            else {
                message.error(res && res.msg || '服务器异常')
                return false
            }
        }else if(e.key == 'reject'){
            this.setState({
                showReason:true,
            })

        }else if(e.key == 'audit'){
            var req = {
                'ids': rows.id,
                'audit_status': 'audit',
                'comment': '',
                'medium': this.props.medium
            }
            const res = await request({
                url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatusothers`,
                method: 'post',
                data: req
            })
            if (res && res.status === 1) {
                console.log('props',this.props)
                this.props.onUpdate();
                return true
            }
            else {
                message.error(res && res.msg || '服务器异常')
                return false
            }
        }

    }
    //deepleaper审核拒绝理由
    reasonSubmit = async ()=>{
        var req = {
            'ids': this.state.ids,
            'audit_status': 'reject',
            'comment': this.state.comment,
            'medium': this.props.medium
        }
        const res = await request({
            url: `${BUSINESSAPIHOST}/audit/adcreativeupdateauditstatusothers`,
            method: 'post',
            data: req
        })
        if(res && res.status === 1){
            this.setState({
                showReason:false,
            })
            message.success( '审核拒绝设置成功')
            await this.props.onUpdate();

        }
        else {
            this.setState({
                showReason:false,
            })
            message.error(res && res.msg || '服务器异常')
            return false
        }


    }
    //拒绝理由
    textAreaBlurHandle= async(e)=>{
        await this.setState({
            comment: e.target.value
        })

    }
    textAreaChangeHandle= async(e)=>{
        await this.setState({
            comment: e.target.value,
            textAreaVal:e.target.value
        })
    }
    render() {
        const {index , row , value, medium} = this.props
        const {showReason,textAreaVal} = this.state
        return (
            <div>
                <Dropdown trigger={["hover"]} overlay={
                    row.other_audit_status == 'audit'
                        ?
                        <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                            <Menu.Item key="pass">审核通过</Menu.Item>
                            <Menu.Item key="reject">审核拒绝</Menu.Item>
                        </Menu>
                        : row.other_audit_status == 'pass'
                        ?
                        <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                            <Menu.Item key="reject">审核拒绝</Menu.Item>
                        </Menu>
                        :  row.other_audit_status == 'reject' ? <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                            <Menu.Item key="pass">审核通过</Menu.Item>
                        </Menu>
                            : <Menu onClick={(e)=>this.handleMenuClick(e, row)}>
                            <Menu.Item key="audit">审核中</Menu.Item>
                        </Menu>

                }
                >
                    <Button style={{marginLeft: 8}}>
                        {
                            value == 'audit'
                                ? '审核中'
                                : value == 'pass'
                                ? '审核通过'
                                : value == 'wait'? '待审核'
                                    :value == 'reject' ?(
                                    <div style={{display:'inline-block'}}>
                                        审核拒绝
                                        {
                                            <Popover placement="top" trigger="hover" title="审核拒绝原因" content={
                                                <div style={{ fontSize: 14, lineHeight: '20px', width: 220 }}>
                                                    {row.other_comment}
                                                </div>
                                            }>
                                                <Icon type="question-circle-o" />
                                            </Popover>
                                        }

                                    </div>

                                ):'-'
                        }
                        <Icon type="down"/>
                    </Button>
                </Dropdown>
                <Modal title="审核拒绝原因"
                       visible={showReason}
                       onCancel={e => this.setState({showReason: false})}
                       footer={
                           <div>
                               <Button onClick={e =>
                                   this.setState({
                                       showReason: false,
                                       textAreaVal:''
                                   })

                               }>关 闭</Button>
                               <Button onClick={this.reasonSubmit}>提 交</Button>
                           </div>
                       }
                >

                    <div className={styles.line}>
                            <TextArea autosize={{minRows: 10}}
                                      placeholder="请输入拒绝理由"
                                      onBlur={this.textAreaBlurHandle}
                                      onChange={this.textAreaChangeHandle}
                                      value={textAreaVal}
                            />
                    </div>

                </Modal>
            </div>
        )
    }
}



