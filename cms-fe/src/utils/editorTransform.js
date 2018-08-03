/**
 * func: editorTransform
 * 功能替换编辑器输出为详情页需要的样式
 *  @param:data 编辑器输出html字符串
 */

//替换编辑器输出中文字p标签为详情页样式
function replaceChar(replaceNode) {
	if (replaceNode.getElementsByTagName('p')[0] !== undefined) {
		for (var i = 0, replaceCharNode = replaceNode.getElementsByTagName('p'); i < replaceCharNode.length; i++) {
			replaceCharNode[i].className = 'articleCharacter'
		}
	}
	return replaceNode;
}

//替换编辑器输出中图片img标签为详情页样式
//不需考虑商品中的图片，replaceGoods会将整个商品dom替换
function replaceImage(replaceNode) {
	if (replaceNode.getElementsByTagName('img')[0] !== undefined) {
		for (var i = 0, replaceImageNode = replaceNode.getElementsByTagName('img'); i < replaceImageNode.length; i++) {
			replaceImageNode[i].className = 'articlePicture';
			replaceImageNode[i].setAttribute('data-url', replaceImageNode[i].getAttribute('src'));
			replaceImageNode[i].setAttribute('src', '');
			replaceImageNode[i].removeAttribute('width');
			replaceImageNode[i].removeAttribute('height');
			replaceImageNode[i].removeAttribute('style');
		}
	}
	return replaceNode;
}

//替换编辑器输出中商品部分为详情页样式
function replaceGoods(replaceNode) {
	if (replaceNode.getElementsByClassName('wrapperOld')[0] !== undefined) {
		var goodsdata = JSON.parse(replaceNode.getElementsByClassName('wrapperOld')[0].getAttribute('data-shop'));
		var effectNode = document.createElement('div');
		effectNode.setAttribute('class', 'articleCommodity');
		effectNode.setAttribute('data-load', goodsdata.item_url);
		effectNode.setAttribute('data-itemId', goodsdata.num_iid);
		effectNode.setAttribute('data-uid', goodsdata.uid);


		var articleCommodityPicture = document.createElement('img');
		articleCommodityPicture.setAttribute('class', 'articleCommodityPicture');
		articleCommodityPicture.setAttribute('src', goodsdata.pict_url);


		var articleCommodityWrapper = document.createElement('div');
		articleCommodityWrapper.setAttribute('class', 'articleCommodityWrapper');

		var articleCommodityTitle = document.createElement('p');
		articleCommodityTitle.setAttribute('class', 'articleCommodityTitle');
		articleCommodityTitle.textContent = goodsdata.title;

		var articleCommodityPrice = document.createElement('div');
		articleCommodityPrice.setAttribute('class', 'articleCommodityPrice');

		var articleSymbol = document.createElement('span');
		articleSymbol.setAttribute('class', 'symbol');
		articleSymbol.textContent = '¥';

		var articlePrice = document.createElement('span');
		articlePrice.setAttribute('class', 'price');
		articlePrice.textContent = goodsdata.zk_final_price;

		articleCommodityPrice.appendChild(articleSymbol);
		articleCommodityPrice.appendChild(articlePrice);

		var buyBtn = document.createElement('img');
		buyBtn.setAttribute('src', 'http://effect.deepleaper.com/effect/img/buyBtn.png');
		buyBtn.setAttribute('class', 'buyBtn');

		articleCommodityWrapper.appendChild(articleCommodityTitle);
		articleCommodityWrapper.appendChild(articleCommodityPrice);
		articleCommodityWrapper.appendChild(buyBtn);

		effectNode.appendChild(articleCommodityPicture);
		effectNode.appendChild(articleCommodityWrapper);

		replaceNode.getElementsByClassName('wrapperOld')[0].parentNode.replaceChild(effectNode, replaceNode.getElementsByClassName('wrapperOld')[0]);

		return replaceGoods(replaceNode);
	} else {
		return replaceNode
	}
}

//node节点转换为字符串
function nodeToString(node) {
	var tmpNode = document.createElement("div");
	tmpNode.appendChild(node.cloneNode(true));
	var str = tmpNode.innerHTML;
	tmpNode = node = null; // prevent memory leaks in IE
	return str;
}

//替换编辑器输出为详情页需要的样式
export const editorTransform = (data) => {
	var replaceNode = document.createElement('div');
	replaceNode.innerHTML = data;
	replaceNode = replaceImage(replaceNode);
	replaceNode = replaceChar(replaceNode);
	replaceNode = replaceGoods(replaceNode);
	replaceNode = nodeToString(replaceNode);
	return replaceNode;
};