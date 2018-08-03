/**
 * Created by liuchangyu on 2017/11/9.
 * 测试用例demo
 */
import './setup';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
configure({adapter: new Adapter()});
import React from 'react';
import {expect} from 'chai';
import {shallow,mount,render} from 'enzyme';
import sinon from 'sinon';


describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			expect(-1, [1,2,3].indexOf(4)).to.be.ok;
		});
	});
});