import React, { Component } from 'react';
import { Checkbox, Alert,Button} from 'antd';
import propTypes from 'prop-types';
import {DP_POST} from '../../utils/fetch';
const CheckboxGroup = Checkbox.Group;

class Channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // options: ['头条号', '百家号', '微信公众号', '大鱼号', '企鹅号', '一点号', '搜狐号', '新浪微博', '淘宝头条']
            options: [],
            lastChannel: null
        };
    }

    componentWillMount() {
        const url = SERVICE_API_URL+"/api/channel/list";
        DP_POST(url, {body: ""})
            .then((res) => {
                if (res.status !== 'ok') return;
                console.log(res)
                var options = res.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id
                    }
                })
                this.setState({
                    options: options
                })
            })
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.channel) return
        let lastChannelId = nextProps.channel.split(',');
        let lastChannel = [];
        lastChannelId.forEach((id) => {
            this.state.options.forEach((item) => {
                if (id == item.value) {
                    lastChannel.push(item.label)
                }
            })
        })
        this.setState({
            lastChannel: lastChannel
        })
    }

    handleChange(checkedValues) {
        var channel = checkedValues.join(",");
        console.log(channel)
        this.props.fetchChannel(channel)
    }
    render() {
        return (
            <div>
                {
                    this.state.lastChannel
                        ? <Alert
                            message="当前作品推荐平台"
                            type="info"
                            showIcon
                            description={this.state.lastChannel.map((item, index) =>{
                                return <Button key={index}>{item}</Button>
                            })}/>
                        : null
                }
                <Alert message="推荐平台" type="info" showIcon description="请推荐平台"/>
                <CheckboxGroup options={this.state.options} onChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
}

Channel.propTypes = {
    fetchChannel: propTypes.func,
    channel: propTypes.string
}
export default Channel;
