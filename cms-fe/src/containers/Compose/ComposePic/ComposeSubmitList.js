import React, {Component} from 'react';
import {connect} from 'react-redux';
import CustomButton from '../../../components/CMSButton/CustomButton';
import {Row, Col, message} from 'antd';
import propTypes from 'prop-types';
import {Prompt} from 'react-router-dom';
import {DP_POST} from '../../../utils/fetch';

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
        const goodsForCompose = this.handleShopData();
        const {title, marksman, content, editorContent, displayInfo, category, tags, machineTag, type,newContent} = this.props;
        const uid = this.state.uid;
        const url = SERVICE_API_URL + "/api/compose/replace";
        var contentResult = [];
        //存在封面图，此条数据即可被存入
        for (var i = 0; i < content.length; i++) {
            if (content[i].pic) {
                //Todo:删除数据中的空商品,如需支持多个商品，修改成循环
                var contentSingle = Object.assign({}, content[i]);
                if (contentSingle.goodsPromotion.length !== 0 && !contentSingle.goodsPromotion[0].uid) {
                    contentSingle.goodsPromotion = [];
                }
                contentResult.push(contentSingle);
            }
        }
        var option = {
            "compose": {
                "auditStatus": auditStatus,
                "category": category,
                // "content": JSON.stringify(contentResult),
                "content": newContent ? newContent : JSON.stringify(contentResult),
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
        // 防止数据格式引起的报错 content里面的内容必须是JSON格式字符串
        if (typeof option.compose.content !== "string") {
            option.compose.content = JSON.stringify(option.compose.content)
        }
        if (uid) {
            // 编辑
            option.compose.updateUser = JSON.parse(sessionStorage.token).user;
            option.compose.uid = uid;
        } else {
            // 创建
            option.compose.createUser = JSON.parse(sessionStorage.token).user
        }
        console.dir(option)
        console.log("newContent", newContent);
        // 前端参数验证
        let checkout = this.paramsCheckout(option);
        if (checkout !== "ok") {
            message.error(checkout);
            return
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === 'ok') {

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
        var content = this.props.content;
        //从有封面图片的数据中取添加上的商品
        for (var i = 0; i < content.length; i++) {
            if (content[i].pic && content[i].goodsPromotion.length !== 0) {
                shopListData.push({
                    "cover": content[i].goodsPromotion[0].pic,
                    "createUser": JSON.parse(sessionStorage.token).user,
                    "price": parseInt(content[i].goodsPromotion[0].price) * 100,
                    "source": "taobao",
                    "title": content[i].goodsPromotion[0].title,
                    "type": 2,
                    "url": content[i].goodsPromotion[0].url,
                    "uid": content[i].goodsPromotion[0].uid
                })
            }
        }
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
    content: propTypes.array,
    editorContent: propTypes.string,
    uid: propTypes.string
};

const mapStateToProps = (state) => {
    return {
        ...state.composePic
    }
};
const ComposeSubmitList = connect(mapStateToProps)(SubmitList);
export default ComposeSubmitList;
