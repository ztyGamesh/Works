import React, {Component} from 'react';
import {Carousel, Card, Upload, Button, Icon} from 'antd';
import wrapWithAccessionPermission from '../../higher-order/wrapWithAccessPermission';
import './index.css';
import {Link} from 'react-router-dom';

import CMSDragList from '../../components/CMSDragList'


class Home extends Component {

  render() {
    return (
      <div>
          <Carousel autoplay className="demo">
              <div>
                  用户信息(右上角)
              </div>
              <div><Link to="/compose/add">创作新作品</Link></div>
              <div><Link to="/compose/list">作品列表</Link></div>
              <div>还想要什么..</div>
          </Carousel>
          <div>
              {/* <CMSDragList /> */}
          </div>
      </div>
    );
  }
}

Home = wrapWithAccessionPermission(Home);

export default Home;
