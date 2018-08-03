import React, {Component} from 'react';
import {Chart, Axis, Geom, Tooltip, Legend} from 'bizcharts';
import { View } from '@antv/data-set';
import { connect } from 'react-redux';
import CustomLegend from './Legend';
import {strToPercent} from "../../../../utils/aboutReportUtils.js"
// // 生成假数据
// const y = [];
// for (var i = 1; i <span 20; i++) {
// 	y.push({
// 		"xValue": i,
// 		"income": parseInt(Math.random()*10),
// 		"imp": parseInt(Math.random()*10),
// 		"ctr": parseInt(Math.random()*10),
// 		"clk": parseInt(Math.random()*10),
// 		"ecpm": parseInt(Math.random()*10),
// 		"ecpc": parseInt(Math.random()*10),
// 		"incomeCompare": 5,
// 		"impCompare": 8,
// 		"ctrCompare": i * 6,
// 		"clkCompare": i * 8,
// 		"ecpmCompare": i * 10,
// 		"ecpcCompare": i * 12,
// 	})
// }
//
// const data = y;
//
const LGEGINNAME = ["cost", "media_income", "list_pv", "list_content_ctr", "list_ad_ctr", "detail_pv", "detail_ad_ctr", "goods_ctr", "goods_vol", "payment"];
function comebine(current, compare) {
    // 折线图使用的数据对象
	current.forEach((currentItem) => {
		for (var k in currentItem) {
			if (currentItem[k] == null) {
				currentItem[k] = 0;
			}
            if (k.includes("ctr")) {
                currentItem[k] = strToPercent(currentItem[k]);
            }			
		}
	})
	compare.forEach((currentItem) => {
		for (var k in currentItem) {
			if (currentItem[k] == null) {
				currentItem[k] = 0;
			}
            if (k.includes("ctr")) {
                currentItem[k] = strToPercent(currentItem[k]);
            }
		}
	})
	return current.map((currentItem, index) => {
		currentItem.xValue = currentItem.date;

		LGEGINNAME.forEach((name) => {
			currentItem[name] = parseFloat(currentItem[name])
			currentItem[name+"Compare"] = parseFloat(compare[index][name])
		})
			return currentItem
		})

}
const cols = {
	'xValue': {
		range: [0, 1],
		tickCount: 12
	},
	'cost': {
		alias: "消费",
		range: [0, 0.9],
	},
	'media_income': {
		alias: "媒体收入",
		range: [0, 0.9]
	},
	'list_pv': {
		alias: "列表页PV",
		range: [0, 0.9]
	},
	'list_content_ctr': {
		alias: "列表页内容CTR(%)",
		range: [0, 0.9]
	},
	'list_ad_ctr': {
		alias: "列表页广告CTR(%)",
		range: [0, 0.9]
	},
	'detail_pv': {
		alias: "详情页PV",
		range: [0, 0.9]
	},
	'detail_ad_ctr': {
		alias: "详情页广告CTR(%)",
		range: [0, 0.9]
	},
	'goods_ctr': {
		alias: "商品CTR(%)",
		range: [0, 0.9]
	},
	'goods_vol': {
		alias: "商品成交量",
		range: [0, 0.9]
	},
	'payment': {
		alias: "佣金",
		range: [0, 0.9]
	},
};

/*
需求: 有N个按钮
button1 button2 button3 ...
至少点击1个 至多点击两个 双击切换
哪个按钮命中 就显示哪个按钮对应的曲线
当只有一个按钮的时候 y轴要移动到左边
 */
class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LINECHART: false,
            legend: [],
			data:[],
			dataSource: [],
			geoms: null,
			dv: null,
			AXIS: <div>
				<Axis name="cost"
					// line={{
					// 	stroke: 'red',
					// 	lineWidth: 2
					// }}
					label={{
						textStyle: {
							fill: "rgba(0,153,255,1)",
						},
						autoRotate: false
					}}
					// grid={null}
					title={{
						offset:24,
						position: 'end',
						textStyle:{
							fontSize: '12',
							fill: 'rgba(0,153,255,1)',
							fontWeight: 'bold',
							rotate: 0
						}}}
				/>
				<Axis name="media_income"
					// line={{
					// 	stroke: 'skyblue',
					// 	lineWidth: 2
					// }}
					label={{
						textStyle: {
							fill: "rgba(242,99,120,1)"
						},
						autoRotate: false
					}}
					// grid={null}
					title={{
						offset:24,
						position: 'end',
						textStyle:{
							fontSize: '12',
							fill: 'rgba(242,99,120,1)',
							fontWeight: 'bold',
							rotate: 0
						}}}
				/>
			</div>,
			GEOM: <div>
				<Geom type="line" shape={'line'} position="xValue*cost" size={2} color={['costkey',(value) => {
					if (value == "消费") {
						return 'rgba(0,153,255,1)'
					} else {
						return 'rgba(0,153,255,0.4)'
					}
				}]} />
				{/* <Geom type='point' position="xValue*income" size={1} shape={'circle'} color={'incomekey'} style={{ stroke: '#fff', lineWidth: 1}} /> */}
				<Geom type="line" position="xValue*media_income" size={2} color={['media_incomekey', (value) => {
					if (value == '媒体收入') {
						return 'rgba(242,99,120,1)'
					} else {
						return 'rgba(242,99,120,0.4)'
					}
				}]}/>
				{/* <Geom type='point' position="xValue*imp" size={4} shape={'circle'} color={'impkey'} style={{ stroke: '#fff', lineWidth: 1}} /> */}
			</div>
        };
    }
	componentWillMount() {
		// console.log(this.props.lineChartCurrent)
		// console.log(this.props.lineChartCompare)
		// console.log("假数据",data)
		// console.log("合成数据", comebine(this.props.lineChartCurrent,this.props.lineChartCompare))
		const dataSource = comebine(this.props.lineChartCurrent,this.props.lineChartCompare)
		console.log(dataSource, "xxxxxx")
		const dv = new View().source(dataSource);
		dv.transform({
			type: 'rename',
			map: {
				cost: '消费',
			}
		})
		dv.transform({
			type: 'rename',
			map: {
				costCompare: '消费同期对比',
			}
		})
		dv.transform({
			type: 'rename',
			map: {
				media_income: '媒体收入',
			}
		})
		dv.transform({
			type: 'rename',
			map: {
				media_incomeCompare: '媒体收入同期对比',
			}
		})

		dv.transform({
			type: 'fold',
			fields: ['消费','消费同期对比'], // 展开字段集
			key: 'costkey', // key字段
			value: 'cost', // value字段
		})
		dv.transform({
			type: 'fold',
			fields: ['媒体收入','媒体收入同期对比'],
			key: 'media_incomekey',
			value: 'media_income'
		})

		this.setState({
			dv: dv,
			dataSource: dataSource
		})

	}
	componentWillReceiveProps(nextProps) {
		console.log("数据源",nextProps)
		if (nextProps.lineChartCurrent.length === nextProps.lineChartCompare.length) {
            // 防止别的reducer函数覆盖
			const dataSource = comebine(nextProps.lineChartCurrent,nextProps.lineChartCompare)

			const dv = new View().source(dataSource);
			console.log('+++++++++++++',dataSource)
			console.log('-------------',dv)

			dv.transform({
				type: 'rename',
				map: {
					cost: '消费',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					costCompare: '消费同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					media_incomekey: '媒体收入',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					media_incomekeyCompare: '媒体收入同期对比',
				}
			})

			dv.transform({
				type: 'rename',
				map: {
					list_pv: '列表页PV',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					list_pvCompare: '列表页PV同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					list_content_ctr: '列表页内容CTR',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					list_content_ctrCompare: '列表页内容CTR同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					list_ad_ctr: '列表页广告CTR',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					list_ad_ctrCompare: '列表页广告CTR同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					detail_pv: '详情页PV',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					detail_pvCompare: '详情页PV同期对比',
				}
			})

			dv.transform({
				type: 'rename',
				map: {
					detail_ad_ctr: '详情页广告CTR',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					detail_ad_ctrCompare: '详情页广告CTR同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					goods_ctr: '商品CTR',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					goods_ctrCompare: '商品CTR同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					goods_vol: '商品成交量',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					goods_volCompare: '商品成交量同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					payment: '佣金',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					paymentCompare: '佣金同期对比',
				}
			})
			dv.transform({
				type: 'fold',
				fields: ['消费','消费同期对比'], // 展开字段集
				key: 'costkey', // key字段
				value: 'cost', // value字段
			})
			dv.transform({
				type: 'fold',
				fields: ['媒体收入','媒体收入同期对比'],
				key: 'media_incomekey',
				value: 'media_income'
			})
			dv.transform({
				type: 'fold',
				fields: ['列表页PV','列表页PV同期对比'],
				key: 'list_pvkey',
				value: 'list_pv'
			})
			dv.transform({
				type: 'fold',
				fields: ['列表页内容CTR','列表页内容CTR同期对比'],
				key: 'list_content_ctrkey',
				value: 'list_content_ctr'
			})
			dv.transform({
				type: 'fold',
				fields: ['列表页广告CTR','列表页广告CTR同期对比'],
				key: 'list_ad_ctrkey',
				value: 'list_ad_ctr'
			})
			dv.transform({
				type: 'fold',
				fields: ['详情页PV','详情页PV同期对比'],
				key: 'detail_pvkey',
				value: 'detail_pv'
			})
			dv.transform({
				type: 'fold',
				fields: ['详情页广告CTR','详情页广告CTR同期对比'],
				key: 'detail_ad_ctrkey',
				value: 'detail_ad_ctr'
			})
			dv.transform({
				type: 'fold',
				fields: ['商品CTR','商品CTR同期对比'],
				key: 'goods_ctrkey',
				value: 'goods_ctr'
			})
			dv.transform({
				type: 'fold',
				fields: ['商品成交量','商品成交量同期对比'],
				key: 'goods_volkey',
				value: 'goods_vol'
			})
			dv.transform({
				type: 'fold',
				fields: ['佣金','佣金同期对比'],
				key: 'paymentkey',
				value: 'payment'
			})

			this.setState({
				dv: dv,
				dataSource: dataSource
			})
		} else {
			console.log("waiting!!!!!1")
		}

	}
	componentDidMount() {
        // 此时content绘制完毕(null绘制完毕)
        // 此时再绘制折线图
        // 在bizcharts中给图像复制forceFit都得这么处理
		this.setState({
			LINECHART: true
		})
	}
	legendItemClick(x, activeButtons) {
        // 点击每个legend的时候
        // x为每个legend对应的dataIndex
		this.draw(activeButtons)
	}

	colorMap(x) {
		switch (x) {
			case 'cost':
				return [0,153,255]
			case 'media_income':
				return [242,99,120]
			case 'list_pv':
				return [19,219,173]
			case 'list_content_ctr':
				return [155,125,72]
			case 'list_ad_ctr':
				return [60,115,0]
			case 'detail_pv':
				return [0,146,199]
			case 'detail_ad_ctr':
				return [250,218,141]
			case 'goods_ctr':
				return [182,194,154]
			case 'goods_vol':
				return [220,87,18]
			case 'payment':
				return [29,191,151]
			default:
				return [0,0,0]
		}
	}
	rename(fields) {
        // 输入["income","impCompare"];
        // 得到["收入","收入同期对比"]
		switch (fields[0]) {
			case 'cost':
				return ['消费','消费同期对比']
			case 'media_income':
				return ['媒体收入','媒体收入同期对比']
			case 'list_pv':
				return ['列表页PV','列表页PV同期对比']
			case 'list_content_ctr':
				return ['列表页内容CTR','列表页内容CTR同期对比']
			case 'list_ad_ctr':
				return ['列表页广告CTR','列表页广告CTR同期对比']
			case 'detail_pv':
				return ['详情页PV','详情页PV同期对比']
			case 'detail_ad_ctr':
				return ['详情页广告CTR','详情页广告CTR同期对比']
			case 'goods_ctr':
				return ['商品CTR','商品CTR同期对比']
			case 'goods_vol':
				return ['商品成交量','商品成交量同期对比']
			case 'payment':
				return ['佣金','佣金同期对比']
			default:
				return console.log("error")
		}
	}
	draw(activeButtons) {
		const fieldsArr = activeButtons.map((x) => {
			return [x, x + "Compare"]
		})
		const dv = new View().source(this.state.dataSource);
		fieldsArr.forEach((fields) => {
			let renameFields = this.rename(fields);
			// console.log(renameFields)
			let dvActions = fields.map((fields, index) => {
				let temp = {type: 'rename',map:{}};
				temp.map[fields] = renameFields[index];
				return temp
			})

			dv.transform(dvActions[0])
			dv.transform(dvActions[1])
			// console.log(dvActions)
			dv.transform({
				type: 'fold',
				fields: renameFields,
				key: fields[0] + "key",
				value: fields[0]
			})
		})

		const Axises = activeButtons.map((x) => {
            // 根据不同的字段 y轴所带的单位不同
			var color = "red";
			switch (x) {
				case 'cost':
					color =  "rgb(0,153,255)";
					break;
				case 'media_income':
					color =  "rgb(242,99,120)";
					break;
				case 'list_pv':
					color =  "rgb(19,219,173)";
					break;
				case 'list_content_ctr':
					color =  "rgb(155,125,72)";
					break;
				case 'list_ad_ctr':
					color =  "rgb(60,115,0)";
					break;
				case 'detail_pv':
					color =  "rgb(0,146,199)";
					break;
				case 'detail_ad_ctr':
					color =  "rgb(250,218,141)";
					break;
				case 'goods_ctr':
					color =  "rgb(182,194,154)";
					break;
				case 'goods_vol':
					color =  "rgb(220,87,18)";
					break;
				case 'payment':
					color =  "rgb(29,191,151)";
					break;
				default:
					unit = 'rgb(0,0,0)';
			}
			return <Axis name={x}
				key={x}
				// line={{
				// 	stroke: color,
				// 	lineWidth: 2
				// }}
				label={{
					textStyle: {
						fill: color
					},
					autoRotate: false,
				}}
				// grid={null}
				title={{
					offset:24,
					position: 'end',
					textStyle:{
						fontSize: '12',
						fill: color,
						fontWeight: 'bold',
						rotate: 0
					}}}
				   />
		})
		const Geoms = activeButtons.map((x) => {
			var arr = this.colorMap(x);
			return <div key={x}>
				<Geom type="line" position={`xValue*${x}`} size={2} color={[x + "key", (value) => {
					if (value.indexOf("同期对比") == -1) {
                        // 正常
                        return `rgba(${arr[0]},${arr[1]},${arr[2]},1)`
					} else {
                        // 浅色
						return `rgba(${arr[0]},${arr[1]},${arr[2]},0.4)`
					}
				}]} />
				{/* <Geom type='point' position={`xValue*${x}`} size={4} shape={'circle'} color={x + "key"} style={{ stroke: '#fff', lineWidth: 1}} /> */}
			</div>
		})

		this.setState({
			dv: dv,
			AXIS: <div>{Axises}</div>,
			GEOM: <div>{Geoms}</div>
		})
	}
    render() {

        // 折线图组件
		const CHART =
		<Chart
			height={500}
			data={this.state.dv}
			scale={cols}
			padding={[80, 'auto', 100, 'auto']}
			forceFit
			// plotBackground={{fill: 'yellow'}}
			background={
				{
					// fill: "#F6F6F6",
					// stroke: "black"
				}
			}
		>
			<Tooltip
				crosshairs={{
					type:'y',
					style: {
						lineWidth: 0.5,
						stroke: "rgb(0,191,255)"
					}

				}}
				containerTpl='<div class="g2-tooltip">
				<div class="g2-tooltip-title"></div>
				<div class="g2-tooltip-list">
				</div>
				</div>'
				itemTpl='<div class="g2-tooltip-list-item" style="border:1px solid white;overflow:hidden;padding:4px;">
				<div style="color:{color};float: left;font-size:14px;padding: 0 10px 0 0">❤&nbsp;&nbsp;{name}</div>
				<div style="color:{color};float: right;font-size:14px;padding: 0 0 10px 0">{value}</div>
				</div>'
				offset={50}
				g2-tooltip={{
					position: 'absolute',
					visibility: 'hidden',
					border : '1px solid rgba(51,51,51,0.3)',
					backgroundColor: 'white',
					color: 'silver',
					opacity: "1",
					textAlign:"center",
					// padding: '5px 15px',
					'transition': 'top 200ms,left 200ms'
				}}
				g2-tooltip-list={{
					margin: '10px'
				}}
			/>
			<Legend />
			<Axis name="xValue"
				// tickLine={null}
				label={{
					textStyle: {
						fill: "#adadad",
						 rotate: 10,
					},
					autoRotate: true
				}}
			/>

			{this.state.AXIS}
			{this.state.GEOM}
		</Chart>;

        /*
        	占位组件
			为了使得bizcharts画出来的折线图组件的宽度自适应
			需要在content组件绘制的时候先绘制null 等待content组件绘制完毕(null绘制完毕) 再绘制折线图组件
         */
		const LINECHART = !this.state.LINECHART ? null: CHART;

        return (
			<div style={{position: 'relative'}}>
				<CustomLegend handleClick={this.legendItemClick.bind(this)} />
				{LINECHART}
			</div>
        );
    }
};
const mapStateToProps = (state) => {
	return {
		lineChartCurrent: state.contentDashboardReducers.chart.data[0],
		lineChartCompare: state.contentDashboardReducers.chart.data[1]
	}
}
export default connect(
	mapStateToProps
)(LineChart);
