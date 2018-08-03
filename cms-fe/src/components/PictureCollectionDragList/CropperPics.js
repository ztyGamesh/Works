import React, {Component} from 'react';
import {Modal, Button} from 'antd';

import CropperPic from '../CMSCropper';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
	showModal() {
		this.setState({visible: true});
	}
	handleOk(e) {
		console.log(e);
		this.setState({visible: false});
	}
	handleCancel(e) {
		console.log(e);
		this.setState({visible: false});
	}
	render() {
		return (<div>
			<Button type="primary" onClick={this.showModal}>裁剪</Button>
			<Modal title="图集裁剪功能区域"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width="60%"
   >
				<CropperPic
                    visible={this.state.visible}
                    src={this.props.src}
                    order={this.props.order}
                    savePic={this.props.savePic}
                    handleOk={this.handleOk.bind(this)}
                    handleCancel={this.handleCancel.bind(this)}
    />
			</Modal>
		</div>);
	}
}

export default App;
