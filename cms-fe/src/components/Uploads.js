import React, { Component } from 'react';
import MyUpload from './MyUpload';
import {Button} from 'antd';
class Uploads extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
    };
  }

  
  render() {
    return (
      <div>
        <MyUpload/>
        <MyUpload/>
        <MyUpload/>
        <Button>上传</Button>
      </div>
    );
  }
}

export default Uploads;
