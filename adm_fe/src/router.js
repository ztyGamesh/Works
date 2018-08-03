import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import UserLayout from './layout/UserLayout'
import BasicLayout from './layout/BasicLayout'
import Exception403 from './views/Exception/403';
import Exception404 from './views/Exception/404';
import Exception500 from './views/Exception/500';

export default class Router extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/user/login" component={UserLayout}/>
                <Route path="/exception/403" exact component={Exception403}/>
                <Route path="/exception/404" exact component={Exception404}/>
                <Route path="/exception/500" exact component={Exception500}/>
                <Route path="/"  component={BasicLayout}/>
            </Switch>
        );
    }
}


