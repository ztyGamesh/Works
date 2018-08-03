import React, {Component} from 'react';
import {Row, Col, Input} from 'antd';

const {TextArea} = Input;

class PictureList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {pic = '', description = '', goodsPromotion} = this.props;
        const goodsPic = goodsPromotion ? goodsPromotion[0] ? goodsPromotion[0].pic : '' : '';
        return (
            <Row gutter={16}>
                <Col span={8}>
                    <div style={{textAlign: 'center'}}>
                        <img src={pic} style={{width: 150, height: 150}}/>
                    </div>
                </Col>
                <Col span={8} style={{height: 150}}>
                    <div style={{
                        textAlign: 'center',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}>
                        <TextArea value={description}/>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{textAlign: 'center'}}>
                        {
                            goodsPic ?
                                <img src={goodsPic} style={{width: 150, height: 150}}/> :
                                <img style={{width: 150, height: 150}}/>
                        }
                    </div>
                </Col>
            </Row>
        )
    }
}

export default PictureList;
