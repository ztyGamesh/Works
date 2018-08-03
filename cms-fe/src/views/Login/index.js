import React, { Component } from 'react';
import { Form, Input, Button, notification, Icon } from 'antd';
import {UserLogin} from '../../utils/fetch';

import './index.less'

const FormItem = Form.Item;

class LoginPage extends Component {

    handleSubmit(e) {
        e.preventDefault();
        //登录校验
        const option = this.props.form.getFieldsValue();
        UserLogin(option)
        .then((res) => {
          // res 就是data
          // 否则返回 false
          if (res) {
            sessionStorage.setItem('token', JSON.stringify(res.token));
            sessionStorage.setItem('user', JSON.stringify(res.user));
            this.props.history.push("/");
            history.go(0)
          }
          else {
            this.openNotificationWithError("info")
          }
        })
    }

    // 返回一个弹框对象，提示用户名和密码
    openNotificationWithIcon (type) {
        return notification[type]({
                 message: '跃盟科技',
                 description: 'Deepleaper',
                 duration: 6,
                 icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
               })
    }
    // 返回一个弹框对象, 提示用户登录信息错误
    openNotificationWithError (type) {
      return notification[type]({
               message: '用户名or密码 错误',
               description: '请重新输入',
               duration: 1,
               icon: <Icon type="frown" style={{ color: 'red' }} />,
             })
    }

    componentDidMount() {
        this.openNotificationWithIcon('info');
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="loginpagewrap">
                <div className="box">
                    <p>Welcome to the Deepleaper&CMS</p>
                    <div className="loginWrap">
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <FormItem>
                                {getFieldDecorator('mail', {
                                    rules: [{ required: true, message: '请输入用户名' }],
                                })(
                                    <Input placeholder="Username" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }],
                                })(
                                    <Input type="password" placeholder="Password" />
                                )}
                            </FormItem>
                            <Button type="primary" htmlType="submit" className="loginBtn">登录</Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

let Login = Form.create()(LoginPage);
export default Login;
