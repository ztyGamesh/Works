import React, {Component} from 'react';
import {Chart, Axis, Geom, Tooltip, Legend} from 'bizcharts';
import { View } from '@antv/data-set';
import { connect } from 'react-redux';
import CustomLegend from './Legend';
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
const legendInfos = [{
	fields: "income"
},{
	fields: "imp"
},{
	fields: "clk"
},{
	fields: "ctr"
},{
	fields: "ecpc"
},{
	fields: "ecpm"
}]
function comebine(current, compare) {
    // 折线图使用的数据对象
	const flag = current[0].date === current[1].date ? "day" : "period";
	current.forEach((currentItem) => {
		for (var k in currentItem) {
			if (currentItem[k] == null) {
				currentItem[k] = 0;
			}
		}
	})
	compare.forEach((currentItem) => {
		for (var k in currentItem) {
			if (currentItem[k] == null) {
				currentItem[k] = 0;
			}
		}
	})
	if (flag === "day") {
		// 如果是某一天的数据curren&compare
		return current.map((currentItem, index) => {
			currentItem.xValue = currentItem.period;
			currentItem.income = parseFloat(currentItem.income);
			currentItem.imp = parseInt(currentItem.imp);
			currentItem.ctr = parseFloat(currentItem.ctr);
			currentItem.clk = parseInt(currentItem.clk);
			currentItem.ecpm = parseFloat(currentItem.ecpm);
			currentItem.ecpc = parseFloat(currentItem.ecpc);


			currentItem.incomeCompare = parseFloat(compare[index].income);
			currentItem.impCompare = parseInt(compare[index].imp);
            // 点击率
			currentItem.ctrCompare = parseFloat(compare[index].ctr);
            // 点击量
			currentItem.clkCompare = parseInt(compare[index].clk);
			currentItem.ecpmCompare = parseFloat(compare[index].ecpm);
			currentItem.ecpcCompare = parseFloat(compare[index].ecpc);
			return currentItem
		})
	}
    else if (flag === "period") {
		// 如果是某段时间的数据current&compare
		// 如果是某一天的数据curren&compare
		return current.map((currentItem, index) => {
			currentItem.xValue = currentItem.date;
			currentItem.income = parseFloat(currentItem.income);
			currentItem.imp = parseInt(currentItem.imp);
			currentItem.ctr = parseFloat(currentItem.ctr);
			currentItem.clk = parseInt(currentItem.clk)
			currentItem.ecpm = parseFloat(currentItem.ecpm)
			currentItem.ecpc = parseFloat(currentItem.ecpc)


			currentItem.incomeCompare = parseFloat(compare[index].income);
			currentItem.impCompare = parseInt(compare[index].imp);
            // 点击率
			currentItem.ctrCompare = parseFloat(compare[index].ctr);
            // 点击量
			currentItem.clkCompare = parseInt(compare[index].clk);
			currentItem.ecpmCompare = parseFloat(compare[index].ecpm);
			currentItem.ecpcCompare = parseFloat(compare[index].ecpc);
			return currentItem
		})
	}

}
const cols = {
	'xValue': {
		range: [0, 1],
		tickCount: 12
	},
	'income': {
		alias: "花费(元)",
		range: [0, 0.9],
	},
	'imp': {
		alias: "曝光量",
		range: [0, 0.9]
	},
	'ctr': {
		alias: "点击率(%)",
		range: [0, 0.9]
	},
	'clk': {
		alias: "点击量",
		range: [0, 0.9]
	},
	'ecpm': {
		alias: "eCPM(元)",
		range: [0, 0.9]
	},
	'ecpc': {
		alias: "CPC(元)",
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
				<Axis name="income"
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
				<Axis name="imp"
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
				<Geom type="line" shape={'line'} position="xValue*income" size={2} color={['incomekey',(value) => {
					if (value == "花费") {
						return 'rgba(0,153,255,1)'
					} else {
						return 'rgba(0,153,255,0.4)'
					}
				}]} />
				{/* <Geom type='point' position="xValue*income" size={1} shape={'circle'} color={'incomekey'} style={{ stroke: '#fff', lineWidth: 1}} /> */}
				<Geom type="line" position="xValue*imp" size={2} color={['impkey', (value) => {
					if (value == '曝光量') {
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
		console.log(dataSource)
		const dv = new View().source(dataSource);
		dv.transform({
			type: 'rename',
			map: {
				income: '花费',
			}
		})
		dv.transform({
			type: 'rename',
			map: {
				incomeCompare: '花费同期对比',
			}
		})
		dv.transform({
			type: 'rename',
			map: {
				imp: '曝光量',
			}
		})
		dv.transform({
			type: 'rename',
			map: {
				impCompare: '曝光量同期对比',
			}
		})

		dv.transform({
			type: 'fold',
			fields: ['花费','花费同期对比'], // 展开字段集
			key: 'incomekey', // key字段
			value: 'income', // value字段
		})
		dv.transform({
			type: 'fold',
			fields: ['曝光量','曝光量同期对比'],
			key: 'impkey',
			value: 'imp'
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
					income: '花费',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					incomeCompare: '花费同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					imp: '曝光量',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					impCompare: '曝光量同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					clk: '点击量',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					clkCompare: '点击量同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					ctr: '点击率',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					ctrCompare: '点击率同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					ecpm: 'eCPM',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					ecpmCompare: 'eCPM同期对比',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					ecpc: 'CPC',
				}
			})
			dv.transform({
				type: 'rename',
				map: {
					ecpcCompare: 'CPC同期对比',
				}
			})

			dv.transform({
				type: 'fold',
				fields: ['花费','花费同期对比'], // 展开字段集
				key: 'incomekey', // key字段
				value: 'income', // value字段
			})
			dv.transform({
				type: 'fold',
				fields: ['曝光量','曝光量同期对比'],
				key: 'impkey',
				value: 'imp'
			})
			dv.transform({
				type: 'fold',
				fields: ['点击量','点击量同期对比'],
				key: 'clkkey',
				value: 'clk'
			})
			dv.transform({
				type: 'fold',
				fields: ['点击率','点击率同期对比'],
				key: 'ctrkey',
				value: 'ctr'
			})
			dv.transform({
				type: 'fold',
				fields: ['eCPM','eCPM同期对比'],
				key: 'ecpmkey',
				value: 'ecpm'
			})
			dv.transform({
				type: 'fold',
				fields: ['CPC','CPC同期对比'],
				key: 'ecpckey',
				value: 'ecpc'
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
			case 'income':
				return [0,153,255]
			case 'imp':
				return [242,99,120]
			case 'clk':
				return [19,219,173]
			case 'ctr':
				return [155,125,72]
			case 'ecpm':
				return [60,115,0]
			case 'ecpc':
				return [0,146,199]
			default:
				return [0,0,0]
		}
	}
	rename(fields) {
        // 输入["income","impCompare"];
        // 得到["收入","收入同期对比"]
		switch (fields[0]) {
			case 'income':
				return ["花费","花费同期对比"]
			case 'imp':
				return ["曝光量","曝光量同期对比"]
			case 'clk':
				return ["点击量","点击量同期对比"]
			case 'ctr':
				return ["点击率","点击率同期对比"]
			case 'ecpm':
				return ["eCPM","eCPM同期对比"]
			case 'ecpc':
				return ["CPC","CPC同期对比"]
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
				case 'income':
					color = "rgb(0,153,255)";
					break;
				case 'imp':
					color = 'rgb(242,99,120)';
					break;
				case 'clk':
					color = 'rgb(19,219,173)';
					break;
				case 'ctr':
					color = 'rgb(155,125,72)';
					break;
				case 'ecpm':
					color = 'rgb(60,115,0)';
					break;
				case 'ecpc':
					color = 'rgb(0,146,199)';
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
		lineChartCurrent: state.clientDashboardReducers.lineChart.current,
		lineChartCompare: state.clientDashboardReducers.lineChart.compare
	}
}
export default connect(
	mapStateToProps
)(LineChart);
