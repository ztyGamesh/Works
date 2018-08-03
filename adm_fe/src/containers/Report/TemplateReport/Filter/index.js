import React, { Component } from 'react';
import CustomRangePicker from '../CustomRangePicker';
import SelectorSlotStruct from '../SelectorSlotStruct';
import { Row, Col, Menu, Dropdown, Button, Icon, message} from 'antd';

class Filter extends Component {

    dateChange(dates,dateString) {
        // console.log("dateChange",dateString)
        this.props.getResult('date', dateString)
    }

    slotTemplateChange(template) {
        if (template == "") {
            this.props.getResult('template', "");
        } else {
            this.props.getResult('template', template);
        }
    }


    render() {
        return (
            <div>
                {/*日期选择器*/}
                <Row>
                    <Col span={8}>
                        <CustomRangePicker getResult={this.dateChange.bind(this)}/>
                    </Col>
                </Row>
                {/*媒体选择器*/}
                <SelectorSlotStruct getResult={this.slotTemplateChange.bind(this)}/>
            </div>
        );
    }
}


export default Filter;
