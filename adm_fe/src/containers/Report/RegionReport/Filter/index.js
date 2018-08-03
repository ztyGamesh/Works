import React, { Component } from 'react';
import moment from 'moment';
import CustomRangePicker from '../CustomRangePicker';
import SelectorGroup from '../SelectorGroup';
import SelectorPlan from '../SelectorPlan';
import HourOrDay from '../HourOrDay';
import { Row, Col, Menu, Dropdown, Button, Icon, message,Switch,Radio} from 'antd';
import {dateComparePeriodForADS} from '../../../../utils/aboutDashboard';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
function todaySubtract(x) {
    return moment().subtract(x, 'days');
}

class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateA: [todaySubtract(0), todaySubtract(0)],
            dateB: [todaySubtract(1), todaySubtract(1)],
            type: "client"
        };
    }

    dateChangeCurrent(dates,dateString) {
        console.log("dateChange",dateString)
        //获取A日期，计算得出B日期，赋值给B日历
        let currentDate = {
            begin: dateString[0],
            end: dateString[1]
        }
        let compareDate = dateComparePeriodForADS(currentDate);
        // console.log("cur",currentDate);
        // console.log("com",compareDate);
        let dateA = [moment(currentDate.begin), moment(currentDate.end)];
        let dateB = [moment(compareDate.begin), moment(compareDate.end)];
        this.setState({
            dateA: dateA,
            dateB: dateB
        })
        // this.props.getResult('date', dateString)
    }

    handleChoose(e) {
        if (e.target.value === "client") {
            this.props.handleClient();
        }
        this.setState({
            type: e.target.value
        })
    }
    handletarget(e) {
        // console.log(e.target.value)
        this.props.handletarget(e.target.value)
    }
    handleGroup(x) {
        this.props.handleGroup(x);
    }
    handlePlan(x) {
        this.props.handlePlan(x);
    }
    render() {
        let show;
        switch (this.state.type) {
            case "client":
                show = null;
                break;
            case "adgroup":
                show = <SelectorGroup getResult={this.handleGroup.bind(this)}/>;
                break;
            case "adplan":
                show = <SelectorPlan getResult={this.handlePlan.bind(this)}/>;
                break;
            default:
        }
        return (
            <div>
                {/*日期选择器*/}
                <Row>
                    <Col span={8}>
                        <CustomRangePicker getResult={this.dateChangeCurrent.bind(this)} showDate={this.state.dateA} haveAction={this.props.dateChangeCurrent}/>
                    </Col>
                </Row>
                {/*选择器*/}
                <Row>
                    <Col span={8}>
                        <RadioGroup
                            defaultValue="client"
                            style={{marginTop: "4%"}}
                            onChange={this.handleChoose.bind(this)}
                        >
                            <RadioButton value="client">账户</RadioButton>
                            <RadioButton value="adgroup">筛选广告组</RadioButton>
                            <RadioButton value="adplan">筛选广告计划</RadioButton>
                        </RadioGroup>
                    </Col>
                    <Col span={8}>
                        <RadioGroup
                            defaultValue="imp"
                            style={{marginTop: "4%"}}
                            onChange={this.handletarget.bind(this)}
                        >
                            <RadioButton value="imp">展示量</RadioButton>
                            <RadioButton value="clk">点击量</RadioButton>
                            <RadioButton value="ctr">点击率</RadioButton>
                        </RadioGroup>
                    </Col>
                </Row>
                {show}
            </div>
        );
    }
}

export default Filter;
