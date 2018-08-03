import React, { Component } from 'react';
import {Prompt} from 'react-router-dom';

// 验证是否离开页面的高阶组件
export default (WrappedComponent) => {
  class NewComponent extends Component {
    render() {
      return (
        // 把其他咱叔原封不动地传递给被包装的组件
        <div>
            <WrappedComponent {...this.props}/>
            <Prompt message="是否离开当前页面?未保存内容将会丢失"/>
        </div>
      );
    }
  }

  return NewComponent
};
