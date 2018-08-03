import React, { Component } from 'react';
import './index.css';
import {Link} from 'react-router-dom';
export default class NoMatch extends Component {
  render() {
    return (
      <div id="main">
        <div id="header">
          <h1>Page Gone To Heaven And Doesn't Want To Come Back<span>404 Error - Not Found </span></h1>
        </div>
        <div id="content">
          <ul className="nav">
              <li className="home"><Link to="/">Home</Link></li>
                <li className="site_map"><Link to="/compose/add">创作新作品</Link></li>
                <li className="search"><Link to="/compose/list">作品列表</Link></li>
             </ul>
             <p>Hey, you're early! You don't belong here - at least not today. Besides, what you're looking for is not here anyways.<br />
             So why don't you go to our <Link to="/">Home</Link>, check out our sitemap or try using the website search</p>
        </div>
      </div>
    );
  }
};
