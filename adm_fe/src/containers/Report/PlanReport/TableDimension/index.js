import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, message, Checkbox} from 'antd';



// 初始化时候接受一个columns渲染数组
// 根据数组 渲染出按钮的选中状态
// 然后将 按钮的选中状态与数组同步 并输出
class TableDimension extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dimensionArray: [
                {
                    name: 'period_date',
                    checked: true
                },
                {
                    name: 'imp',
                    checked: true
                },
                {
                    name: 'clk',
                    checked: true
                },
                {
                    name: 'ctr',
                    checked: true
                },
                {
                    name: 'income',
                    checked: true
                },
                {
                    name: 'ecpm',
                    checked: true
                },
                {
                    name: 'ecpc',
                    checked: true
                },
            ]
        };
    }
    handleVisibleChange = (flag) => {
        this.setState({ visible: flag });
    }
    onChange(name,e) {
        // console.log(e.target.checked, name)
        // 根据key 去this.state.dimensionArray中找到对应的对象，同步checked的状态
        this.state.dimensionArray.forEach((item) => {
            if (item.name === name) {
                item.checked = e.target.checked
            }
        })
        // 然后将点击行为后的最新状态包装成columns传给父组件的回到函数，重新渲染页面
        const result = this.state.dimensionArray.filter((item) => {
            // 返回checked为true的name
            return item.checked
        })
        const resultName = result.map((item) => {
            return item.name
        })
        // console.log("结果",resultName)
        // 将最终的结果返回给父组件
        this.props.handleClick(resultName)
    }
    render() {
        const menu = (
          <Menu
              onClick={this.handleMenuClick}
              multiple={true}
          >
              <Menu.Item key="1"><Checkbox defaultChecked onChange={this.onChange.bind(this,'period_date')}>日期</Checkbox></Menu.Item>
              <Menu.Item key="2"><Checkbox defaultChecked onChange={this.onChange.bind(this,'imp')}>曝光量</Checkbox></Menu.Item>
              <Menu.Item key="3"><Checkbox defaultChecked onChange={this.onChange.bind(this,'clk')}>点击量</Checkbox></Menu.Item>
              <Menu.Item key="4"><Checkbox defaultChecked onChange={this.onChange.bind(this,'ctr')}>点击率</Checkbox></Menu.Item>
              <Menu.Item key="5"><Checkbox defaultChecked onChange={this.onChange.bind(this,'income')}>收入(元)</Checkbox></Menu.Item>
              <Menu.Item key="6"><Checkbox defaultChecked onChange={this.onChange.bind(this,'ecpm')}>eCPM(元)</Checkbox></Menu.Item>
              <Menu.Item key="7"><Checkbox defaultChecked onChange={this.onChange.bind(this,'ecpc')}>eCPC(元)</Checkbox></Menu.Item>
          </Menu>
        );
        return (
            <div>
                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    onVisibleChange={this.handleVisibleChange}
                    visible={this.state.visible}
                >
                    <Button style={{ marginLeft: 8 }}>
                        维度选择 <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        );
    }
}


export default TableDimension;
