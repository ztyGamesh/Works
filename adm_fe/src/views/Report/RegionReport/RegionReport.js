/**
 * @class 地域报表
 * */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loading from '../../../components/Loading/Loading';
import {Card, message, Button, Icon} from 'antd';
import Filter from '../../../containers/Report/RegionReport/Filter';
import TableForReport from '../../../containers/Report/RegionReport/TableForReport';
import TableDimension from '../../../containers/Report/RegionReport/TableDimension';
import AdsDropDown from '../../../containers/Report/RegionReport/AdsDropDown';
import Toggle from '../../../containers/Report/RegionReport/Toggle';
import RegionMap from '../../../containers/Report/RegionReport/RegionMap';
import Bars from '../../../containers/Report/RegionReport/Bars';
import moment from 'moment';
import request from '../../../utils/request';
import {BUSINESSAPIHOST} from '../../../common/env';

import {
	todaySubtract,
    addTasks,
    handleResponseError
} from '../../../utils/aboutReportUtils';
import {dateComparePeriod} from '../../../utils/aboutDashboard';
import {georeport,currentSetData,deltaTimeSet,fetchuseradstruct,useradstructSet} from './flow/RegionReportActions.js';
import {provinceColumnsRegion,cityColumnsRegion} from '../../../mock/Report/ColumnsMap';


class RegionReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			reportType: "province",
			sorter: {
				order: 'descend',
                begin: todaySubtract(0),
                end: todaySubtract(0),
                filter: "client",
                ids: "",
                target: "imp",
                dimension: "province",
				field: 'imp',
				limit: 50,
				offset: 0,
			},
			delta: 0,
			// 从mock处取得账户报表页面的报表列
			columns: Object.assign([], provinceColumnsRegion),
		};
		this.allTasks = this.allTasks.bind(this);
		this.setDataToReducer = this.setDataToReducer.bind(this);
	}
	componentWillMount() {
		this._init();
	}
	allTasks(date) {
		const type = date.begin === date.end ? 0 : 1;
		const currentTime = date;
		const compareTime = dateComparePeriod(date);
		let report_type = type === 0 ? "hourly" : "daily";
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				begin: currentTime.begin,
				end: currentTime.end,
				report_type: report_type
			}
		}
		let compareCondition = {
			sorter: {
				...this.state.sorter,
				begin: compareTime.begin,
				end: compareTime.end,
				report_type: report_type
			}
		};
		let useradstruct = {
			sorter: {
				query_date: currentTime.begin
			}
		}
		let tasks = [
			georeport(currentCondition),
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
		this.props.useradstructSet(data[1]);
		this.setState({loading: false})
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
		let currentCondition = {
			sorter: {
				...this.state.sorter,
				begin: currentTime.begin,
                end: currentTime.end
			}
		}
		let tasks = [
			georeport(currentCondition),
		];
		Promise.all(tasks).then((res) => {
			console.log(res)
			this.props.currentSetData(res[0].data)
		})
		this.setState({
			sorter: {
				...this.state.sorter,
				...currentCondition.sorter
			}
		})
	}

    handleGroup(x) {
        this.setState({
            sorter: {
                ...this.state.sorter,
                ids: x,
                filter: "adgroup"
            }
        })
    }
    handlePlan(x) {
        this.setState({
            sorter: {
                ...this.state.sorter,
                ids: x,
                filter: "adplan"
            }
        })
    }
    handleClient() {
        this.setState({
            sorter: {
                ...this.state.sorter,
                ids: "",
                filter: "client"
            }
        })
    }
    handletarget(x) {
        this.setState({
            sorter: {
                ...this.state.sorter,
                target: x
            }
        }, () => {
            console.log(this.state.sorter)
        })
    }
	handleUpload() {
		// 下载表单
		var url = BUSINESSAPIHOST + '/alliancereport/exportcsv?action_name=georeportAction&offset=0&limit=1000000&begin=' + this.state.sorter.begin + '&end=' + this.state.sorter.end + '&filter=' + this.state.sorter.filter + '&ids=' + this.state.sorter.ids + '&target=' + this.state.sorter.target + '&dimension=' + this.state.sorter.dimension;
		window.open(encodeURI(url));
	}

	updateHandle = async (params) => {
		const {pageSize, current, filters} = params;
		const res = await request({
			url: `${BUSINESSAPIHOST}/alliancereport/georeport`,
			method: 'get',
			data: {
				sort: params.sorter.field,
				order: params.sorter.order,
				limit: pageSize,
				offset: pageSize * (current - 1),
				begin: params.sorter.begin,
				end: params.sorter.end,
				report_data: params.sorter.report_data,
				filter: params.sorter.filter,
				target: params.sorter.target,
				ids: params.sorter.ids,
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
	toggle(value) {
		// 1.切换列
		// 决定报表展示 日期 还是 媒体
		// value: date or media
		let currentColumes;
		let sorter = {};
		switch (value) {
			case "province":
				currentColumes = provinceColumnsRegion;
				sorter.field = "imp";
				sorter.order = "descend";
				break;
			case "city":
				currentColumes = cityColumnsRegion;
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
				dimension: value
			}
		})
	}
	renderColumns(columnsNames) {
		let columnsModel;
		switch (this.state.reportType) {
			case "province":
				columnsModel = provinceColumnsRegion;
				break;
			case "city":
				columnsModel = cityColumnsRegion;
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
	handleDimension(x) {
		this.setState({
			dimension: x
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
                    <Filter
						dateChangeCurrent={this.dateChangeCurrent.bind(this)}
                        handleGroup={this.handleGroup.bind(this)}
                        handlePlan={this.handlePlan.bind(this)}
                        handleClient={this.handleClient.bind(this)}
                        handletarget={this.handletarget.bind(this)}
					/>
                </Card>
                <Card style={{
                        margin: "20px 20px 20px"
                }}>
                    <RegionMap target={this.state.sorter.target}/>
                </Card>
                <Card style={{
                        margin: "20px 20px 20px"
                }}>
                    <Bars target={this.state.sorter.target}/>
                </Card>
				<Card title="数据报表" style={{
						margin: "20px 20px 20px"
				}} extra={
					<Icon type="download" style={{cursor: "pointer",fontSize:"16px"}} title="下载报表" onClick={this.handleUpload.bind(this)}/>
				}>
					<TableForReport
						columns={this.state.columns}
						onUpdate={this.updateHandle}
						sorter={this.state.sorter}>
						<Toggle getResult={this.toggle.bind(this)}/>
						<TableDimension
							columns={this.state.columns}
							handleClick={this.renderColumns.bind(this)}
							reportType={this.state.reportType}
							handleDimension={this.handleDimension.bind(this)}
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
		deltaTime:  state.regionReportReducers.deltaTime
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(RegionReport)
