import {Select} from 'antd';
const Option = Select.Option;
import React, { Component } from 'react';

class Toggle extends Component {

    handleChange(value) {
        if (this.props.getResult) {
            this.props.getResult(value);
        }
    }

    render() {
        return (
            <div>
                <Select defaultValue="province" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                    <Option value="province">省级数据</Option>
                    <Option value="city">市级数据</Option>
                </Select>
            </div>
        );
    }
}

export default Toggle;
