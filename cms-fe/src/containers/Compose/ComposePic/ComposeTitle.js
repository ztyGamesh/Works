/**
 *
 * 标题容器组件 for 新建、编辑图集作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveTitle} from '../../../reducers/composePic';
import Title from '../../../components/Title';


const mapStateToProps = (state) => {
    return {
        title: state.composePic.title,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveTitle: (title) => {
            dispatch(saveTitle(title))
        }
    }
}

const ComposeTitle = connect(mapStateToProps, mapDispatchToProps)(Title);

export default ComposeTitle;