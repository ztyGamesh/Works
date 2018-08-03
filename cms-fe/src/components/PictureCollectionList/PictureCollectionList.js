/**
 * 图集列表组件
 * @param content: 图集数据 (state)
 * @param addPic: 添加一列 (action)
 * @param savePic: 保存图片 (action)
 * @param saveDescription: 保存描述 (action)
 * @param saveGoods: 保存商品 (action)
 * @param deletePic: 删除一列 (action)
 * @param movePic: 下移一列 (action)
 */
import React, {Component} from 'react';
import {Alert, Button} from 'antd';
import PropTypes from 'prop-types';
import PictureCollection from './PictureCollection';
import './PictureCollectionList.css'

export default class PictureCollectionList extends Component {

	handleOnClickAddPic() {
		this.props.addPic()
	}

	render() {
		console.log('图集列表组件渲染，content数据:', this.props.content);
		return (
			<div className="pictureCollectionList">
				<Alert message="图片" type="info" showIcon description="请配置图片及商品信息"/>
				<div className="ComposePicListTitle">
					<span>图片</span>
					<span>描述</span>
					<span>商品</span>
					<span>操作</span>
				</div>
				{this.props.content.map((cont, index)=>
					<PictureCollection
						key={index}
						order={index}
						content={this.props.content[index]}
						savePic={(order, pic)=> this.props.savePic(order, pic)}
						saveDescription={(order, description)=> this.props.saveDescription(order, description)}
						saveGoods={(order, goodsPromotion)=> this.props.saveGoods(order, goodsPromotion)}
						deletePic={(order)=> this.props.deletePic(order)}
						movePic={(order)=> this.props.movePic(order)}
						SERVICE_API_URL={this.props.SERVICE_API_URL}
					/>
				)}
				<Button onClick={this.handleOnClickAddPic.bind(this)}>添加一列</Button>
			</div>
		);
	}
}

PictureCollectionList.propTypes = {
	content: PropTypes.arrayOf(PropTypes.shape({
		pic: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		goodsPromotion: PropTypes.arrayOf(PropTypes.shape({
			uid: PropTypes.string.isRequired,
			pic: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			price: PropTypes.string.isRequired,
			smallImages: PropTypes.array.isRequired,
			url: PropTypes.string.isRequired
		})).isRequired
	})).isRequired,
	addPic: PropTypes.func.isRequired,
	savePic: PropTypes.func.isRequired,
	saveDescription: PropTypes.func.isRequired,
	saveGoods: PropTypes.func.isRequired,
	deletePic: PropTypes.func.isRequired,
	movePic: PropTypes.func.isRequired,
};