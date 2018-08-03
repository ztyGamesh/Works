/**
 *
 * 马甲容器组件 for 新建、编辑图集作品页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveMaskman} from '../../../reducers/composePic';
import Marksman from '../../../components/Marksman';

const mapStateToProps = (state) => {
    return {
        marksman: state.composePic.marksman
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveMaskman: (marksman) => {
            dispatch(saveMaskman(marksman))
        }
    }
};
const ComposeMarksman = connect(mapStateToProps, mapDispatchToProps)(Marksman);

export default ComposeMarksman;