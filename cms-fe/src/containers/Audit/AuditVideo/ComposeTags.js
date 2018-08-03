/**
 *
 * 标签容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveTags} from '../../../reducers/auditVideo';
import Tags from '../../../components/Tags';

const mapStateToProps = (state) => {
    return {
        title: state.auditVideo.title,
        tags: state.auditVideo.tags,
    }
}

const mapDispatchToProps = (disptach) => {
    return {
        fetchTags: (tags) => {
            disptach(saveTags(tags))
        }
    }
}

const ComposeTags = connect(mapStateToProps, mapDispatchToProps)(Tags);

export default ComposeTags;
