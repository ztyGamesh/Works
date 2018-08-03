import React, {Component} from 'react';
import CustomRangePicker from '../../../containers/Dashboard/MediaDashboard/CustomRangePicker';
import CoverView from '../../../containers/Dashboard/MediaDashboard/CoverView';
import LineChart from '../../../containers/Dashboard/MediaDashboard/LineChart';
import {MediaIncomeTable, SlotIncomeTable} from '../../../containers/Dashboard/MediaDashboard/DashboardTable';
import {BaseTemplateIncomeTop, BaseTemplateCtr} from '../../../containers/Dashboard/MediaDashboard/BarChart';
import Loading from '../../../components/Loading/Loading';
import { Row, Col, Card, message, Tabs} from 'antd';
import { connect } from 'react-redux';

import {todaySubtract, dateComparePeriod, handleResponseError} from '../../../utils/aboutDashboard';

import {
	dashboardHourly,
    dashboardDaily,
    dashboardSum,
    dashboardTemplateIncome,
    dashboardTemplateCtr,
    dashboardMediaIncomeReport,
    dashboardSlotIncomeReport,
	timeSet,
	coverviewSetCurrent,
	coverviewSetCompare,
	mediaincomeSet,
	slotincomeSet,
	templateIncome,
	templateCtr,
	lineChartCurrent,
	lineChartCompare
} from './flow/MediaDashboardActions';

const TabPane = Tabs.TabPane;
/**
 * 媒体dashboard页面
 * */

/*
	* mediadashboard页面请求管理函数
	* config Object
	* - type: 表示请求的时间是 一天还是多天
	* - 0: 一天
	* - 1: 多天
	* - date: 表示具体的请求时间  Object
	* - {
	* 		begin: "YYYY/MM/DD",
	* 		end: "YYYY/MM/DD"
	* 	}
	* - return Promise.all
 */
function allTasks(date) {
	const type = date.begin === date.end ? 0 : 1;
	const currentTime = date;
	const compareTime = dateComparePeriod(date);

	console.log("timetime")
	console.log(currentTime)
	console.log(compareTime)
	let tasks = [
		dashboardSum(currentTime),
		dashboardSum(compareTime),
		dashboardTemplateIncome(currentTime),
		dashboardTemplateCtr(currentTime),
		dashboardMediaIncomeReport(currentTime),
		dashboardSlotIncomeReport(currentTime),
	];
	if (type === 0) {
        // 某一天
        // 某一天的前一天
		tasks = tasks.concat([dashboardHourly(currentTime),dashboardHourly(compareTime)])
	}
	else if (type === 1) {
        // 多天
        // 多天的 前 多天
        tasks = tasks.concat([dashboardDaily(currentTime),dashboardDaily(compareTime)])
	}
	return Promise.all(tasks);
}

class MediaDashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
		this.setDataToReducer = this.setDataToReducer.bind(this);
	}

	componentWillMount() {
        // 所有的请求都与时间有关，可以封装成一个请求数组，所有请求都成功以后再渲染页面
        // 所有请求都成功以后，将所有请求的数据整体装入reducer
        //
        // MediaDashboard页面默认加载的时候，需要获取昨天和前天的数据
        // 昨天 格式为"YYYY/MM/DD"
		const yesterday = {
			begin: todaySubtract(1),
			end: todaySubtract(1)
		}
		// console.log("某天",yesterday)
		this.props.timeSet({
			current: yesterday,
			compare: dateComparePeriod(yesterday)
		})
		allTasks(yesterday)
		.then(this.setDataToReducer)
		.catch(handleResponseError)
	}

	setDataToReducer(array) {
		console.log("数据源")
		console.log(array)

		// array中的每个位置中的数据是固定的，是根据allTasks中异步Promise对象的顺序产生的
		// 0: sumCurrent
		this.props.coverviewSetCurrent(array[0].data[0]);
		// 1: sumCompare
		this.props.coverviewSetCompare(array[1].data[0]);
		// 2: 样式收入排行
		this.props.templateIncome(array[2].data)
		// 3: 样式点击率排行
		this.props.templateCtr(array[3].data)
		// 4: 媒体收入
		this.props.mediaincomeSet(array[4].data);
		// 5: 广告主收入
		this.props.slotincomeSet(array[5].data);
		// 6: LineChartCurrent
		this.props.lineChartCurrent(array[6].data);
		// 7: LineChartCompare
		this.props.lineChartCompare(array[7].data)
		this.setState({
			loading: false
		})
	}

	dateChange(dates,dateString) {
		var isChooseTime = {
			begin: dateString[0].replace(/-/g, "/"),
			end: dateString[1].replace(/-/g, "/")
		}
		console.log("选中时间",isChooseTime)
		this.props.timeSet({
			current: isChooseTime,
			compare: dateComparePeriod(isChooseTime)
		})
		allTasks(isChooseTime)
		.then(this.setDataToReducer)
		.catch(handleResponseError)
	}

	render() {
		return (
			this.state.loading
				? <Loading/>
				: <div >
					<Card bordered={false} style={{margin: "20px 20px 20px"}}
						extra={<div style={{textAlign:"left"}}>
							<CustomRangePicker
								getResult={this.dateChange.bind(this)}
							/>
						</div>}>
						<CoverView />
					</Card>
					<Card title="数据趋势分析" style={{margin: "20px 20px 20px"}}
						bodyStyle={{paddingTop: 0}}
					>
						<LineChart />
					</Card>

					<Card style={{margin: "20px 20px 20px"}} >
						<Tabs defaultActiveKey="1" >
							<TabPane tab="媒体收入" key="1"><MediaIncomeTable /></TabPane>
							<TabPane tab="广告主收入" key="2"><SlotIncomeTable /></TabPane>
						</Tabs>
					</Card>


					<Row>
						<Col span={12}><Card title="样式收入排行" style={{margin:"20px 20px 20px"}}><BaseTemplateIncomeTop /></Card></Col>
						<Col span={12}><Card title="样式点击率排行" style={{margin:"20px 20px 20px"}}><BaseTemplateCtr /></Card></Col>
					</Row>
				</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		timeSet: (time) => {
			dispatch(timeSet(time))
		},
		coverviewSetCurrent: (current) => {
			dispatch(coverviewSetCurrent(current))
		},
		coverviewSetCompare: (compare) => {
			dispatch(coverviewSetCompare(compare))
		},
		mediaincomeSet: (mediaincome) => {
			dispatch(mediaincomeSet(mediaincome))
		},
		slotincomeSet: (slotincome) => {
			dispatch(slotincomeSet(slotincome))
		},
		templateIncome: (income) => {
			dispatch(templateIncome(income))
		},
		templateCtr: (ctr) => {
			dispatch(templateCtr(ctr))
		},
		lineChartCurrent: (current) => {
			dispatch(lineChartCurrent(current))
		},
		lineChartCompare: (compare) => {
			dispatch(lineChartCompare(compare))
		}
	}
}

export default connect(
	null,
	mapDispatchToProps
)(MediaDashboard)
