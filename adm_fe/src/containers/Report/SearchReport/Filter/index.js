import React, { Component } from 'react';
import moment from 'moment';
import CustomRangePicker from '../CustomRangePicker';
import SelectorGroup from '../SelectorGroup';
import { Row, Col, Menu, Dropdown, Button, Icon, message,Switch,Radio} from 'antd';
import {dateComparePeriodForADS} from '../../../../utils/aboutDashboard';

function todaySubtract(x) {
    return moment().subtract(x, 'days');
}

class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateA: [todaySubtract(0), todaySubtract(0)]
        };
    }

    dateChangeCurrent(dates,dateString) {
        // console.log("dateChange",dateString)
        this.props.dateChange(dates,dateString)
    }

    matchType(x) {
        this.props.matchTypeChange(x);
    }
    render() {
        return (
            <div>
                {/*日期选择器*/}
                <Row>
                    <Col span={8}>
                        <CustomRangePicker showDate={this.state.dateA} dateChangeCurrent={this.dateChangeCurrent.bind(this)}/>
                    </Col>
                </Row>
                {/*广告计划选择器*/}
                <Row>
                    <Col span={12}>
                        <SelectorGroup matchType={this.matchType.bind(this)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Filter;
