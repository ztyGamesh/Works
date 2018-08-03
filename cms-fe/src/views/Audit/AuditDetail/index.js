import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {INITDATA, CLEARDATA} from '../../../reducers/composeAudit';

import ComposeTitle from '../../../containers/Audit/AuditDetail/ComposeTitle';
import ComposeMarksman from '../../../containers/Audit/AuditDetail/ComposeMarksman';
import ComposeUeditor from '../../../containers/Audit/AuditDetail/ComposeUeditor.js';
import ComposeCoverMap from '../../../containers/Audit/AuditDetail/ComposeCoverMap';
import ComposeSortLabel from '../../../containers/Audit/AuditDetail/ComposeSortLabel';
import ComposeTags from '../../../containers/Audit/AuditDetail/ComposeTags';
import ComposeMachineTag from '../../../containers/Audit/AuditDetail/ComposeMachineTag';
import ComposeScore from '../../../containers/Audit/AuditDetail/ComposeScore';
import ComposeChannel from '../../../containers/Audit/AuditDetail/ComposeChannel';
import ArticleURL from '../../../components/ArticleURL';
import SubmitAudit from '../../../containers/Audit/AuditDetail/ComposeSubmitList';

import {DP_POST} from '../../../utils/fetch';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class AuditDetail extends Component {
    constructor() {
        super()
        this.state = {
            data: '',
            uid: '',
            lastSearchCondition: null
        }
    }

    componentWillMount() {
        // console.log(this.props.location.state.cellData.lastSearchCondition);
        // console.log(this.props.location.state.cellData.lastSearchCondition);
        // console.log(this.props.location.state)
        const uid = this.props.location.state.cellData.uid;
        // const uid = nextProps.location.state.cellData.uid;
        const url = SERVICE_API_URL + "/api/compose/detail";
        const option = {
            uid: uid
        }
        DP_POST(url, {body: option})
            .then((res) => {
                console.log(res.data)
                if (res.status === "ok") {
                    var init = res.data;
                    var compose = init.compose;
                    var displayInfo = init.displayInfo;
                    let model = {
                        title: compose.title,
                        marksman: compose.marksman,
                        editorContent: compose.editorContent,
                        content: compose.content,
                        displayInfo: {
                            content: displayInfo ? displayInfo.cover : "[]",
                            type: displayInfo ? displayInfo.type : "0"
                        },
                        category: compose.category,
                        tags: compose.tag,
                        score: compose.score,
                        channel: compose.channel,
                        machineTag: compose.machineTag,
                        uid: uid
                    }
                    this.props.initData(model)
                    this.setState({
                        data: res.data,
                        uid: uid,
                    })
                }
            })
    }

    componentWillUnmount() {
        console.log("over")
        this.props.clearData()
    }

    render() {
        return (
            <div style={{width: "1000px", margin: "0 auto",padding:"45px 60px"}}>

                {/* 文章标题 */}
                <ComposeTitle />
                {/* 文章马甲名*/}
                <ComposeMarksman/>
                {/* 编辑内容部分  (编辑器)*/}
                <ComposeUeditor id="content"/>

                {/* 上传封面图 */}
                <ComposeCoverMap editStyle={1}/>
                {/* 分类 */}
                <ComposeSortLabel />
                {/*  机器标签*/}
                <ComposeMachineTag editStyle={1}/>
                {/* 人工标签 */}
                <ComposeTags />
                {/* 评分 */}
                <ComposeScore />

                {/* 推荐平台 */}
                <ComposeChannel />

                {/* 文章URL */}
                <ArticleURL uid={this.state.uid}/>

                {/* 发布功能按钮*/}
                <SubmitAudit initData={this.state.data} {...this.props}/>

            </div>
        )
    }
};

AuditDetail.propTypes = {
    initData: propTypes.func,
    clearData: propTypes.func
};

const mapDispatchToProps = (dispatch) => {
    return {
        initData: (initData) => {
            dispatch(INITDATA(initData))
        },
        clearData: () => {
            dispatch(CLEARDATA())
        }
    }
};
AuditDetail = connect(null, mapDispatchToProps)(AuditDetail);
AuditDetail = wrapWithAccessionPermission(AuditDetail);
export default AuditDetail;
