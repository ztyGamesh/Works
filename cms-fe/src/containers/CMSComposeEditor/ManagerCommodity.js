import React, {Component} from 'react';
import {Modal, Button, Input} from 'antd';
import EditorTitle from './EditorTitle';
import PicturesWall from './PicturesWall';

class ManagerCommodity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			// 外部接受的数据
			shopData: null,
			// 内部管理的数据
			innerData: {
				title: "",
				images: {
					mainImage: "",
					smallImages: []
				}
			}
		};
	}

	componentWillReceiveProps(nextProps) {
		// 1.接受参数
		// 1.1 接受打开ManagerCommodity的命令 visible:true
		// 1.2 将 触发 点击完善资料 的商品数据存储于 ManagerCommodity 中
		this.setState({
			visible: nextProps.isShow,
			// 接受外部的传来的数据
			shopData: nextProps.shopData,
			innerData: {
				title: nextProps.shopData ? nextProps.shopData.title : "",
				images: {
					mainImage: nextProps.shopData ? nextProps.shopData["pict_url"] : "",
                    smallImages: nextProps.shopData ? nextProps.shopData["small_images"] ? nextProps.shopData["small_images"]["string"] : [] : []
				}
			}
		})
	}

	handleOk(e) {
		// function isClass(o) {
		//   if (o === null)
		//   return "Null";
		//   if (o === undefined)
		//   return "Undefined";
		//   return Object.prototype.toString.call(o).slice(8, -1);
		// }
		// function deepClone(obj) {
		//   var result,
		//   oClass = isClass(obj);
		//   //确定result的类型
		//   if (oClass === "Object") {
		//     result = {};
		//   } else if (oClass === "Array") {
		//     result = [];
		//   } else {
		//     return obj;
		//   }
		//   for (var key in obj) {
		//     var copy = obj[key];
		//     if (isClass(copy) == "Object") {
		//       result[key] = deepClone(copy); //递归调用
		//     } else if (isClass(copy) == "Array") {
		//       result[key] = deepClone(copy);
		//     } else {
		//       result[key] = obj[key];
		//     }
		//   }
		//   return result;
		// }
		const deepClone = (obj) => {
			var proto = Object.getPrototypeOf(obj);
			return Object.assign({}, Object.create(proto), obj);
		}
		// 1. 将对于 商品数据的所有修改 集成成一个新的 数据对象
		var target = deepClone(this.state.shopData);
		// 所有对数据的修改写在这里
		// 数据对象可以修改的地方包括
		// target.title
		// target.pict_url
		// target.small_images.string
		// console.log(target)
		// console.log(this.state.innerData)
		target.title = this.state.innerData.title;
		target["pict_url"] = this.state.innerData.images.mainImage;
        if(!target["small_images"]){
            target["small_images"] = {};
        }
		target["small_images"]["string"] = this.state.innerData.images.smallImages;

		// console.log(target)
		// 2. 将新的数据对象返回给uEditor 这里的target是修改完数据以后的新数据对象
		this.props.fetchResult(target);
		// 关闭ManagerCommodity
        var me = this;
        // 关闭GoodsDetail
        this.props.closeShow()
        setTimeout(function() {
          me.setState({visible: false, shopData: target, innerData: me.state.innerData})
        }, 0)
  }

    handleCancel(e) {
      // 关闭GoodsDetail
      this.props.closeShow()
      this.setState({visible: false})
    }


	changeData(data) {
		function isType(target) {
			return Object.prototype.toString.call(target).slice(8, -1);
		}

		switch (isType(data)) {
			// 修改标题
			case "String":
				// console.log(data);
				this.setState({
					...this.state,
					innerData: {
						...this.state.innerData,
						title: data
					}
				})
				break;
			// 上传图片
			case "Array":
				console.log(data, "mongo");
				this.setState({
					...this.state,
					innerData: {
						...this.state.innerData,
						images: {
							...this.state.innerData.images,
							smallImages: data
						}
					}
				})
				break;
			// 更改主图
			case "Object":
				// console.log(data.mainImage)
				this.setState({
					...this.state,
					innerData: {
						...this.state.innerData,
						images: {
							...this.state.innerData.images,
							mainImage: data.mainImage
						}
					}
				})
				break;
			default:
				return
		}
	}




	render() {
		return (
			<div>
				<Modal title="编辑宝贝" visible={this.state.visible} onOk={this.handleOk.bind(this)}
				       onCancel={this.handleCancel.bind(this)}>
					<p>宝贝信息</p>
					<EditorTitle data={this.state.shopData} open={this.state.visible}
					             changeData={this.changeData.bind(this)}/>
					<p>
						￥{this.props.shopData
						? this.props.shopData["zk_final_price"]
						: "价格"}
					</p>
					<PicturesWall data={this.state.shopData} open={this.state.visible}
					              changeData={this.changeData.bind(this)}/>
				</Modal>
			</div>
		);
	}
}

export default ManagerCommodity;
