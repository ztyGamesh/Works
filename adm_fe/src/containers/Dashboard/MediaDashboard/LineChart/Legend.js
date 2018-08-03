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

class ButtonSize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeButtonsStack: ["income", "imp"],
            legend: [
                {
                    name: '收入(元)',
                    dataIndex: 'income',
                    style: {
                        color: "white",
                        background: "rgb(0,153,255)",
                        fontWeight: "bold"
                    },
                    active: true
                },
                {
                    name: '曝光量',
                    dataIndex: 'imp',
                    style: {
                        color: "white",
                        background: "rgb(242,99,120)",
                        fontWeight: "bold"
                    },
                    active: true
                },
                {
                    name: '点击量',
                    dataIndex: 'clk',
                    style: {
                        color: "white",
                        background: "rgb(19,219,173)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: '点击率',
                    dataIndex: 'ctr',
                    style: {
                        color: "white",
                        background: "rgb(155,125,72)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: 'eCPM(元)',
                    dataIndex: 'ecpm',
                    style: {
                        color: "white",
                        background: "rgb(60,115,0)",
                        fontWeight: "bold"
                    },
                    active: false
                },
                {
                    name: 'CPC(元)',
                    dataIndex: 'ecpc',
                    style: {
                        color: "white",
                        background: "rgb(0,146,199)",
                        fontWeight: "bold"
                    },
                    active: false
                }
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
        return <Radio.Group value={'large'}>{Buttons}</Radio.Group>
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
