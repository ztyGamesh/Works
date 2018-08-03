/**
 * 关键字组件（只读）
 */
import React, {Component} from 'react';
import {Alert, Button} from 'antd';
import propTypes from 'prop-types';

class ReadMachineTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '未选择关键词',
        };
    }

    getMachineTag() {
        const machineTag = this.props.machineTag;
        return !machineTag ? '未选择关键词' :
            machineTag.split(',').map((item, index) =>
                <Button type="dashed" key={index}>{item}</Button>
            );
    }

    render() {
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Alert message="当前关键词" type="info" showIcon description={this.getMachineTag.bind(this)()}/>
                </div>
            </div>
        );
    }
}

ReadMachineTag.propTypes = {
    machineTag: propTypes.string,
}
export default ReadMachineTag;
