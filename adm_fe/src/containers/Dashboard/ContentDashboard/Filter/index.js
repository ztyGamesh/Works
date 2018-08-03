import React, { Component } from 'react';
import moment from 'moment';
import CustomRangePicker from '../CustomRangePicker';
import Selector from '../Selector';
import { Row, Col, Menu, Dropdown, Button, Icon, message,Switch} from 'antd';

function todaySubtract(x) {
    return moment().subtract(x, 'days');
}

class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateA: [todaySubtract(1), todaySubtract(1)],
        };
    }

    dateChangeCurrent(dates,dateString) {
        // console.log("dateChange",dateString)
        //获取A日期，计算得出B日期，赋值给B日历
        let currentDate = {
            begin: dateString[0],
            end: dateString[1]
        }
        let dateA = [moment(currentDate.begin), moment(currentDate.end)];
        this.setState({
            dateA: dateA,
        })
        // this.props.getResult('date', dateString)
    }
    uidChange(x) {
        this.props.getUidChange(x)
    }
    render() {
        return (
            <div>
                {/*日期选择器*/}
                <Row>
                    <Col span={8}>
                        <CustomRangePicker getResult={this.dateChangeCurrent.bind(this)} showDate={this.state.dateA} haveAction={this.props.getDateChange}/>
                    </Col>
                </Row>
                {/*筛选媒体选择器*/}
                <Row>
                    <Col span={12}>
                        <Selector getResult={this.uidChange.bind(this)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Filter;
