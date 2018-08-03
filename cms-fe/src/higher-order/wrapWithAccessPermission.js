import React, { Component } from 'react';
import {AccessPermission} from '../utils/fetch';
import {message} from 'antd';

// 验证权限的高阶组件
export default (WrappedComponent) => {
  class NewComponent extends Component {
    componentWillMount() {
      AccessPermission()
      .then((res) => {
        if (!res) {
            alert("登录失效，请重新登录")
            this.props.history.push('/login')
        }
      })
    }

    render() {
      return (
        // 把其他咱叔原封不动地传递给被包装的组件
        <WrappedComponent {...this.props}/>
      );
    }
  }

  return NewComponent
};
