import React, {Component} from 'react';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {INITDATA, CLEARDATA} from '../../../reducers/composeSecondCreation';

import ComposeTitle from '../../../containers/Compose/ComposeSecondCreation/ComposeTitle';
import ComposeMarksman from '../../../containers/Compose/ComposeSecondCreation/ComposeMarksman';
import ComposeUeditor from '../../../containers/Compose/ComposeSecondCreation/ComposeUeditor.js';
import ComposeCoverMap from '../../../containers/Compose/ComposeSecondCreation/ComposeCoverMap';
import ComposeSortLabel from '../../../containers/Compose/ComposeSecondCreation/ComposeSortLabel';
import ComposeTags from '../../../containers/Compose/ComposeSecondCreation/ComposeTags';
import ComposeMachineTag from '../../../containers/Compose/ComposeSecondCreation/ComposeMachineTag';
import SubmitCompose from '../../../containers/Compose/ComposeSecondCreation/ComposeSubmitList';

import {DP_POST} from '../../../utils/fetch';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class ComposeSecondCreation extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        // console.log(this.props.location.state)
        const uid = this.props.location.state.cellData.uid;
        // const uid = nextProps.location.state.cellData.uid;
        const url = SERVICE_API_URL + '/api/content/detail';
        const option = {
            uid: uid
        }
        DP_POST(url, {body: option})
            .then((res) => {
                console.log(res.data)
                if (res.status === "ok") {
                    const init = res.data;
                    const editorContent = init.content.replace(/^<div>|<\/div>$/g, '');
                    const model = {
                        title: init.title,
                        editorContent: editorContent,
                        contentUid: uid,
                    }
                    this.props.initData(model)
                }
            })
    }

    componentWillUnmount() {
        this.props.clearData()
    }

    render() {
        return (
            <div style={{width: "1000px", margin: "0 auto",padding:"45px 60px"}}>
                {/* 文章标题 */}
                <ComposeTitle/>
                {/* 文章马甲名*/}
                <ComposeMarksman/>
                {/* 编辑内容部分  (编辑器)*/}
                <ComposeUeditor id="content"/>

                {/* 上传封面图 */}
                <ComposeCoverMap/>
                {/* 分类 */}
                <ComposeSortLabel/>
                {/*  机器标签*/}
                <ComposeMachineTag/>
                {/* 人工标签 */}
                <ComposeTags/>

                {/* 发布功能按钮*/}
                <SubmitCompose {...this.props}/>
            </div>
        )
    }
};

ComposeSecondCreation.propTypes = {
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
ComposeSecondCreation = connect(null, mapDispatchToProps)(ComposeSecondCreation);
ComposeSecondCreation = wrapWithAccessionPermission(ComposeSecondCreation);
export default ComposeSecondCreation;
