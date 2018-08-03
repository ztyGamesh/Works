import {message} from 'antd';
import moment from 'moment';
function todaySubtract(x) {
	return moment().subtract(x, 'days').format('YYYY/MM/DD');
}

// 已知某段时间，计算这段时间的对比时间
// demo: get: {begin:"2018/02/02",end:"2018/02/02"} input:{begin:"2018/02/01",end:"2018/02/01"}
// demo: {begin:"2018/02/06",end:"2018/02/11"} input: {begin:"2018/02/01",end:"2018/02/05"}
function dateComparePeriod(option) {

	//获取查询时间毫秒
	var curDateStart = new Date(option.begin);
	var curDateEnd = new Date(option.end);
	var deltaTime;
	//如果是同一天
	if (option.begin === option.end) {
		deltaTime = 3600 * 24 * 1000;
	} else {
		//计算查询时间的时间间隔
		deltaTime = curDateEnd.getTime() - curDateStart.getTime();
	}
	//计算上一个阶段的时间节点
	var prevDateStart = curDateStart.getTime() - deltaTime;
	var prevDateEnd = curDateEnd.getTime() - deltaTime;
	//将上一个阶段的时间节点转化为时间对象
	var preStart = new Date(prevDateStart);
	var preEnd = new Date(prevDateEnd);

	var preStartArr = [];
	var preEndArr = [];
	preStartArr[0] = preStart.getFullYear();
	preStartArr[1] = preStart.getMonth() + 1;
	preStartArr[2] = preStart.getDate();

	preEndArr[0] = preEnd.getFullYear();
	preEndArr[1] = preEnd.getMonth() + 1;
	preEndArr[2] = preEnd.getDate();

	//格式处理
	for (var i = 0; i < 3; i++) {
		preStartArr[i] = preStartArr[i].toString();
		preEndArr[i] = preEndArr[i].toString();
		if (preStartArr[i].length === 1) {
			preStartArr[i] = '0' + preStartArr[i];
		}
		if (preEndArr[i].length === 1) {
			preEndArr[i] = '0' + preEndArr[i];
		}
	}

	//将结果包装成对象
	return {
		begin: preStartArr.join('/'),
		end: preEndArr.join('/')
	};
}
function dateComparePeriodForADS(option) {

	//获取查询时间毫秒
	var curDateStart = new Date(option.begin);
	var curDateEnd = new Date(option.end);
	var deltaTime;
	//如果是同一天
	if (option.begin === option.end) {
		deltaTime = 3600 * 24 * 1000;
	} else {
		//计算查询时间的时间间隔
		deltaTime = curDateEnd.getTime() - curDateStart.getTime();
	}
	//计算上一个阶段的时间节点
	var prevDateStart = curDateStart.getTime() - deltaTime;
	var prevDateEnd = curDateEnd.getTime() - deltaTime;
	//将上一个阶段的时间节点转化为时间对象
	var preStart = new Date(prevDateStart);
	var preEnd = new Date(prevDateEnd);

	var preStartArr = [];
	var preEndArr = [];
	preStartArr[0] = preStart.getFullYear();
	preStartArr[1] = preStart.getMonth() + 1;
	preStartArr[2] = preStart.getDate();

	preEndArr[0] = preEnd.getFullYear();
	preEndArr[1] = preEnd.getMonth() + 1;
	preEndArr[2] = preEnd.getDate();

	//格式处理
	for (var i = 0; i < 3; i++) {
		preStartArr[i] = preStartArr[i].toString();
		preEndArr[i] = preEndArr[i].toString();
		if (preStartArr[i].length === 1) {
			preStartArr[i] = '0' + preStartArr[i];
		}
		if (preEndArr[i].length === 1) {
			preEndArr[i] = '0' + preEndArr[i];
		}
	}

	//将结果包装成对象
	return {
		begin: preStartArr.join('-'),
		end: preEndArr.join('-')
	};
}

function handleResponseError(reason) {
	console.log("mediadashboardError", reason)
	message.error("服务器忙，请稍后重试")
}

export {
    todaySubtract,
    dateComparePeriod,
    handleResponseError,
	dateComparePeriodForADS
}
