/*
 添加成功商品展示组件
 name: ListCommodity
 */
import React, {Component} from 'react';
import {Card} from 'antd';
// import './ComposePics.css'

export default class ListCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pic: '',
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({
			pic: nextProps.goodsData.pic
		})
	}

	render() {
		var pic = this.state.pic;
		return (
			<div style={{overflow: "hidden"}}>
				{ pic ?
					<div>
						<div>商品缩略图:</div>
						<Card style={{width: "80px", float: 'left'}} bodyStyle={{padding: 6}}>
							<div className="custom-image">
								<img alt="example" width="100%" height="100%" src={pic}/>
							</div>
						</Card>
					</div>
					:
					null
				}
			</div>
		);
	}
}