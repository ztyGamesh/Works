/**
 *
 * 关键词容器组件 for 新建、编辑作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMachineTag} from '../../../reducers/composeAdd';
import MachineTag from '../../../components/MachineTag';

const mapStateToProps = (state) => {
    return {
        title: state.composeAdd.title,
        machineTag: state.composeAdd.machineTag,
    }
}

const mapDispatchtoProps = (dispatch) => {
    return {
        saveMachineTag: (machineTag) => {
            dispatch(saveMachineTag(machineTag))
        }
    }
}
const ComposeMachineTag = connect(mapStateToProps, mapDispatchtoProps)(MachineTag);
export default ComposeMachineTag;