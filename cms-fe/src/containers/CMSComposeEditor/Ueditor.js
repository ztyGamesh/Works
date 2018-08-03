import React, {Component} from 'react';
import EditorToolbar from './EditorToolbar';
import ManagerCommodity from './ManagerCommodity'
import CommodityButton from './CommodityButton';
import './Ueditor.css'

class Ueditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			managerShow: false,
			currentShopData: null,
			currentElement: null,
			// editorContent: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		const ue = UE.getEditor('content');
		ue.ready(() => {
			if (ue.getContent() === '') {
				ue.setContent(nextProps.editorContent);
			}
		});
		// this.setState({
		//     editorContent: nextProps.editorContent
		// }, () => {
		//     UE.getEditor('content').ready(() => {
		//         UE.getEditor('content').setContent(this.state.editorContent);
		//     })
		// })
	}

    componentWillMount() {
        this.GoodsButton()
    }

	componentDidMount() {
		this.initEditor()
		var me = this;
		//给编辑器内部添加点击事件
		UE.getEditor('content').addListener('click', function (e) {
			// 深层克隆函数
			const deepClone = (obj) => {
				var proto = Object.getPrototypeOf(obj);
				return Object.assign({}, Object.create(proto), obj);
			}
			// this 可以获得编辑器的实例对象 然后判断点击的是否是 trigger
			this.body.onclick = function (e) {
				if (e.target.className === 'trigger') {
					// 如果点击的是trigger
					// 1. 将存取在商品中的数据取出来 e.path[2].dataset.shop
					// 2. 将数据做展示 并保存修改
					// 3. 重新存入 商品内部
					console.log('trigger');
					// 处理商品数据开始 入口
					// 1. 触发 点击完善资料 从商品身上获取数据
					// console.log(e.path[2].dataset.shop);
					console.log(e.path[2].dataset.shop)
					var shopData = deepClone(JSON.parse(e.path[2].dataset.shop));
					// 2. 将数据传递到 ManagerCommodity 组件
					// 2.1 将ManagerCommodity组件打开
					// 2.2 将商品身上的数据 挂在到 Ueditor组件上  便于传入ManagerCommodity组件
					// 2.3 将当前的点击对象保存 为了后面将处理完毕的数据 更新到商品身上
					me.setState({
						managerShow: true,
						currentShopData: shopData,
						currentElement: e
					})
					// e.path[2].dataset.shop = shopData;
				}
			}
		})

		//实时获取编辑器内容
		UE.getEditor('content').addListener('contentChange', function () {
			me.props.saveEditorContent(this.getContent());
		});
	}

    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        UE.delEditor(this.props.id);
    }
    // 处理goodsButton的显示问题
    openGoodsButton () {
        // fn == true 点击
        this.setState({
            showButton: true
        })
    }
    closeGoodsButton () {
        this.setState({
            showButton: false
        })
    }

    // 处理添加商品显示的问题
    closeGoodsDetail () {
        this.setState({
            managerShow: false
        })
    }
    // 编辑器内部创建按钮demo
    // 如果需要生效 需要在 componentWillMount 中调用 this.GoodsButton()
    GoodsButton() {
        /**
         * 创建按钮
         */
        var that = this;
        UE.registerUI('goods', function (editor, uiName) {
            // 策略模式编写按钮逻辑
            var buttonCategories = {
                // 这里扩展按钮的逻辑算法
                "goods": function () {
                    that.openGoodsButton()
                },
            }

            var bindButton = function (strategy, uiName) {
                strategy[uiName]()
            }
            //注册按钮执行时的command命令，使用命令默认就会带有回退操作
            editor.registerCommand(uiName, {
                execCommand: function (uiName) {
                    console.log('execCommand function');
                }
            });
            //创建一个button
            var btn = new UE.ui.Button({
                //按钮的名字
                name: uiName,
                //提示
                title: uiName,
                //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                //icons.png x方向20px一个图标
                cssRules: 'background-position: -800px -40px;',
                //点击时执行的命令
                onclick: function () {
                    //这里可以不用执行命令,做你自己的操作也可
                    editor.execCommand(uiName);
                    // 如果添加多个按钮 这里可以根据uiName来分类处理算法
                    bindButton(buttonCategories, uiName)
                }
            });
            //当点到编辑内容上时，按钮要做的状态反射
            editor.addListener('selectionchange', function () {
                var state = editor.queryCommandState(uiName);
                if (state == -1) {
                    btn.setDisabled(true);
                    btn.setChecked(false);
                } else {
                    btn.setDisabled(false);
                    btn.setChecked(state);
                }
            });
            //因为你是添加button,所以需要返回这个button
            return btn;
        });
    }

    initEditor() {
        const id = this.props.id;
        const ueEditor = UE.getEditor(this.props.id, {
            /*这里是配置*/
            toolbars: [
                [
					'selectall',
					'cleardoc',
                    'undo',
                    'redo',
                    'bold',
                    'italic',
                    'underline',
                    'justifyleft',
                    'justifycenter',
                    'justifyright',
                    'justifyjustify',
                    'simpleupload',
                    'forecolor',
					'backcolor',
                    'insertorderedlist',
                    'insertunorderedlist',
                    'horizontal',
                    'paragraph',
                ]
            ],
            allowDivTransToP: false,
            disabledTableInTable: true
        });
        const self = this;
        ueEditor.ready((ueditor) => {
            if (!ueditor) {
                UE.delEditor(id);
                self.initEditor();
            }
        })
    }

	// 接收 ManagerCommodity 修改完成后的数据
	// 数据接收器
	handleManagerData(data) {
		// 更改页面的显示
		// console.log(data)
		// console.log(this.state.currentElement)
		// console.log(this.state.currentElement.path[1].nextSibling.children[0].innerHTML);
		// console.log(this.state.currentElement.path[1].children[0].src);
		var temptitle = this.state.currentElement.path[1].nextSibling.children[0].innerHTML;
		var tempSrc = this.state.currentElement.path[1].children[0].src;
		if (!data.title) {
			data.title = temptitle;
			this.state.currentElement.path[1].nextSibling.children[0].innerHTML = temptitle;
		} else {
			this.state.currentElement.path[1].nextSibling.children[0].innerHTML = data.title;
		}
		if (!data["pict_url"]) {
			data["pict_url"] = tempSrc;
			this.state.currentElement.path[1].children[0].src = tempSrc;
			this.state.currentElement.path[1].children[0].setAttribute('_src', tempSrc);
		} else {
			this.state.currentElement.path[1].children[0].src = data["pict_url"];
			this.state.currentElement.path[1].children[0].setAttribute('_src', data["pict_url"]);
		}
		// 将新的数据对象更新到 触发 点击完善资料 的商品上
		this.state.currentElement.path[2].dataset.shop = JSON.stringify(data);
		// 接受回 ManagerCommodity 返回的新的数据对象 data
		// 将新的数据对象更新到Ueditor
		this.setState({
			currentShopData: data
		})
	}
	// 完善商品资料关闭后的回调
	handleManagerShow(state) {
		this.setState({
			managerShow: state
		})
	}

    render() {
        return (
            <div className="Ueditor">
                {/* 将弹出按钮的标识从这里传入 利用this.state.showButton 是在goods处理函数中完成的 */}
                <EditorToolbar
                    openGoods={this.openGoodsButton.bind(this)}
                    closeGoods={this.closeGoodsButton.bind(this)}
                    showButton={this.state.showButton}
                />
                <div id={this.props.id} name="content" type="text/plain"></div>
                {/* 1.打开ManagerCommodity组件 2.将触发 点击完善资料 的商品数据从Ueditor传入ManagerCommodity */}
                <ManagerCommodity
                    isShow={this.state.managerShow}
                    closeShow={this.closeGoodsDetail.bind(this)}
                    shopData={this.state.currentShopData}
                    fetchResult={this.handleManagerData.bind(this)}
                />
                <div className="editorLoading">
                    <p className="editorMsg">
                        图片上传中,请等待...
                    </p>
                </div>
            </div>
        )
    }
}

export default Ueditor;
