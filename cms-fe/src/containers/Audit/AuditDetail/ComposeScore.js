/**
 *
 * 推荐评级容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveScore} from '../../../reducers/composeAudit';
import Score from '../../../components/Score';

const mapStateToProps = (state) => {
    return {
        score: state.composeAudit.score
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchScore: (score) => {
            dispatch(saveScore(score))
        }
    }
};

const ComposeScore = connect(mapStateToProps, mapDispatchToProps)(Score);

export default ComposeScore;
