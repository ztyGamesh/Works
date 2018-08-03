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
                <Select defaultValue="media" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                    <Option value="date">日期</Option>
                    <Option value="media">媒体</Option>
                </Select>
            </div>
        );
    }
}

export default Toggle;
