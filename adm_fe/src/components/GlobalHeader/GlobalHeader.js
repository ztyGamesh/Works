import React, {Component} from 'react';
import {Menu, Icon, Spin, Dropdown} from 'antd';
const SubMenu = Menu.SubMenu;
import {Link} from 'react-router-dom';
import styles from './GlobalHeader.less';
import {BUSINESSAPIHOST} from '../../common/env';
import request from '../../utils/request'
import {removeAuthority,getAuthority} from '../../utils/authority';
export default class GlobalHeader extends Component {
    constructor() {
        super();
        this.state = {
            current: 'aFeed',
            remain_budget: '',
            today_spend_budget: '',
            authority:''
        };
        this.onMenuClick = this.onMenuClick.bind(this);
    }

    componentDidMount() {
        const authority = getAuthority();
        this.setState({
            authority:authority
        });
        //广告主需要显示的花费、余额信息
        if(authority==2){
            request({
                method: 'post',
                url: BUSINESSAPIHOST + '/client/clientaccount',
                data: {}
            }).then(res=> {
                if (res.status == 1) {
                    this.setState({
                        remain_budget: res.data.remain_budget,
                        today_spend_budget: res.data.today_spend_budget,
                    })
                } else {
                    console.error(res.msg)
                }
            });
        }
    };


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    };

    onMenuClick = ({key}) => {
        if (key === 'logout') {
            request({
                method: 'post',
                url: BUSINESSAPIHOST + '/index/logout',
                data: {}
            }).then(res=> {
                if (res.status == 1) {
                    removeAuthority();
                    this.props.history.push('/user/login');
                } else {
                    console.error(res.msg)
                }
            });

        }
    };

    render() {
        const {userName} = this.props;
        const {authority,today_spend_budget, remain_budget} = this.state;
        const menu = (
            <Menu className={styles.menu} onClick={this.onMenuClick}>
                <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
            </Menu>
        );
        return (
            <div className={styles.header}>
                {
                    authority==2?
                        <div className={styles.message}>
                            <span>今日花费：<span className={styles.important}>{today_spend_budget}</span>元</span>
                            <span style={{marginLeft: 30}}>账户余额：<span
                                className={styles.important}>{remain_budget}</span>元</span>
                        </div>
                        :null
                }

                <div className={styles.right}>
                    {userName ? (
                        <Dropdown overlay={menu} className={styles.right}>
                            <span className={`${styles.action} ${styles.account}`}>
                                <span className={styles.name}>{userName}</span>
                            </span>
                        </Dropdown>
                    ) : <Spin size="small" style={{marginLeft: 8}}/>}
                </div>
            </div>
        );
    }
}
