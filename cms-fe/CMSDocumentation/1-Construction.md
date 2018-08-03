# 智推项目结构说明

## 使用角度(角色权限)

- 编辑
- 审核
- 运营

## 页面流程

- 入口: http:cms.deepleaper.com/login 说明: 任何其他的url都会被重定向到http:cms.deepleaper.com,并进行权限校验。如果不满足校验，则会跳转到http:cms.deepleaper.com/login.如果满足，则进行跳转。

- React项目构建完成后，向外吐出src/index.js文件。

- src/index.js 向外吐出一个路由组件，在目录src/routes中，该目录是用来管理路由的目录，路由管理的代码写在src/routes/Root.js中。
- 路由组件src/routes/Root.js做两件事。

  1. 将数据管理流Redux传到react项目全局中，即Provide中的store
  2. 管理前端未登录时的路由，将所有url重定向到http:cms.deepleaper.com，并且对http:cms.deepleaper.com/login吐出登录页面

- React中所有的页面都管理在src/views目录中。从登录页面Login进入。
- 在Login页面进行登录，用户输入账号密码，前端发送至后端进行校验，如果有效，则将后端返回的token存储在sessionStorage中，并进行http:cms.deepleaper.com跳转。如果无效，则给出提示，并停留在登录页面。
- 登录成功后，界面跳转至http:cms.deepleaper.com界面。(每次进入一个界面的时候，都会验证token是否是有效的，如果无效，都会跳转至于/login进行登录，验证函数已经进行封装)
- 进入http:cms.deepleaper.com界面后，该界面属于布局界面layouts，即对应于src/layouts/index.js。该界面有2部分。

  1. 左边部分 根据token返回的menu 不同权限展示的目录不同
  2. 右边部分 顶部TOP以及下部的Content

- React Route 根据url的不同，在右边部分渲染不同的组件
