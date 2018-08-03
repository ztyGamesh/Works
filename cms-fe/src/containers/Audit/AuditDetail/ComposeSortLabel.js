/**
 *
 * 分类容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveCategory} from '../../../reducers/composeAudit';
import SortLabel from '../../../components/SortLabel';

const mapStateToProps = (state) => {
    return {
        category: state.composeAudit.category
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCategory: (category) => {
            dispatch(saveCategory(category))
        }
    }
}

const ComposeSortLabel = connect(mapStateToProps, mapDispatchToProps)(SortLabel);

export default ComposeSortLabel;