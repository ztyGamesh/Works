/**
 *
 * 封面容器组件 for 新建、编辑图集作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveDisplayInfo,savePics} from '../../../reducers/composePic';
import CoverMap from '../../../components/CoverMap/CoverMap';

const mapStateToProps = (state) => {
    return {
        pics: state.composePic.pics,
        displayInfo: state.composePic.displayInfo,
        uid: state.composePic.uid,
        // 图集的信息 给封面图组件使用
        mode: "tuji",
        modeContent: state.composePic.content,
    }
};

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
};

const ComposeTitle = connect(mapStateToProps, mapDispatchToProps)(CoverMap);

export default ComposeTitle;
