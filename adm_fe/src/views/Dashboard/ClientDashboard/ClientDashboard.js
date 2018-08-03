import React, {Component} from 'react';
import {Card, Tabs, Row, Col} from 'antd';
const TabPane = Tabs.TabPane;
/**
 * 广告主dashboard页面
 * */
import CustomRangePicker from '../../../containers/Dashboard/ClientDashboard/CustomRangePicker';
import LineChart from '../../../containers/Dashboard/ClientDashboard/LineChart';
import CoverView from '../../../containers/Dashboard/ClientDashboard/CoverView';
import ADGroupBars from '../../../containers/Dashboard/ClientDashboard/ADGroupBars';
import ADPlanBars from '../../../containers/Dashboard/ClientDashboard/ADPlanBars';
import {CurrentKeyWordTable,CompareKeyWordTable} from '../../../containers/Dashboard/ClientDashboard/DashboardTable';
import Loading from '../../../components/Loading/Loading';
import { connect } from 'react-redux';
import {todaySubtract, dateComparePeriod, handleResponseError} from '../../../utils/aboutDashboard';

import {
    dashboardHourly,
    dashboardDaily,
    dashboardSum,
    dashboardADGroupTop,
    dashboardADPlanTop,
    dashboardWordTop,
    timeSet,
    coverviewSetCurrent,
    coverviewSetCompare,
    adgrouptopSet,
    adplantopSet,
    lineChartCurrent,
    lineChartCompare,
    wordTopCurrent,
    wordTopCompare
} from './flow/ClientDashboardActions';



function allTasks(date) {
	const type = date.begin === date.end ? 0 : 1;
    console.log("type", type)
	const currentTime = date;
	const compareTime = dateComparePeriod(date);

	console.log("timetime")
	console.log(currentTime)
	console.log(compareTime)
	let tasks = [
		dashboardSum(currentTime),
		dashboardSum(compareTime),
		dashboardADGroupTop(currentTime),
		dashboardADPlanTop(currentTime),
        dashboardWordTop(currentTime),
        dashboardWordTop(compareTime),
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



class ClientDashboard extends Component {

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
        const today = {
            begin: todaySubtract(0),
            end: todaySubtract(0)
        }
        // console.log("某天",yesterday)
        this.props.timeSet({
            current: today,
            compare: dateComparePeriod(today)
        })
        allTasks(today)
        .then(this.setDataToReducer)
        .catch(handleResponseError)
    }

    setDataToReducer(array) {
        console.log("数据源")
        console.log(array)

        // // array中的每个位置中的数据是固定的，是根据allTasks中异步Promise对象的顺序产生的
        // // 0: sumCurrent
        this.props.coverviewSetCurrent(array[0].data[0]);
        // // 1: sumCompare
        this.props.coverviewSetCompare(array[1].data[0]);
        // // 2: 广告组
        this.props.adgrouptopSet(array[2].data);
        // // 3: 广告计划
        this.props.adplantopSet(array[3].data);
        // // 4: wordTop Current
        this.props.wordTopCurrent(array[4].data);
        // // 5: wordTop Compare
        this.props.wordTopCompare(array[5].data);
        // // 6: LineChartCurrent
        this.props.lineChartCurrent(array[6].data);
        // // 7: LineChartCompare
        this.props.lineChartCompare(array[7].data);
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
            :<div>
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
                        <TabPane tab="广告组" key="1"><ADGroupBars/></TabPane>
                        <TabPane tab="广告计划" key="2"><ADPlanBars/></TabPane>
                    </Tabs>
                </Card>


                <Card
                    style={{margin: "20px 20px 20px"}}
                    bodyStyle={{padding: 0}}
                >
                    <Row>
                        <Col span={12}>
                            <Card
                                title="关键词Top20"
                                type="inner"
                                style={{
                                    margin: "20px 10px 20px",
                                }}
                                bodyStyle={{
                                    padding:0,
                                }}
                            >
                                <CurrentKeyWordTable/>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title="关键词Top20"
                                type="inner"
                                style={{margin: "20px 10px 20px"}}
                                bodyStyle={{padding:0,bordered: "0px solid red"}}
                            >
                                <CompareKeyWordTable/>
                            </Card>
                        </Col>
                    </Row>
                </Card>

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
		adgrouptopSet: (adgrouptop) => {
			dispatch(adgrouptopSet(adgrouptop))
		},
		adplantopSet: (adplantop) => {
			dispatch(adplantopSet(adplantop))
		},
		lineChartCurrent: (current) => {
			dispatch(lineChartCurrent(current))
		},
		lineChartCompare: (compare) => {
			dispatch(lineChartCompare(compare))
		},
        wordTopCurrent: (current) => {
            dispatch(wordTopCurrent(current))
        },
        wordTopCompare: (compare) => {
            dispatch(wordTopCompare(compare))
        }
	}
}
export default connect(
    null,
    mapDispatchToProps
)(ClientDashboard);
