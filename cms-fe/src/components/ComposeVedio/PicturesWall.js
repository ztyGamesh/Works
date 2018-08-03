import React, {Component} from 'react';
import {Upload, Icon, Card} from 'antd';
import _ from 'underscore';
import './PicturesWall.css'
function createSmallImages(smallImages) {
	return smallImages.map(function (item, index) {
		return {
			uid: index,
			name: "xxx.png",
			status: "done",
			url: item
		}
	})
}
class PicturesWall extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileList: createSmallImages(props.data.images.smallImages),
			mainImage: props.data.images.mainImage
		};
	}

	//当点击了父组件的浮层隐藏操作后，再次打开需要去掉未保存的标题，显示当前已保存的标题
	componentWillReceiveProps(props) {
		this.setState({
			fileList: createSmallImages(props.data.images.smallImages),
			mainImage: props.data.images.mainImage
		});
	}

	// 切换主图
	handlePreview(file) {
		if (file.status == 'done') {
			this.setState({
				mainImage: file.url
			});
			this.props.changeData({
				mainImage: file.url
			})
		}
	}

	//上传文件改变时的状态
	handleChange({fileList, file}) {
		if (fileList.length === 0) {
			return
		}
		const deepClone = (obj) => {
			var proto = Object.getPrototypeOf(obj);
			return Object.assign([], Object.create(proto), obj);
		};
		var myFileList = deepClone(fileList);
		var last = deepClone(_.last(myFileList));
		if (last.status === "done") {
			myFileList[myFileList.length - 1] = {
				uid: last.uid,
				name: last.name,
				status: 'done',
				url: last.response ? last.response.data[0].url : last.url
			};
			this.props.changeData(myFileList)
		}
		this.setState({
			fileList: myFileList
		})
	}

	render() {
		const {fileList} = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus"/>
				<div className="ant-upload-text">添加上传图片</div>
			</div>
		);
		return (
			<div className="clearfix PicturesWall">
				<Card bodyStyle={{padding: 0}} style={{width: "210px", height: "250px", padding: "0 4px"}}>
					<p style={{fontSize: "24px"}}>宝贝主图</p>
					<img src={this.state.mainImage}
					     width="200px"
					     height="200px"
					/>
				</Card>
				<p>请选择宝贝主图:</p>
				<Upload action={SERVICE_API_URL + "/api/upload"}
				        listType="picture-card"
				        fileList={this.state.fileList}
				        onPreview={this.handlePreview.bind(this)}
				        onChange={this.handleChange.bind(this)}
				>
					{fileList.length >= 10
						? null
						: uploadButton}
				</Upload>
			</div>
		);
	}
}

export default PicturesWall;
