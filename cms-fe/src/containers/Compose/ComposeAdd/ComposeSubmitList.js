import React, {Component} from 'react';
import {connect} from 'react-redux';
import CustomButton from '../../../components/CMSButton/CustomButton';
import {Row, Col, message} from 'antd';
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
                    buttonName: '保存',
                    clickEvent: this.saveButton.bind(this)
                },
                {
                    buttonName: '提交',
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
        console.log("保存")
        this.saveCompose(0);
    }

    submitButton(e) {
        console.log("提交")
        this.saveCompose(1);
    }

    previewButton(e) {
        console.log("预览")
    }

    cancelButton(e) {
        console.log("取消")
        this.setState({
            isSureToLeave: false
        }, () => {
            this.props.history.push('/compose/list');
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.uid) return;
        this.setState({
            uid: nextProps.uid,
        });
    }

    saveCompose(auditStatus = 0) {
        // 文章编辑器
        const editorContent = UE.getEditor('content').getContent();
        const content = editorTransform(editorContent);
        // console.log(content)
        // 获取商品数据 "goods"
        const goodsForCompose = this.handleShopData();
        // console.log(goodsForCompose)
        const {title, marksman, displayInfo, category, tags, machineTag, type, contentUid} = this.props;
        const uid = this.state.uid;
        // console.log(title, marksman, displayInfo, category, tags, machineTag, type, contentUid)
        const url = SERVICE_API_URL + "/api/compose/replace";
        var option = {
            "compose": {
                "auditStatus": auditStatus,
                "category": category,
                "content": content,
                "editorContent": editorContent,
                "machineTag": machineTag,
                "marksman": marksman,
                "tag": tags,
                "title": title,
                "type": type,
                "uid": this.state.uid
            },
            "displayInfo": {
                "cover": displayInfo.content,
                "title": title,
                "type": displayInfo.type,
            },
            "goods": goodsForCompose || []
        };
        if (uid) {
            // 编辑
            option.compose.updateUser = JSON.parse(sessionStorage.token).user;
            option.compose.uid = uid;
        } else {
            // 创建
            option.compose.createUser = JSON.parse(sessionStorage.token).user;
        }
        //二次创作原作品uid
        if (contentUid) {
            option.compose.contentUid = contentUid;
        }
        console.dir(option)
        // 前端参数验证
        let checkout = this.paramsCheckout(option);
        if (checkout !== "ok") {
            console.log(checkout)
            message.error(checkout);
            return
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === 'ok') {
                // 点击保存的处理
                if (0 === auditStatus) {
                    message.success('作品保存成功');
                    this.setState({
                        uid: res.data,
                    });
                } else {
                    message.success('作品提交成功');
                    this.setState({
                        isSureToLeave: false
                    })
                    this.props.history.push('/compose/list')
                }
            }
            else {
                if (res.message == "-1003") {
                    res.data = res.data.split(",");
                    // res.data 是存放失效商品uid的数组
                    // goodsForCompose 是所有提交的商品数组
                    goodsForCompose.forEach((shop) => {
                        res.data.forEach((uid) => {
                            if (uid === shop.goodsId) {
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
                "createUser": JSON.parse(sessionStorage.token).user,
                "goodsId": String(goods.num_iid),
                "price": parseInt(goods.zk_final_price) * 100,
                "source": "taobao",
                "title": goods.title,
                "type": 1,
                "url": goods.item_url,
                "uid": goods.uid
            }
        })
    }

    paramsCheckout(option) {
        let messageInfo;
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
                                return messageInfo;
                            case "editorContent":
                                messageInfo = "编辑器内不能为空";
                                return messageInfo;
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
    machineTag: propTypes.string,
    tags: propTypes.string,
    type: propTypes.number,
    uid: propTypes.string,
    contentUid: propTypes.string,
};

const mapStateToProps = (state) => {
    return {
        ...state.composeAdd
    }
};
const ComposeSubmitList = connect(mapStateToProps)(SubmitList);
export default ComposeSubmitList;
