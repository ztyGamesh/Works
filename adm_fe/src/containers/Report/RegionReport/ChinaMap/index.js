import React, {Component} from 'react';
import {connect} from 'react-redux';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import 'echarts/map/js/china.js';
class ChinaMap extends Component {

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
		console.log("zty", nextProps.province,nextProps.target)
		this.setState({
			source: nextProps.province,
			target: nextProps.target
		}, () => {
			this.draw()
		})
	}
	componentDidMount() {
		this.draw();
	}

	draw() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('demo'));
		// 绘制图表
		var name_title = "省级地域分布";
		var subname = '';
		var nameColor = "rgb(55, 75, 113)";
		var name_fontFamily = '等线';
		var subname_fontSize = 15;
		var name_fontSize = 18;
		var mapName = 'china';
		var target = this.state.target;
		// 源数据
		// var source = [
		// 	{province_name: "上海", target: "61944200", occupy: "0.49"},
		// 	{province_name: "北京", target: "59268300", occupy: "0.47"},
		// 	{province_name: "浙江", target: "2430804", occupy: "0.02"},
		// 	{province_name: "广东", target: "1807810", occupy: "0.01"},
		// 	{province_name: "山东", target: "1117610000", occupy: "0.01"},
		// ]
		var provinces = [
			{
				name: "北京",
			},
			{
				name: "天津",
			}, {
				name: "河北",
			}, {
				name: "山西",
			}, {
				name: "内蒙古",
			}, {
				name: "辽宁",
			}, {
				name: "吉林",
			}, {
				name: "黑龙江",
			}, {
				name: "上海",
			}, {
				name: "江苏",
			}, {
				name: "浙江",
			}, {
				name: "安徽",
			}, {
				name: "福建",
			}, {
				name: "江西",
			}, {
				name: "山东",
			}, {
				name: "河南",
			}, {
				name: "湖北",
			}, {
				name: "湖南",
			}, {
				name: "重庆",
			}, {
				name: "四川",
			}, {
				name: "贵州",
			}, {
				name: "云南",
			}, {
				name: "西藏",
			}, {
				name: "陕西",
			}, {
				name: "甘肃",
			}, {
				name: "青海",
			}, {
				name: "宁夏",
			}, {
				name: "新疆",
			}, {
				name: "广东",
			}, {
				name: "广西",
			},
			{
				name: "海南",
			},
			{
				name: "台湾",
			},
			{
				name: "南海诸岛",
			}
		];
		var source = this.state.source.length !== 0
		? this.state.source
		: provinces.map((model) => {
			return {
				name: model.name,
				value: 0
			}
		})
		;
		// 结果数据
		var data = provinces.map((model) => {
			var value;
			for (var i = 0; i < source.length; i++) {
				if (source[i].province_name === model.name) {
					value = parseInt(source[i].target);
					break;
				}
					value = 0;
			}
			return {
				name: model.name,
				value: value
			}
		})
		var toolTipData = provinces.map((model) => {
			var value;
			var occupy;
			for (var i = 0; i < source.length; i++) {
				if (source[i].province_name === model.name) {
					value = parseInt(source[i].target);
					occupy = source[i].occupy;
					break;
				}
					value = 0;
					occupy = "-"
			}
			return {
				name: model.name,
				value: [
					{
						"name": target,
						"value": value
					},
					{
						"name": "占比",
						"value": occupy
					}
				]
			}
		})
		var geoCoordMap = {};


		/* 获取地图数据 */
		myChart.showLoading();
		var mapFeatures = echarts.getMap(mapName).geoJson.features;

		myChart.hideLoading();
		mapFeatures.forEach(function(v) {
			// 地区名称
			var name = v.properties.name;
			// 地区经纬度
			geoCoordMap[name] = v.properties.cp;

		});

		// console.log("============geoCoordMap===================")
		// console.log(geoCoordMap)
		// console.log("================data======================")
		// console.log(data)
		// console.log(toolTipData)
		var max = 480,
			min = 9; // todo
		var maxSize4Pin = 100,
			minSize4Pin = 20;

		function convertData(data) {
			let res = [];
			for (var i = 0; i < data.length; i++) {
				let geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value)
					});
				}
			}
			return res;
		};
		var option = {
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
			// 提示框组件
			tooltip: {
				trigger: 'item',
				formatter: function(params) {
					if (typeof(params.value)[2] == "undefined") {
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
					} else {
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
				}
			},
			// 视觉映射组件，也就是将数据映射到视觉元素
			visualMap: {
				// 先隐藏
				show: false,
				min: 0,
				max: 150,
				left: 'left',
				top: 'bottom',
				text: [
					'高', '低'
				], // 文本，默认为数值文本
				calculable: true,
				seriesIndex: [1],
				inRange: {
					// color: ['#FFFFFF', '#FF2525'] // 白红
					// color: ['#eee', '#a6c1ee'] // 黑绿
					color: ['#eee', '#DC143C'] //
				}
			},
			// 地理坐标系组件
			geo: {
				show: true,
				map: mapName,
				label: {
					normal: {
						show: false
					},
					emphasis: {
						show: false
					}
				},
				roam: false,
				itemStyle: {
					normal: {
						areaColor: '#031525',
						borderColor: '#3B5077'
					},
					emphasis: {
						areaColor: 'orange'
					}
				}
			},
			// 系列列表 每个系列通过type决定自己的图标类型
			series: [
				{
					name: '散点',
					type: 'scatter',
					coordinateSystem: 'geo',
					data: convertData(data),
					symbolSize: function(val) {
						// return val[2] / 10;
						return 5;
					},
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: true
						},
						emphasis: {
							show: true
						}
					},
					itemStyle: {
						normal: {
							// color: '#05C3F9'
							color: '#00467F'
							// color: "#0093E9"
						}
					}
				}, {
					type: 'map',
					map: mapName,
					geoIndex: 0,
					aspectScale: 0.75, //长宽比
					showLegendSymbol: false, // 存在legend时显示
					label: {
						normal: {
							show: true
						},
						emphasis: {
							show: false,
							textStyle: {
								color: '#fff'
							}
						}
					},
					roam: true,
					itemStyle: {
						normal: {
							areaColor: 'white',
							borderColor: '#3B5077'
						},
						emphasis: {
							areaColor: '#2B91B7'
						}
					},
					animation: false,
					data: data
				}, {
					name: '点',
					type: 'scatter',
					coordinateSystem: 'geo',
					symbol: 'pin', //气泡
					symbolSize: function(val) {
						if (val[2] == 0) {
							// 如果数据为0， 地图上就不显示气泡
							return 0
						}
						var a = (maxSize4Pin - minSize4Pin) / (max - min);
						var b = minSize4Pin - a * min;
						b = maxSize4Pin - a * max;
						// return a * val[2] + b;
						return 0
					},
					label: {
						normal: {
							show: true,
							// 跟官网的差别 需要添加这行代码
							// 气泡里面的字
							formatter: '{@value}',
							textStyle: {
								color: 'black',
								fontSize: 9
							}
						}
					},
					itemStyle: {
						normal: {
							color: '#F62157', //标志颜色
						}
					},
					zlevel: 6,
					data: convertData(data)
				}, {
					name: 'Top x',
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: convertData(data.sort(function(a, b) {
						return b.value - a.value;
						// slice(0,n)代表取前几 目前不需要这个功能 n为0
					}).slice(0, 1)),
					symbolSize: function(val) {
						// return val[2] / 10;
						if (val[2] !== 0) {
							return 10;
						} else {
							return 0
						}

					},
					showEffectOn: 'render',
					rippleEffect: {
						brushType: 'stroke'
					},
					hoverAnimation: true,
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: false
						}
					},
					itemStyle: {
						normal: {
							color: 'yellow',
							shadowBlur: 10,
							shadowColor: 'yellow'
						}
					},
					zlevel: 1
				}
			]
		};
		myChart.setOption(option);
	}
	render() {
		return (
			<div id="demo" style={{
				height: 600
			}}></div>);
	}
}

const mapStateToProps = (state) => {
	return {
		province: state.regionReportReducers.current.province
	}
}
export default connect(mapStateToProps)(ChinaMap);
