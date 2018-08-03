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
            legend: [
                {
                    name: '收入(元)',
                    dataIndex: 'income',
                    style: {
                        color: "white",
                        background: "rgb(255,215,0)",
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
        this.reverse = this.reverse.bind(this);
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
        // x是当前点击的按钮的数据对象

        //点击行为处理对象
        const click = {
            // 判断点击的按钮是否是已经处于active状态
            xInActiveButtons: (x) => {
                return activeButtons.indexOf(x.dataIndex) !== -1
            },
            // 判断处于active状态的按钮的个数
            countActiveButtons: () => {
                // 用来统计active的按钮数量
                this.state.legend.forEach((button) => {
                    if (button.active) {
                        activeButtons.push(button.dataIndex)
                    }
                })
                return activeButtons.length
            },
            // 判断此次点击行为是否会让本按钮的状态切换
            isReverse: () => {
                return reverseRule.some((function (rule) {
                    return rule.exc()
                }))
            },
            done: () => {
                if (click.isReverse()) {
                    this.reverse(x)
                }
            }
        }
        // 用来缓存active的按钮
        const activeButtons = [];
        const count = click.countActiveButtons();
        // 此次按钮状态切换的规则
        const reverseRule = [
            {
                message: "如果已经有2个active,看点击的dataIndex是否是这两个，是则切换状态，否则点击无效",
                exc: function () {
                    if ((count === 2 && !click.xInActiveButtons(x))) {
                        // 如果active的数量为2个，即激活按钮的个数为2个，并且这次点击命中的按钮不是这两个，那么给出提示，无法再选中
                        message.warning('最多可选两个指标', 0.5)
                    }
                    // 如果激活按钮的数量为2并且当前点击的按钮正是其中之一，那么就满足切换状态的条件
                    return count === 2 && click.xInActiveButtons(x)
                }
            },
            {
                message: "如果已经有1个active 看点击的dataIndex是否是这1个 是则点击无效 否则切换状态",
                exc: function () {
                    // 如果激活按钮的数量为1并且当前点击的按钮不是激活按钮，那么就满足切换状态的条件
                    return count === 1 && !click.xInActiveButtons(x)
                }
            }
        ]

        click.done()

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
    reverse (x) {
        // 按钮被点击时
        // 反转自己的active状态
        // x是点击时 按钮对应的状态
        // y是所有单个按钮对应的状态
        this.state.legend.forEach((y) => {
            if (y.dataIndex === x.dataIndex) {
                x.active = !x.active;
            }
        })
        this.setState({
            legend: [
                ...this.state.legend
            ]
        })
    }
    render() {
        const result = this.init();
        return (
            <div style={{position: 'absolute',top: "4%",right:"8%",zIndex: "10000"}}>
                {result}
            </div>
        );
    }
}
export default ButtonSize;
