import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import {Layout} from 'antd';

// 首页
import Home from '../views/Home';

// 功能页面
/* 审核列表页面*/
import AuditList from '../views/Audit/AuditList';
/* 审核列表编辑图文页面*/
import AuditDetail from '../views/Audit/AuditDetail';
/* 审核列表编辑图集页面*/
import AuditPic from '../views/Audit/AuditPic';
/* 审核视频页面*/
import AuditVideo from '../views/Audit/AuditVideo';
/* 创作新作品入口页面*/
import ComposeEntry from '../views/Compose/ComposeEntry';
/* 创作新图文页面*/
import ComposeAdd from '../views/Compose/ComposeAdd';
/* 创作新图集页面*/
import ComposePic from '../views/Compose/ComposePic';
/* 创作列表查看页面*/
import ComposeDetail from '../views/Compose/ComposeDetail';
/* 创作列表页面*/
import ComposeList from '../views/Compose/ComposeList';
/* 内容列表页面*/
import ContentList from '../views/Content/ContentList';
/* 发布列表页面*/
import PublishList from '../views/Publish/PublishList';
/* 内容二次创作*/
import ComposeSecondCreation from '../views/Compose/ComposeSecondCreation';
/* 淘宝商品导入 */
import GoodsImport from '../views/Goods/GoodsImport';



// 404 页面
import NoMatch from '../views/NoMatch';

const {Content} = Layout;

export default class Main extends Component {

  componentWillMount() {
    console.log(this.props.url)
  }
  render() {
    return (
      <Content>
          <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/audit/list" component={AuditList}></Route>
              <Route exact path="/audit/detail" component={AuditDetail}></Route>
              <Route exact path="/audit/pic" component={AuditPic}></Route>
              <Route exact path="/audit/video" component={AuditVideo}></Route>
              <Route exact path="/compose/entry" component={ComposeEntry}></Route>
              <Route exact path="/compose/add" component={ComposeAdd}></Route>
              <Route exact path="/compose/pic" component={ComposePic}></Route>
              <Route exact path="/compose/list" component={ComposeList}></Route>
              <Route exact path="/compose/detail" component={ComposeDetail}></Route>
              <Route exact path="/content/list" component={ContentList}></Route>
              <Route exact path="/composePublish/list" component={PublishList}></Route>
              <Route exact path="/compose/secondCreation" component={ComposeSecondCreation}></Route>
              <Route exact path="/goods/import" component={GoodsImport}></Route>
              <Route component={NoMatch}></Route>
          </Switch>
      </Content>
    );
  }
};
