import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TreeSelect, Button, Modal, Radio,message,} from 'antd';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

import TreeList from '../TreeList';
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
			radioValue: "a"
		}
	}

	componentWillMount() {
		// console.log("+++++",this.props.mediaList)
		// let treeData = [];
		// {a1,:b1,...,an:bn} ===> [{label:b1,value:a1,key:a1}]n
		// for (let key in this.props.mediaList) {
        // 	let item = {
		// 		label: this.props.mediaList[key],
		// 		value: key,
		// 		key: key
		// 	}
		// 	treeData.push(item)
		// }
		console.log('slot', this.props.slot)
        //拿到的数据是广告结构
        // 即 媒体->广告位->模板
        // 这里只展示 媒体->广告位
		// [{id:id,name:name,child:[]},...{}]n ===> [{label:b1,value:a1,key:a1,child}]n
		let treeData = this.props.slot.map((meiti) => {
            // 如果媒体下的广告位个数为0，则不显示
			if (meiti.child.length !== 0) {
				return {
					title: meiti.name,
					value: meiti.child.map((slot) => {
						return slot.id
					}).join(","),
					key: meiti.child.map((slot) => {
						return slot.id
					}).join(","),
					children: meiti.child.map((slot) => {
						return {
							title: slot.name,
							value: slot.id,
							key: slot.id
						}
					})
				}
			} else {
				return null;
			}
		})
		treeData = treeData.filter((item) => {
			return item != null
		})
		this.setState({
			treeData: treeData
		})

	}
	onChange(value,) {
		console.log("media字段", value.join(','))
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
            isAll: true
        })
		// console.log("allMedia")
		const mediaCondition = "";
        // 将全选信息传给父组件，作为新的查询条件
        this.props.getResult(mediaCondition)
    }
	handleModal() {
		this.setState({
			visible: true,
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
				>筛选广告位</RadioButton>
				<Modal
					title="筛选广告位"
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
		slot: state.slotReportReducers.slot.data
	}
}


export default connect(
	mapStateToProps
)(Selector);
