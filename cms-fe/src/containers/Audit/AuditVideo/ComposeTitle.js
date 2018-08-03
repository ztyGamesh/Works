/**
 *
 * 标题容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveTitle} from '../../../reducers/auditVideo';
import Title from '../../../components/Title';

const mapStateToProps = (state) => {
    return {
        title: state.auditVideo.title,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveTitle: (title) => {
            dispatch(saveTitle(title))
        }
    }
};

const ComposeTitle = connect(mapStateToProps, mapDispatchToProps)(Title);

export default ComposeTitle;
