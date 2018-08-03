/*
 * 网络请求方法
 - url: 请求地址
 - options: 配置对象
 + catches: 异常处理 控制台抛出的异常是否自己处理
 * true: 是
 * false: 否 由公共方法统一处理优化显示给用户 默认 false
 + credentials: 请求带上cookies 使每次请求保持会话一直
 + method: 请求使用的方法
 + headers: 请求的头信息，形式为 Headers 对象或 ByteString值的对象字面量
 + body: 请求的 body 信息, GET or POST 方法的请求不能包含 body 信息
 + mode: 请求的模式 如 cors no-cors same-origin 是否允许跨域请求
 + cache: 请求的cache模式
 */
import React, {Component} from 'react';

// 普通的POST请求封装
export const DP_POST = (url, options) => {
	const myHeaders = {
		'Content-Type': 'application/json',
		// 'Content-Type': 'application/x-www-form-urlencoded',
		'Accept': 'application/json',
	}
	const init = {
		// credentials: 'include',
		method: "POST",
		mode: 'cors',
		headers: (options && options.headers) || myHeaders,
		cache: (options && options.cache) || 'default'
	}

	if (options && options.body) {
		init.body = JSON.stringify(options.body)
	}

	return fetch(url, init)
	.then(function (response) {
		if (response.ok) {
			return response.json()
		}
		else {
			if (options && options.catchs) {
				throw new Error(response.statusText)
			}
			else {
				var error = new Error(response.statusText);
				throw new Error('')
			}
		}
	})
}

// 普通的GET请求

export const DP_GET = (url) => {
	const myHeaders = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
	const init = {
		// credentials: 'include',
		method: "GET",
		mode: 'cors',
		headers: myHeaders,
		cache: 'default'
	}

	return fetch(url, init)
	.then(function (response) {
		if (response.ok) {
			return response.json()
		}
		else {
			throw new Error(response.statusText)
		}
	})
}

/*
 * 权限限定 验证封装
 * return  boolean
 *   - 有权限  true 可以继续访问
 *   - 无权限  false  跳转至于 登录页面
 *
 */
export const AccessPermission = () => {
	const url = SERVICE_AUTH_URL + "/User/AccessPermission";

	const option = {
		"token": JSON.parse(sessionStorage.getItem("token")) || "",
		"address": window.location.pathname
	}

	return DP_POST(url, {body: option})
	.then((res) => {
		if (res.status === "ok") {
			return true
		}
		return false
	})
}

/*
 * 登录校验 封装
 * return boolean
 *   - 成功 true
 *   - 失败 false
 */
export const UserLogin = (options) => {
	const url = SERVICE_AUTH_URL + "/User/Login";
	const option = {
		platform: 3,
		mail: options.mail,
		password: options.password
	}
	console.log(option)
	return DP_POST(url, {body: option})
	.then((res) => {
		if (res.status === "ok") {
			return res.data
		}
		return false
	})
}

/*
 * 获取用户权限 即获取主菜单数据列表封装
 *
 */
export const GetRoleData = () => {
	const url = SERVICE_AUTH_URL + "/Power/GetRolePower";
	const option = {
		"role": JSON.parse(sessionStorage.getItem("token")).role
	}
	return DP_POST(url, {body: option})
	.then((res) => {
		// return "ROle"
		return new Promise((resolve, reject) => {
			if (res.status === "ok") {
				resolve(res.data)
			}
			else {
				reject(res.status)
			}
		})
	})
}

/*
 * taobao商品的API
 */
export const DP_taobao = (address) => {
	// const url = SERVICE_API_URL + "/api/goods/taobao";
	const url = SERVICE_API_URL + "/api/goods/taobaoWithCheck";
	// 获取url中的id字段 name=id 方法
	function GetQueryString(name, shopUrl) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = shopUrl.substr(shopUrl.indexOf("\?") + 1).match(reg);  //获取url中"?"符后的字符串并正则匹配
		// console.log(shopUrl.substr(shopUrl.indexOf("\?") + 1))
		// console.log(r)
		var context = "";
		if (r != null)
			context = r[2];
		reg = null;
		r = null;
		return context == null || context == "" || context == "undefined" ? "" : context;
	}

	const shopId = GetQueryString("id", address);
	// console.log(address)
	// console.log(shopId)
	const option = {
		"goodsId": shopId,
		"type": "taobao"
	}
	return DP_POST(url, {body: option})
	.then((res) => {
		// console.log(res)
		return new Promise((resolve, reject) => {
			if (res.status === "ok") {
				resolve(res.data)
			}
			else {
				// console.log(res)
				// reject(res.status)
				resolve(res.status)
			}
		})
	})
	.catch((error) => {
		console.log(error)
	})
}
