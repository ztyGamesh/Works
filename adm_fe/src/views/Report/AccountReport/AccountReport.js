/**
 * @class 媒体账户报表
 * */
import React, {Component} from 'react';
import {Row, Col, Card, Button, Icon} from 'antd';
import {connect} from 'react-redux';

import request from '../../../utils/request';
import {BUSINESSAPIHOST} from '../../../common/env';


import Loading from '../../../components/Loading/Loading';
import CustomRangePicker from '../../../containers/Report/AccountReport/CustomRangePicker';
import LineChart from '../../../containers/Report/AccountReport/LineChart';
import TableForReport from '../../../containers/Report/AccountReport/TableForReport';
import TableDimension from '../../../containers/Report/AccountReport/TableDimension';

import {
	todaySubtract,
    addTasks,
    handleResponseError
} from '../../../utils/aboutReportUtils';
import {allianceaccount, lineChartCurrent} from './flow/AccountReportActions';
import {columnsDate} from '../../../mock/Report/ColumnsMap';
/**
 * 账户报表页面
 * */


const execTasks = addTasks([allianceaccount]);

class AccountReport extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
            /*页面请求sorter的状态,一开始赋值为昨天，后续根据操作更新*/
			sorter: {
				field: 'period_date',
				order: 'ascend',
				begin: todaySubtract(1),
				end: todaySubtract(1),
				limit: 50
			},
            // 从mock处取得账户报表页面的报表列
			columns: Object.assign([], columnsDate)
		};
		this.setDataToReducer = this.setDataToReducer.bind(this);
		this.dateChange = this.dateChange.bind(this);
	}

	componentWillMount() {
		// console.log('复制的', Object.assign([], columnsDate))
        /*1.页面第一次加载时，需要昨天的日期*/
		const condition = {
			date: {
				begin: todaySubtract(1),
				end: todaySubtract(1)
			}
		}
        /*2.将初始化数据传入函数管理器，流水线作业*/
		execTasks(condition)
		.then(this.setDataToReducer)
		.catch(handleResponseError)
	}

	setDataToReducer(data) {
        // data是 请求处理器返回的请求处理结果的数据，数据的顺序对应请求处理函数的顺序
        // 也就是 addTasks 中函数的顺序
		// 将数据存入reducer
		const currentChart = data[0].data.chart;
		this.props.lineChartCurrent(currentChart)
		this.setState({loading: false})
	}
	dateChange(dates, dateString) {
		const condition = {
			date: {
				begin: dateString[0].replace(/-/g, "/"),
				end: dateString[1].replace(/-/g, "/")
			}
		}
		// console.log("选中时间", condition.date)
		execTasks(condition).then(this.setDataToReducer).catch(handleResponseError)
		this.setState({
			sorter: {
				...this.state.sorter,
				begin: condition.date.begin,
				end: condition.date.end
			}
		})
	}
	updateHandle = async (params) => {
		const {pageSize, current, filters} = params;
		const res = await request({
			url: `${BUSINESSAPIHOST}/alliancereport/allianceaccount`,
			method: 'get',
			data: {
				sort: params.sorter.field,
				order: params.sorter.order,
				limit: pageSize,
				offset: pageSize * (current - 1),
				begin: params.sorter.begin,
				end: params.sorter.end,
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
		// console.log(columnsNames)
		// 根据最新的columnsNames 去columns库中选择所要渲染的columns，生成新的columns
		// columnsMap 是所有规则
		// columnsNames是要渲染的列
		// 做一个双重循环
		const newColumns = [];
		columnsDate.forEach((itemObj, index) => {
			if (index === 0) {
				newColumns.push(itemObj)
			}

			if (columnsNames.indexOf(itemObj.dataIndex) !== -1) {
				newColumns.push(itemObj)
			}
		})

		this.setState({columns: newColumns})
	}

	handleUpload() {
		// 下载表单
		var x = BUSINESSAPIHOST + '/alliancereport/exportcsv?action_name=allianceaccountAction&offset=0&limit=1000000&begin=' + this.state.sorter.begin + '&end=' + this.state.sorter.end;
		window.open(encodeURI(x));
	}
	render() {
		// console.log(this.state.columns)
		return (
			this.state.loading
			? <Loading/>
			: <div>
				<Card style={{
						margin: "20px 20px 20px"
				}}>
					<Row>
						<Col span={8}>
							<CustomRangePicker getResult={this.dateChange.bind(this)}/>
						</Col>
					</Row>
				</Card>

				<Card title="数据趋势分析" style={{
						margin: "20px 20px 20px"
				}}>
					<LineChart/>
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
						{/* 维度选择 */}
						<TableDimension
							columns={this.state.columns}
							handleClick={this.renderColumns.bind(this)}
						/>
					</TableForReport>
				</Card>
			</div>)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		lineChartCurrent: (current) => {
			dispatch(lineChartCurrent(current))
		}
	}
}

export default connect(null, mapDispatchToProps)(AccountReport)
