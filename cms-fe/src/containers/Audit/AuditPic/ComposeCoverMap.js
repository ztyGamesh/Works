/**
 *
 * 封面容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveDisplayInfo,savePics} from '../../../reducers/auditPic';
import CoverMap from '../../../components/CoverMap/CoverMap';

const mapStateToProps = (state) => {
    return {
        pics: state.auditPic.pics,
        displayInfo: state.auditPic.displayInfo,
        mode: "tuji",
        modeContent: state.auditPic.content,
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
