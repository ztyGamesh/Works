import React, {Component} from 'react';
import {Radio, Alert} from 'antd';
import propTypes from 'prop-types';

const RadioGroup = Radio.Group;

class Score extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 100,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.score)
        this.setState({
            value: nextProps.score || "100"
        })
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
        this.props.fetchScore(e.target.value)
    }

    render() {
        return (
            <div>
                <Alert message="推荐评级" type="info" showIcon description="请评级"/>
                <RadioGroup onChange={this.handleChange.bind(this)} value={this.state.value}>
                    <Radio value={100}>S</Radio>
                    <Radio value={75}>A</Radio>
                    <Radio value={50}>B</Radio>
                    <Radio value={25}>C</Radio>
                </RadioGroup>
            </div>
        );
    }
}

Score.propTypes = {
    fetchScore: propTypes.func,
    score: propTypes.number
};
export default Score;
