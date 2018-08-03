import {message} from 'antd';
import {
	AFEEDOPERATE_INIT,
	AFEEDOPERATE_CHANGE_FEEDID,
	AFEEDOPERATE_CHANGE_NAME,
	AFEEDOPERATE_CHANGE_INDUSTRY,
	AFEEDOPERATE_CHANGE_UPDATEMODE,
	AFEEDOPERATE_CHANGE_TYPE,
	AFEEDOPERATE_CHANGE_FILEID,
	AFEEDOPERATE_CHANGE_FILENAME,
	AFEEDOPERATE_CHANGE_TIMEUNIT,
	AFEEDOPERATE_CHANGE_URL,
	AFEEDOPERATE_CHANGE_INDUSTRYS,
	AFEEDOPERATE_CHANGE_CURRENT,
	AFEEDOPERATE_CHANGE_DAY,
	AFEEDOPERATE_CHANGE_TIME,
	AFEEDOPERATE_ROUTER_BACK,
	AFEEDOPERATE_CHANGE_STATUS,
	AFEEDOPERATE_CHANGE_TOTAL,
	AFEEDOPERATE_CHANGE_NORMAL,
	AFEEDOPERATE_CHANGE_ERROR,
	AFEEDOPERATE_CHANGE_WARN,
	AFEEDOPERATE_CHANGE_LOADING
} from './AFeedOperateConstants';
import {BUSINESSAPIHOST} from '../../../../common/env';
import axios from 'axios';
import { push } from 'react-router-redux'
//初始化数据
export const init = function () {
	return {
		type: AFEEDOPERATE_INIT
	}
};
export const changeFeedId = function (feedId) {
	return {
		type: AFEEDOPERATE_CHANGE_FEEDID,
		payload: {
			feedId: feedId
		}
	}
};
export const changeName = function (name) {
	return {
		type: AFEEDOPERATE_CHANGE_NAME,
		payload: {
			name: name
		}
	}
};
export const changeIndustry = function (industry) {
	return {
		type: AFEEDOPERATE_CHANGE_INDUSTRY,
		payload: {
			industry: industry
		}
	}
};
export const changeUpdateMode = function (updateMode) {
	return {
		type: AFEEDOPERATE_CHANGE_UPDATEMODE,
		payload: {
			updateMode: updateMode
		}
	}
};
export const changeType = function (type) {
	return {
		type: AFEEDOPERATE_CHANGE_TYPE,
		payload: {
			type: type
		}
	}
};
export const changeFileId = function (fileId) {
	return {
		type: AFEEDOPERATE_CHANGE_FILEID,
		payload: {
			fileId: fileId
		}
	}
};
export const changeFileName = function (fileName) {
	return {
		type: AFEEDOPERATE_CHANGE_FILENAME,
		payload: {
			fileName: fileName
		}
	}
};
export const changeTimeUnit = function (timeUnit) {
	return {
		type: AFEEDOPERATE_CHANGE_TIMEUNIT,
		payload: {
			timeUnit: timeUnit
		}
	}
};
export const changeDay = function (day) {
	return {
		type: AFEEDOPERATE_CHANGE_DAY,
		payload: {
			day: day
		}
	}
};
export const changeTime = function (time) {
	return {
		type: AFEEDOPERATE_CHANGE_TIME,
		payload: {
			time: time
		}
	}
};
export const changeUrl = function (url) {
	return {
		type: AFEEDOPERATE_CHANGE_URL,
		payload: {
			url: url
		}
	}
};
export const changeIndustrys = function (industrys) {
	return {
		type: AFEEDOPERATE_CHANGE_INDUSTRYS,
		payload: {
			industrys: industrys
		}
	}
};
export const changeCurrent = function (current) {
	return {
		type: AFEEDOPERATE_CHANGE_CURRENT,
		payload: {
			current: current
		}
	}
};
export const changeRouterBack = function (routerBack) {
	return {
		type: AFEEDOPERATE_ROUTER_BACK,
		payload: {
			routerBack: routerBack
		}
	}
};
export const changeStatus = function (status) {
	return {
		type: AFEEDOPERATE_CHANGE_STATUS,
		payload: {
			status: status
		}
	}
};
export const changeTotal = function (total) {
	return {
		type: AFEEDOPERATE_CHANGE_TOTAL,
		payload: {
			total: total
		}
	}
};
export const changeNormal = function (normalNo) {
	return {
		type: AFEEDOPERATE_CHANGE_NORMAL,
		payload: {
			normalNo: normalNo
		}
	}
};
export const changeError = function (errorNo) {
	return {
		type: AFEEDOPERATE_CHANGE_ERROR,
		payload: {
			errorNo: errorNo
		}
	}
};
export const changeWarn = function (warnNo) {
	return {
		type: AFEEDOPERATE_CHANGE_WARN,
		payload: {
			warnNo: warnNo
		}
	}
};
export const changeLoading = function (loading) {
	return {
		type: AFEEDOPERATE_CHANGE_LOADING,
		payload: {
			loading: loading
		}
	}
};
//请求数据标准ajax
function industrysAjax() {
	return new Promise(function (resolve, reject) {
		axios({
			method: 'post',
			url: BUSINESSAPIHOST + '/api/listIndustries',
			data: ''
		}).then((res)=> {
			if (res.status == 200) {
				const data = res.data;
				if (data.code == 1) {
					const industrys = data.data;
					resolve({industrys: industrys});
				} else {
					message.error(data.message);
				}
			} else {
				message.error(res.error + ':' + res.message);
			}
		}).catch(function (error) {
			reject(error);
		});
	})
}
//请求数据标准action
export const requestIndustrys = function () {
	return async(dispatch, getState) => {
		const responseData = await industrysAjax();
		dispatch(changeIndustrys(responseData.industrys));
	}
};
//创建aFeed-ajax
function createFeedAjax(arg) {
	return new Promise(function (resolve, reject) {
		let data = {};
		//注：特殊参数传递方式！请注意！！！
		//如果没用到time参数，需要传递-1，不能不传，配合后端逻辑！
		switch (arg.type) {//根据接入方式不同，参数不同
			case '1'://手工文件上传
				data = {
					"userName": "测试",
					"feed": {
						feedId: arg.feedId,
						name: arg.name,
						industry: arg.industry,
						updateMode: arg.updateMode,
						type: arg.type,
						fileId: arg.fileId,
						fileName: arg.fileName,
						time: "-1",
					}
				};
				break;
			case '2'://程序拉取
				switch (arg.timeUnit) {//根据更新频率不同参数不同
					case '1'://每天
						data = {
							"userName": "测试",
							"feed": {
								feedId: arg.feedId,
								name: arg.name,
								industry: arg.industry,
								updateMode: arg.updateMode,
								type: arg.type,
								timeUnit: arg.timeUnit,
								url: arg.url,
								time: arg.time,
							}
						};
						break;
					case '2'://每周
						data = {
							"userName": "测试",
							"feed": {
								feedId: arg.feedId,
								name: arg.name,
								industry: arg.industry,
								updateMode: arg.updateMode,
								type: arg.type,
								timeUnit: arg.timeUnit,
								url: arg.url,
								day: arg.day,
								time: arg.time,
							}
						};
						break;
					case '0'://每小时
						data = {
							"userName": "测试",
							"feed": {
								feedId: arg.feedId,
								name: arg.name,
								industry: arg.industry,
								updateMode: arg.updateMode,
								type: arg.type,
								timeUnit: arg.timeUnit,
								url: arg.url,
								time: "-1",
							}
						};
						break
				}

				break;
			case '0'://api推送
				data = {
					"userName": "测试",
					"feed": {
						feedId: arg.feedId,
						name: arg.name,
						industry: arg.industry,
						type: arg.type,
						time: "-1",
					}
				};
				break;
		}
		axios({
			method: 'post',
			url: BUSINESSAPIHOST + '/api/updateFeed',
			data: data
		}).then((res)=> {
			if (res.status == 200) {
				const data = res.data;
				if (data.code == 1) {
					const feedID = data.data;
					resolve({code: 1, type: arg.type, feedID: feedID});
				} else {
					resolve({code: 0, message: data.message});
					message.error(data.message);
				}
			} else {
				message.error(res.error + ':' + res.message);
			}
		}).catch(function (error) {
			alert('保存广告主feed异常：' + error);
		});
	})
}

//创建aFeed-action
export const createFeed = function () {
	return async(dispatch, getState) => {
		const states = getState();
		const responseData = await createFeedAjax(states.aFeedOperateReducers);
		if (responseData.code == 1) {
			dispatch(changeFeedId(responseData.feedID));
			if (responseData.type == '1') {//手工文件上传
				dispatch(changeCurrent(1));
			} else if (responseData.type == '2') {//程序拉取
				dispatch(changeCurrent(1));
			} else if (responseData.type == '0') {//api推送
				dispatch(changeRouterBack(true));
			}
		} else {
			message.error('创建广告主feed失败：' + responseData.message);
		}
	}
};
//商品入库ajax
function commodityImportAjax(arg) {
	return new Promise(function (resolve, reject) {
		let data = {
			"feedId": arg.feedId
		};
		axios({
			method: 'post',
			url: BUSINESSAPIHOST + '/api/xmlImport',
			data: data
		}).then((res)=> {
			if (res.status == 200) {
				const data = res.data;
				if (data.code == 1) {
					resolve({code: 1, message: data.message});
				} else {
					resolve({code: 0, message: data.message});
				}
			} else {
				message.error(res.error + ':' + res.message);
			}
		}).catch(function (error) {
			alert('商品入库异常：' + error);
		});
	})
}
//商品入库-action
export const commodityImport = function () {
	return async(dispatch, getState) => {
		dispatch(push('/Dashboard'));
		// const states = getState();
		// const responseData = await commodityImportAjax(states.aFeedOperateReducers);
		// if (responseData.code == 1) {
		// 	message.success('商品入库成功！');
		// 	dispatch(changeCurrent(2));
		// } else {
		// 	message.error('商品入库失败：' + responseData.message);
		// }
	}
};

//请求afeed详情ajax
function getAFeedAjax(feedId) {
	return new Promise(function (resolve, reject) {
		axios({
			method: 'post',
			url: BUSINESSAPIHOST + '/api/getFeed',
			data: {"feedId": feedId}
		}).then((res)=> {
			if (res.status == 200) {
				const data = res.data;
				if (data.code == 1) {
					resolve(data.data);
				} else {
					message.error(data.message);
				}
			} else {
				message.error(res.error + ':' + res.message);
			}
		}).catch(function (error) {
			reject(error);
		});
	})
}
//请求afeed详情action
export const getAFeed = function (feedId) {
	return async(dispatch, getState) => {
		const responseData = await getAFeedAjax(feedId);
		dispatch(changeFeedId(feedId));
		dispatch(changeName(responseData.name));
		dispatch(changeIndustry(responseData.industry));
		dispatch(changeType(responseData.type));
		switch (responseData.type) {//根据接入方式不同，参数不同
			case '1'://手工文件上传
				dispatch(changeUpdateMode(responseData.updateMode.toString()));
				dispatch(changeFileId(responseData.fileId));
				dispatch(changeFileName(responseData.fileName));
				break;
			case '2'://程序拉取
				switch (responseData.timeUnit.toString()) {//根据更新频率不同参数不同
					case '1'://每天
						dispatch(changeUpdateMode(responseData.updateMode.toString()));
						dispatch(changeTimeUnit(responseData.timeUnit.toString()));
						dispatch(changeUrl(responseData.url));
						dispatch(changeTime(responseData.time.toString()));
						break;
					case '2'://每周
						dispatch(changeUpdateMode(responseData.updateMode.toString()));
						dispatch(changeTimeUnit(responseData.timeUnit.toString()));
						dispatch(changeUrl(responseData.url));
						dispatch(changeTime(responseData.time.toString()));
						dispatch(changeDay(responseData.day.toString()));
						break;
					case '0'://每小时
						dispatch(changeUpdateMode(responseData.updateMode.toString()));
						dispatch(changeTimeUnit(responseData.timeUnit.toString()));
						dispatch(changeUrl(responseData.url));
						break;
					default:
						console.error('没有匹配到timeUnit的值' + responseData.timeUnit);
				}
				break;
			case '0'://api推送
				break;
		}
		dispatch(changeLoading(false));
		dispatch(push('/'));
	}
};