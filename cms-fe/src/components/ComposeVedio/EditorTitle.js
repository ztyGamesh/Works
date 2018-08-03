import React, {Component} from 'react';
import {Input} from 'antd';

export default class EditorTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: props.data.title,
		};
	}
	//当点击了父组件的浮层隐藏操作后，再次打开需要去掉未保存的标题，显示当前已保存的标题
	componentWillReceiveProps(props){
		this.setState({
			content : props.data.title
		});
	}

	handleChange(e) {
		this.setState({
			content: e.target.value,
		});
		this.props.changeTitle(e.target.value)
	}

	render() {
		return (
			<div>
				<Input size="small"
				       value={this.state.content}
				       onChange={this.handleChange.bind(this)}
				/>
			</div>
		);
	}
}
