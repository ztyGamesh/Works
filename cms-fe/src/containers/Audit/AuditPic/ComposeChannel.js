/**
 *
 * 推荐平台容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveChannel} from '../../../reducers/auditPic';
import Channel from '../../../components/Channel';


const mapStateToProps = (state) => {
    return {
        channel: state.auditPic.channel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchChannel: (channel) => {
            dispatch(saveChannel(channel))
        }
    }
};

const ComposeChannel = connect(mapStateToProps, mapDispatchToProps)(Channel);

export default ComposeChannel;