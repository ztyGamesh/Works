/**
 * 马甲组件
 */
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Menu, Dropdown, Icon, Input} from 'antd';

import {DP_POST} from '../../utils/fetch';

class Marksman extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            menuList: [],
            value: ''
        };
    }

    componentWillMount() {
        // 拉取马甲名列表
        const url = SERVICE_API_URL + "/api/marksman/queryByUser";
        const option = {
            user: JSON.parse(sessionStorage.token).user
        }
        DP_POST(url, {body: option})
            .then((res) => {
                // console.log(res)
                this.setState({
                    menuList: res.data
                })
            })
    }

    componentWillReceiveProps(nextProps) {
        // 马甲名初始化
        var name = "";
        this.state.menuList.forEach((item) => {
            if (item.id === nextProps.marksman) {
                name = item.name
            }
        })
        this.setState({
            value: name
        })
    }

    handleMenuClick(e) {
        if (e.key) {
            this.setState({
                visible: false,
                value: e.item.props.children
            });
            this.props.saveMaskman(parseInt(e.key))
        }
    }

    handleVisibleChange(flag) {
        this.setState({visible: flag});
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                {this.state.menuList.map((item) => {
                    return <Menu.Item key={item.id}>{item.name}</Menu.Item>
                })}
            </Menu>
        );
        return (
            <Dropdown overlay={menu}
                      onVisibleChange={this.handleVisibleChange.bind(this)}
                      visible={this.state.visible}
            >
                <Input
                    addonBefore={<span>马甲名选择<Icon type="edit"/></span>}
                    value={this.state.value}
                    // onChange={this.handleChangeTitle.bind(this)}
                    // onBlur={this.handleBlurTitle.bind(this)}
                />
            </Dropdown>
        );
    }
}

Marksman.propTypes = {
    saveMaskman: propTypes.func,
    marksman: propTypes.number
}

export default Marksman;
