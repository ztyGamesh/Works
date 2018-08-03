import React, {Component} from 'react';
import {
	Modal,
	Button,
	Input,
	Card,
	Icon,
	message,
	Tabs
} from 'antd';
import _ from 'underscore';

import ShopLibrary from './ShopLibrary';
import MyCommodity from './MyCommodity';

const TabPane = Tabs.TabPane;
import {DP_POST, DP_taobao} from '../../utils/fetch';

/*
 添加商品功能的组件
 name: AddCommodity
 */
class AddCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//商品的购买链接
			targetUrl: '',
			//淘宝API返回的数据对象
			targetData: null
		};
	}

	handleInput(e) {
		this.setState({targetUrl: e.target.value})
	}

	handleClick() {
		//这里应该做两件事
		// 1. 验证url格式是否符合要求
		// 2. 如果满足 则发出请求
		// 3. 如果不满足 给予提示
		const URL_REGEX = /^((https|http|)?:\/\/)[^\s]+/;
		const re = new RegExp(URL_REGEX);
		if (!re.test(this.state.targetUrl)) {
			message.error('url格式不正确')
			return
		}
		// 此处发送请求 如果成功 则做两件事
		// 1. 将返回的数据包装成一个CardCommodity组件放入ListCommodity当中
		// 2. 包装好一个 商品模板 用于插入到编辑器

		// 1. 先包装 CardCommodity
		// CardCommodity 中目前只需要一个数据 就是 pictureURL
		// 发送 请求 去拿数据
		// var URL = "http://192.168.0.104:3000/cms";
		// var URL = `http://192.168.0.104:3333/cms?${this.state.targetUrl}`;

		DP_taobao(this.state.targetUrl)
		.then((res) => {
			if (res === "failed") {
				message.error("该商品无效")
				return
			}
			// 获取taobaoAPI返回的数据对象data
			var temp = res.tbk_item_info_get_response.results.n_tbk_item[0];
			// 给每个商品加一个唯一的标识符 添加一个 0-100W的随机数
			temp.uniqueId = _.random(1, 1000000);
			this.setState({targetData: temp})
			//  将从淘宝得到的数据对象 给到父组件 [宝贝]
			this.props.handleDataArr(this.state.targetData)
		})

	}

	render() {
		return (
			<div>
				<Input onBlur={this.handleInput.bind(this)}/>
				<Button type="primary" onClick={this.handleClick.bind(this)}>添加商品</Button>
			</div>
		);
	}
}

/*
 展示添加成功商品的列表组件
 name: ListCommodity
 */
class ListCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div style={{
				overflow: "hidden"
			}}>
				<div>商品列表</div>
				{/* 从父组件中拿到所有的商品数据 根据商品数据做每一条商品的渲染 */}
				{this.props.dataArr.map((item, index) => {
					// item 是从淘宝API每次获取的单个商品的数据 传入单个Card 给予展示
					// handleCloseCommodity 是删除父组件中商品数据的操作函数 给到Card组件 目的是给予Card组件触发删除的权利
					return <CardCommodity key={index} id={item.uid} handleCloseCommodity={this.props.handleDataArr}
					                      singleData={item}/>
				})}
			</div>
		);
	}
}

/*
 单个商品的展示卡片组件
 name: CardCommodity
 */
class CardCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleClick() {
		const {uniqueId} = this.props.singleData;
		this.props.handleCloseCommodity(uniqueId)
	}

	render() {
		// 可以在这里对传进来的数据进行解构赋值
		return (
			<Card style={{
				width: "80px",
				float: 'left'
			}} bodyStyle={{
				padding: 6
			}}>
				<Icon onClick={this.handleClick.bind(this)} type="close-square" style={{
					position: "absolute",
					right: 0,
					top: 0,
					color: "#108ee9",
					zIndex: "1000",
					backgroundColor: "white"
				}}/>
				<div className="custom-image">
					{/* 这里图片链接使用到了商品数据 后续可能还会有别的地方 */}
					<img alt="example" width="100%" height="100%" src={this.props.singleData.imgSrc}/>
				</div>
			</Card>
		);
	}
}
/*
 宝贝按钮组件
 name: CommodityButton
 */
class CommodityButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			cardList: [],
			currentTabs: 1
		};
	}
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({
			visible: nextProps.showButton
		})
	}
	// 点击宝贝按钮 显示弹出框
	showModal() {
		this.setState({visible: true});
	}

	// 在CardList中插入数据
	addCardList(data) {
		// 从ADD中拿到 taobaoAPI 返回的数据对象 data
		// 将数据对象添加到 存储数组当中
		this.state.cardList.push({imgSrc: data.pict_url, uniqueId: data.uniqueId, shopData: data})
		this.setState({cardList: this.state.cardList})
	}

	// 在CardList中删除数据
	deleteCardList(uniqueId) {
		// console.log(uniqueId);
		this.setState({
			cardList: _.filter(this.state.cardList, function (num) {
				return num.uniqueId !== uniqueId
			})
		})
	}

	// 点击确认
	handleOk(e) {
        // 关闭弹出层
		this.props.closeGoods()
		// console.log(this.state.cardList)
		// var template = `<div class="wrapper" style="border:1px solid red;width:100px"><div class="cover"><img src="<%=imgSrc%>" alt="" width="100px" height="100px"><div class="trigger" style="border:1px solid red;">点击完善资料</div><div class="title">标题</div><div class="price">价格</div></div></div>`;
		var template = '<div style="width:158px;height:208px;position:relative" class="wrapperNew">'
			+ '<div style="width:160px;position:relative" class="cover">'
			+ '<img src="<%=imgSrc%>" alt="" title="" width="158px" height="160px" style="display: block; max-width: 158px; height: 158px; opacity: 1; width: 158px; margin-left: 0px; margin-top: 0px;position:relative">'
			+ '<div id="triggerStar" class="trigger" style="position:absolute;bottom:0;left:0;right:0;height:24px;background:rgba(0,0,0,.6);text-align: center;color: #fff;font-size: 12px;cursor: pointer;line-height: 24px;width:158px;zIndex:9999">点击完善资料</div>'
			+ '</div>'
			+ '<div class="list" style="border: 1px solid #999;box-sizing:border-box">'
			+ '<div class="title" style="height: 24px;line-height: 24px;text-align: center;font-size: 14px;color: #999;overflow: hidden;padding: 0 2px;"><%=shopData.title%></div>'
			+ '<div class="price" style="height: 24px;line-height: 24px;text-align: center;font-size: 14px;color: #999;overflow: hidden;padding: 0 2px;">￥<%=shopData["zk_final_price"]%></div>'
			+ '</div>'
			+ '</div>';
		// var compiled = _.template(template);
		for (var i = 0; i < this.state.cardList.length; i++) {
			// 对 当前CardList中的每个数据对象应用模板字符串解析 并插入编辑器
			// UE.getEditor('content').execCommand('inserthtml', "<p>←</p>");
			UE.getEditor('content').execCommand('inserthtml', "<p><br/></p>");
			UE.getEditor('content').execCommand('inserthtml', _.template(template)({
				imgSrc: this.state.cardList[i].imgSrc,
				shopData: this.state.cardList[i].shopData
			}));
			UE.getEditor('content').execCommand('inserthtml', "<p><br/></p>");
			// UE.getEditor('content').execCommand('inserthtml', "<p>→</p>");
			// UE.getEditor('content').execCommand('inserthtml', "<p>-</p>");
		}

		var shops = UE.getEditor('content').body.children;
		console.log("UE")
		// 存放新插入的商品
		var newshops = [];
		// 将所有商品中 新插入的商品拿出来 设置不可编辑属性 然后变成旧商品
		for (var i = 0; i < shops.length; i++) {
			if (shops[i].className === "wrapperNew") {
				shops[i].setAttribute('contenteditable', false);
				console.log("商品");
				console.log(shops[i]);
				newshops.push(shops[i]);
				shops[i].className = "wrapperOld";
			}
		}
		console.log(shops)
		// //  i : 1 4 7 10 13 ...  3n+1 n=0
		// //  [] 中的下标 : 0 1 2 .... n-1 n=1
		// 对新商品进行数据的存储
		for (var j = 0; j < newshops.length; j++) {
			newshops[j].dataset.shop = JSON.stringify(this.state.cardList[j].shopData);
		}
		//点击确定键 关闭弹窗 清空数据
		this.setState({
			visible: false,
			cardList: []
		});
	}

	// 点击取消
	handleCancel(e) {
        // 关闭弹出层
		this.props.closeGoods()
		this.setState({visible: false, cardList: []});
	}

	render() {
		return (
			<div>
				<div onClick={this.showModal.bind(this)}
					style={{backgroundColor: "burlywood", textAlign: "center", cursor: "pointer", display: "none"}}>添加宝贝
				</div>
				<Modal title="添加宝贝"
					visible={this.state.visible}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					width="80%"
				>
					<Tabs
						defaultActiveKey="1"
						animated={false}
						onChange={(key) => {
							this.setState({
								currentTabs: key
							})
						}}
					>
						<TabPane tab="商品库" key="1">
							{this.state.currentTabs == 1 ? <ShopLibrary /> : null}
						</TabPane>
						<TabPane tab="我的选品" key="2">
							{this.state.currentTabs == 2 ? <MyCommodity handleDataArr={this.addCardList.bind(this)}/> : null}
						</TabPane>
						<TabPane tab="添加商品" key="3">
							{this.state.currentTabs == 3
								? <div>
									<AddCommodity dataArr={this.state.cardList} handleDataArr={this.addCardList.bind(this)}/>
									<ListCommodity dataArr={this.state.cardList} handleDataArr={this.deleteCardList.bind(this)}/>
								</div>
								:null
							}
						</TabPane>
					</Tabs>
				</Modal>
			</div>
		);
	}
}
export default CommodityButton;
