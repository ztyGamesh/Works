/**
 *
 * 关键词容器组件 for 新建、编辑图集作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMachineTag} from '../../../reducers/composePic';
import MachineTag from '../../../components/MachineTag';

const mapStateToProps = (state) => {
    return {
        title: state.composePic.title,
        machineTag: state.composePic.machineTag,
        content: state.composePic.content,
        uid: state.composePic.uid,
    }
};

const mapDispatchtoProps = (dispatch) => {
    return {
        saveMachineTag: (machineTag) => {
            dispatch(saveMachineTag(machineTag))
        }
    }
};
const ComposeMachineTag = connect(mapStateToProps, mapDispatchtoProps)(MachineTag);
export default ComposeMachineTag;