import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
configure({adapter: new Adapter()});

import React from 'react';
import {expect} from 'chai';
import {shallow,mount} from 'enzyme';
import sinon from 'sinon';
import PictureCollectionList from '../PictureCollectionList'
import PictureCollection from '../PictureCollection'

describe('测试react组件渲染', function () {
	var content = [
		{
			pic: '',
			description: '',
			goodsPromotion: [
				{
					uid: '',
					pic: '',
					title: '',
					price: '',
					smallImages: [],
					url: ''
				}
			]
		}, {
			pic: '',
			description: '',
			goodsPromotion: [
				{
					uid: '',
					pic: '',
					title: '',
					price: '',
					smallImages: [],
					url: ''
				}
			]
		}
	];
	function addPic() {

	}

	function savePic() {

	}

	function saveDescription() {

	}

	function saveGoods() {

	}

	function deletePic() {

	}

	function movePic() {

	}

	it('将会渲染2个 <PictureCollectionList /> 组件', function () {

		const wrapper = shallow(<PictureCollectionList content={content} addPic={addPic}
		                                               savePic={savePic} saveDescription={saveDescription}
		                                               saveGoods={saveGoods} deletePic={deletePic}
		                                               movePic={movePic} />);
		expect(wrapper.find('PictureCollection')).to.have.lengthOf(2);
	});

	it(' <Alert /> components', function () {
		const wrapper = shallow(<PictureCollectionList content={content} addPic={addPic}
		                                               savePic={savePic} saveDescription={saveDescription}
		                                               saveGoods={saveGoods} deletePic={deletePic}
		                                               movePic={movePic} />);
		expect(wrapper.find('Alert').exists()).to.be.ok;
	});

	it('点击添加按钮，addPic函数被执行',function () {
		var callback = sinon.spy();
		const wrapper = mount(<PictureCollectionList content={content} addPic={callback}
		                                               savePic={savePic} saveDescription={saveDescription}
		                                               saveGoods={saveGoods} deletePic={deletePic}
		                                               movePic={movePic} />);
		wrapper.find('Button').simulate('click');
		expect(callback.calledOnce).to.be.ok;
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