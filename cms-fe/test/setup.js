/**
 * http://airbnb.io/enzyme/docs/guides/jsdom.html
 * 使用jsdom解决mocha's mount方法对于dom环境的需要
 */
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
	const props = Object.getOwnPropertyNames(src)
	.filter(prop => typeof target[prop] === 'undefined')
	.reduce((result, prop) => ({
		...result,
		[prop]: Object.getOwnPropertyDescriptor(src, prop),
	}), {});
	Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
	userAgent: 'node.js',
};
copyProps(window, global);