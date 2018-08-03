import React, {Component} from 'react';
import Filter from '../../../containers/Dashboard/ContentDashboard/Filter';
import CoverView from '../../../containers/Dashboard/ContentDashboard/CoverView';
import LineChart from '../../../containers/Dashboard/ContentDashboard/LineChart';
import {ArticleTable, GoodsTable} from '../../../containers/Dashboard/ContentDashboard/DashboardTable';
import Loading from '../../../components/Loading/Loading';
import { Row, Col, Card, message, Tabs, Button} from 'antd';
import { connect } from 'react-redux';
import {BUSINESSAPIHOST} from '../../../common/env';
import {todaySubtract, dateComparePeriod, handleResponseError} from '../../../utils/aboutDashboard';

import {
    mediaListAPI,
    sumAPI,
    chartAPI,
    articleAPI,
    goodsAPI,
    mediaSet,
    sumSet,
    chartSet,
    articleSet,
    goodsSet,
    sorterSet
} from './flow/ContentDashboardActions.js';
const TabPane = Tabs.TabPane;
/**
 * 内容合作页面dashboard页面
 * */

function allTasks(sorter) {
	const type = sorter.begin === sorter.end ? 0 : 1;
	const date = {
		begin: sorter.begin,
		end: sorter.end
	}
	const currentTime = date;
	const compareTime = dateComparePeriod(date);

	const options = {
		begin: currentTime.begin,
		end: currentTime.end,
		begin_cmp: compareTime.begin,
		end_cmp: compareTime.end,
		uid: sorter.uid || ""
	}
	let tasks = [
		mediaListAPI(options),
		sumAPI(options),
		chartAPI(options),
		articleAPI(options),
		goodsAPI(options)
	];
	return Promise.all(tasks);
}

function tastWithDate(sorter) {
	const type = sorter.begin === sorter.end ? 0 : 1;
	const date = {
		begin: sorter.begin,
		end: sorter.end
	}
	const currentTime = date;
	const compareTime = dateComparePeriod(date);

	const options = {
		begin: currentTime.begin,
		end: currentTime.end,
		begin_cmp: compareTime.begin,
		end_cmp: compareTime.end,
		uid: sorter.uid || ""
	}
	let tasks = [
		sumAPI(options),
		chartAPI(options),
		articleAPI(options),
		goodsAPI(options)
	];
	return Promise.all(tasks);
}
function tastWithUid(sorter) {
	const type = sorter.begin === sorter.end ? 0 : 1;
	const date = {
		begin: sorter.begin,
		end: sorter.end
	}
	const currentTime = date;
	const compareTime = dateComparePeriod(date);

	const options = {
		begin: currentTime.begin,
		end: currentTime.end,
		begin_cmp: compareTime.begin,
		end_cmp: compareTime.end,
		uid: sorter.uid || ""
	}
	let tasks = [
		sumAPI(options),
		chartAPI(options),
	];
	return Promise.all(tasks);
}

class ContentDashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
		this.setDataToReducer = this.setDataToReducer.bind(this);
		this.setDataToReducerDate = this.setDataToReducerDate.bind(this);
		this.setDataToReducerUid = this.setDataToReducerUid.bind(this);
	}

	componentWillMount() {
        // 所有的请求都与时间有关，可以封装成一个请求数组，所有请求都成功以后再渲染页面
        // 所有请求都成功以后，将所有请求的数据整体装入reducer
        //
        // MediaDashboard页面默认加载的时候，需要获取昨天和前天的数据
        // 昨天 格式为"YYYY/MM/DD"
		const yesterday = {
			begin: todaySubtract(1),
			end: todaySubtract(1),
			uid: ""
		}
		this.props.sorterSet(yesterday)
		allTasks(yesterday)
		.then(this.setDataToReducer)
		.catch(handleResponseError)
	}

	setDataToReducer(array) {
		console.log("请求来的数据:", array);
		this.props.mediaSet(array[0]);
		this.props.sumSet(array[1]);
		this.props.chartSet(array[2]);
		this.props.articleSet(array[3]);
		this.props.goodsSet(array[4]);

		this.setState({
			loading: false
		})
	}

	setDataToReducerDate(array) {
		console.log("请求来的数据:", array);
		// this.props.mediaSet(array[0]);
		this.props.sumSet(array[0]);
		this.props.chartSet(array[1]);
		this.props.articleSet(array[2]);
		this.props.goodsSet(array[3]);

		this.setState({
			loading: false
		})
	}

	setDataToReducerUid(array) {
		console.log("请求来的数据:", array);
		// this.props.mediaSet(array[0]);
		this.props.sumSet(array[0]);
		this.props.chartSet(array[1]);
		// this.props.articleSet(array[3]);
		// this.props.goodsSet(array[4]);

		this.setState({
			loading: false
		})
	}

	dateChange(dates,dateString) {
		var isChooseTime = {
			begin: dateString[0].replace(/-/g, "/"),
			end: dateString[1].replace(/-/g, "/"),
			uid: this.props.sorter.uid || ""
		}
		/*************************日期选择器 选择日期*************************/
		console.log(isChooseTime);
		this.props.sorterSet(isChooseTime)
		tastWithDate(isChooseTime)
		.then(this.setDataToReducerDate)
		.catch(handleResponseError)		


	}

	uidChange(uid) {
		/*************************筛选媒体 媒体uid*************************/
		console.log(uid);
		const sorter = this.props.sorter;
		sorter.uid = uid;
		this.props.sorterSet(sorter);
		tastWithUid(sorter)
		.then(this.setDataToReducerUid)
		.catch(handleResponseError)		
	}

	/*************************下载报表*************************/
	
	downloadA() {
		//下载报表1 内容合作 日期 媒体
		const {begin, end, uid} = this.props.sorter;
		var url = BUSINESSAPIHOST + '/contentreport/download?type=content&begin=' + begin + '&end=' + end + '&media=' + uid;
        window.open(encodeURI(url));
	}
	downloadB() {
		//热门文章
		const {begin, end, uid} = this.props.sorter;
        var url = BUSINESSAPIHOST + '/contentreport/download?type=article&begin=' + begin + '&end=' + end + '&offset=0&limit=50';
        window.open(encodeURI(url));		
	}
	downloadC() {
		//热门商品
		const {begin, end, uid} = this.props.sorter;
        var url = BUSINESSAPIHOST + '/contentreport/download?type=goods&begin=' + begin + '&end=' + end + '&offset=0&limit=50';
        window.open(encodeURI(url));		
	}
	render() {
		return (
				this.state.loading
				? <Loading/>
				: <div >
					<Card bordered={false} style={{margin: "20px 20px 20px"}}>
						<Filter 
						getDateChange={this.dateChange.bind(this)}
						getUidChange={this.uidChange.bind(this)}
						/>
						<Button style={{
							position: "absolute",
							right: "10%",
							top:"10%"
						}} onClick={this.downloadA.bind(this)}>下载报表</Button>
						<CoverView />
					</Card>

					<Card title="数据趋势分析" style={{margin: "20px 20px 20px"}}
						bodyStyle={{paddingTop: 0}}
					>
						<LineChart />
					</Card>

					<Card style={{margin: "20px 20px 20px"}}>
						<Tabs defaultActiveKey="1" >
							<TabPane tab="热门文章排行榜" key="1"><Button onClick={this.downloadB.bind(this)} style={{float: "right", margin:"0 0 10px 0", zIndex: 1}}>下载报表</Button><ArticleTable /></TabPane>
							<TabPane tab="热门商品排行榜" key="2"><Button onClick={this.downloadC.bind(this)} style={{float: "right", margin:"0 0 10px 0", zIndex: 1}}>下载报表</Button><GoodsTable /></TabPane>
						</Tabs>
					</Card>
				</div>
			)
	}
}

const mapStateToProps = (state) => {
	return {
		sorter: state.contentDashboardReducers.sorter,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		mediaSet: (data) => {
			dispatch(mediaSet(data))
		},
		sumSet: (data) => {
			dispatch(sumSet(data))
		},
		chartSet: (data) => {
			dispatch(chartSet(data))
		},
		articleSet: (data) => {
			dispatch(articleSet(data))
		},
		goodsSet: (data) => {
			dispatch(goodsSet(data))
		},
		sorterSet: (sorter) => {
			dispatch(sorterSet(sorter))
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContentDashboard)
