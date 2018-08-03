import React, { Component } from 'react';
import { Button, Radio, Icon, message} from 'antd';

/*
 *折线图的仿图例功能组件
 *一系列的按钮
 *初始化默认选中前2个按钮
 *至少选中1个按钮
 *点击切换选中状态
 *选中哪个状态，就显示哪条曲线
 */

const LGEGINNAME = ["cost", "media_income", "list_pv", "list_content_ctr", "list_ad_ctr", "detail_pv", "detail_ad_ctr", "goods_ctr", "goods_vol", "payment"];
class ButtonSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeButtonsStack: ["cost", "media_income"],
            legend: [
                {
                    name: '消费',
                    dataIndex: 'cost',
                    style: {
                        color: "white",
                        background: "rgb(0,153,255)",
                        fontWeight: "bold"
                    },
                    active: true
                },
                {
                    name: '媒体收入',
                    dataIndex: 'media_income',
                    style: {
                        color: "white",
                        background: "rgb(242,99,120)",
                        fontWeight: "bold"
                    },
                    active: true
                },
                {
                    name: '列表页PV',
                    dataIndex: 'list_pv',
                    style: {
                        color: "white",
                        background: "rgb(19,219,173)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '列表页内容CTR',
                    dataIndex: 'list_content_ctr',
                    style: {
                        color: "white",
                        background: "rgb(155,125,72)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '列表页广告CTR',
                    dataIndex: 'list_ad_ctr',
                    style: {
                        color: "white",
                        background: "rgb(60,115,0)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '详情页PV',
                    dataIndex: 'detail_pv',
                    style: {
                        color: "white",
                        background: "rgb(0,146,199)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '详情页广告CTR',
                    dataIndex: 'detail_ad_ctr',
                    style: {
                        color: "white",
                        background: "rgb(250,218,141)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '商品CTR',
                    dataIndex: 'goods_ctr',
                    style: {
                        color: "white",
                        background: "rgb(182,194,154)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '商品成交量',
                    dataIndex: 'goods_vol',
                    style: {
                        color: "white",
                        background: "rgb(220,87,18)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '佣金',
                    dataIndex: 'payment',
                    style: {
                        color: "white",
                        background: "rgb(29,191,151)",
                        fontWeight: "bold"
                    },
                    active: false
                },
            ]
        }
        this.init = this.init.bind(this);
        // this.reverse = this.reverse.bind(this);
    }
    init () {
        const Buttons = this.state.legend.map((x) => {
            return <Radio.Button

                key={x.dataIndex}
                onClick={this.handleClick.bind(this,x)}
                style={x.active ? x.style : {}}
                   >{x.name}
            </Radio.Button>
        })
        return <Radio.Group value={'large'} size="small">{Buttons}</Radio.Group>
    }
    handleClick (x) {
        //每次点击 根据legend中按钮的状态更新按钮显示
        // 用来缓存active的按钮
        //维护一个按钮栈 先点击的按钮在前，后点击的按钮在后
        // 假设income第一次点击 imp第二次点击
        var activeButtonsStack = this.state.activeButtonsStack;
        const currentActive = x.dataIndex;
        if (activeButtonsStack.length == 2) {
            if (activeButtonsStack.indexOf(currentActive) === -1){
                //点击新的按钮
                //[income,imp] => [imp, clk]
                //[imp,clk] => [clk, ctr]
                // activeButtonsStack.shift();
                activeButtonsStack.shift();
                activeButtonsStack.push(x.dataIndex);
            } else {
                // 点击的是已经选中的
                // 将已经选中的 反选
                // currentActive
                activeButtonsStack.splice(activeButtonsStack.indexOf(currentActive),1);
                activeButtonsStack[1] = activeButtonsStack[0];
            }

        } else if (activeButtonsStack.length == 1){
            //暂不处理
        }
        this.setState({
            activeButtonsStack: activeButtonsStack
        })
        this.refresh(activeButtonsStack)
        // 处理外部传来的点击函数
        if (this.props.handleClick) {
            const temp = [];
            this.state.legend.forEach((button) => {
                if (button.active) {
                    temp.push(button.dataIndex)
                }
            })
            this.props.handleClick(x.dataIndex, temp)
        }

    }

    refresh(activeButtonsStack) {
        console.log(activeButtonsStack)
        //根据当前选中的字段，渲染按钮和折线图
        //其实就是根据选中的字段，更改对应legend中的active值
        this.state.legend.forEach((legend) => {
            if (activeButtonsStack.indexOf(legend.dataIndex) !== -1) {
                legend.active = true;
            } else {
                legend.active = false;
            }
        })
    }
    render() {
        const result = this.init();
        return (
            <div style={{position: 'absolute',top: "4%",right:"8%",zIndex: "1"}}>
                {result}
            </div>
        );
    }
}
export default ButtonSize;
