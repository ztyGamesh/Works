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
            console.log(this.props.location.state.cellData.lastSearchCondition);
            //将上一次的查询条件传回
            this.props.history.push('/audit/list', {
                backInfo: this.props.location.state.cellData.lastSearchCondition
            });
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
        // console.log(this.props.initData)
        // 文章标题
        // console.log(this.props.title)
        // 文章马甲
        // console.log(this.props.marksman)
        // 文章编辑器
        const editorContent = UE.getEditor('content').getContent();
        const content = editorTransform(editorContent);
        // console.log(data)
        // 封面图信息 content 是图片url type 是图片模式 1 or 3
        // console.log(this.props.displayInfo)
        // 分类
        // console.log(this.props.category)
        // 标签
        // console.log(this.props.tags)
        // 获取商品数据 "goods"
        // console.log(this.handleShopData())
        const goodsForCompose = this.handleShopData();
        // console.log(goodsForCompose)
        const {title, marksman, displayInfo, category, tags, channel, score, machineTag, type, uid, lastSearchCondition} = this.props;
        // console.log(title, marksman, displayInfo, category, tags)
        const url = SERVICE_API_URL+"/api/audit/compose";
        var option = {
            // ...this.props.initData,
            "compose": {
                ...this.props.initData.compose,
                "auditStatus": auditStatus,
                "category": category,
                "channel": channel,
                "content": content,
                "editorContent": editorContent,
                // "contentUid": "string",
                // "createTime": 0,
                // "createUser": "string",
                "marksman": marksman,
                "score": score,
                "tag": tags,
                "title": title,
                "machineTag": machineTag,
                "type": type,
                "updateUser":JSON.parse(sessionStorage.token).user,
                "uid": uid,
                "comment": typeof refuseComment !== "string" ? "":refuseComment
                // "updateTime": 0,
                // "updateUser": "string"
            },
            "displayInfo": {
                ...this.props.initData.displayInfo,
                "cover": displayInfo.content,
                // "summary": "string",
                "title": title,
                "type": displayInfo.type,
                // "uid": "string"
            },
            "goods": goodsForCompose || []
        }
        // console.log(this.props.initData)
        console.dir(option)
        // 前端参数验证
        let checkout = this.paramsCheckout(option);
        if (checkout !== "ok") {
            message.error(checkout);
            return
        }
        DP_POST(url, {body: option})
            .then((res) => {
                console.log(res)
                if (res.status === "ok") {
                    if (option.compose.auditStatus == 2) {
                        message.success('已拒绝');
                    } else if (option.compose.auditStatus == 3) {
                        message.success("审核通过")
                    }
                    this.setState({
                        isSureToLeave: false
                    })
                    //将上一次的查询条件传回
                    this.props.history.push('/audit/list', {
                        backInfo: this.props.location.state.cellData.lastSearchCondition
                    });
                } else {
                    if (res.message == "-1003") {
                        res.data = res.data.split(",");
                        // res.data 是存放失效商品uid的数组
                        // goodsForCompose 是所有提交的商品数组
                        console.log(res.data);
                        console.log(goodsForCompose);
                        goodsForCompose.forEach((shop) => {
                            res.data.forEach((uid) => {
                                if (uid === shop.goodsId) {
                                    console.log(shop.title);
                                    message.error("失效商品为:" + shop.title)
                                }
                            })
                        })
                    }
                    // message.error("上传参数有误，原因是:" + res.message)
                    // message.error("请修改失效商品，重新提交")
                }
            })

    }

    handleShopData() {
        const div = document.createElement('div');
        div.innerHTML = UE.getEditor("content").getContent();
        var shopList = div.getElementsByClassName("wrapperOld");
        if (shopList.length === 0) {
            return false
        }
        shopList = Array.prototype.slice.call(shopList)
        var shopListData = shopList.map((shop) => {
            return JSON.parse(shop.dataset.shop)
        })
        // 返回 存放所有最终的商品数据
        return shopListData.map((goods) => {
            return {
                "cover": goods.pict_url,
                "createTime": 0,
                "createUser": "string",
                "goodsId": String(goods.num_iid),
                "price": parseInt(goods.zk_final_price)*100,
                "source": "taobao",
                "status": 0,
                "title": goods.title,
                "type": 0,
                "uid": "string",
                "url": goods.item_url,
                "uid": goods.uid
            }
        })
    }

    paramsCheckout(option) {
        let messageInfo;
        for (var k in option) {
            if (k === "goods") continue;
            console.log(k);
            if (typeof option[k] === "object") {

                // compose
                // displayInfo
                for (var l in option[k]) {
                    if (l === "uid") continue;
                    if (l === "machineTag") {console.log(option[k][l] == "");}
                    if (option[k][l] == "") {
                        switch (l) {
                            case "category":
                                messageInfo = "作品分类未填写";
                                return messageInfo;
                                break;
                            case "editorContent":
                                messageInfo = "编辑器内不能为空";
                                return messageInfo;
                                break;
                            case "content":
                                messageInfo = "详情页HTML不能为空";
                                return messageInfo;
                            case "machineTag":
                                messageInfo = "作品关键字未选中";
                                return messageInfo;
                            case "marksman":
                                messageInfo = "作品马甲名未选中";
                                return messageInfo;
                            case "tag":
                                messageInfo = "作品标签未选中";
                                return messageInfo;
                            case "title":
                                messageInfo = "作品标题未填写";
                                return messageInfo;
                            case "cover":
                                messageInfo = "封面图信息未填写完全";
                                return messageInfo;
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
        var comment = this.state.comment;
        this.saveCompose(2, comment, true);
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
    channel: propTypes.string,
    lastSearchCondition: propTypes.object
};

const mapStateToProps = (state) => {
    return {
        ...state.composeAudit
    }
};
const ComposeSubmitList = connect(mapStateToProps)(SubmitList);
export default ComposeSubmitList;
