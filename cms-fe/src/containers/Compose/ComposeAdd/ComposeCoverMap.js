/**
 *
 * 封面容器组件 for 新建、编辑作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveDisplayInfo,savePics} from '../../../reducers/composeAdd';
import CoverMap from '../../../components/CoverMap/CoverMap';

const mapStateToProps = (state) => {
    return {
        pics: state.composeAdd.pics,
        displayInfo: state.composeAdd.displayInfo,
        // 图文的信息 给封面图组件用  暂时不需要
        mode: "tuwen",
        modeContent: null
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
