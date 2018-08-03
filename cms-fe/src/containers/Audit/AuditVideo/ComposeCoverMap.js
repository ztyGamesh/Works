/**
 *
 * 封面容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveDisplayInfo,savePics} from '../../../reducers/auditVideo';
import CoverMap from '../../../components/CoverMap/CoverMap';

const mapStateToProps = (state) => {
    return {
        pics: state.auditVideo.pics,
        displayInfo: state.auditVideo.displayInfo,
        // 视频类型 没有三图模式的封面图
        name: "video",
        mode: "shipin"
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchType: (displayInfoContent) => {
            dispatch(saveDisplayInfo(displayInfoContent))
        },
        fetchDisplayInfoContent: (displayInfoContent) => {
            dispatch(saveDisplayInfo(displayInfoContent))
        },
        savePics: (pics) => {
            dispatch(savePics(pics))
        }
    }
}

const ComposeCoverMap = connect(mapStateToProps, mapDispatchToProps)(CoverMap);

export default ComposeCoverMap;
