import React, { Component } from 'react';
import CustomRangePicker from '../CustomRangePicker';
import SelectorSlotClass from '../SelectorSlotClass';
import SelectorSlotStruct from '../SelectorSlotStruct';
import { Row, Col, Menu, Dropdown, Button, Icon, message} from 'antd';

class Filter extends Component {

    dateChange(dates,dateString) {
        // console.log("dateChange",dateString)
        this.props.getResult('date', dateString)
    }

    slotChange(slot) {
        if (slot == "") {
            this.props.getResult('slot', "");
        } else {
            this.props.getResult('slot', slot);
        }
    }
    slotClassChange(slotClass) {
        if (slotClass == "") {
            this.props.getResult('slot_class', "");
        } else {
            this.props.getResult('slot_class', slotClass);
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
                <Row>
                    <Col span={12}>
                        <SelectorSlotClass getResult={this.slotClassChange.bind(this)}/>
                    </Col>
                    <Col span={12}>
                        <SelectorSlotStruct getResult={this.slotChange.bind(this)}/>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default Filter;
