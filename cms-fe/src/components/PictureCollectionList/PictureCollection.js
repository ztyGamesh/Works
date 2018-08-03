/**
 * 图集单行组件
 * @param content: 图集单行数据 (state)
 * @param savePic: 保存图片 (action)
 * @param saveDescription: 保存描述 (action)
 * @param saveGoods: 保存商品 (action)
 * @param deletePic: 删除一列 (action)
 * @param movePic: 下移一列 (action)
 *
 * example-----------------
 * content: {
	 pic: '',
	 description: '',
	 goodsPromotion: [
		 {
			 uid: '',
			 pic: '',
			 title: '',
			 price: '',
			 smallImages: [],
			 url: ''
		 }
	 ]}
 *
 */
import React, {Component} from 'react';
import {Input, Icon, Upload, message} from 'antd';
const {TextArea} = Input;
import AddTheGoods from '../AddTheGoods/AddTheGoods'
import './PictureCollection.css'


function PictureCollectionBeforeUpload(file) {
	const isJPG = file.type === 'image/jpeg';
	const isPNG = file.type === 'image/png';
	if (!isJPG && !isPNG) {
		message.error('只能上传JPG或PNG格式的图片!');
		return false;
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('图片需要小于2MB!');
	}
	return isLt2M;
}

export default class PictureCollection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pic: this.props.content.pic,
			description: this.props.content.description,
			goodsData: this.props.content.goodsPromotion[0],
		};
	}


	handleChangePic(info) {
		if (info.file.status === 'done') {
			var res = info.file.response;
			if (res.status === 'ok') {
				this.setState({
					pic: res.data[0].url
				});
				this.props.savePic(this.props.order, res.data[0].url);
			} else {
				message.error(res.message);
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({
			pic: nextProps.content.pic,
			description: nextProps.content.description,
			goodsData: nextProps.content.goodsPromotion[0],
		})
	}

	handleChangeDescription(e) {
		//去掉描述中的回车、换行符
		this.setState({
			description: e.target.value.replace(/[\r\n]/g, "")
		});
	}

	handleBlurDescription(e) {
		this.props.saveDescription(this.props.order, this.state.description)
	}


	// 保存商品数据
	handleSaveGoods(data) {
		this.setState({
			goodsData: data
		});
		this.props.saveGoods(this.props.order, data);
	}

	//删除一行
	handleDeletePic() {
		this.props.deletePic(this.props.order)
	}

	// 移动一行
	handleMovePic() {
		this.props.movePic(this.props.order)
	}

	render() {
		var pic = this.state.pic;
		var description = this.state.description;
		var goodsPromotion = this.state.goodsData;
		console.log('图集单行组件渲染，图片数据:', pic);
		console.log('图集单行组件渲染，描述数据:', description);
		console.log('图集单行组件渲染，传递给商品组件数据goodsPromotion:', goodsPromotion);
		return (
			<div className="pictureCollection">
				<div className="picGroup">
					<Upload
						className="pic-collection-uploader"
						name="file"
						showUploadList={false}
						action={this.props.SERVICE_API_URL + "/api/upload"}
						beforeUpload={PictureCollectionBeforeUpload}
						onChange={this.handleChangePic.bind(this)}
					>
						{
							pic ?
								<img src={pic} alt="" className="avatar"/> :
								<Icon type="plus" className="pic-collection-uploader-trigger"/>
						}
					</Upload>
				</div>
				<div className="picGroup">
					<TextArea className="picDescription"
						placeholder="请输入小于200字描述"
						autosize={{minRows: 2, maxRows: 6}}
						value={description}
						onChange={this.handleChangeDescription.bind(this)}
						onBlur={this.handleBlurDescription.bind(this)}
					/>
				</div>
				<div className="picGroup">
					<AddTheGoods goodsPromotion={goodsPromotion}
						handleSaveGoods={this.handleSaveGoods.bind(this)}/>
				</div>
				<div className="picGroup action">
					<span onClick={this.handleDeletePic.bind(this)}>删除</span>
					<span onClick={this.handleMovePic.bind(this)}>下移</span>
				</div>
			</div>
		);
	}
}
