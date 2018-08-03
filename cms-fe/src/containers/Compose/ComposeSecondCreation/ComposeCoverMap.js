/**
 *
 * 封面容器组件 for 二次创作页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveDisplayInfo,savePics} from '../../../reducers/composeSecondCreation';
import CoverMap from '../../../components/CoverMap/CoverMap';

const mapStateToProps = (state) => {
    return {
        pics: state.composeSecondCreation.pics,
        displayInfo: state.composeSecondCreation.displayInfo,
        uid: state.composeSecondCreation.uid
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

const ComposeCoverMap = connect(mapStateToProps, mapDispatchToProps)(CoverMap);

export default ComposeCoverMap;