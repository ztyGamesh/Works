import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

/*
CustomRangePicker组件可以接受
1. 名为getResult的函数，外部如果需要获取每一次操作该组件后的时间结果，则将处理函数传给getResult即可。
    函数接受的两个参数为(dates, dateString)
    dates: [Moment, Moment] 两个日期对象
    dateString: ["2018-05-01", "2018-05-03"]
 */


/*
    计算moment格式下的日期
    传参为 number
    意义为 距离当下的日期减去接受的数值
    例如 TodaySubtract(1)代表昨天 TodaySubtract(7)代表7天前

 */
function todaySubtract(x) {
    return moment().subtract(x, 'days');
}

function monthSutract(x) {
    return moment().subtract(x, 'months');
}

export default class CustomRangePicker extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            // 代表默认时间 默认时间是昨天
    		value: [todaySubtract(1), todaySubtract(1)]
    	};
    }

    dateChange (dates, dateString) {
        // 如果存才获取数据的函数，则将操作后的时间对象返回给getResult函数
        if (this.props.getResult) {
            this.props.getResult(dates, dateString)
        }
    	this.setState({
    		value: dates
    	})
    }

    render() {
        return (
            <div>
                <RangePicker
                    style={{width:"80%"}}
                    defaultValue={[todaySubtract(1), todaySubtract(1)]}
                    onChange={this.dateChange.bind(this)}
                    // value={this.state.value}
                    allowClear={false}
                    ranges={
                        {
                            "昨天":[todaySubtract(1),todaySubtract(1)],
                            "过去7天": [todaySubtract(7),todaySubtract(1)],
                            "过去14天": [todaySubtract(14),todaySubtract(1)],
                            "过去21天": [todaySubtract(21),todaySubtract(1)],
                            "过去30天": [todaySubtract(30),todaySubtract(1)],
                            "上个月": [
                            moment().subtract(1,"month").subtract(moment().date() - 1,'days'),
                            moment().subtract(moment().date(), 'days')]
                        }
                    }
                    disabledDate={(current) => {
                        return current > moment().subtract(1, 'days').endOf("day")
                    }}
                />
            </div>
        );
    }
};
