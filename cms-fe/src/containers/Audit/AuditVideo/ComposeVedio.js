/**
 *
 * 视频容器组件 for 审核页面
 *
 */
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {saveVedio} from '../../../reducers/auditVideo';
import Vedio from '../../../components/ComposeVedio';

const mapStateToProps = (state) => {
    return {
        content: state.auditVideo.content,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveVedio: (content) => {
            dispatch(saveVedio(content))
        }
    }
};

const ComposeVedio = connect(mapStateToProps, mapDispatchToProps)(Vedio);

export default ComposeVedio;
