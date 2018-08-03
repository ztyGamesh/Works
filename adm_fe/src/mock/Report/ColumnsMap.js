import React, { Component } from 'react';
import {strToPercent} from '../../utils/aboutReportUtils';
import {Divider, message} from 'antd';

import {appendWords} from '../../views/Report//SearchReport/flow/SearchReportActions.js'
const noData = "-";
/*
1.媒体数据报表: 日期的columns
 */
const columnsDate = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	}, {
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (index === 0) {
				if (typeof text == "object") {
					// 一段日期
					return <div>
						<span>{text[0]}</span>
						<br/>
						<span>{text[1]}</span>
					</div>
				} else {
					// 某一天
					return text
				}

			} else {
				return text
			}
		}
	}, {
		title: '曝光量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			return text == null ?  noData :strToPercent(parseFloat(text))
		}
	}, {
		title: '收入(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPM(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPC(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}
]

/*
2.数据报表: 媒体的columns
 */
const columnsMedia = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	}, {
		title: '媒体',
		dataIndex: 'media_name'
	}, {
		title: '曝光量',
		dataIndex: 'imp',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
		// sorter: (a, b) => a.age - b.age,
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
		// sorter: (a, b) => a.address.length - b.address.length,
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			return text == null ? noData : strToPercent(parseFloat(text))
		}
	}, {
		title: '收入(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPM(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPC(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}
]
/*
3.数据报表: 广告位的columns
 */
const columnsSlot = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	}, {
		title: '广告位',
		dataIndex: 'slot_name',
	}, {
		title: '广告位类型',
		dataIndex: 'slot_class_name'
	}, {
		title: '所属媒体',
		dataIndex: 'media_name'
	}, {
		title: '曝光量',
		dataIndex: 'imp',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
		// sorter: (a, b) => a.age - b.age,
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
		// sorter: (a, b) => a.address.length - b.address.length,
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			return text == null ? noData : strToPercent(parseFloat(text))
		}
	}, {
		title: '收入(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPM(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPC(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}
]
/*
4.数据报表: 样式的columns
 */
const columnsTemplate = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	}, {
		title: '样式',
		dataIndex: 'template_name'
	}, {
		title: '广告位',
		dataIndex: 'slot_name'
	}, {
		title: '广告位类型',
		dataIndex: 'slot_class_name'
	}, {
		title: '所属媒体',
		dataIndex: 'media_name'
	}, {
		title: '曝光量',
		dataIndex: 'imp',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
		// sorter: (a, b) => a.age - b.age,
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
		// sorter: (a, b) => a.address.length - b.address.length,
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			return text == null ? noData : strToPercent(parseFloat(text))
		}
	}, {
		title: '收入(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPM(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}, {
		title: 'eCPC(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			return text == null ? noData : text
		}
	}
]

// 广告主报表:样式的columns
const columnsClient = [
	{
		title: '',
		dataIndex: 'uid',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			} else {
				return " "
			}
		}
	}, {
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			console.log(text)
			if (index === 0 && text) {
				//单日
				if (text.length == 1) {
					return text[0]
				}
				//多日
				if (text.length == 2 && typeof text[0] == "string") {
					return <div>
						<span>{text[0]}</span> ~ <span>{text[1]}</span>
					</div>
				}
				//单日对比
				if (text.length == 2 && text[0].length == 1) {
					return <div>
						<span>{text[0][0]}</span>
						<br/>
						<span>{text[1][0]}</span>
					</div>
				}
				//多日对比
				if (text.length == 2 && text[0].length == 2) {
					return <div>
						<span>{text[0][0]}</span> ~ <span>{text[0][1]}</span>
						<br/>
						<span>{text[1][0]}</span> ~ <span>{text[1][1]}</span>
					</div>
				}
			}
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
			// if (index === 0) {
			// 	if (typeof text == "object") {
			// 		// 一段日期
			// 		return <div>
			// 			<span>{text[0]}</span>
			// 			至
			// 			<br/>
			// 			<span>{text[1]}</span>
			// 		</div>
			// 	} else {
			// 		// 某一天
			// 		return text
			// 	}
			// } else {
			// 	return text
			// }
		}
	}, {
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]

// 推广组报表
const adgroupColumnsUnlimited = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '广告组名称',
		dataIndex: 'group_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const adgroupColumnsdate = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (index === 0 && text) {
				//单日
				if (text.length == 1) {
					return text[0]
				}
				//多日
				if (text.length == 2 && typeof text[0] == "string") {
					return <div>
						<span>{text[0]}</span> ~ <span>{text[1]}</span>
					</div>
				}
				//单日对比
				if (text.length == 2 && text[0].length == 1) {
					return <div>
						<span>{text[0][0]}</span>
						<br/>
						<span>{text[1][0]}</span>
					</div>
				}
				//多日对比
				if (text.length == 2 && text[0].length == 2) {
					return <div>
						<span>{text[0][0]}</span> ~ <span>{text[0][1]}</span>
						<br/>
						<span>{text[1][0]}</span> ~ <span>{text[1][1]}</span>
					</div>
				}
			}
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const adgroupColumnsadgroup = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '广告组名称',
		dataIndex: 'group_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
// 推广计划报表
const adplanColumnsUnlimited = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '广告计划名称',
		dataIndex: 'plan_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告组名称',
		dataIndex: 'group_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const adplanColumnsdate = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (index === 0 && text) {
				//单日
				if (text.length == 1) {
					return text[0]
				}
				//多日
				if (text.length == 2 && typeof text[0] == "string") {
					return <div>
						<span>{text[0]}</span> ~ <span>{text[1]}</span>
					</div>
				}
				//单日对比
				if (text.length == 2 && text[0].length == 1) {
					return <div>
						<span>{text[0][0]}</span>
						<br/>
						<span>{text[1][0]}</span>
					</div>
				}
				//多日对比
				if (text.length == 2 && text[0].length == 2) {
					return <div>
						<span>{text[0][0]}</span> ~ <span>{text[0][1]}</span>
						<br/>
						<span>{text[1][0]}</span> ~ <span>{text[1][1]}</span>
					</div>
				}
			}
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const adplanColumnsadgroup = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '广告计划名称',
		dataIndex: 'plan_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告组名称',
		dataIndex: 'group_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
//推广创意报表
const adcreativeColumnsUnlimited = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '广告创意名称',
		dataIndex: 'creative_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告计划名称',
		dataIndex: 'plan_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告组名称',
		dataIndex: 'group_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const adcreativeColumnsdate = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (index === 0 && text) {
				//单日
				if (text.length == 1) {
					return text[0]
				}
				//多日
				if (text.length == 2 && typeof text[0] == "string") {
					return <div>
						<span>{text[0]}</span> ~ <span>{text[1]}</span>
					</div>
				}
				//单日对比
				if (text.length == 2 && text[0].length == 1) {
					return <div>
						<span>{text[0][0]}</span>
						<br/>
						<span>{text[1][0]}</span>
					</div>
				}
				//多日对比
				if (text.length == 2 && text[0].length == 2) {
					return <div>
						<span>{text[0][0]}</span> ~ <span>{text[0][1]}</span>
						<br/>
						<span>{text[1][0]}</span> ~ <span>{text[1][1]}</span>
					</div>
				}

			}
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const adcreativeColumnsadcreative = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '广告创意名称',
		dataIndex: 'creative_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告计划名称',
		dataIndex: 'plan_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告组名称',
		dataIndex: 'group_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
//关键词
const wordColumnsunlimited = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '关键词',
		dataIndex: 'word',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告计划名称',
		dataIndex: 'adplan_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告组名称',
		dataIndex: 'adgroup_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const wordColumnsdate = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '日期',
		dataIndex: 'period_date',
		sorter: true,
		render: (text, record, index) => {
			if (index === 0 && text) {
				//单日
				if (text.length == 1) {
					return text[0]
				}
				//多日
				if (text.length == 2 && typeof text[0] == "string") {
					return <div>
						<span>{text[0]}</span> ~ <span>{text[1]}</span>
					</div>
				}
				//单日对比
				if (text.length == 2 && text[0].length == 1) {
					return <div>
						<span>{text[0][0]}</span>
						<br/>
						<span>{text[1][0]}</span>
					</div>
				}
				//多日对比
				if (text.length == 2 && text[0].length == 2) {
					return <div>
						<span>{text[0][0]}</span> ~ <span>{text[0][1]}</span>
						<br/>
						<span>{text[1][0]}</span> ~ <span>{text[1][1]}</span>
					</div>
				}

			}
			if (typeof text == "object") {
				// 一段日期
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
const wordColumnsword = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '关键词',
		dataIndex: 'word',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告计划名称',
		dataIndex: 'adplan_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '广告组名称',
		dataIndex: 'adgroup_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
// 地域报表 省
const provinceColumnsRegion = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '省份',
		dataIndex: 'province_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]
// 地域报表 市
const cityColumnsRegion = [
	{
		title: '',
		dataIndex: 'total',
		width: '5px',
		align: 'center',
		render: (text, record, index) => {
			if (index === 0) {
				return "合计"
			}
		}
	},{
		title: '城市',
		dataIndex: 'city_name',
		render: (text, record, index) => {
			return text
		}
	},{
		title: '展示量',
		dataIndex: 'imp',
		sorter: true,
		// sorter: (a, b) => a.age - b.age,
		render: (text) => {
			 text = text == null ? noData : text;
			 if (typeof text == "object" && text != null) {
				 // 一段日期
				 if (!text[0]) {
					 text[0] = noData
				 }
				 if (!text[1]) {
					 text[1] = noData
				 }
				 return <div>
					 <span>{text[0]}</span>
					 <br/>
					 <span>{text[1]}</span>
				 </div>
			 } else {
				 // 某一天
				 return text
			 }
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		// sorter: (a, b) => a.address.length - b.address.length,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = "0"
				}
				if (!text[1]) {
					text[1] = "0"
				}
				return <div>
					<span>{strToPercent(parseFloat(text[0]))}</span>
					<br/>
					<span>{strToPercent(parseFloat(text[1]))}</span>
				</div>
			} else {
				// 某一天
				text = text == null ?  "0" :strToPercent(parseFloat(text));
				return text
			}
		}
	}, {
		title: '花费(元)',
		dataIndex: 'income',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均千次展示费用(元)',
		dataIndex: 'ecpm',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object" && text != null) {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}, {
		title: '平均点击单价(元)',
		dataIndex: 'ecpc',
		sorter: true,
		render: (text) => {
			text = text == null ? noData : text;
			if (typeof text == "object") {
				// 一段日期
				if (!text[0]) {
					text[0] = noData
				}
				if (!text[1]) {
					text[1] = noData
				}
				return <div>
					<span>{text[0]}</span>
					<br/>
					<span>{text[1]}</span>
				</div>
			} else {
				// 某一天
				return text
			}
		}
	}
]

// 搜索词报表  
const searchColumnsUnlimited = [
	{
		title: '组名称',
		dataIndex: 'group_name',
		sorter: true,
	},{
		title: '广告计划名称',
		dataIndex: 'plan_name',
		sorter: true,
	}, {
		title: '关键词',
		dataIndex: 'word',
		sorter: true,
	}, {
		title: '搜索词',
		dataIndex: 'query',
		sorter: true,
	}, {
		title: '展现量',
		dataIndex: 'imp',
		sorter: true,
		render: (text) => {
			return text = text == null ? noData : text;
		}
	}, {
		title: '点击量',
		dataIndex: 'clk',
		sorter: true,
		render: (text) => {
			return text = text == null ? noData : text;
		}
	}, {
		title: '点击率(%)',
		dataIndex: 'ctr',
		sorter: true,
		render: (text) => {
			// text = parseInt()
			return text == null ?  noData :strToPercent(parseFloat(text))
		}
	}, {
		title: "操作",
		key: "action",
		width: "180px",
		render: (text, record) => {
			// 短语否定 1
			// 精确否定 2
			console.log(record);
			let flag = record.word_existed;
			let result;
			let id = record.id;
			if (flag === "1") {
				result = <span>已被添加</span>
			} else if (flag === "0") {
				result = <span id={id}>
					<a 
					href="javascript:;"
					onClick={() => {
						appendWords(record,1)
						.then((res) => {
							if (res.code === 1) {
								//成功
								message.success("添加成功")
								document.getElementById(id).innerHTML = "已被添加"
							} else {
								//失败
								message.error(res.msg)
							}
						})
					}}
					>短语否定</a>
					<Divider type="vertical" />
					<a 
					href="javascript:;"
					onClick={() => {
						appendWords(record,2)
						.then((res) => {
							if (res.code === 1) {
								//成功
								message.success("添加成功")
								document.getElementById(id).innerHTML = "已被添加"
							} else {
								//失败
								message.error(res.msg)
							}
						})
					}}
					>精确否定</a>
				</span>
			}
			return result;
		}
	}
]
export {
    columnsDate,
    columnsMedia,
    columnsSlot,
    columnsTemplate,
	columnsClient,
	adgroupColumnsUnlimited,
	adgroupColumnsdate,
	adgroupColumnsadgroup,
	adplanColumnsUnlimited,
	adplanColumnsdate,
	adplanColumnsadgroup,
	adcreativeColumnsUnlimited,
	adcreativeColumnsdate,
	adcreativeColumnsadcreative,
	wordColumnsunlimited,
	wordColumnsdate,
	wordColumnsword,
	provinceColumnsRegion,
	cityColumnsRegion,
	searchColumnsUnlimited
};
