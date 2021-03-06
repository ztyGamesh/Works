import React, {Component} from 'react';
import {Card, message, Button, Icon} from 'antd';
import {connect} from 'react-redux';

import request from '../../../utils/request';
import {BUSINESSAPIHOST} from '../../../common/env';

import Loading from '../../../components/Loading/Loading';

import Filter from '../../../containers/Report/TemplateReport/Filter';
import LineChart from '../../../containers/Report/TemplateReport/LineChart';
import TableForReport from '../../../containers/Report/TemplateReport/TableForReport';
import TableDimension from '../../../containers/Report/TemplateReport/TableDimension';
import Toggle from '../../../containers/Report/TemplateReport/Toggle';

import {todaySubtract, addTasks, handleResponseError} from '../../../utils/aboutReportUtils';
import {alliancetemplate,getSlotStruct,setSlotTemplate,lineChartCurrent} from './flow/TemplateActions';
import {columnsDate, columnsTemplate} from '../../../mock/Report/ColumnsMap';

/**
 * 样式报表页面
 * */

const execTasks = addTasks([alliancetemplate, getSlotStruct]);

class TemplateReport extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			reportType: "template",
			sorter: {
				field: "imp",
				order: 'ascend',
				begin: todaySubtract(1),
				end: todaySubtract(1),
				limit: 50,
				offset: 0,
                slot_template: "",
				dimension: "template"
			},
			columns: Object.assign([], columnsTemplate)
		};
		this.setDataToReducer = this.setDataToReducer.bind(this);
		this.dateChange = this.dateChange.bind(this);
	}
	componentWillMount() {
		this._init();
	}
	_init() {
		/* 1.页面第一次加载时，需要昨天的日期 */
		const condition = {
			sorter: {
				...this.state.sorter
			}
		}
		/* 2.将初始化数据传入函数管理器，流水线作业 */
		execTasks(condition).then(this.setDataToReducer).catch(handleResponseError)
	}
	setDataToReducer(data) {
		// data是 请求处理器返回的请求处理结果的数据，数据的顺序对应请求处理函数的顺序
		// 也就是 addTasks 中函数的顺序
		// 将数据存入reducer
		console.log(data)
		// data[0].data 是所有数据
		const currentChart = data[0].data.chart;
		this.props.lineChartCurrent(currentChart);
		// // data[1].data 广告位样式
		this.props.setSlotTemplate(data[1].data);
		this.setState({loading: false})
	}
	dateChange(dates, dateString) {
		const condition = {
			sorter: {
				...this.state.sorter,
				begin: dateString[0].replace(/-/g, "/"),
				end: dateString[1].replace(/-/g, "/")
			}
		}
		// console.log("选中时间", condition.date)
		execTasks(condition).then(this.setDataToReducer).catch(handleResponseError);
		this.setState({
			sorter: {
				...this.state.sorter,
				begin: condition.sorter.begin,
				end: condition.sorter.end
			}
		})
	}
	updateHandle = async (params) => {
		const {pageSize, current, filters} = params;
		const res = await request({
			url: `${BUSINESSAPIHOST}/alliancereport/alliancetemplate`,
			method: 'get',
			data: {
				sort: params.sorter.field,
				order: params.sorter.order,
				limit: pageSize,
				offset: pageSize * (current - 1),
				begin: params.sorter.begin,
				end: params.sorter.end,
                slot_template: params.sorter.slot_template,
				dimension: params.sorter.dimension,
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
		// 根据 reportType 来决定查找的模板列
		let columnsModel;
		switch (this.state.reportType) {
			case "date":
				columnsModel = columnsDate;
				break;
			case "template":
				columnsModel = columnsTemplate;
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

		this.setState({columns: newColumns})
	}

	handleUpload() {
		// 下载表单
		// alert("下载表单")
		console.log(this.state.sorter)
		var url = BUSINESSAPIHOST + '/alliancereport/exportcsv?action_name=alliancetemplateAction&offset=0&limit=1000000&begin=' + this.state.sorter.begin + '&end=' + this.state.sorter.end + '&slot_template=' + this.state.sorter.slot_template + '&dimension=' + this.state.sorter.dimension;
		window.open(encodeURI(url));
	}
	toggle(value) {
		console.log(value)
		// 1.切换列
		// 决定报表展示 日期 还是 媒体
		// value: date or media
		let currentColumes;
		let sorter = {};
		switch (value) {
			case "date":
				currentColumes = columnsDate;
				sorter.field = "period_date";
				sorter.order = "descend";
				break;
			case "template":
				currentColumes = columnsTemplate;
				sorter.field = "imp";
				sorter.order = "ascend";
				break;
			default:
				return
		}
		// console.log('数据报表', value)
		this.setState({
			reportType: value,
			columns: currentColumes,
			sorter: {
				...this.state.sorter,
				field: sorter.field,
				order: sorter.order,
				dimension: value
			}
		})
	}

	refreshDate(dateString) {
		console.log(dateString)
		this.setState({
			sorter: {
				...this.state.sorter,
				begin: dateString[0],
				end: dateString[1]
			}
		}, () => {
			this._init()
		})
	}

	refreshSlotTemplate(slotTemplate) {
		this.setState({
			sorter: {
				...this.state.sorter,
				slot_template: slotTemplate
			}
		},() => {
			this._init()
		})
	}

	handleFilter(type, value) {
		switch (type) {
			case "date":
				this.refreshDate(value)
				break;
			case "template":
				this.refreshSlotTemplate(value);
				break;
			default:
				return
		}
	}
	render() {

		return (
			this.state.loading
			? <Loading/>
			: <div>
				<Card style={{
						margin: "20px 20px 20px"
				}}>
					<Filter getResult={this.handleFilter.bind(this)}/>
				</Card>

				<Card title="数据趋势分析" style={{
						margin: "20px 20px 20px"
				}}>
					<LineChart/>
				</Card>

				<Card title="数据报表" style={{
						margin: "20px 20px 20px"
				}} extra={
					<Icon type="download" style={{cursor: "pointer",fontSize:"16px"}} title="下载报表" onClick={this.handleUpload.bind(this)}/>
				}>
					<TableForReport columns={this.state.columns} onUpdate={this.updateHandle} sorter={this.state.sorter}>
						{/* 日期媒体切换 */}
						<Toggle getResult={this.toggle.bind(this)}/> {/* 维度选择 */}
						<TableDimension columns={this.state.columns} reportType={this.state.reportType} handleClick={this.renderColumns.bind(this)}/>
					</TableForReport>
				</Card>
			</div>)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setSlotTemplate: (slotTemplate) => {
			dispatch(setSlotTemplate(slotTemplate))
		},
		lineChartCurrent: (current) => {
			dispatch(lineChartCurrent(current))
		}
	}
}

export default connect(null, mapDispatchToProps)(TemplateReport)
