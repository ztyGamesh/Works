import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TreeSelect, Button, Radio, Modal} from 'antd';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import TreeList from '../TreeList';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// const treeData = [
// 	{
// 		label: '网易新闻',
// 		value: 'e17d3d75-0ba8-4a86-acd5-407af266a317',
// 		key: 'e17d3d75-0ba8-4a86-acd5-407af266a317',
// 	}, {
// 		label: 'Node2',
// 		value: '0-1',
// 		key: '0-1',
// 	}
// ];

class Selector extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: "",
            isAll: true,
			treeData: [],
			visible: false
		}
	}
	translateFun(dataTemp, dataGroup) {
		for (var i = 0; i < dataGroup.length; i++) {
			var obj = {};
			var hasCreate = false;
			obj.id = '0-' + dataGroup[i].id;
			obj.key = dataGroup[i].id;
			obj.value = dataGroup[i].id;
			obj.name = dataGroup[i].name;
			obj.title = dataGroup[i].name;
			obj.row = 0;
			if (dataGroup[i].child.length != 0) {
				obj.child = [];  //有计划才创建孩子节点
				var adplan = dataGroup[i].child;
				for (var j = 0; j < adplan.length; j++) {
					var hasCreatePerPlan = false;
					var obj2Child = {};
					obj2Child.id = '1-' + adplan[j].id;
					obj2Child.key = adplan[j].id;
					obj2Child.value = adplan[j].id;
					obj2Child.name = adplan[j].name;
					obj2Child.title = adplan[j].name;
					obj2Child.row = 1;
					if (adplan[j].child.length != 0) {
						obj2Child.child = [];
						hasCreatePerPlan = true;
						hasCreate = true;
						var adcreative =adplan[j].child;
						for (var k = 0; k < adcreative.length; k++) {
							var obj3Child = {};
							obj3Child.id = '2-'+ adcreative[k].id;
							obj3Child.key = adcreative[k].id;
							obj3Child.value = adcreative[k].id;
							obj3Child.name = adcreative[k].name;
							obj3Child.title = adcreative[k].name;
							obj3Child.row = 2;
							obj2Child.child.push(obj3Child);
						}
					}
					if (hasCreatePerPlan) {
						obj.child.push(obj2Child);
						hasCreatePerPlan = false;
					}
				}
			}

			if(hasCreate) {
				dataTemp.push(obj);
				hasCreate = false;
			}

		}
	}
	componentWillMount() {
		let treeData = [];
		this.translateFun(treeData, this.props.useradstruct);

		// console.log(treeData);
		treeData = treeData.map((a) => {
			return {
				title: a.name,
				key: a.key,
				value: a.value,
				children: a.child.map((b) => {
					return {
						title: b.name,
						key: b.key,
						value: b.value,
					}
				})
			}
		})
		this.setState({
			treeData: treeData
		})

	}
	onChange(value) {

		// console.log("media字段", value.join(','))
		const mediaCondition = value.join(',');
		this.props.getResult(mediaCondition)
        // 将选中的媒体字段传给父组件，作为新的查询条件
		this.setState({
			value,
			isAll: mediaCondition == "" ? true : false
		})
	}
    handleAll() {
        this.setState({
            value: "",
            isAll: true,
			visible: false,
			radioValue: "a"
        })
		// console.log("allMedia")
		const mediaCondition = "";
        // 将全选信息传给父组件，作为新的查询条件
        this.props.getResult(mediaCondition)
    }

	handleModal() {
		this.setState({
			visible: true
		})
	}
	render() {
		const tProps = {
			onChange: this.onChange.bind(this),
			treeData: this.state.treeData,
			isAll: this.state.isAll
		}
		return <div style={{
				padding: "10px 0"
        }}>
			<RadioGroup value={this.state.radioValue} onChange={(e) => {
				this.setState({
					radioValue: e.target.value
				})
			}}>
				<RadioButton
					value="a"
					// type={this.state.isAll ? "primary" : "ghost"}
					className={this.state.isAll ? styles.onFocus : styles.onBlur}
					onClick={this.handleAll.bind(this)}
				>全部</RadioButton>
				<RadioButton
					value="b"
					onClick={this.handleModal.bind(this)}
					className={!this.state.isAll ? styles.onFocus : styles.onBlur}
				>筛选广告计划</RadioButton>
				<Modal
					title="筛选广告计划"
					visible={this.state.visible}
					onCancel={() => {
						this.setState({
							visible: false
						})
					}}
					footer={null}
					bodyStyle={{height: "400px",overflow:"auto",paddingTop:"0px"}}
					// closable={false}
				>
					{/* <TreeSelect {...tProps}/> */}
					<TreeList {...tProps}/>
				</Modal>
			</RadioGroup>
		</div>;
	}
}

const mapStateToProps = function (state) {
	return {
		useradstruct: state.keywordReportReducers.useradstruct.data
	}
}


export default connect(
	mapStateToProps
)(Selector);
