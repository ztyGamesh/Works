import React, {Component} from 'react';
import {connect} from 'react-redux';
import CustomButton from '../../../components/CMSButton/CustomButton';
import {Row, Col, Modal, Input, message} from 'antd';
import propTypes from 'prop-types';
import {Prompt} from 'react-router-dom';
import {DP_POST} from '../../../utils/fetch';
import {editorTransform} from '../../../utils/editorTransform';

import ComposePreview from '../../../components/CMSComposePreview';

class SubmitList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonColletion: [
                {
                    buttonName: '通过',
                    clickEvent: this.saveButton.bind(this)
                },
                {
                    buttonName: '拒绝',
                    clickEvent: this.submitButton.bind(this)
                },
                {
                    buttonName: '预览',
                    clickEvent: this.previewButton.bind(this)
                },
                {
                    buttonName: '取消',
                    clickEvent: this.cancelButton.bind(this)
                }
            ],
            uid: '',
            isSureToLeave: true,
        };
        // this.saveButton = this.saveButton.bind(this);
        // this.submitButton = this.submitButton.bind(this);
        // this.previewButton = this.previewButton.bind(this);
        // this.cancelButton = this.cancelButton.bind(this);
    }

    saveButton(e) {
        console.log("通过")
        this.saveCompose(3);
    }

    submitButton(e) {
        console.log("拒绝")
        this.saveCompose(2);
    }

    previewButton(e) {
        console.log("预览")
    }

    cancelButton(e) {
        console.log("取消")
        this.setState({
            isSureToLeave: false
        },  () => {
            this.props.history.push('/audit/list');
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.uid) return;
        this.setState({
            uid: nextProps.uid,
        });
    }

    saveCompose(auditStatus, refuseComment, refuseConfirm) {
        if (!refuseConfirm && auditStatus === 2) {
            Modal.confirm({
                title: "拒绝理由是(可以不填)",
                okText: "确认拒绝",
                cancelText: "再想想",
                content: <Input onChange={this.handleComment.bind(this)}/>,
                onOk: () => {
                    this.handleCommentSubmit.apply(this)
                    console.log("success")
                    return
                },
                onCancel: () => {
                    return
                }
            })
            return
        }
        const goodsForCompose = this.handleShopData();
        const {title, marksman, content, editorContent, displayInfo, category, tags, channel, score, machineTag, type, uid} = this.props;
        const url = SERVICE_API_URL + "/api/audit/compose";
        var option = {
            "compose": {
                "auditStatus": auditStatus,
                "category": category,
                "content": content,
                "editorContent": editorContent,
                "updateUser": JSON.parse(sessionStorage.token).user,
                "machineTag": machineTag,
                "marksman": marksman,
                "score": score,
                "channel": channel,
                "tag": tags,
                "title": title,
                "type": type,
                "uid": uid,
                "comment": typeof refuseComment !== "string" ? "":refuseComment
            },
            "displayInfo": {
                "cover": displayInfo.content,
                "title": title,
                "type": displayInfo.type,
            },
            "goods": goodsForCompose || []
        };
        if (uid !== '') {
            option.compose.uid = uid
        }
        console.dir(option)
        //测试阶段
        // return
        // 前端参数验证
        let checkout = this.paramsCheckout(option);
        if (checkout !== "ok") {
            message.error(checkout);
            return
        }
        DP_POST(url, {body: option})
            .then((res) => {
                if (res.status === 'ok') {
                    if (option.compose.auditStatus == 2) {
                        message.success('已拒绝');
                    } else if (option.compose.auditStatus == 3) {
                        message.success("审核通过")
                    }
                    this.setState({
                        isSureToLeave: false
                    })
                    this.props.history.push('/audit/list')
                }
                else {
                    if (res.message == "-1003") {
                        res.data = res.data.split(",");
                        // res.data 是存放失效商品uid的数组
                        // goodsForCompose 是所有提交的商品数组
                        goodsForCompose.filter((shop) => {
                            res.data.forEach((uid) => {
                                if (uid === shop.uid) {
                                    message.error("失效商品为:" + shop.title)
                                }
                            })
                        })
                    }
                    message.error("上传参数有误，原因是:" + res.message)
                }
            })
    }

    handleShopData() {
        var shopListData = [];
        var content = JSON.parse(this.props.content);
        // console.log(content);
        for (var i = 0; i < content.length; i++) {
            if (content[i].video && content[i].goodsPromotion[0].uid) {
                shopListData.push({
                    "cover": content[i].goodsPromotion[0].pic,
                    "createUser": JSON.parse(sessionStorage.token).user,
                    "price": parseInt(content[i].goodsPromotion[0].price) * 100,
                    "source": "taobao",
                    "title": content[i].goodsPromotion[0].title,
                    "type": 2,
                    "url": content[i].goodsPromotion[0].url,
                    "uid": content[i].goodsPromotion[0].uid,
                })
            }
        }
        // console.log(shopListData);
        return shopListData;
    }

    paramsCheckout(option) {
        let messageInfo = "ok";
        for (var k in option) {
            if (k === "goods") continue;
            if (typeof option[k] === "object") {
                console.log(option[k])
                // compose
                // displayInfo
                for (var l in option[k]) {
                    if (l === "uid") continue;
                    if (option[k][l] == "") {
                        switch (l) {
                            case "category":
                                messageInfo = "作品分类未填写";
                                break;
                            case "editorContent":
                                messageInfo = "编辑器内不能为空";
                                break;
                            case "content":
                                messageInfo = "详情页HTML不能为空";
                                break;
                            case "machineTag":
                                messageInfo = "作品关键字未选中";
                                break;
                            case "marksman":
                                messageInfo = "作品马甲名未选中";
                                break;
                            case "tag":
                                messageInfo = "作品标签未选中";
                                break;
                            case "title":
                                messageInfo = "作品标题未填写";
                                break;
                            case "cover":
                                messageInfo = "封面图信息未填写完全";
                                break;
                            default:
                                messageInfo = "ok"
                        }
                    } else {
                        messageInfo = "ok"
                    }
                }
            }
        }
        return messageInfo
    }

    handleComment(e) {
        this.setState({
            comment: e.target.value
        })
    }
    handleCommentSubmit() {
        console.log("成功拒绝")
        this.saveCompose(2, this.state.comment, true);
    }

    render() {
        return (
            <Row gutter={16} style={{marginTop: "100px"}}>
                {this.state.buttonColletion.map((item, index) => {
                    if ('预览' === item.buttonName) {
                        return <Col span={2} push={10} key={index}>
                            <ComposePreview uid={this.state.uid}/>
                        </Col>
                    }
                    return <Col span={2} push={10} key={index}>
                        <CustomButton buttonName={item.buttonName} handleButtonClick={item.clickEvent} key={index}/>
                    </Col>
                })}
                <Prompt message="是否离开当前页面?未保存的内容将会丢失" when={this.state.isSureToLeave}/>
            </Row>

        );
    }
}

SubmitList.propTypes = {
    title: propTypes.string,
    marksman: propTypes.number,
    displayInfo: propTypes.object,
    category: propTypes.string,
    tags: propTypes.string,
    type: propTypes.number,
    content: propTypes.string,
    editorContent: propTypes.string,
    uid: propTypes.string,
    score: propTypes.number,
    channel: propTypes.string
};

const mapStateToProps = (state) => {
    return {
        ...state.auditVideo
    }
};
const ComposeSubmitList = connect(mapStateToProps)(SubmitList);
export default ComposeSubmitList;
