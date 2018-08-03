/**
 *
 * 推荐评级容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveScore} from '../../../reducers/auditPic';
import Score from '../../../components/Score';

const mapStateToProps = (state) => {
    return {
        score: state.auditPic.score
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchScore: (score) => {
            dispatch(saveScore(score))
        }
    }
};

const ComposeTitle = connect(mapStateToProps, mapDispatchToProps)(Score);

export default ComposeTitle;