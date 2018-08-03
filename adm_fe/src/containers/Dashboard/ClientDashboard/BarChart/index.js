import React, {Component} from 'react';
import {Chart, Axis, Geom, Tooltip, Legend} from 'bizcharts';

const data = [
	{
		xValue: '暂无数据',
		yValue: ' '
	}
];

const cols = {
	'yValue': {
		// tickInterval: 20
	}
};

class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			BARCHART: false,
			data: []
		};
	}

	componentWillMount() {
		this.setState({
			data: this.props.data || []
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data || []
		})
	}

	componentDidMount() {
		this.setState({
			BARCHART: true
		})
	}
    render() {
		const chart = <Chart height={200} data={this.state.data.length === 0 ? data : this.state.data} scale={cols} forceFit padding={[20,'auto',40,'auto']}>
			<Axis name="xValue" />
			<Axis name="yValue" />
			{/* <Tooltip crosshairs={{type : "y"}}/> */}
			<Tooltip
				containerTpl='<div class="g2-tooltip"><p class="g2-tooltip-title"></p><table class="g2-tooltip-list"></table></div>'
				itemTpl='<tr class="g2-tooltip-list-item"><td style="color:{color}">值:</td><td>{value}</td></tr>'
				offset={50}
				g2-tooltip={{
					position: 'absolute',
					visibility: 'hidden',
					border : '1px solid #efefef',
					backgroundColor: 'white',
					color: '#000',
					opacity: "0.8",
					padding: '5px 15px',
					'transition': 'top 200ms,left 200ms'
				}}
				g2-tooltip-list={{
					margin: '10px'
				}}
			/>
			<Geom type="interval" position="xValue*yValue" />
		</Chart>
        return (
            <div>
				{!this.state.BARCHART ? null : chart}
            </div>
        );
    }
}

export default BarChart;
