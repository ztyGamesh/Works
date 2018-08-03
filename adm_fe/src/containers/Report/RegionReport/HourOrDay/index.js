import React, { Component } from 'react';
import moment from 'moment';
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import {connect} from 'react-redux';
function todaySubtract(x) {
    return moment().subtract(x, 'days');
}

function sameDay(dayA, dayB, dimensions) {
    let result = dimensions.map((dimension) => {
        if (dayA[dimension]() === dayB[dimension]()) {
            return true
        } else {
            return false
        }
    })
    let answer = true;
    for (var i = 0; i < result.length; i++) {
        answer = answer && result[i];
    }
    return answer;
}

class HourOrDay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "a"
        };
    }

    componentWillReceiveProps(nextProps) {
        let value = nextProps.deltaTime === 0 ? "a" : "b";
        this.setState({
            value: value
        })
    }
    onChange(e) {

        let {currentTime} = this.props;
        const dimensions = ["year", "month", "date"];
        let flag = sameDay(currentTime[0],todaySubtract(0), dimensions);
        // 如果当前时间是一天 才能够分日
        if (flag) {
            this.setState({
                value: "a"
            }, () => {
                this.props.getDayOrHour(this.state.value,this.props.allTime)
            })
        } else if (this.props.deltaTime !== 0){
            this.setState({
                value: "b"
            }, () => {
                this.props.getDayOrHour(this.state.value,this.props.allTime)
            })
        } else {
            this.setState({
                value: e.target.value
            }, () => {
                this.props.getDayOrHour(this.state.value,this.props.allTime)
            })
        }
        // console.log(e.target.value)
        // this.props.getDayOrHour(e.target.value,this.props.allTime)

    }
    render() {
        return (
            <div>
                <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
                    <RadioButton value="a">分时</RadioButton>
                    <RadioButton value="b">分日</RadioButton>
                </RadioGroup>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		deltaTime:  state.keywordReportReducers.deltaTime
	}
}
export default connect(mapStateToProps)(HourOrDay)
