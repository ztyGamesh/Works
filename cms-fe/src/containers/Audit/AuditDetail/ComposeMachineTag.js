/**
 *
 * 关键词容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMachineTag} from '../../../reducers/composeAudit';
import MachineTag from '../../../components/MachineTag';

const mapStateToProps = (state) => {
    return {
        title: state.composeAudit.title,
        machineTag: state.composeAudit.machineTag,
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