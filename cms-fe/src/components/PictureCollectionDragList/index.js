import React, {Component} from 'react';
import {Button, Alert, Icon, message, Upload} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import ListSort from '../../components/ListSort';
import PictureCollection from './PictureCollection';
import reqwest from 'reqwest';

import {SortablePane, Pane} from 'react-sortable-pane'

// 根据接受的数据 渲染可以拖拽的项目
class PictureCollectionDragList extends Component {
	constructor(props) {
		super(props);
		this.state = {
            newContent: [],
            color: "red",
            text: "图集顺序确认按钮",
            // 添加多列图集需要的字段
			fileList: [],
			uploading: false,
			content: [],
			saveInfo: ""
		};
	}

	componentWillMount() {
		this.setState({
			content: JSON.parse(JSON.stringify(this.props.content))
		})
	}

	componentWillReceiveProps(nextProps) {
		console.log("render");
		console.log(nextProps.content);
		this.setState({
			content: JSON.parse(JSON.stringify(nextProps.content))
		})
	}
    handleOnClickAddPic() {
        this.props.addPic()
		this.setState({
			saveInfo: "需要拖拽行为来保存新加入的图集",
			color: "red"
		})
    }
    sortRefresh(children) {
		if (!children.map) return;
        console.log(children);
		console.log(this.props.content);
        var orderList = children.map((item) => {
            return item.order
        })
        // console.log(orderList);
        // console.log(this.props.content);
        var newContent = [];
        orderList.forEach((order) => {
            newContent.push(this.state.content[order])
        })
		console.log(newContent);
		var submit = newContent.filter((item) => {
			if (item.goodsPromotion[0] && item.goodsPromotion[0].pic == "") {
				item.goodsPromotion = [];
			}
			return item.pic !== ""
		})
		console.log(submit);
		console.log(JSON.stringify(submit));
		this.props.sortDrag(JSON.stringify(submit))
        // this.setState({
        //     content: newContent,
        // }, () => {
		// 	this.props.sortDrag(this.state.content)
		// })


    }

	handleUpload () {
		const {fileList} = this.state;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('files', file);
		})

		this.setState({
			uploading: true
		})

        // ajax请求
		reqwest({
			url: this.props.SERVICE_API_URL + "/api/uploadfiles",
			method: 'post',
			processData: false,
			data: formData,
			success: (res) => {
				console.log(res);
				this.setState({fileList: [], uploading: false});
				message.success('upload successfully.');
				const imgUrl = res.data.map((item) => {
					return {
						pic: item.url,
						description: '',
						goodsPromotion: [
							// {
							// 	uid: '',
							// 	pic: '',
							// 	title: '',
							// 	price: '',
							// 	smallImages: [],
							// 	url: ''
							// }
						]
					}
				})
				this.props.addPics(imgUrl);
			},
			error: () => {
				this.setState({uploading: false});
				message.error('upload failed.');
			}
		});
	}
	render() {
		const {uploading} = this.state;
		const props = {
			action: this.props.SERVICE_API_URL + "/api/uploadfiles",
			// showUploadList: false,
			multiple: true,
			// name: "files",
			onRemove: (file) => {
				this.setState(({fileList}) => {
					const index = fileList.indexOf(file);
					const newFileList = fileList.slice();
					newFileList.splice(index, 1);
					return {fileList: newFileList};
				});
			},
			beforeUpload: (file) => {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				if (!isJPG && !isPNG) {
					message.error('只能上传JPG或PNG格式的图片!');
					return false;
				}
				this.setState(({ fileList }) => ({
	          		fileList: [...fileList, file],
					saveInfo: "需要拖拽行为来保存新加入的图集",
					color: "red"
	        	}));
		        return false;
			},
			fileList: this.state.fileList
		}
		var body = this.state.content.map((item, index) => (
			<Pane
				id={index}
				key={index}
				width="100%"
				height={220}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: 'solid 1px #ddd',
					background: '#f0f0f0',
					position: 'relative',
				}}
			>
				<div
					className="handle"
					style={{
						width: '25px',
						height: '25px',
						border: 'solid 1px #ccc',
						position: 'absolute',
						top: '10px',
						left: '10px',
						cursor: 'move',
					}}
				/>
				<div key={index} className={`${this.props.className}-list`}>
					<PictureCollection
						dataLength={this.state.content.length}
						key={index}
						order={index}
						content={this.state.content[index]}
						savePic={(order, pic)=> this.props.savePic(order, pic)}
						saveDescription={(order, description)=> this.props.saveDescription(order, description)}
						saveGoods={(order, goodsPromotion)=> this.props.saveGoods(order, goodsPromotion)}
						deletePic={(order)=> this.props.deletePic(order)}
						movePic={(order)=> this.props.movePic(order)}
						SERVICE_API_URL={this.props.SERVICE_API_URL}
					/>
				</div>
			</Pane>
		))
		return(<div>
            <Alert message="图片" type="info" showIcon description="请配置图片及商品信息"/>
            <Button onClick={this.handleOnClickAddPic.bind(this)}>添加一列</Button>
			<Upload {...props}>
				<Button>添加多列</Button>
			</Upload>
			<Button
				className="upload-demo-start"
				type="primary"
				onClick={this.handleUpload.bind(this)}
				disabled={this.state.fileList.length === 0}
				loading={uploading}
			>
				{uploading ? '添加中' : '添加选中图集' }
			</Button>
			<div style={{color:this.state.color}}>{this.state.saveInfo}</div>
            <div className={`${this.props.className}-wrapper`}>
				<SortablePane
					direction="vertical"
					margin={20}
					dragHandleClassName="handle"
					onResize={(e, id, panes, data) => {
						// console.log('onResize', e, id, panes, data);
					}}
					onResizeStart={(e, id, panes) => {
						// console.log('onResizeStart', e, id, panes);
					}}
					onResizeStop={(e, id, panes, data) => {
						// console.log('onResizeStop', e, id, panes, data);
					}}
					onOrderChange={(panes, next) => {
						// console.log('onOrderChange', panes, next);
						console.log("当前结果", next);
						// const result = next.map((item,index) => {
						// 	return item.id
						// })
						// console.log("当前数组", result);
						this.sortRefresh(next)
						this.setState({
							saveInfo: "图集信息已经保存",
							color: "green"
						})
					}}
					onDragStart={(e, id, panes) => {
						// console.log('onDragStart', e, id, panes)
					}}
					onDragStop={(e, id, panes) => {
						// console.log('onDragStop', e, id, panes)
					}}
				>
					{body}
				</SortablePane>
			</div>
		</div>
        );
	}
}


PictureCollectionDragList.PropTypes = {
    className: PropTypes.string,
}
PictureCollectionDragList.defaultProps = {
    className: 'list-sort-demo-drag',
};
export default PictureCollectionDragList;
