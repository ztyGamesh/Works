import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';

import ComposeTitle from '../../../containers/Audit/AuditPic/ComposeTitle';
import ComposeMarksman from '../../../containers/Audit/AuditPic/ComposeMarksman';
// import PictureCollectionListContainer from '../../../containers/Audit/AuditPic/PictureCollectionListContainer';
import PictureCollectionLDragContainer from '../../../containers/Audit/AuditPic/PictureCollectionDragContainer';
import ComposeCoverMap from '../../../containers/Audit/AuditPic/ComposeCoverMap';
import ComposeSortLabel from '../../../containers/Audit/AuditPic/ComposeSortLabel';
import ComposeTags from '../../../containers/Audit/AuditPic/ComposeTags';
import ComposeMachineTag from '../../../containers/Audit/AuditPic/ComposeMachineTag';
import ComposeScore from '../../../containers/Audit/AuditPic/ComposeScore';
import ComposeChannel from '../../../containers/Audit/AuditPic/ComposeChannel';
import ArticleURL from '../../../components/ArticleURL';
import SubmitCompose from '../../../containers/Audit/AuditPic/ComposeSubmitList';
import {DP_POST} from '../../../utils/fetch';
import {INITDATA, CLEARDATA} from '../../../reducers/auditPic';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class AuditPic extends Component {
    constructor() {
        super();
        this.state = {
            uid: '',
        }
    }

    componentWillMount() {
        if (this.props.location.state) {
            const uid = this.props.location.state.cellData.uid;
            const url = SERVICE_API_URL + '/api/compose/detail';
            const option = {
                uid: uid
            };
            DP_POST(url, {body: option})
                .then((res) => {
                    if (res.status === "ok") {
                        var init = res.data;
                        var compose = init.compose;
                        var displayInfo = init.displayInfo;
                        //如果图集信息中没有商品，也需要初始化出商品的JSON结构，图集组件渲染时使用
                        var content = JSON.parse(compose.content);
                        for (var i = 0; i < content.length; i++) {
                            if (content[i].goodsPromotion.length == 0) {
                                content[i].goodsPromotion = [{
                                    uid: '',
                                    pic: '',
                                    title: '',
                                    price: '',
                                    smallImages: [],
                                    url: ''
                                }]
                            }
                        }
                        let model = {
                            uid: compose.uid,
                            title: compose.title,
                            marksman: compose.marksman,
                            editorContent: compose.editorContent,
                            content: content,
                            displayInfo: {
                                content: displayInfo ? displayInfo.cover : "[]",
                                type: displayInfo ? displayInfo.type : "0",
                            },
                            category: compose.category,
                            tags: compose.tag,
                            machineTag: compose.machineTag,
                            type: compose.type,
                            score: compose.score,
                            channel: compose.channel,
                        };
                        this.props.initData(model);
                        this.setState({
                            uid: uid,
                        })
                    }
                })
        }
    }

    componentWillUnmount() {
        this.props.clearData();
    }

    render() {
        return (
            <div style={{width: "80%", "margin": "0 20px"}}>
                {/* 文章标题 */}
                <ComposeTitle/>
                {/* 文章马甲名*/}
                <ComposeMarksman/>
                {/* 上传图集 */}
                <PictureCollectionLDragContainer/>
                {/* 上传封面图 */}
                <ComposeCoverMap editStyle={1}/>
                {/* 分类 */}
                <ComposeSortLabel/>
                {/*  机器标签*/}
                <ComposeMachineTag editStyle={1} picsType={true}/>
                {/* 人工标签 */}
                <ComposeTags/>
                {/* 评分 */}
                <ComposeScore/>

                {/* 推荐平台 */}
                <ComposeChannel/>

                {/* 文章URL */}
                <ArticleURL uid={this.state.uid}/>

                {/* 发布功能按钮*/}
                <SubmitCompose {...this.props}/>
            </div>
        )
    }
}

AuditPic.propTypes = {
    initData: propTypes.func,
    clearData: propTypes.func
};

const mapDispatchToProps = (dispatch) => {
    return {
        initData: (data) => {
            dispatch(INITDATA(data))
        },
        clearData: () => {
            dispatch(CLEARDATA())
        }
    }
};
AuditPic = connect(null, mapDispatchToProps)(AuditPic);
AuditPic = wrapWithAccessionPermission(AuditPic);
export default AuditPic;
