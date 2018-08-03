import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import {Alert, Modal, message} from 'antd'
import Login from 'ant-design-pro/lib/Login'
import {checkRole} from '../../utils/utils';
const {UserName, Password, Submit} = Login;
import {BUSINESSAPIHOST} from '../../common/env';
import request from '../../utils/request'
import styles from './Login.less'
const logo = require('../../assets/deeperleaper@1x.png');
import FreeTrial from '../../components/FreeTrial/FreeTrial';
import {setAuthority} from '../../utils/authority';
/**
 * @class 登录页面
 * @param role 登录角色 publisher-媒体 ads-广告主
 * */

class LoginDemo extends Component {
    state = {
        notice: '',
        visible: false,
        confirmLoading: false,
        role: ''
    };

    componentDidMount() {
        this.setState({
            role: checkRole()
        })
    }

    onSubmit = (err, values) => {
        this.setState({
            notice: '',
        }, () => {
            // 校验用户名、密码，处理正确跳转、错误提示的逻辑
            if (!err) {
                this.login(values.username, values.password)
                    .then(function () {
                        return this.getUserInfo()
                    }.bind(this))
                    .then(function (role) {
                        setAuthority(role);
                        this.props.history.push('/')
                    }.bind(this));
            }
        });
    };
    login = (username, password)=> {
        return new Promise(function (resolve, reject) {
            request({
                method: 'post',
                url: BUSINESSAPIHOST + '/index/login',
                data: {
                    "role": this.state.role == 'publisher' || this.state.role == 'adm' ? 'media' : 'client',
                    "username": username,
                    "password": password
                }
            }).then(res=> {
                if (res.status == 1) {
                    resolve();
                } else {
                    this.setState({
                        notice: res.msg,
                    });
                    reject(res.msg);
                }
            });
        }.bind(this));
    };
    getUserInfo = ()=> {
        return new Promise(function (resolve, reject) {
            request({
                method: 'post',
                url: BUSINESSAPIHOST + '/user/getcurrentuserauthority',
                data: {}
            }).then(res=> {
                if (res.status == 1) {
                    let role = '';
                    if (res.user.power == 'admin') {//管理员
                        role = 0;
                    } else if (res.user.power == 'admin_price') {//底价管理员
                        role = 3;
                    } else if (res.user.power == 'admin_audit') {//审核管理员
                        role = 4;
                    } else {
                        switch (res.user.role) {//媒体或广告主
                            case 'media':
                                role = 1;
                                break;
                            case 'client':
                                role = 2;
                                break;
                        }
                    }
                    resolve(role);
                } else {
                    message.error(res.message);
                    reject(res.msg);
                }
            });
        });
    };
    showRegister = ()=> {
        this.setState({
            visible: true
        })
    };
    hideRegister = ()=> {
        this.setState({
            visible: false
        })
    };

    registering = (data, callback) => {
        this.setState({
            confirmLoading: true,
        });
        request({
            method: 'post',
            url: BUSINESSAPIHOST + '/index/sendemail',
            data: data
        }).then(res=> {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
            if (res.status == 1) {
                message.info('申请成功，请等待我们联系您');
                callback();
            } else {
                message.error(res.message)
            }
        });
    };

    render() {
        const {notice, visible, confirmLoading, role} = this.state;
        const usernameRules = [
            {required: true, message: '请输入账户邮箱！'},
            {type: 'email', message: '邮箱格式不正确'}
        ];
        const passwordRules = [
            {required: true, message: '请输入密码！'}
        ];
        let slogan = '', title = '', nameHolder = '';
        switch (role) {
            case 'publisher':
                slogan = '高效的媒体变现解决方案';
                title = '瞬知™媒体变现系统';
                nameHolder = '媒体登录邮箱';
                break;
            case 'ads':
                slogan = '广告即内容';
                title = '瞬知™投放管理系统';
                nameHolder = '广告主登录邮箱';
                break;
            case 'adm':
                slogan = '尊敬的瞬知管理员，您好';
                title = '瞬知™管理员系统';
                nameHolder = '管理员登录邮箱';
                break;
            default:
        }
        return (
            <div className="Login">
                <img src={logo} className={styles.logo}/>
                {role !== '' ? <div>
                    <div className={styles.slogan}>{slogan}</div>
                    <div className={styles.login}>
                        <Login
                            onSubmit={this.onSubmit}
                        >
                            <div className={styles.top}>
                                <div className={styles.header}>
                                    <span className={styles.title}>{title}</span>
                                </div>
                            </div>
                            {
                                notice &&
                                <Alert style={{marginBottom: 24}} message={notice} type="error" showIcon
                                       closable/>
                            }
                            <UserName name="username" placeholder={nameHolder} rules={usernameRules}/>
                            <Password name="password" placeholder="密码" rules={passwordRules}/>
                            <Submit className={styles.subBtn}>登录</Submit>
                            <p className={styles.register}>没有平台账户？<span style={{cursor: "pointer"}}
                                                                        onClick={this.showRegister}>申请注册</span></p>
                        </Login>
                    </div>
                </div> :
                    <p className={styles.error}>配置失效，请联系网站管理员</p>
                }

                <FreeTrial visible={visible} confirmLoading={confirmLoading} onOk={this.registering}
                           onCancle={this.hideRegister}/>
            </div>

        );
    }
}
export default withRouter(LoginDemo);
