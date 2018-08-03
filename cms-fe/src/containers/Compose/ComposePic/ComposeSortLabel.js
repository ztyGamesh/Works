/**
 *
 * 分类容器组件 for 新建、编辑图集作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveCategory} from '../../../reducers/composePic';
import SortLabel from '../../../components/SortLabel';

const mapStateToProps = (state) => {
    return {
        category: state.composePic.category
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCategory: (category) => {
            dispatch(saveCategory(category))
        }
    }
};

const ComposeSortLabel = connect(mapStateToProps, mapDispatchToProps)(SortLabel);

export default ComposeSortLabel;