/**
 *
 * 关键词容器组件 for 二次创作页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMachineTag} from '../../../reducers/composeSecondCreation';
import MachineTag from '../../../components/MachineTag';

const mapStateToProps = (state) => {
    return {
        title: state.composeSecondCreation.title,
        machineTag: state.composeSecondCreation.machineTag,
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