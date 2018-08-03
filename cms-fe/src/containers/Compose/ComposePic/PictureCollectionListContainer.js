/**
 *
 * 图集上传容器组件 for 图集编辑页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addPic, savePic, saveDescription, saveGoods, deletePic, movePic} from '../../../reducers/composePic';
import PictureCollectionList from '../../../components/PictureCollectionList/PictureCollectionList';

const mapStateToProps = (state) => {
	return {
		content: state.composePic.content,
		SERVICE_API_URL: SERVICE_API_URL
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		addPic: () => {
			dispatch(addPic())
		},
		savePic: (index, pic) => {
			dispatch(savePic(index, pic))
		},
		saveDescription: (index, description) => {
			dispatch(saveDescription(index, description))
		},
		saveGoods: (index, goodsPromotion) => {
			dispatch(saveGoods(index, goodsPromotion))
		},
		deletePic: (index) => {
			dispatch(deletePic(index))
		},
		movePic: (index) => {
			dispatch(movePic(index))
		}
	}
};

const PictureCollectionListContainer = connect(mapStateToProps, mapDispatchToProps)(PictureCollectionList);

export default PictureCollectionListContainer;