import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import {DP_POST} from '../utils/fetch';
class MyUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
    }
  }


  handleUpload() {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      // console.log(file)
      formData.append('files', file);
    });
    // formData.append('files', fileList)

    this.setState({
      uploading: true,
    });
    const url = SERVICE_API_URL+"/api/uploadCsv";
    fetch(url, {
      method: 'post',
      body: formData
    })
    .then((res) => {
      if (res.stauts === 200) {
        this.setState({
          fileList: [],
          uploading: false
        })
      } else {
        this.setState({
          uploading: false
        })
      }
    })
  }

  render() {
    const { uploading } = this.state;
    const props = {
      action: SERVICE_API_URL+"/api/uploadCsv",
      multiple: true,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          className="upload-demo-start"
          type="primary"
          onClick={this.handleUpload.bind(this)}
          disabled={this.state.fileList.length === 0}
          loading={uploading}
        >
          {uploading ? 'Uploading' : 'Start Upload' }
        </Button>
      </div>
    );
  }
}

export default MyUpload;
