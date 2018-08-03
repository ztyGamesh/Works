/**
 *
 * 马甲容器组件 for 二次创作页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMaskman} from '../../../reducers/composeSecondCreation';
import Marksman from '../../../components/Marksman';

const mapStateToProps = (state) => {
    return {
        marksman: state.composeSecondCreation.marksman,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveMaskman: (marksman) => {
            dispatch(saveMaskman(marksman))
        }
    }
};

const ComposeMarksman = connect(mapStateToProps, mapDispatchToProps)(Marksman);

export default ComposeMarksman;