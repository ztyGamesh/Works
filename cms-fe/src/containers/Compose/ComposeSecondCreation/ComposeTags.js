/**
 *
 * 标签容器组件 for 二次创作页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveTags} from '../../../reducers/composeSecondCreation';
import Tags from '../../../components/Tags';

const mapStateToProps = (state) => {
    return {
        title: state.composeSecondCreation.title,
        tags: state.composeSecondCreation.tags,
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