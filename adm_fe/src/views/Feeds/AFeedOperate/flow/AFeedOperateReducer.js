/**
 * @param:feedId feedId
 * @param:name feed名称
 * @param:industry 数据标准(行业)
 * @param:updateMode 更新方式
 * @param:type 接入方式 1-手工文件上传 2-程序拉取 0-api推送
 * @param:fileId 手工上传文件ID
 * @param:fileName 手工上传文件名称
 * @param:timeUnit 更新频率 0-每小时 1-每天 2-每周
 * @param:url 文件地址
 * @param:day 每周更新时刻
 * @param:time 每天更新时刻
 * @param:industrys 数据标准列表数据
 * @param:current 步骤 0-填写feed接入基本信息 1数据诊断 2确认信息并完成入库
 * @param:routerBack 页面返回标识 react监听字段改变 为true时做返回操作
 * @param:status feed商品是否可入库标识 true-可入库  false-不可入库
 * @param:total 商品数量
 * @param:normal 数据正常数量
 * @param:error 数据错误数量
 * @param:warn 数据报警数量
 * @param:loading 页面加载中状态标识符
 * */

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

const initState = {
	feedId: "",
	name: "",
	industry: "",
	updateMode: "0",
	type: "1",
	fileId: "",
	fileName: "",
	timeUnit: "1",
	url: "",
	day: "2",
	time: "0",
	industrys: [],
	current: 0,
	routerBack:false,
	status:false,
	total: 0,
	normalNo:0,
	errorNo:0,
	warnNo:0,
	loading:true
};

export default function aFeedOperateReducers(state = initState, action) {
	const {type, payload} = action;
	switch (type) {
		case AFEEDOPERATE_INIT:
			return initState;
		case AFEEDOPERATE_CHANGE_FEEDID:
			return {
				...state,
				feedId: payload.feedId
			};
		case AFEEDOPERATE_CHANGE_NAME:
			return {
				...state,
				name: payload.name
			};
		case AFEEDOPERATE_CHANGE_INDUSTRY:
			return {
				...state,
				industry: payload.industry
			};
		case AFEEDOPERATE_CHANGE_UPDATEMODE:
			return {
				...state,
				updateMode: payload.updateMode
			};
		case AFEEDOPERATE_CHANGE_TYPE:
			return {
				...state,
				type: payload.type
			};
		case AFEEDOPERATE_CHANGE_FILEID:
			return {
				...state,
				fileId: payload.fileId
			};
		case AFEEDOPERATE_CHANGE_FILENAME:
			return {
				...state,
				fileName: payload.fileName
			};
		case AFEEDOPERATE_CHANGE_TIMEUNIT:
			return {
				...state,
				timeUnit: payload.timeUnit
			};
		case AFEEDOPERATE_CHANGE_DAY:
			return {
				...state,
				day: payload.day
			};
		case AFEEDOPERATE_CHANGE_TIME:
			return {
				...state,
				time: payload.time
			};
		case AFEEDOPERATE_CHANGE_URL:
			return {
				...state,
				url: payload.url
			};
		case AFEEDOPERATE_CHANGE_INDUSTRYS:
			return {
				...state,
				industrys: payload.industrys
			};
		case AFEEDOPERATE_CHANGE_CURRENT:
			return {
				...state,
				current: payload.current
			};
		case AFEEDOPERATE_ROUTER_BACK:
			return {
				...state,
				routerBack: payload.routerBack
			};
		case AFEEDOPERATE_CHANGE_STATUS:
			return {
				...state,
				status: payload.status
			};
		case AFEEDOPERATE_CHANGE_TOTAL:
			return {
				...state,
				total: payload.total
			};
		case AFEEDOPERATE_CHANGE_NORMAL:
			return {
				...state,
				normalNo: payload.normalNo
			};
		case AFEEDOPERATE_CHANGE_ERROR:
			return {
				...state,
				errorNo: payload.errorNo
			};
		case AFEEDOPERATE_CHANGE_WARN:
			return {
				...state,
				warnNo: payload.warnNo
			};
		case AFEEDOPERATE_CHANGE_LOADING:
			return {
				...state,
				loading: payload.loading
			};
		default:
			return {...state}
	}
}