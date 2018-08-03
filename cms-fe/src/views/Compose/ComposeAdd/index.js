import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {INITDATA, CLEARDATA} from '../../../reducers/composeAdd';

import ComposeTitle from '../../../containers/Compose/ComposeAdd/ComposeTitle';
import ComposeMarksman from '../../../containers/Compose/ComposeAdd/ComposeMarksman';
import ComposeUeditor from '../../../containers/Compose/ComposeAdd/ComposeUeditor.js';
import ComposeCoverMap from '../../../containers/Compose/ComposeAdd/ComposeCoverMap';
import ComposeSortLabel from '../../../containers/Compose/ComposeAdd/ComposeSortLabel';
import ComposeTags from '../../../containers/Compose/ComposeAdd/ComposeTags';
import ComposeMachineTag from '../../../containers/Compose/ComposeAdd/ComposeMachineTag';
import SubmitCompose from '../../../containers/Compose/ComposeAdd/ComposeSubmitList';

import {DP_POST} from '../../../utils/fetch';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class ComposeAdd extends Component {
    constructor() {
        super();
        this.state = {
            //编辑状态，0：新建，1：编辑
            editStyle: 0,
        }
    }

    componentWillMount() {
        if (!this.props.location.state) {
            this.props.initData({});
            this.setState({
                editStyle: 0,
            });
            return;
        }
        const {uid} = this.props.location.state.cellData;
        const url = SERVICE_API_URL + '/api/compose/detail';
        const option = {
            uid: uid
        }
        DP_POST(url, {body: option})
            .then((res) => {
                console.log(res.data)
                if (res.status === 'ok') {
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
                            content: displayInfo ? displayInfo.cover : '{}',
                            type: displayInfo ? displayInfo.type : '0',
                        },
                        category: compose.category,
                        tags: compose.tag,
                        machineTag: compose.machineTag,
                        type: compose.type,
                        pics: [],
                        contentUid: compose.contentUid,
                    }
                    this.props.initData(model)
                    this.setState({
                        editStyle: 1,
                    });
                }
            })
    }

    componentWillUnmount() {
        this.props.clearData()
    }

    render() {
        const editStyle = this.state.editStyle;
        return (
            <div style={{width: "1000px", margin: "0 auto",padding:"45px 60px"}}>
                {/* 文章标题 */}
                <ComposeTitle/>
                {/* 文章马甲名*/}
                <ComposeMarksman/>
                {/* 编辑内容部分  (编辑器)*/}
                <ComposeUeditor id="content"/>
                {/* 上传封面图 */}
                <ComposeCoverMap editStyle={editStyle}/>
                {/* 分类 */}
                <ComposeSortLabel/>
                {/*  机器标签*/}
                <ComposeMachineTag editStyle={editStyle}/>
                {/* 人工标签 */}
                <ComposeTags/>

                {/* 发布功能按钮*/}
                <SubmitCompose {...this.props}/>

            </div>
        )
    }
};

ComposeAdd.propTypes = {
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
ComposeAdd = connect(null, mapDispatchToProps)(ComposeAdd);
ComposeAdd = wrapWithAccessionPermission(ComposeAdd);
export default ComposeAdd;
