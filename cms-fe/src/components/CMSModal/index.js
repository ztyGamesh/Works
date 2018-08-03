import React, { Component } from 'react';
import {Modal, Button} from 'antd';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleOk.bind(this);
    }

    showModal() {
        this.setState({
            visible: true
        })
    }

    handleOk(e) {
        this.setState({
            visible: false
        })
    }

    handleCancel(e) {
        this.setState({
            visible: false
        })
    }

    render() {
        return(
            <div>
                <Button onClick={this.showModal}>{this.props.text}</Button>
                <Modal
                    title={this.props.title || "弹出框"}
                    visible={this.state.visible}
                    footer={null}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {this.props.children}
                </Modal>
            </div>
        )
    }
}

export default App;
