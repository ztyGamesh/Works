import React, { Component } from 'react';
import {Input, Button} from 'antd';

export default class EditorTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 存储title
      content: '',
    };
  }
  componentDidMount() {
    // this.setState({
    //   content: this.state.title
    // })
    this.setState({
      content: this.props.data.title
    })
  }
  componentWillReceiveProps(nextProps) {
      if(!nextProps.open){
          this.setState({
              content: '',
          });
          return;
      }
    // this.setState({
    //   content: nextProps.title
    // })
    this.setState({
      content: this.state.content || nextProps.data.title
    })
  }

  handleChange(e) {
    this.setState({
      content: e.target.value,
    })
  }

  handleBlur(e) {
    this.setState({
      content: e.target.value
    })
    this.props.changeData(e.target.value)
  }

  render() {
    return (
      <div>
        <Input size="small"
          value={this.state.content}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
        />
      </div>
    );
  }
}
