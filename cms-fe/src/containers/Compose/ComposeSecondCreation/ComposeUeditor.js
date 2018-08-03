/**
 *
 * 编辑器组件 for 新建、编辑作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveEditorContent} from '../../../reducers/composeSecondCreation';
import Ueditor from '../../../containers/CMSComposeEditor/Ueditor.js'

const mapStateToProps = (state) => {
    return {
        editorContent: state.composeSecondCreation.editorContent,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveEditorContent: (title) => {
            dispatch(saveEditorContent(title))
        }
    }
};

const ComposeUeditor = connect(mapStateToProps, mapDispatchToProps)(Ueditor);

export default ComposeUeditor;