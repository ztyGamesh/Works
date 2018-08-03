import React, {Component} from 'react';
import {Alert, Row, Col} from 'antd';

import Picture from './Picture';

class PictureList extends Component {
    constructor(props) {
        super(props);
    }

    getPictureListData() {
        if (!this.props.content) return;
        const content = JSON.parse(this.props.content);
        return content.map((t, index) => <Picture {...t} key={index}/>);
    }

    render() {
        return (
            <div style={{marginBottom: 16}}>
                <Alert message="图集" type="info" showIcon description={'图集详细信息'}/>
                <Row gutter={16}>
                    <Col span={8}>
                        <span style={{width: '100%', display: 'inline-block', padding: '16px 0', textAlign: 'center'}}>图片</span>
                    </Col>
                    <Col span={8}>
                        <span style={{width: '100%', display: 'inline-block', padding: '16px 0', textAlign: 'center'}}>描述</span>
                    </Col>
                    <Col span={8}>
                        <span style={{width: '100%', display: 'inline-block', padding: '16px 0', textAlign: 'center'}}>商品</span>
                    </Col>
                </Row>
                {this.getPictureListData.bind(this)()}
            </div>
        )
    }
}

export default PictureList;
