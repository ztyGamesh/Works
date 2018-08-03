/**
 * @class 推广组报表
 * */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loading from '../../../components/Loading/Loading';
import {Card, message, Button, Icon} from 'antd';
import Filter from '../../../containers/Report/GroupReport/Filter';
import LineChart from '../../../containers/Report/GroupReport/LineChart';
import TableForReport from '../../../containers/Report/GroupReport/TableForReport';
import TableDimension from '../../../containers/Report/GroupReport/TableDimension';
import AdsDropDown from '../../../containers/Report/GroupReport/AdsDropDown';
import Toggle from '../../../containers/Report/GroupReport/Toggle';
import moment from 'moment';
import request from '../../../utils/request';
import {BUSINESSAPIHOST} from '../../../common/env';

import {
	todaySubtract,
    addTasks,
    handleResponseError
} from '../../../utils/aboutReportUtils';
import {dateComparePeriod} from '../../../utils/aboutDashboard';
import {adgroupreport,currentSetData,compareSetData, deltaTimeSet,fetchuseradstruct,useradstructSet} from './flow/GroupReportActions.js';
import {adgroupColumnsUnlimited,adgroupColumnsdate,adgroupColumnsadgroup} from '../../../mock/Report/ColumnsMap';


class GroupReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			reportType: "adgroup",
			sorter: {
				order: 'descend',
				condition:JSON.stringify([{
					begin: todaySubtract(0),
					end: todaySubtract(0),
					report_type:"hourly",
					dimension: "adgroup",
					ids: ""
				}]),
				field: 'imp',
				limit: 50,
				offset: 0,
				report_data: "all"
			},
			isCompare: false,
			delta: 0,
			// 从mock处取得账户报表页面的报表列
			columns: Object.assign([], adgroupColumnsadgroup),
            // 帮助表格组件存放查询条件的变量
			forReport: {
				dateA:{
					begin: todaySubtract(0),
					end: todaySubtract(0),
				},
				dateB:{
					begin: todaySubtract(1),
					end: todaySubtract(1),
				}
			}
		};
		this.allTasks = this.allTasks.bind(this);
		this.setDataToReducer = this.setDataToReducer.bind(this);
		this.askData = this.askData.bind(this)
		this.refreshReport = this.refreshReport.bind(this)
	}
	componentWillMount() {
		this._init();
	}
	allTasks(date) {
		const type = date.begin === date.end ? 0 : 1;
		const currentTime = date;
		const compareTime = dateComparePeriod(date);
		let report_type = type === 0 ? "hourly" : "daily";
		let initialCondition = JSON.parse(this.state.sorter.condition)[0];
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...initialCondition,
					begin: currentTime.begin,
					end: currentTime.end,
					report_type: report_type
				}])
			}
		}
		let compareCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...initialCondition,
					begin: compareTime.begin,
					end: compareTime.end,
					report_type: report_type
				}])
			}
		};
		let useradstruct = {
			sorter: {
				query_date: currentTime.begin
			}
		}
		let tasks = [
			adgroupreport(currentCondition),
			adgroupreport(compareCondition),
			fetchuseradstruct(useradstruct)
		];
		return Promise.all(tasks);
	}
	_init() {
		/* 页面第一次加载时，需要今天的日期 */
		/* 页面第一次加载时，需要昨天的日期 */
		const today = {
			begin: todaySubtract(0),
			end: todaySubtract(0),
		}
		this.allTasks(today).then(this.setDataToReducer).catch(handleResponseError);
		/* 2.将初始化数据传入函数管理器，流水线作业 */
		// execTasks(condition).then(this.setDataToReducer).catch(handleResponseError)
	}
	setDataToReducer(data) {
		// data是 请求处理器返回的请求处理结果的数据，数据的顺序对应请求处理函数的顺序
		// 也就是 addTasks 中函数的顺序
		// 将数据存入reducer
		console.log(data)
		// data[0].data 是所有数据
		this.props.currentSetData(data[0].data);
		// // data[1].data medialist数据
		this.props.compareSetData(data[1].data);
		//useradstruct
		this.props.useradstructSet(data[2])
		this.setState({loading: false})
	}

	isCompare(x) {
		//x代表对比日期checkbox的状态
		let typeIs = this.state.forReport.dateA.begin === this.state.forReport.dateA.end ? "hourly" : "daily";
		var condition;
		const initialCondition = JSON.parse(this.state.sorter.condition);
		if(x) {
			// 需要对比
			console.log("needCompare", this.state.forReport,typeIs)
			condition = JSON.stringify([
				{...initialCondition[0],...this.state.forReport.dateA,report_type:typeIs},
				{...initialCondition[0],...this.state.forReport.dateB,report_type:typeIs},
			])
		} else {
			// 不需要对比
			console.log("notneedCompare", this.state.forReport,typeIs);
			condition = JSON.stringify([
				{...initialCondition[0],...this.state.forReport.dateA,report_type:typeIs},
			])
		}
		this.setState({
			isCompare: x,
			sorter: {
				...this.state.sorter,
				condition: condition
			}
		})

		// console.log(this.state.isCompare)
		// 如果x是true 说明列表的要显示对比日期
		// 此时this.state.sorter.condition 应变成[{},{}]
		// 如果x是false 说明列表不显示对比日期
		// 此时this.state.sorter.condition 应变成[{}]
	}

	refreshReport() {
		let typeIs = this.state.forReport.dateA.begin === this.state.forReport.dateA.end ? "hourly" : "daily";
		var condition;
		let initialCondition = JSON.parse(this.state.sorter.condition);
		if(this.state.isCompare) {
			// 需要对比
			console.log("needCompare", this.state.forReport,typeIs)
			condition = JSON.stringify([
				{
					...initialCondition[0],
					begin: this.state.forReport.dateA.begin,
					end: this.state.forReport.dateA.end,
					report_type:typeIs
				},
				{
					...initialCondition[0],
					begin: this.state.forReport.dateB.begin,
					end: this.state.forReport.dateB.end,
					report_type:typeIs
				},
			])
		} else {
			// 不需要对比
			console.log("notneedCompare", this.state.forReport,typeIs);
			condition = JSON.stringify([
				{
					...initialCondition[0],
					begin: this.state.forReport.dateA.begin,
					end: this.state.forReport.dateA.end,
					report_type:typeIs
				},
			])
		}
		setTimeout(() => {
            // 保证筛选条件是最新的
			this.setState({
				sorter: {
					...this.state.sorter,
					condition: condition
				}
			})
		},1000)
	}

	refreshReportByDate(key) {
		const keyMap = {
			"0": "all",
			"1": "query",
			"2": "contrast"
		}
		console.log(keyMap[key])
		this.setState({
			sorter: {
				...this.state.sorter,
				report_data: keyMap[key]
			}
		})
	}
	dateChangeCurrent(dates, dateString) {
		console.log("xxxxxx", dates[1] - dates[0])
		this.props.deltaTimeSet(dates[1] - dates[0]);
		console.log("dateChangeCurrent",dateString)
		const condition = {
			date: {
				begin: dateString[0].replace(/-/g, "/"),
				end: dateString[1].replace(/-/g, "/")
			}
		}
		const type = condition.date.begin === condition.date.end ? 0 : 1;
		let report_type = type === 0 ? "hourly" : "daily";
		// console.log("选中时间", condition.date)
		// this.allTasks(condition).then(this.setDataToReducer).catch(handleResponseError);
		const currentTime = condition.date;
		const compareTime = dateComparePeriod(condition.date);
		const initialCondition = JSON.parse(this.state.sorter.condition)[0];
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...initialCondition,
					begin: currentTime.begin,
					end: currentTime.end,
					report_type: report_type
				}])
			}
		}
		let compareCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...initialCondition,
					begin: compareTime.begin,
					end: compareTime.end,
					report_type: report_type
				}])
			}
		}
		let tasks = [
			adgroupreport(currentCondition),
			adgroupreport(compareCondition),
		];
		Promise.all(tasks).then((res) => {
			console.log(res)
			this.props.currentSetData(res[0].data)
			this.props.compareSetData(res[1].data)
		})

		let typeIs = currentTime.begin === currentTime.end ? "hourly" : "daily";
		var conditionX;
		if(this.state.isCompare) {
			// 需要对比
			console.log("needCompare", this.state.forReport,typeIs)
			conditionX = JSON.stringify([
				{
					...initialCondition,
					begin: currentTime.begin,
					end: currentTime.end,
					report_type:typeIs
				},
				{
					...initialCondition,
					begin: compareTime.begin,
					end: compareTime.end,
					report_type:typeIs
				},
			])
		} else {
			// 不需要对比
			console.log("notneedCompare", this.state.forReport,typeIs);
			conditionX = JSON.stringify([
				{
					...initialCondition,
					begin: currentTime.begin,
					end: currentTime.end,
					report_type:typeIs
				},
			])
		}
        // 选中当前时间后 更新查询条件
		this.setState({
			sorter: {
				...this.state.sorter,
				condition: conditionX
			},
			forReport: {
				dateA: currentTime,
				dateB: compareTime
			}
		})
	}
	dateChangeCompare(dates, dateString) {
		console.log("dateChangeCompare",dateString);
		const condition = {
			date: {
				begin: dateString[0].replace(/-/g, "/"),
				end: dateString[1].replace(/-/g, "/")
			}
		}
		const type = condition.date.begin === condition.date.end ? 0 : 1;
		let report_type = type === 0 ? "hourly" : "daily";
		// console.log("选中时间", condition.date)
		// this.allTasks(condition).then(this.setDataToReducer).catch(handleResponseError);
		const currentTime = condition.date;
		const initialCondition = JSON.parse(this.state.sorter.condition)[0];
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...initialCondition,
					begin: currentTime.begin,
					end: currentTime.end,
					report_type: report_type
				}])
			}
		}
		let tasks = [
			adgroupreport(currentCondition),
		];
		Promise.all(tasks).then((res) => {
			console.log(res)
			this.props.compareSetData(res[0].data)
		})
		let typeIs = currentTime.begin === currentTime.end ? "hourly" : "daily";
		var conditionX;
		var preCondition = this.state.forReport.dateA;
		if(this.state.isCompare) {
			// 需要对比
			console.log("needCompare", this.state.forReport,typeIs)
			conditionX = JSON.stringify([
				{
					...initialCondition,
					begin: preCondition.begin,
					end: preCondition.end,
					report_type:typeIs
				},
				{
					...initialCondition,
					begin: currentTime.begin,
					end: currentTime.end,
					report_type:typeIs
				},
			])
		} else {
			// 不需要对比
			console.log("notneedCompare", this.state.forReport,typeIs);
			conditionX = JSON.stringify([
				{
					...initialCondition,
					begin: preCondition.begin,
					end: preCondition.end,
					report_type:typeIs
				},
			])
		}

        // 选中当前时间后 更新查询条件
		this.setState({
			sorter: {
				...this.state.sorter,
				condition: conditionX
			},
			forReport: {
				dateA: preCondition,
				dateB: currentTime
			}
		})
	}

	askData(conditionA, conditionB, x) {
		console.log(x)
		const timeA = conditionA.date;
		const timeB = conditionB.date;
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...timeA,
					report_type: x
				}])
			}
		}
		let compareCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify([{
					...timeB,
					report_type: x
				}])
			}
		}
		let tasks = [
			adgroupreport(currentCondition),
			adgroupreport(compareCondition),
		];
		Promise.all(tasks).then((res) => {
			console.log(res)
			this.props.currentSetData(res[0].data)
			this.props.compareSetData(res[1].data)
		})
	}

	getFenshiFenri(x,allTime) {
		// console.log("分时分日", x);
		const type = x === "a" ? "hourly" : "daily";
		const conditionA = {
			date: {
				begin: allTime[0][0].format("YYYY/MM/DD"),
				end: allTime[0][1].format("YYYY/MM/DD")
			}
		}
		const conditionB= {
			date: {
				begin: allTime[1][0].format("YYYY/MM/DD"),
				end: allTime[1][1].format("YYYY/MM/DD")
			}
		}
		// console.log("conditionA",conditionA)
		// console.log("conditionB",conditionB)
		this.askData(conditionA, conditionB, type);
	}

	updateHandle = async (params) => {
		const {pageSize, current, filters} = params;
		const res = await request({
			url: `${BUSINESSAPIHOST}/alliancereport/adgroupreport`,
			method: 'get',
			data: {
				sort: params.sorter.field,
				order: params.sorter.order,
				limit: pageSize,
				offset: pageSize * (current - 1),
				condition: params.sorter.condition,
				report_data: params.sorter.report_data,
				// begin: params.sorter.begin,
				// end: params.sorter.end,
				...filters
			}
		})
		if (res) {
			let result = res.data.report;
			result.rows.forEach((item, index) => {
				item.uid = index
			})
			return {
				rows: result.rows,
				total: parseInt(result.total)
			}
		}
	}
	renderColumns(columnsNames) {
		let columnsModel;
		switch (this.state.reportType) {
			case "unlimited":
				columnsModel = adgroupColumnsUnlimited;
				break;
			case "date":
				columnsModel = adgroupColumnsdate;
				break;
			case "adgroup":
				columnsModel = adgroupColumnsadgroup;
				break;
			default:
				return
		}
		const newColumns = [];
		columnsModel.forEach((itemObj, index) => {
			if (index === 0) {
				newColumns.push(itemObj)
			}

			if (columnsNames.indexOf(itemObj.dataIndex) !== -1) {
				newColumns.push(itemObj)
			}
		})

		// console.log("xxxxxxx",newColumns)

		this.setState({
			columns: newColumns,
		})
	}

	handleUpload() {
		// 下载表单
		var x = BUSINESSAPIHOST + '/alliancereport/exportcsv?action_name=adgroupreportAction&offset=0&limit=1000000&condition=' + this.state.sorter.condition;
		window.open(encodeURI(x));
	}

	getGroupids(x) {
		// console.log("广告ids",x)
		let condition = JSON.parse(this.state.sorter.condition);
		condition[0].ids = x;
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify(condition)
			}
		}
		let compareCondition = {
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify(condition)
			}
		}
		let tasks = [
			adgroupreport(currentCondition),
			adgroupreport(compareCondition),
		];
		Promise.all(tasks).then((res) => {
			console.log(res)
			this.props.currentSetData(res[0].data)
			this.props.compareSetData(res[1].data)
		})
		this.setState({
			sorter: {
				...this.state.sorter,
				condition: JSON.stringify(condition)
			}
		}, () => {
			this.refreshReport()
		})
	}
	toggle(value) {
		// 1.切换列
		// 决定报表展示 日期 还是 媒体
		// value: date or media
		let currentColumes;
		let sorter = {};
		let condition = JSON.parse(this.state.sorter.condition);
		condition = condition.map((item) => {
			return {
				...item,
				dimension: value
			}
		})
		// condition[0].dimension = value;

		switch (value) {
			case "unlimited":
				currentColumes = adgroupColumnsUnlimited;
				sorter.field = "period_date";
				sorter.order = "descend";
				break;
			case "date":
				currentColumes = adgroupColumnsdate;
				sorter.field = "period_date";
				sorter.order = "descend";
				break;
			case "adgroup":
				currentColumes = adgroupColumnsadgroup;
				sorter.field = "imp";
				sorter.order = "descend";
				break;
			default:
				return
		}
		// console.log('数据报表', this.state.sorter)
		this.setState({
			reportType: value,
			columns: currentColumes,
			sorter: {
				...this.state.sorter,
				field: sorter.field,
				order: sorter.order,
				condition: JSON.stringify(condition)
			}
		})
	}
    render() {
        return (
			this.state.loading
			? <Loading/>
            : <div>
                <Card style={{
                        margin: "20px 20px 20px"
                }}>
                    <Filter isCompare={this.isCompare.bind(this)}
						dateChangeCurrent={this.dateChangeCurrent.bind(this)}
						dateChangeCompare={this.dateChangeCompare.bind(this)}
						getFenshiFenri={this.getFenshiFenri.bind(this)}
						getGroupids={this.getGroupids.bind(this)}
					/>
                </Card>
                <Card title="数据趋势分析" style={{
                        margin: "20px 20px 20px"
                }}>
                    <LineChart showCompare={this.state.isCompare}/>
                </Card>

				<Card title="数据报表" style={{
						margin: "20px 20px 20px"
				}} extra={
					// <Button onClick = {
					// 	this.handleUpload.bind(this)
					// } > 下载报表</Button>
					<Icon type="download" style={{cursor: "pointer",fontSize:"16px"}} title="下载报表" onClick={this.handleUpload.bind(this)}/>
				}>
					<TableForReport
						columns={this.state.columns}
						onUpdate={this.updateHandle}
						sorter={this.state.sorter}>
						<Toggle getResult={this.toggle.bind(this)}/>
						{this.state.isCompare ? <AdsDropDown getResult={this.refreshReportByDate.bind(this)}/> : null}
						<TableDimension
							columns={this.state.columns}
							handleClick={this.renderColumns.bind(this)}
							reportType={this.state.reportType}
						/>
					</TableForReport>
				</Card>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		currentSetData: (current) => {
			dispatch(currentSetData(current))
		},
		compareSetData: (compare) => {
			dispatch(compareSetData(compare))
		},
		deltaTimeSet: (deltaTime) => {
			dispatch(deltaTimeSet(deltaTime))
		},
		useradstructSet: (useradstruct) => {
			dispatch(useradstructSet(useradstruct))
		}
	}
}

const mapStateToProps = (state) => {
	return {
		deltaTime:  state.groupReportReducers.deltaTime
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(GroupReport)
