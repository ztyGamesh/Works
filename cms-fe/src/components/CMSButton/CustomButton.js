import React, { Component } from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';

class CustomButton extends Component {
    render() {
        return (
            <Button
                onClick={this.props.handleButtonClick}
                type="primary"
            >{this.props.buttonName}</Button>
        );
    }
}

CustomButton.PropTypes = {
    buttonName: PropTypes.string,
    handleButtonClick: PropTypes.func
}

CustomButton.defaultProps = {
    buttonName: '按钮名称',
    handleButtonClick: () => {
        console.log('点击按钮执行的事件')
    }

}

export default CustomButton;
