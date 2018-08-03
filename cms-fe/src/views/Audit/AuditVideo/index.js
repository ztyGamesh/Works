import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';

import ComposeTitle from '../../../containers/Audit/AuditVideo/ComposeTitle';
import ComposeMarksman from '../../../containers/Audit/AuditVideo/ComposeMarksman';
import ComposeCoverMap from '../../../containers/Audit/AuditVideo/ComposeCoverMap';
import ComposeSortLabel from '../../../containers/Audit/AuditVideo/ComposeSortLabel';
import ComposeTags from '../../../containers/Audit/AuditVideo/ComposeTags';
import ComposeMachineTag from '../../../containers/Audit/AuditVideo/ComposeMachineTag';
import ComposeScore from '../../../containers/Audit/AuditVideo/ComposeScore';
import ComposeChannel from '../../../containers/Audit/AuditVideo/ComposeChannel';
import SubmitCompose from '../../../containers/Audit/AuditVideo/ComposeSubmitList';
import ComposeVedio from '../../../containers/Audit/AuditVideo/ComposeVedio';
import {DP_POST} from '../../../utils/fetch';
import {INITDATA, CLEARDATA} from '../../../reducers/auditVideo';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class AuditVideo extends Component {
    constructor() {
        super();
        this.state = {
            uid: '',
        }
    }

    componentWillMount() {
        // console.log(this.props.location.state);
        if (this.props.location.state) {
            const uid = this.props.location.state.cellData.uid;
            const url = SERVICE_API_URL + '/api/compose/detail';
            const option = {
                uid: uid
            };
            DP_POST(url, {body: option})
                .then((res) => {
                    if (res.status === "ok") {
                        console.log(res);
                        var init = res.data;
                        var compose = init.compose;
                        var displayInfo = init.displayInfo;
                        let model = {
                            uid: compose.uid,
                            title: compose.title,
                            marksman: compose.marksman,
                            editorContent: compose.editorContent,
                            content: compose.content,
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
                {/* 文章视频*/}
                <ComposeVedio/>
                {/* 上传封面图 */}
                <ComposeCoverMap editStyle={0}/>
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

                {/* 发布功能按钮*/}
                <SubmitCompose {...this.props}/>
            </div>
        )
    }
}

AuditVideo.propTypes = {
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
AuditVideo = connect(null, mapDispatchToProps)(AuditVideo);
AuditVideo = wrapWithAccessionPermission(AuditVideo);
export default AuditVideo;
