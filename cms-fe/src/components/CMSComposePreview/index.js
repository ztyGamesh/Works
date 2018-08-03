/** 预览功能
 *  props参数列表：
 *      uid: string, uid
 *      type: string || 'button', 可选，默认为'button'，标签，a/button
 */
import React, {Component} from 'react';
import {Modal, message} from 'antd';

import {DP_POST} from "../../utils/fetch";

import CustomButton from '../CMSButton/CustomButton';

class ComposePreview extends Component {
    constructor() {
        super()
        this.state = {
            preview: false,
            src: '',
            type: 'button',
        }
    }

    //预览
    handlePreview() {
        const uid = this.props.uid;
        console.log('====preview:' + uid);
        if (!uid){
            message.error('未保存作品无法预览');
            return;
        }
        const url = SERVICE_API_URL + '/api/compose/preview';
        const option = {
            uid: uid,
        };
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === "ok") {
                this.setState({
                    src: res.data.url,
                    preview: true,
                });
            }
        });
    }

    //关闭预览
    handleClosePreview() {
        this.setState({
            src: '',
            preview: false,
        });
    }

    render() {
        return (
            <div style={{display: 'inline-block'}}>
                {
                    'a' === this.props.type ?
                        <a onClick={this.handlePreview.bind(this)}>预览</a> :
                        <CustomButton handleButtonClick={this.handlePreview.bind(this)} buttonName={'预览'}/>
                }
                <Modal
                    visible={this.state.preview}
                    footer={null}
                    onCancel={this.handleClosePreview.bind(this)}
                    maskClosable={false}
                >
                    <div
                        style={{width: 340, height: 550, margin: '0 auto', backgroundColor: '#000'}}
                    >
                        <iframe src={this.state.src} style={{width: '100%', height: '100%', border: 0}}></iframe>
                    </div>
                </Modal>
            </div>
        )
    }
};

export default ComposePreview;

