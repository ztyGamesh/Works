/*
 添加商品功能的组件
 name: AddCommodity
 */
import React, {Component} from 'react';
import {Input, Button, message} from 'antd';
import {DP_taobao} from '../../utils/fetch';

export default class AddCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			targetUrl: '',
		};
	}

	handleInput(e) {
		this.setState({targetUrl: e.target.value})
	}

	handleClick() {
		//验证url格式
		const URL_REGEX = /^((https|http|)?:\/\/)[^\s]+/;
		const re = new RegExp(URL_REGEX);
		if (!re.test(this.state.targetUrl)) {
			message.error('url格式不正确');
			return;
		}
		//请求商品接口
		DP_taobao(this.state.targetUrl)
		.then((data) => {
			if (data === "failed") {
				message.error("该商品无效");
				return
			}
			var temp = data.tbk_item_info_get_response.results.n_tbk_item[0];
			this.props.handleDataArr(temp)
		})

	}

	render() {
		return (
			<div>
				<Input onBlur={this.handleInput.bind(this)}/>
				<Button type="primary" onClick={this.handleClick.bind(this)}>添加商品</Button>
			</div>
		);
	}
}