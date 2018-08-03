/**
 * AddTheGoods--商品组件：商品初始上传及修改功能
 * @param goodsPromotion--商品信息
 * @param handleSaveGoods--保存商品信息到redux的方法
 *
 * example---------------------
 * goodsPromotion : {
				uid: data.uid,
				pic: data.pict_url,
				title: data.title,
				price: data.zk_final_price,
				smallImages: data.small_images.string,
				url: data.item_url
			}
 * handleSaveGoods(data) {
		this.setState({
			goodsData: data
		});
		this.props.saveGoods(this.props.order, data);
	}
 *
 */
import React, {Component} from 'react';
import {Icon, message, Modal} from 'antd';
import ManagerCommodity from './ManagerCommodity'
import AddCommodity from './AddCommodity'
import ListCommodity from './ListCommodity'
import './AddTheGoods.css'

export default class AddTheGoods extends Component {
	constructor(props) {
		super(props);
		// console.log('AddTheGoods组件触发constructor事件，props.goodsPromotion为：', props.goodsPromotion);
		this.state = {
			visible: false,
			managerShow: false,
			goodsData: props.goodsPromotion,
			addData: '',
		};
	};

	//下移事件触发props改变
	componentWillReceiveProps(nextProps) {
		// console.log('AddTheGoods组件触发componentWillReceiveProps事件，nextProps为：', nextProps);
		this.setState({
			goodsData: nextProps.goodsPromotion,
		})
	}

	// 点击添加商品按钮 显示弹出框
	handleClickAddGoods() {
		this.setState({visible: true});
	}

	// 新增商品数据存入state:addData
	addCardList(data) {
		this.setState({
			addData: {
				uid: data.uid,
				pic: data.pict_url,
				title: data.title,
				price: data.zk_final_price,
				smallImages: data.small_images?data.small_images.string:[],
				url: data.item_url
			}
		})
	}

	//添加商品确认(将addData中的数据存入redux)
	handleOk(e) {
		// console.log('handleOk');
		const addData = this.state.addData;
		if (addData == '') {
			message.error('还没有添加商品');
		} else {
			this.props.handleSaveGoods(addData);
			this.setState({
				goodsData: addData,
				visible: false,
			});
		}
	}

	// 添加商品取消
	handleCancel(e) {
		this.setState({visible: false, goodsData: this.props.goodsPromotion});
	}

	// 关闭ManagerCommodity后触发父组件的回调
	handleCancelManagerCommodity() {
		this.setState({
			managerShow: false
		});
	}

	// 修改商品确认
	handleFetchResult(data) {
		this.setState({
			goodsData: {
				...this.state.goodsData,
				pic: data.url,
				title: data.title,
				smallImages: data.smallImages
			},
			managerShow: false
		}, function () {
			this.props.handleSaveGoods(this.state.goodsData);
		});
	}

	// 打开商品编辑浮层
	handleClickEditGoods(e) {
		this.setState({
			managerShow: true
		});
	}

	render() {
		const {uid, pic, title, price}= this.state.goodsData;
		const goodsData = this.state.goodsData;
		// console.log('渲染商品组件，商品数据goodsData：', goodsData);
		return (
			<div>
				{
					!uid ?
						<div>
							<div className="addGoods" onClick={this.handleClickAddGoods.bind(this)}>
								<Icon type="plus" className="pic-collection-uploader-trigger"/>
							</div>
							<Modal title="添加商品" visible={this.state.visible} onOk={this.handleOk.bind(this)}
								onCancel={this.handleCancel.bind(this)}>
								<AddCommodity handleDataArr={this.addCardList.bind(this)}/>
								<ListCommodity goodsData={this.state.addData}/>
							</Modal>
						</div>
					:
					<div className="goodsWrapper">
						<div className="goodsPicWrapper">
							<img src={pic} alt="" title="" width="158px" height="160px"
							className="goodsPic"/>
							<div className="goodsMsg" onClick={this.handleClickEditGoods.bind(this)}>
								点击完善资料
							</div>
						</div>
						<div className="goodsInfoWrapper">
							<div className="goodsTitle">{title}</div>
							<div className="goodsPrice">¥{price}</div>
						</div>

						<ManagerCommodity visible={this.state.managerShow} goodsData={goodsData}
							                  cancelManagerCommodity={this.handleCancelManagerCommodity.bind(this)}
							                  fetchResult={this.handleFetchResult.bind(this)}/>
						</div>
				}
			</div>
		)
	}
};
