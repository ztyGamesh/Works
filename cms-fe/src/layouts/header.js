import React, { Component } from 'react';
import { Menu, Icon, Layout } from 'antd'
import { Link } from 'react-router-dom'
// import * as screenfull from 'screenfull'
import './header.less'

const SubMenu = Menu.SubMenu
const { Header } = Layout

export default class Top extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: ''
        }
    }

    componentDidMount() {
        this.getUser()
    }

    getUser(){
      this.setState({
        username: JSON.parse(sessionStorage.getItem("user"))
        ? JSON.parse(sessionStorage.getItem("user")).name
        : ""
      })
    }

    clear(item){
        if (item.key === 'logOut') {
          sessionStorage.setItem("token", null);
        }
    }

    render() {
        return (
            <Header style={{ background: '#fff', border:"1px solid #ccc"}}>
                <Menu mode="horizontal" className="logOut" onClick={this.clear}>
                    <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>} >
                        <Menu.Item key="logOut"><Link to="/login" >退出</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
        );
    }
}
