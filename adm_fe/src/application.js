import React, {Component} from 'react'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {ConnectedRouter, routerReducer, routerMiddleware, push} from 'react-router-redux'
import createHistory from 'history/createHashHistory'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import 'ant-design-pro/dist/ant-design-pro.css'
import reducers from './reducers'
import {RUNTIMEENV} from './common/env'
import Router from './router.js'

//config middleware
const middleware = [];
const history = createHistory();
const reactRouterMiddleware = routerMiddleware(history);
middleware.push(reactRouterMiddleware);
middleware.push(thunkMiddleware);
if (RUNTIMEENV === 'development') {
    middleware.push(logger);
}

//create store
const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer
    }),
    applyMiddleware(...middleware)
);
export var exStore = store;
export default class Application extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Router />
                </ConnectedRouter>
            </Provider>
        );
    }
}