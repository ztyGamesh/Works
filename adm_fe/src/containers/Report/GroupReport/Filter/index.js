import React, { Component } from 'react';
import moment from 'moment';
import CustomRangePicker from '../CustomRangePicker';
import Selector from '../Selector';
import HourOrDay from '../HourOrDay';
import { Row, Col, Menu, Dropdown, Button, Icon, message,Switch} from 'antd';
import {dateComparePeriodForADS} from '../../../../utils/aboutDashboard';

function todaySubtract(x) {
    return moment().subtract(x, 'days');
}

class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateA: [todaySubtract(0), todaySubtract(0)],
            dateB: [todaySubtract(1), todaySubtract(1)],
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
    dateChangeCompare(dates,dateString) {
        console.log("dateChange",dateString)
        let deltaB = moment(dateString[1]) - moment(dateString[0]);
        let deltaA = this.state.dateA[1] - this.state.dateA[0];
        if (deltaB !== deltaA) {
            message.warning("比较日期与查询日期长度不一致，请重新选择")
            this.setState({
                dateB: this.state.dateB
            })
        } else {
            let currentDate = {
                begin: dateString[0],
                end: dateString[1]
            }
            let dateB = [moment(currentDate.begin), moment(currentDate.end)];
            this.setState({
                dateB: dateB
            })
        }

        // console.log("cha", moment(dateString[1]) - moment(dateString[0]));
        // console.log("real", this.state.dateA[1] - this.state.dateA[0]);
        // this.props.getResult('date', dateString)
    }
    getgetDayOrHour(x,y) {
        this.props.getFenshiFenri(x,y);
    }
    getGroupids(x) {
        this.props.getGroupids(x)
    }
    render() {
        return (
            <div>
                {/*日期选择器*/}
                <Row>
                    <Col span={8}>
                        <CustomRangePicker getResult={this.dateChangeCurrent.bind(this)} showDate={this.state.dateA} haveAction={this.props.dateChangeCurrent}/>
                    </Col>
                    <Col span={8}>
                        <CustomRangePicker getResult={this.dateChangeCompare.bind(this)} showDate={this.state.dateB} checkbox={true} isCompare={this.props.isCompare} haveAction={this.props.dateChangeCompare}/>
                    </Col>
                    <Col span={6}>
                        {/*分时分日选择器*/}
                        <HourOrDay currentTime={this.state.dateA}
                            getDayOrHour={this.getgetDayOrHour.bind(this)}
                            allTime={[this.state.dateA,this.state.dateB]}
                        />
                    </Col>
                </Row>
                {/*广告组选择器*/}
                <Row>
                    <Col span={12}>
                        <Selector getResult={this.getGroupids.bind(this)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Filter;
