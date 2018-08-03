import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, message, Checkbox} from 'antd';
import {provinceColumnsRegion,cityColumnsRegion} from '../../../../mock/Report/ColumnsMap';


// 初始化时候接受一个columns渲染数组
// 根据数组 渲染出按钮的选中状态
// 然后将 按钮的选中状态与数组同步 并输出
class TableDimension extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    componentWillMount() {
        // console.log("dimensio组件收到的columns", this.props.reportType)
        this._handleColumns(this.props.reportType,this.props.columns)
    }

    componentWillReceiveProps(nextProps) {
        // console.log("nextProps组件收到的columns", nextProps.reportType)
        this._handleColumns(nextProps.reportType, nextProps.columns)
    }
    _handleColumns(type, x) {
        console.log("外部传来的数据")
        console.log((type));
        let array;
        switch (type) {
            case "province":
                array = provinceColumnsRegion;
                break;
            case "city":
                array = cityColumnsRegion;
                break;
            default:
                return
        }
        // console.log("Model", array)
        console.log("state", array)
        this.setState({
            // 根据外部的数据，渲染组件的维度选项
            dimensionArray: array.slice(1).map((item) => {
                // 同步checkoutbox的选中状态
                let checked = false;
                x.forEach((xx) => {
                    if (xx.dataIndex === item.dataIndex) {
                        checked = true
                    }
                })
                return {
                    name: item.dataIndex,
                    title: item.title,
                    checked: checked
                }
            })
        })
    }

    handleVisibleChange = (flag) => {
        this.setState({ visible: flag });
    }
    onChange(name,e) {
        // console.log(name)
        // console.log(e.target.checked)
        // console.log(dimensionArrayHandle)
        const dimensionArrayHandle = Object.assign([], this.state.dimensionArray)
        dimensionArrayHandle.forEach((item) => {
            if (item.name === name) {
                    item.checked = e.target.checked
                }
            })

        const result = dimensionArrayHandle.map((item) => {
            if (item.checked) {
                return item.name
            } else {
                return null
            }
        });

        const resultName = [];
        result.forEach((item) => {
            if (item !== null) {
                resultName.push(item)
            }
        })

        // console.log(dimensionArrayHandle)
        this.setState({
            dimensionArray: dimensionArrayHandle
        })

        this.props.handleClick(resultName)
    }
    render() {

        let menuItems = this.state.dimensionArray.map((item, index) => {
            return  <Menu.Item key={index}><Checkbox checked={item.checked} onChange={this.onChange.bind(this,item.name)}>{item.title}</Checkbox></Menu.Item>
        })
        // console.log(menuItems)
        const menu = (
          <Menu
              multiple={true}
          >
              {menuItems}
          </Menu>
        );

        return (
            <div>
                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    onVisibleChange={this.handleVisibleChange.bind(this)}
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
