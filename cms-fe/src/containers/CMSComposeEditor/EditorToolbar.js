import React, { Component } from 'react';
import CommodityButton from './CommodityButton'
import {Button} from 'antd';
class EditorToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{width:'60px',position:'fixed',left:'200px',top: '181px'}}>
          <CommodityButton
              openGoods={this.props.openGoods}
              closeGoods={this.props.closeGoods}
              showButton={this.props.showButton}
          />
          <Button onClick={() => {

              // UE.getEditor("content").execCommand("insertHTML", Object.values(JSON.parse(localStorage.ueditor_preference))[0])
              var name = null;
              for (var key in JSON.parse(localStorage.ueditor_preference)) {
                  // console.log(key.indexOf("add"));
                  if (key.indexOf("add") !== -1) {
                      name = key
                  }
              }
              // console.log(name);
              UE.getEditor("content").setContent(JSON.parse(localStorage.ueditor_preference)[name])
          }}>还原自动保存</Button>
      </div>
    );
  }
}
export default EditorToolbar;
