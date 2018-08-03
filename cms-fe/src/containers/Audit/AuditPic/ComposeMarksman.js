/**
 *
 * 马甲容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMaskman} from '../../../reducers/auditPic';
import ReadMarksman from '../../../components/Marksman/ReadMarksman';

const mapStateToProps = (state) => {
    return {
        marksman: state.auditPic.marksman,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveMaskman: (marksman) => {
            dispatch(saveMaskman(marksman))
        }
    }
};

const ComposeMarksman = connect(mapStateToProps, mapDispatchToProps)(ReadMarksman);

export default ComposeMarksman;