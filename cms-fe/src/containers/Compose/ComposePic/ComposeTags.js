/**
 *
 * 标签容器组件 for 新建、编辑图集作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveTags} from '../../../reducers/composePic';
import Tags from '../../../components/Tags';

const mapStateToProps = (state) => {
    return {
        tags: state.composePic.tags
    }
};

const mapDispatchToProps = (disptach) => {
    return {
        fetchTags: (tags) => {
            disptach(saveTags(tags))
        }
    }
};

const ComposeTags = connect(mapStateToProps, mapDispatchToProps)(Tags);

export default ComposeTags;