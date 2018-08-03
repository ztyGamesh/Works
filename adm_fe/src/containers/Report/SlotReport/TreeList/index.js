import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;
import React, { Component } from 'react';


// const treeData = [
// 	{
// 		title: '0-0',
// 		key: '0-0',
// 		children: [
// 			{
// 				title: '0-0-0',
// 				key: '0-0-0',
// 				children: [
// 					{
// 						title: '0-0-0-0',
// 						key: '0-0-0-0'
// 					}, {
// 						title: '0-0-0-1',
// 						key: '0-0-0-1'
// 					}, {
// 						title: '0-0-0-2',
// 						key: '0-0-0-2'
// 					}
// 				]
// 			}, {
// 				title: '0-0-1',
// 				key: '0-0-1',
// 				children: [
// 					{
// 						title: '0-0-1-0',
// 						key: '0-0-1-0'
// 					}, {
// 						title: '0-0-1-1',
// 						key: '0-0-1-1'
// 					}, {
// 						title: '0-0-1-2',
// 						key: '0-0-1-2'
// 					}
// 				]
// 			}, {
// 				title: '0-0-2',
// 				key: '0-0-2'
// 			}
// 		]
// 	}, {
// 		title: '0-1',
// 		key: '0-1',
// 		children: [
// 			{
// 				title: '0-1-0-0',
// 				key: '0-1-0-0'
// 			}, {
// 				title: '0-1-0-1',
// 				key: '0-1-0-1'
// 			}, {
// 				title: '0-1-0-2',
// 				key: '0-1-0-2'
// 			}
// 		]
// 	},
//     {
// 		title: '0-2',
// 		key: '0-2'
// 	}
// ];

class Demo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			autoExpandParent: true,
			checkedKeys: [],
		};

        this.onCheck = this.onCheck.bind(this);
        this.renderTreeNodes = this.renderTreeNodes.bind(this);
	}
    componentWillReceiveProps(nextProps) {
        if(nextProps.isAll) {
            this.setState({
                checkedKeys: []
            })
        }
    }
	onCheck(checkedKeys){
		console.log('onCheck', checkedKeys);
        this.props.onChange(checkedKeys);
		this.setState({checkedKeys});
	}
	renderTreeNodes(data){
		// console.log(data)
		return data.map((item) => {
			if (item.children) {
				return (<TreeNode title={item.title} key={item.key} dataRef={item}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>);
			}
			return <TreeNode {...item}/>;
		});
	}
	render() {
		return (<Tree
            checkable="checkable"
            defaultExpandAll={true}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
          >
			{this.renderTreeNodes(this.props.treeData)}
		</Tree>);
	}
}

export default Demo;
