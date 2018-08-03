import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'react-router-dom'
const {Header, Content, Footer, Sider} = Layout;
import pathToRegexp from 'path-to-regexp';
const SubMenu = Menu.SubMenu;
import styles from './SiderMenu.less'
import {urlToList} from '../_utils/pathTools';
import {checkPermissions} from '../Authorized/CheckPermissions'

const getIcon = icon => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`}/>;
    }
    if (typeof icon === 'string') {
        return <Icon type={icon}/>;
    }
    return icon;
};
export const getMeunMatchKeys = (flatMenuKeys, path) => {
    return flatMenuKeys.filter(item => {
        return pathToRegexp(item).test(path);
    });
};

export default class SiderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menus = props.menuData;
        this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
        this.state = {
            openKeys: this.getDefaultCollapsedSubMenus(props),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                openKeys: this.getDefaultCollapsedSubMenus(nextProps),
            });
        }
    }

    /**
     * Convert pathname to openKeys
     * /list/search/articles = > ['list','/list/search']
     * @param  props
     */
    getDefaultCollapsedSubMenus(props) {
        const {location: {pathname}} = props || this.props;
        return urlToList(pathname)
            .map(item => {
                return getMeunMatchKeys(this.flatMenuKeys, item)[0];
            })
            .filter(item => item);
    }

    /**
     * Recursively flatten the data
     * [{path:string},{path:string}] => {path,path2}
     * @param  menus
     */
    getFlatMenuKeys(menus) {
        let keys = [];
        menus.forEach(item => {
            if (item.children) {
                keys = keys.concat(this.getFlatMenuKeys(item.children));
            }
            keys.push(item.path);
        });
        return keys;
    }

    /**
     * 判断是否是http链接.返回 Link 或 a
     * Judge whether it is http link.return a or Link
     * @memberof SiderMenu
     */
    getMenuItemPath = item => {
        const itemPath = this.conversionPath(item.path);
        const {name} = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath}>
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                replace={itemPath === this.props.location.pathname}
            >
                <span>{name}</span>
            </Link>
        );
    };
    /**
     * get SubMenu or Item
     */
    getSubMenuOrItem = item => {
        if (item.children && item.children.some(child => child.name)) {
            const childrenItems = this.getNavMenuItems(item.children);
            // 当无子菜单时就不展示菜单
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                  {getIcon(item.icon)}
                                    <span>{item.name}</span>
                </span>
                            ) : (
                                item.name
                            )
                        }
                        key={item.path}
                    >
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        } else {
            return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
    };

    /**
     * 获得菜单子节点
     * @memberof SiderMenu
     */
    getNavMenuItems = menusData => {
        if (!menusData) {
            return [];
        }
        return menusData
            .filter(item => item.name && !item.hideInMenu)
            .map(item => {
                // make dom
                const ItemDom = this.getSubMenuOrItem(item);
                return this.checkPermissionItem(item.authority, ItemDom);
            })
            .filter(item => item);
    };
    // Get the currently selected menu
    getSelectedMenuKeys = () => {
        const { location: { pathname } } = this.props;
        return urlToList(pathname).map(itemPath => getMeunMatchKeys(this.flatMenuKeys, itemPath).pop());
    };
    // 转化路径
    conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };
    // permission to check
    checkPermissionItem = (authority, ItemDom) => {
        return checkPermissions(authority, this.props.role, ItemDom);
    };
    isMainMenu = key => {
        return this.menus.some(item => key && (item.key === key || item.path === key));
    };
    handleOpenChange = openKeys => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
        this.setState({
            openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
        });
    };
    render() {
        const {logo} = this.props;
        const { openKeys } = this.state;
        // if pathname can't match, use the nearest parent's key
        let selectedKeys = this.getSelectedMenuKeys();
        if (!selectedKeys.length) {
            selectedKeys = [openKeys[openKeys.length - 1]];
        }
        return (
            <Sider width={200} className={styles.sider}>
                <div className={styles.logo} key="logo">
                    <Link to="/">
                        <img src={logo} alt="logo"/>
                        {/*<h1>PUBLISHER</h1>*/}
                    </Link>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={this.handleOpenChange}
                    style={{width: 200}}
                    selectedKeys={selectedKeys}
                >
                    {this.getNavMenuItems(this.menus)}
                </Menu>
            </Sider>
        );
    }
}
