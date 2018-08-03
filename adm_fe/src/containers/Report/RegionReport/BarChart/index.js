import React, {Component} from 'react';
import {connect} from 'react-redux';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';




class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: [],
			target: "imp"
		};
	}
	componentWillMount() {
		console.log("zty", this.props.province)
		this.setState({
			source: this.props.province
		})
	}
	componentWillReceiveProps(nextProps) {
		console.log("zty", nextProps.city,nextProps.target)
		this.setState({
			source: nextProps.city,
			target: nextProps.target
		}, () => {
			this.draw()
		})
	}
	componentDidMount() {
		this.draw();
	}

	draw() {
		var source = this.state.source || [];
		var myChart = echarts.init(document.getElementById('barchart'));
		var name_title = "地级市分布";
		var subname = '';
		var nameColor = "rgb(55, 75, 113)";
		var name_fontFamily = '等线';
		var subname_fontSize = 15;
		var name_fontSize = 18;
		var target = this.state.target;
		var xValue = source.map((model) => {
			return model.city_name;
		})
		var yValue = source.map((model) => {
			return parseInt(model.target);
		})
		var toolTipData = source.map((model) => {
			return {
				name: model.city_name,
				value: [
					{
						"name": target,
						"value": parseInt(model.target)
					},
					{
						"name": "占比",
						"value": model.occupy
					}
				]
			}
		})
		var option = {
			backgroundColor: 'white',
			// 标题组件
			title: {
				text: name_title,
				subtext: subname,
				x: 'center',
				textStyle: {
					color: nameColor,
					fontFamily: name_fontFamily,
					fontSize: name_fontSize
				},
				subtextStyle: {
					fontSize: subname_fontSize,
					fontFamily: name_fontFamily
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			tooltip:{
				show: true,
				trigger: 'item',
				formatter: function(params) {
					var toolTiphtml = ''
					for (var i = 0; i < toolTipData.length; i++) {
						if (params.name == toolTipData[i].name) {
							toolTiphtml += toolTipData[i].name + ':<br>'
							for (var j = 0; j < toolTipData[i].value.length; j++) {
								toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
							}
						}
					}
					return toolTiphtml;
				}
			},
			xAxis: [
				{
					type: 'category',
					data: xValue,
					axisLine: {
						show: true,
						lineStyle: {
							color: "#063374",
							width: 1,
							type: "solid"
						}
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: true,
						textStyle: {
							color: "#00c7ff"
						}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					axisLabel: {
						formatter: '{value}'
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: "#00c7ff",
							width: 1,
							type: "solid"
						}
					},
					axisTick: {
						show: false
					},
					splitLine: {
						lineStyle: {
							color: "#eee"
						}
					}
				}
			],
			series: [
				{
					type: 'bar',
					data: yValue,
					//barWidth: 50, 柱子宽度
					//barGap: 1, 柱子之间间距
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: '#0093E9'
									// color: '#00fcae'
								}, {
									offset: 1,
									color: '#80D0C7'
									// color: '#006388'
								}
							]),
							opacity: 1
						}
					}
				}
			]
		};
		myChart.setOption(option);
	}
	render() {
		return (
            <div id="barchart" style={{
                height: 400,
            }}></div>
        )
	}
}


const mapStateToProps = (state) => {
	return {
		city: state.regionReportReducers.current.city
	}
}
export default connect(mapStateToProps)(BarChart);
