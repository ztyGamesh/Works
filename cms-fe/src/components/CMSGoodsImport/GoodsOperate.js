import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col, Button, Alert, Modal, Spin, message} from 'antd';

import {DP_POST} from '../../utils/fetch';

import {clearFiles} from '../../reducers/goodsImport';

class GoodsOperate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,//上传结果页
            uploadVisible: false,//上传按钮
            result: '请选择文件',//分析结果
            uploadResult: {
                title: '',
                message: '',
                visible: 'hidden',//重新上传
            },
            updateTime: '',//分析后updateTime
            refresh: () => {
            },
            loading: false,//正在发送请求
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            refresh: nextProps.refresh
        })
    }

    /** 分析 **/
    handleAnalysis() {
        const url = SERVICE_API_URL + '/api/goods/analysisFiles';
        const option = {
            user: JSON.parse(sessionStorage.getItem("token")).user,
            files: this.props.files
        }
        console.dir(option)
        if (this.props.list.length > option.files.length) {
            message.error('请选择文件');
            this.setState({result: '请选择文件'});
            return;
        }
        this.setState({
            loading: true,
        });
        DP_POST(url, {body: option}).then((res) => {
            console.log(res)
            if ('ok' === res.status) {
                this.setState({
                    result: '添加' + res.data.onlineGoods + '，删除' + res.data.offGoods + '，修改' + res.data.changeGoods,
                    uploadVisible: true,
                    updateTime: res.data.updateTime,
                    loading: false,
                });
            } else {
                this.setState({
                    uploadVisible: false,
                    result: res.message,
                    loading: false,
                });
            }
        })
    }

    /** 上传 **/
    handleUpload() {
        this.setState({
            loading: true,
        });
        const url = SERVICE_API_URL + '/api/goods/importGoods';
        const option = {
            user: JSON.parse(sessionStorage.getItem("token")).user,
            updateTime: this.state.updateTime
        };
        console.dir(option)
        DP_POST(url, {body: option}).then((res) => {
            if ('ok' === res.status) {
                this.setState({
                    uploadResult: {
                        title: '上传成功',
                        message: this.state.result,
                        visible: 'hidden'
                    },
                    visible: true,
                    loading: false,
                });
            } else {
                this.setState({
                    uploadResult: {
                        title: '上传失败',
                        message: res.message,
                        visible: 'visible'
                    },
                    visible: true,
                    loading: false,
                });
            }
        })
    }

    /** 返回主页 **/
    handleOk() {
        this.props.clearFiles();
        this.state.refresh();
        this.setState({
            visible: false,
            uploadVisible: false,
            result: '请选择文件',
        });
    }

    /** 重新上传 **/
    handleCancel() {
        this.setState({
            visible: false,
            uploadVisible: false,
            //result: '请选择文件',
        });
    }

    render() {
        return (
            <div style={{width: '80%', marginTop: 20}}>
                <Alert style={{marginLeft: 30}} type="info" showIcon message={'分析结果'} description={this.state.result}/>
                <Row style={{margin: '20px 0 0 30px'}}>
                    <Col span={12}>
                        <div>
                            <Button onClick={this.handleAnalysis.bind(this)} style={{marginLeft: 20}}>分析</Button>
                            {
                                !this.state.uploadVisible ? null :
                                    <Button onClick={this.handleUpload.bind(this)} style={{marginLeft: 20}}>上传</Button>
                            }
                            {
                                this.state.loading ? <Spin style={{marginLeft: 20}}/> : null
                            }
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.visible}
                    title={this.state.uploadResult.title}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel.bind(this)}
                                style={{visibility: this.state.uploadResult.visible}}>重新上传</Button>,
                        <Button key="submit" type="primary" size="large"
                                onClick={this.handleOk.bind(this)}>返回主页</Button>
                    ]}
                >
                    <p>{this.state.uploadResult.message}</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.goodsImport.list,
        files: state.goodsImport.files,
    }
}

const mapDispatchtoProps = (dispatch) => {
    return {
        clearFiles: () => {
            dispatch(clearFiles())
        }
    }
}

GoodsOperate = connect(mapStateToProps, mapDispatchtoProps)(GoodsOperate);

export default GoodsOperate;
