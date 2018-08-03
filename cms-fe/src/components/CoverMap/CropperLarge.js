import React, {Component} from 'react';
import Cropper from 'react-cropperjs';
import {Button, Icon, message} from 'antd';
import propTypes from 'prop-types';
import {DP_POST} from '../../utils/fetch';
import CMSModal from '../CMSModal';
// const src = "http://img4.imgtn.bdimg.com/it/u=1602552054,373587514&fm=27&gp=0.jpg";
const src = "";
// 将图文的UE.getEditor("content").getContent()中的图片提取出来
function tuwenImg() {
	var str = UE.getEditor("content").getContent();
	const imgReg = /<img.*?(?:>|\/>)/gi;
	var arr = str.match(imgReg);
	if (!arr) {
		arr = [];
	};
	// var result = arr.filter((imgStr) => {
	// 	var div = document.createElement('div');
	// 	div.innerHTML = imgStr;
	// 	if (div.children[0].title !== "") {
	// 		return true
	// 	} else {
	// 		return false
	// 	}
	// })
	// console.log(result);
	return arr;
}
class CropperLarge extends Component {
	constructor(props) {
		super(props);
		this.state = {
			src,
			cropResult: null,
			fileName: "",
			tuwenImg: null
		};
		this.cropImage = this.cropImage.bind(this);
		this.onChange = this.onChange.bind(this);
		this.chooseFromContent = this.chooseFromContent.bind(this);
		this.chooseFromtuwen = this.chooseFromtuwen.bind(this);
	}

	onChange(e) {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;
		}
		const reader = new FileReader();
		console.log(files)
		reader.onload = () => {
			var originBase64 = reader.result.split(",")[1];
			console.log("实际图片大小是:" + window.atob(originBase64).length)
			this.setState({src: reader.result, fileName: files[0].name});
		};
		reader.readAsDataURL(files[0]);
	}

	cropImage() {
		if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
			return;
		}
		// 点击裁剪的时候需要做的事情
		// 1.获取裁剪框的尺寸 生成裁剪的option
		// 2.将option 传入 getCroppedCanvas，然后调用裁剪API 生成base64
		var cropBoxOption = this.cropper.getCropBoxData();
		var imgOption = {
  			width: parseInt(cropBoxOption.width),
  			height: parseInt(cropBoxOption.height)
		}
		var imgSize = window.atob(this.cropper.getCroppedCanvas(imgOption).toDataURL("image/jpeg").split(",")[1]).length;
		if (imgSize > 150000) {
			message.error("裁剪后的封面图过大，请重新裁剪或上传")
			return
		}
		console.log(imgSize)
		this.setState({cropResult: this.cropper.getCroppedCanvas(imgOption).toDataURL("image/jpeg")});
	}

	handleUpload() {
		const url = `${SERVICE_API_URL}/api/upload64`;
		const option = {
			content: this.state.cropResult,
			fileName: this.state.fileName
		}
		// 提交base64 裁剪完的图片数据
		DP_POST(url, {body: option})
			.then((res) => {
				if (res.status === "ok") {
					message.info("图片上传成功");
					// 将URL存入redux
					var tempArr = {
			          "pic": res.data[0].url
			        };
					this.props.fetchDisplayInfoContent({
			          content: JSON.stringify(tempArr),
					  type: 1
			        })
				} else if (res.status === "failed") {
					message.error("图片上传失败")
				}
			})
	}
	chooseFromContent(e) {
		this.setState({src: e.target.src, fileName: 'fromContent'});
	}
	chooseFromtuwen() {
		console.log(tuwenImg);
		var resultArr = tuwenImg();
		var resultImgs = resultArr.map((pic,index) => {
			var div = document.createElement('div');
			div.innerHTML = pic;
			return <img src={div.children[0].src} key={index} onClick={this.chooseFromContent} style={{width:"50px",height:"50px",margin:"2px"}}/>
		})
		this.setState({
			tuwenImg: resultImgs
		})
		// console.log(resultImgs);
		return resultImgs;
	}
	render() {
		// var tuwenImgs = tuwenImg();
		// var tuwenImgs = [1, 2, 3];
		return (
			<div>
				<div style={{float: 'left'}}>
					<div>
						<input type="file" onChange={this.onChange.bind(this)} style={{float: 'left'}}/>

						<Button onClick={this.cropImage} style={{float: 'left'}} type="danger">
							裁剪图片
						</Button>
						<CMSModal
							title="从内容中选择"
							text="从内容中选择"
						>
							{(this.props.mode === "tuji" && this.props.modeContent.length !== 0)
								? this.props.modeContent.map((pic, index) => {
									return <img
										src={pic.pic}
										key={index}
										style={{width:"50px", height:"50px",margin:"2px", cursor:"pointer"}}
										onClick={this.chooseFromContent}
										   />
								}) : this.props.mode === "tuwen" ? <div>
									<Button onClick={this.chooseFromtuwen}>从图文获取封面图</Button>
									<div>
										{this.state.tuwenImg}
									</div>
								</div> : this.props.mode === "shipin" ? <div>暂未开放,请自行上传</div> : ''
							}
						</CMSModal>
					</div>
					<br style={{clear: 'both'}}/>
					<Cropper
						// viewMode={3}
						style={{
							height: 300,
							width: 400
						}}
						aspectRatio={16 / 9}
						autoCropArea={0.4}
						scalable={false}
						minCropBoxWidth={160}
						minCropBoxHeight={90}
						preview=".img-preview"
						guides={false}
						zoomable={false}
						src={this.state.src}
						ref={cropper => {this.cropper = cropper}}/>
				</div>
				<div className="box" style={{
					width: '50%',
					float: 'right'
				}}>
					<Button icon="select" style={{float: 'right'}} type="primary" onClick={this.handleUpload.bind(this)}>上传</Button>
					<Button type="dashed" size="large" style={{float: 'left'}}>裁剪后的封面图</Button>
					<img style={{
						width: '320px',
						heigth: "180px"
					}} src={this.state.cropResult} alt="裁剪的结果"/>
				</div>
				<br style={{clear: 'both'}}/>
			</div>
		);
	}
}

CropperLarge.propTypes = {
	saveDisplayInfo: propTypes.func
}

export default CropperLarge;
