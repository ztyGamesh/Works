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

	componentWillMount() {
		// console.log("+++++",this.props.mediaList)
		// {a1,:b1,...,an:bn} ===> [{label:b1,value:a1,key:a1}]n
		// for (let key in this.props.mediaList) {
        // 	let item = {
		// 		label: this.props.mediaList[key],
		// 		value: key,
		// 		key: key
		// 	}
		// 	treeData.push(item)
		// }
		let treeData = this.props.templates.map((item) => {
			return {
				title: item.name,
				value: item.uid,
				key: item.uid,
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
		const templateIdArry = ["3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0", "4d918595-d2a1-47c7-8e4a-012f28ddd96e", "6684515c-3b6d-40f5-969c-d137c3913aab", "7c44a357-ecd0-4c5b-80d0-db8bd5100149", "7e1199fd-de4d-469f-8778-5de1268cddea", "b2826850-b106-4cde-8a7c-d1d08dfaec7a", "c0bb62fe-fc21-4b0b-a5c7-d547db667032", "0f4b8c8e-0acb-49ff-b0d7-bcb099163bfa", "5ee12a12-d1ca-45b3-90a7-f8b40b358b02", "601e0e36-888c-4afa-9eb2-4780fb5de556", "d499c4e0-50bd-44a3-af0e-ec71dc37cfeb", "5e0e3da8-e3cc-4330-a409-ee7263a08711", "3fc13471-36a1-4dfc-abde-98c364e78e2e", "b62e5dfa-a628-4ddc-a2ef-c43e62feb318"];
		const mediaCondition = templateIdArry.join(",");
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
				>筛选创意样式</RadioButton>
				<Modal
					title="筛选创意样式"
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
		templates: state.creativeReportReducers.templates.data
	}
}


export default connect(
	mapStateToProps
)(Selector);
