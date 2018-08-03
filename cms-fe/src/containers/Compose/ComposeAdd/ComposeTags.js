/**
 *
 * 标签容器组件 for 新建、编辑作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveTags} from '../../../reducers/composeAdd';
import Tags from '../../../components/Tags';

const mapStateToProps = (state) => {
    return {
        title: state.composeAdd.title,
        tags: state.composeAdd.tags,
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