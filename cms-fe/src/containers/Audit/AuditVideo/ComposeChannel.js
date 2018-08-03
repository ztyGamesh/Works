/**
 *
 * 推荐平台容器组件 for 审核页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {saveChannel} from '../../../reducers/auditVideo';
import Channel from '../../../components/Channel';


const mapStateToProps = (state) => {
    return {
        channel: state.auditVideo.channel
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
