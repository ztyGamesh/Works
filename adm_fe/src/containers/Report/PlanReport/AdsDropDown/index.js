import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon} from 'antd';


class AdsDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            names: ["不限", "查询日期", "对比日期"],
            value: "不限"
        };
    }
    handleMenuClick(e) {
      console.log('click', e);
      this.props.getResult(e.key)
      this.setState({
          value: this.state.names[e.key]
      })
    }
    render() {
        return (
            <div>
                <Dropdown overlay={
                    <Menu onClick={this.handleMenuClick.bind(this)}>
                        <Menu.Item key="0">不限</Menu.Item>
                        <Menu.Item key="1">查询日期</Menu.Item>
                        <Menu.Item key="2">对比日期</Menu.Item>
                    </Menu>
                }>
                    <Button style={{ marginLeft: 8 }}>
                        {this.state.value}<Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        );
    }
}

export default AdsDropDown;
