import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import {Link, withRouter, Route, Redirect} from 'react-router-dom';
import {AccessPermission, GetRoleData} from './../utils/fetch';
import {allMenu} from '../mock/allMenu';
import menuTransform from '../utils/menuTransform';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import Main from './content';
import Top from './header';

class SiderDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menuTree: [],
      //展开一级菜单
      openKeys: [],
      //选中的菜单
      selectedKeys: [],
      //urls
      urls: []
    };
  }
  componentWillMount() {
    // 根据用户信息做权限判定
    // if (!(sessionStorage.getItem("token") && AccessPermission())) {
    //   this.props.history.push('/login')
    // }
    AccessPermission()
    .then((res) => {
      if (!res) {
        this.props.history.push('/login')
        return
      }
      return GetRoleData().then((roleList) => roleList)
    })
    .then((res) => {
      // 用自己维护的url目录 去 res 中 更新 permission
      // menuTransform 作用的后 allMenu是最终渲染的allMenu
      console.log(res)
      console.log(allMenu)
      var menuTree = menuTransform(allMenu, res);
      console.log(menuTree)
      const urls = [];
      this.setState({
        menuTree: menuTree.map((subMenu) => {
          if (subMenu.children && subMenu.children.length && subMenu.permission > 0) {
            urls.push(subMenu.url);
            return (
              <SubMenu key={subMenu.url} title={<span><Icon type={subMenu.icon} /><span>{subMenu.name}</span></span>}>
                {subMenu.children.map(menu => (
                    urls.push(menu.url),
                  <Menu.Item key={menu.url}><Link to={`${menu.url}`}>{menu.name}</Link></Menu.Item>
                ))}
              </SubMenu>
            )
          }
          else if (subMenu.permission > 0) {
            urls.push(subMenu.url);
            return (
              <Menu.Item key={subMenu.url}>
                <Link to={`${subMenu.url}`}>
                  <Icon type={subMenu.icon} /><span className="nav-text">{subMenu.name}</span>
                </Link>
              </Menu.Item>
            )
          }
        }),
        urls: urls,
      }, () => this.openMenus(this.props, 1))
    }).catch((error) => {
      console.log(error)
    })

  }
  componentWillReceiveProps(nextProps) {
    this.openMenus(nextProps)
  }

componentWillUnmount() {
    console.log('over')
}
  onCollapse(collapsed) {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  handleClick(e) {
    console.log(e.key)
  }
  handleOpenChange(e) {
    this.setState({
      openKeys: [...e]
    });
  }
  openMenus(props, isFirst){
    const urls = this.state.urls;
    const path = props.location.pathname;
    const pathTop = path.replace(/(?!^)\/(.*)/g, '');
    const openKeys = [...this.state.openKeys];
    const selectedKeys = -1 !== urls.indexOf(path) ? [path] : [...this.state.selectedKeys];
    -1 === openKeys.indexOf(pathTop) && openKeys.push(pathTop);
    if(isFirst && '/' === path){
      this.setState({
        openKeys: openKeys,
        selectedKeys: [],
      });
    }else {
      this.setState({
        openKeys: openKeys,
        selectedKeys: selectedKeys,
      });
    }
  }
  render() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 左边菜单 */}
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse.bind(this)}
            >
                <div className="logo" />
                <span style={{height: "60px",display:"block",background:"#404040"}}>
                </span>
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={this.handleClick.bind(this)}
                    onOpenChange={this.handleOpenChange.bind(this)}
                    openKeys={this.state.openKeys}
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.state.menuTree}
                </Menu>
            </Sider>

            {/* 右边内容 */}
            <Layout>
                <Top/>
                <Main/>
                <Footer style={{ textAlign: 'center' }}>
                    跃盟科技CMS系统
                </Footer>
            </Layout>
        </Layout>
    );
  }
}

export default SiderDemo;
