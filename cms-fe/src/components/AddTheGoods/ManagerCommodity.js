/**
 * 商品修改弹窗组件
 * @param goodsData: 商品数据 (state)
 * @param visible: 是否显示 (state)
 * @param cancelManagerCommodity: 关闭ManagerCommodity后触发父组件的回调 (action)
 * @param fetchResult: 提交数据到父组件 (action)
 *
 * example---------------------
 * goodsData : {
				uid: data.uid,
				pic: data.pict_url,
				title: data.title,
				price: data.zk_final_price,
				smallImages: data.small_images.string,
				url: data.item_url
			}
 */
import React, {Component} from 'react';
import {Modal} from 'antd';
import EditorTitle from './EditorTitle';
import PicturesWall from './PicturesWall';

class ManagerCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			// 外部接受的数据
			goodsData: props.goodsData,
			// 内部管理的数据
			innerData: {
				title: "",
				images: {
					mainImage: "",
					smallImages: []
				}
			}
		};
	}

	componentWillReceiveProps(nextProps) {
		// 1.接受参数
		// 1.1 接受打开ManagerCommodity的命令 visible:true
		// 1.2 将 触发 点击完善资料 的商品数据存储于 ManagerCommodity 中
		this.setState({
			visible: nextProps.visible,
			// 接受外部的传来的数据
			goodsData: nextProps.goodsData,
			innerData: {
				title: nextProps.goodsData ? nextProps.goodsData.title : "",
				images: {
					mainImage: nextProps.goodsData ? nextProps.goodsData.pic : "",
					smallImages: nextProps.goodsData ? nextProps.goodsData.smallImages : []
				}
			}
		})
	}

	//提交数据到父组件
	handleOk(e) {
		const deepClone = (obj) => {
			var proto = Object.getPrototypeOf(obj);
			return Object.assign({}, Object.create(proto), obj);
		};
		var target = deepClone(this.state.goodsData);
		target.title = this.state.innerData.title;
		target.url = this.state.innerData.images.mainImage;
		target.smallImages = this.state.innerData.images.smallImages;
		this.props.fetchResult(target);

		// 关闭ManagerCommodity
		this.setState({visible: false, goodsData: target})
	}

	handleCancel(e) {
		this.setState({
			visible: false,
		});
		this.props.cancelManagerCommodity();
	}

	changeTitle(data) {
		this.setState({
			...this.state,
			innerData: {
				...this.state.innerData,
				title: data
			}
		})
	}

	changeData(data) {
		function isType(target) {
			return Object.prototype.toString.call(target).slice(8, -1);
		}

		switch (isType(data)) {
			// 上传图片
			case "Array":
				console.log(data);
				var smallImagesData = [];
				for (var i = 0; i < data.length; i++) {
					smallImagesData.push(data[i].url);
				}
				console.log(smallImagesData);
				this.setState({
					...this.state,
					innerData: {
						...this.state.innerData,
						images: {
							...this.state.innerData.images,
							smallImages: smallImagesData
						}
					}
				});
				break;
			// 更改主图
			case "Object":
				// console.log(data.mainImage)
				this.setState({
					...this.state,
					innerData: {
						...this.state.innerData,
						images: {
							...this.state.innerData.images,
							mainImage: data.mainImage
						}
					}
				});
				break;
			default:
				return
		}
	}

	render() {
		return (
			<div>
				<Modal title="编辑宝贝" visible={this.state.visible} onOk={this.handleOk.bind(this)}
				       onCancel={this.handleCancel.bind(this)}>
					<p>宝贝信息</p>
					<EditorTitle data={this.state.innerData} changeTitle={this.changeTitle.bind(this)}/>
					<p>
						￥{this.props.goodsData
						? this.props.goodsData.price
						: "价格"}
					</p>
					<PicturesWall data={this.state.innerData} changeData={this.changeData.bind(this)}/>
				</Modal>
			</div>
		);
	}
}

export default ManagerCommodity;
