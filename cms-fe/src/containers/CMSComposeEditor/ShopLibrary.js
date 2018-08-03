/* 商品库组件 */

// 1. 商品分类
// 2. 商品展示


import React, {Component} from 'react';

import {DP_POST} from '../../utils/fetch';
import {TreeSelect} from 'antd';
import CommodityList from '../../components/CMSCommodityList/CommidityList';
// const treeData = ;

class ShopTarget extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: undefined,
			name: "未选择",
			treeData: []
		};
	}

	componentWillMount() {
		const url = SERVICE_API_URL + '/api/goodsLibrary/list';
		DP_POST(url, {body: {}})
			.then((res) => {
				if (res.status === "ok") {
					// console.log(res.data);
					this.setState({
						treeData: res.data
					})
				}
			})
	}
	onChange(value, label, treeData) {
		// console.log(treeData.triggerNode.props.level);
		// 获取该分类的level值
		if (!treeData.triggerNode) return;
		const level = treeData.triggerNode.props.level;
		const count = treeData.triggerNode.props.count;
		this.setState({
			value: value,
			name: `${label[0]} (${count})`,
		});
		this.props.getSearchCondition(value, level);
	}
	render() {
		return (
			<div>
				<div style={{
					fontSize: "20px",
				}}>当前选中的商品分类: {this.state.name}</div>
				<TreeSelect
					style={{
						width: 300
					}}
					value={this.state.value}
					dropdownStyle={{
						maxHeight: 400,
						overflow: 'auto'
					}}
					treeData={this.state.treeData}
					placeholder="请选择商品分类"
					treeDefaultExpandAll={false}
					onChange={this.onChange.bind(this)}
				/>
			</div>
		)
	}
}

class ShopList extends Component {
	render() {
		return (
			<div>
				<CommodityList searchCondition={this.props.searchCondition} searchLevel={this.props.searchLevel}/>
			</div>
		);
	}
}
class ShopLibrary extends Component {

	constructor(props) {
		super(props);
		this.state = {
			searchCondition: undefined,
			level: 0
		};
	}

	getSearchCondition (condition, level) {
		this.setState({
			searchCondition: condition || "",
			level: level,
		})
	}
	render() {
		return (
            <div>
                <ShopTarget getSearchCondition={this.getSearchCondition.bind(this)}/>
				<ShopList searchCondition={this.state.searchCondition} searchLevel={this.state.level}/>
            </div>);
	}

}

export default ShopLibrary;
