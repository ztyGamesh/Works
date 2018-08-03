import React, {Component} from 'react';
import {Upload, Icon, Card} from 'antd';
import _ from 'underscore';
import './PicturesWall.css';
class PicturesWall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      choose: '',
      mainImage: '',
        fileListTemp: '',
        mainImageTemp: '',
    };
  }
  componentWillMount() {
    // 宝贝主图
    // console.log(nextProps.mainImage)
    // 宝贝携带的选项图集合
    // console.log(nextProps.smallImages)
    // this._prepare()
    // console.log(this.props.data)
    this._prepare();
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.open){
        this.setState({
            fileListTemp: '',
            mainImageTemp: '',
        });
        return;
    }
    function createSmallImages(smallImages) {
      return smallImages.map(function (item, index) {
        return {
          uid: index,
          name: "xxx.png",
          status: "done",
          url: item.url || item
        }
      })
    }
    this.setState({
      mainImage: this.state.mainImageTemp || nextProps.data["pict_url"],
      fileList: this.state.fileListTemp || createSmallImages(nextProps.data["small_images"] ? nextProps.data["small_images"]["string"] : []),
    })
  }
  _prepare() {
    function createSmallImages(smallImages) {
      return smallImages ? smallImages.map(function (item, index) {
        return {
          uid: index,
          name: "xxx.png",
          status: "done",
          url: item.url || item
        }
      }): []
    }
    this.setState({
      mainImage: this.props.data["pict_url"],
      fileList: createSmallImages(this.props.data["small_images"] && this.props.data["small_images"]["string"])
    })
  }
  handleCancel() {
    this.setState({previewVisible: false})
  }

  handlePreview(file) {

    // console.log(file.url)
    // this.setState({
    //   ...this.state,
    //   mainImage: file.url || file.response.data[0].url
    // })
    this.props.changeData({
      mainImage: file.url || file.response.data[0].url
    })
    var me = this;
    // console.log(this.state)
    setTimeout(function () {
      me.setState({
        ...me.state,
        mainImage: file.url || file.response.data[0].url,
          mainImageTemp: file.url || file.response.data[0].url,
      })
    },0)
  }

  handleChange({fileList, file}) {
    // console.log(file.response)
    // console.log(fileList)
    // console.log(file)
    if (fileList.length === 0) {
      return
    }
    const deepClone = (obj) => {
      var proto = Object.getPrototypeOf(obj);
      return Object.assign([], Object.create(proto), obj);
    }
    var myFileList = deepClone(fileList);
    var last = deepClone(_.last(myFileList));
    if (last.status === "done") {
      myFileList[myFileList.length - 1] = {
        uid: last.uid,
        name: last.name,
        status: 'done',
        url: last.response ? last.response.data[0].url : last.url
      }
      this.props.changeData(myFileList)
    }
    this.setState({
      fileList: myFileList,
        fileListTemp: myFileList,
    })

  }

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
          <Icon type="plus"/>
          <div className="ant-upload-text">添加上传图片</div>
      </div>
    );
    return (
      <div className="clearfix PicturesWall">
        <Card bodyStyle={{padding: 0}} style={{width:"210px",height:"250px",padding:"0 4px"}}>
           <p style={{fontSize:"24px"}}>宝贝主图</p>
           <img src={this.state.mainImage}
                width="200px"
                height="200px"
            />
        </Card>
        <p>请选择宝贝主图:</p>
        <Upload action={SERVICE_API_URL+"/api/upload"}
        listType="picture-card"
        fileList={this.state.fileList}
        onPreview={this.handlePreview.bind(this)}
        onChange={this.handleChange.bind(this)}
        >
          {fileList.length >= 10
            ? null
            : uploadButton}
        </Upload>
      </div>
    );
  }
}

export default PicturesWall;
