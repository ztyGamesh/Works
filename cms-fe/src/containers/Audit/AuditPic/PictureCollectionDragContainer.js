/**
 *
 * 图集上传容器组件 for 图集编辑页面
 *
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addPic, savePic, saveDescription, saveGoods, deletePic, movePic, sortDrag,addPics} from '../../../reducers/auditPic';
import PictureCollectionDragList from '../../../components/PictureCollectionDragList';

const mapStateToProps = (state) => {
	return {
		content: state.auditPic.content,
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
		},
		sortDrag: (content) => {
			dispatch(sortDrag(content))
		},
		addPics: (content) => {
			dispatch(addPics(content))
		}
	}
};

const PictureCollectionDragContainer = connect(mapStateToProps, mapDispatchToProps)(PictureCollectionDragList);

export default PictureCollectionDragContainer;
