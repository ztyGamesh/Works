import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
configure({adapter: new Adapter()});

import React from 'react';
import {expect} from 'chai';
import {shallow,mount} from 'enzyme';
import sinon from 'sinon';

describe('测试AddCommodity组件', function () {

	it('跑通测试', function () {
		expect(10).to.be.above(5)
	});

});


// describe('Array', function() {
// 	describe('#indexOf()', function() {
// 		it('should return -1 when the value is not present', function() {
// 			expect(4 + 5).to.be.equal(9);
// 		});
// 		it('.not 对之后的断言取反',function () {
// 			expect(foo).to.not.equal('bar');
// 		})
// 	});
// });