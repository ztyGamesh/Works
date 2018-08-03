import React, {Component} from 'react'
import {notification, message, Modal} from 'antd'
import axios from 'axios'
import {exStore} from '../application'
import {push} from 'react-router-redux'
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限。（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const status = error.response.status;
    if (status === 401) {
        exStore.dispatch(push('/user/login'));
    } else if (status === 403) {
        exStore.dispatch(push('/exception/403'));
    } else if (status <= 504 && status >= 500) {
        exStore.dispatch(push('/exception/500'));
    } else if (status >= 404 && status < 422) {
        exStore.dispatch(push('/exception/404'));
    }
    return Promise.reject(error);
});

/**
 * Requests a URL, returning a promise.
 *
 * @param  {object} [options] The options we want to pass to "axios"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(options) {
    const defaultOptions = {
        withCredentials: true
    };
    const newOptions = {...defaultOptions, ...options};
    if (newOptions.method === 'post' || newOptions.method === 'put') {
        if (!(newOptions.data instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest',
                ...newOptions.headers,
            };
            newOptions.data = JSON.stringify(newOptions.data);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
                ...newOptions.headers,
            };
        }
    } else if (newOptions.method === 'get') {
        const query = newOptions.data || {};
        const queryKeys = Object.keys(query);
        if(queryKeys.length) {
            newOptions.url = newOptions.url + '?' + queryKeys.map(key=>`${key}=${query[key]}`).join('&')
        }
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            ...newOptions.headers,
        };
    }

    return new Promise(function (resolve, reject) {
        axios(newOptions)
            .then((response)=> {
                resolve(response.data)
            })
    });
}
