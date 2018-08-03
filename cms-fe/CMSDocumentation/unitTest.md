代码单元测试说明

一.框架
1.mocha 单元测试框架
2.chai 断言库的expect API(BDD风格)
3.Enzyme 测试React
4.sinon 测试替代
5.istanbul 计算代码覆盖率

二.使用约定
1.所有用例写在test文件夹中

2.用例目录格式与被测试文件目录相同

3.测试用例命名为：测试文件名+.test.js
eg.  demo.js  ==>  demo.test.js

4.用例头部必须做如下引用
1)引入setup.js
eg. import '../../setup';
2)引入enzyme配置
eg.
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
configure({adapter: new Adapter()});

5.运行单元测试
在package.json文件中找到test:watch，复制其对应脚本代码并进行如下修改后，在终端执行。
替换NODE_ENV=production ./node_modules/.bin/mocha -w 后的路径为需要测试的用例。
eg. NODE_ENV=development ./node_modules/.bin/mocha -w test/components/PictureCollectionList/PictureCollectionList.test.js --compilers js:babel-core/register,css:test/css-ignore-compiler.js
