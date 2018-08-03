import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {
	BrowserRouter,
	Route,
	Redirect,
	Switch,
	Link
} from 'react-router-dom';
import Layouts from '../layouts/index';
import store from '../store';
import {DP_POST} from '../utils/fetch';

import Login from '../views/Login';
import NoMatch from '../views/NoMatch';
import Home from '../views/Home';


class Root extends Component {

	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Switch>
						<Route exact path="/login" component={Login}/>
						<Route path="/" component={Layouts}/>
						<Redirect form="*" to="/"/>
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}
;

export default Root;
