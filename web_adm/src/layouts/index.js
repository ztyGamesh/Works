import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import {Menu, Icon, Layout} from 'antd'
import {MenuAuthority} from '../mock/menu'
import Top from './header'
import Contents from './content'
import 'whatwg-fetch'
import 'es6-promise'
import './index.less'

const SubMenu = Menu.SubMenu;
const {Sider} = Layout;

export default class Layouts extends Component {

	constructor() {
		super();
		this.state = {
			current: 'MediaDashboard',
			collapsed: false,
			mode: 'inline',  // 水平垂直展现
		};
	}

	componentDidMount() {
		this.handleClick([], 'MediaDashboard')
	}

	toggle() {
		this.setState({
			collapsed: !this.state.collapsed,
			mode: this.state.collapsed ? 'inline' : 'vertical',
		});
	};

	clear() {
		this.setState({
			current: 'MediaDashboard',
		});
	};

	handleClick(e, special) {
		this.setState({
			current: e.key || special,
		});
	};
	render() {
		return (
			<Layout className="containAll">
				<Sider
					collapsible
					collapsed={this.state.collapsed}
					onCollapse={this.onCollapse}
					className="leftMenu"
				>
					<span className="author white">瞬知</span>
					<Menu
						theme="dark"
						onClick={this.handleClick.bind(this)}
						defaultOpenKeys={['']}
						selectedKeys={[this.state.current]}
						className="menu"
						mode={this.state.mode}
					>
						{
							MenuAuthority.map((subMenu) => {
								if (subMenu.authority !== "0") {
									if (subMenu.children && subMenu.children.length) {
										return (
											<SubMenu key={subMenu.url} title={<span><Icon
												type={subMenu.icon}/><span>{subMenu.name}</span></span>}>
												{subMenu.children.map((menu) => {
														if (menu.authority !== "0") {
															return (
																<Menu.Item key={menu.url}><Link
																	to={`/${menu.url}`}>{menu.name}</Link></Menu.Item>
															)
														}
													}
												)}
											</SubMenu>
										)
									}
									return (
										<Menu.Item key={subMenu.url}>
											<Link to={`/${subMenu.url}`}>
												<Icon type={subMenu.icon}/><span
												className="nav-text">{subMenu.name}</span>
											</Link>
										</Menu.Item>
									)
								}

							})
						}
					</Menu>

				</Sider>
				<Layout>
					<Top toggle={this.toggle.bind(this)} collapsed={this.state.collapsed} clear={this.clear}/>
					<Contents />
				</Layout>
			</Layout>
		);
	}

}

