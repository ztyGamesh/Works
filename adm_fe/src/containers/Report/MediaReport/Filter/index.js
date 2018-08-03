import React, { Component } from 'react';
import CustomRangePicker from '../CustomRangePicker';
import Selector from '../Selector';
import { Row, Col, Menu, Dropdown, Button, Icon, message} from 'antd';

class Filter extends Component {

    dateChange(dates,dateString) {
        // console.log("dateChange",dateString)
        this.props.getResult('date', dateString)
    }
    mediaChange(media) {
        if (media == "") {
            this.props.getResult('media', "")
        } else {
            this.props.getResult('media', media)
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
                <Selector getResult={this.mediaChange.bind(this)}/>
            </div>
        );
    }
}

export default Filter;
