import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';

import GoodsFiles from './GoodsFiles.js';

class GoodsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            refresh: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list,
            refresh: nextProps.refresh
        });
    }

    render() {
        const {list} = this.state;
        return (
            <div style={{width: '90%',fontSize: 14, color: '#000', textAlign: 'center'}}>
                <Row gutter={16} style={{marginTop: 16}}>
                    <Col span={24} style={{overflow: 'auto'}}>
                        <table style={{width: '100%'}}>
                            <tbody>
                                <tr>
                                    <td style={{minWidth: 110,padding: '0 8px'}}>
                                        <div style={{maxWidth: 110,padding: '4px 15px'}}>媒体名称</div>
                                    </td>
                                    {list.map((t, index) =>
                                        <td key={index} style={{minWidth: 150,padding: '0 8px'}}>
                                            <div style={{
                                                maxWidth: 150,
                                                backgroundColor: '#ccc',
                                                padding: '4px 15px',
                                                borderRadius: 4,
                                                wordWrap: 'break-word',
                                            }} title={t.name}>{t.name}</div>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <td style={{padding: '0 8px'}}>
                                        <div style={{marginTop: 20,maxWidth: 110,padding: '4px 15px'}}>淘宝PID</div>
                                    </td>
                                    {list.map((t, index) =>
                                        <td key={index} style={{padding: '0 8px'}}>
                                            <div style={{
                                                marginTop: 20,
                                                maxWidth: 150,
                                                backgroundColor: '#ccc',
                                                padding: '4px 15px',
                                                borderRadius: 4,
                                                wordWrap: 'break-word',
                                            }} title={t.pid}>{t.pid}</div>
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <td style={{padding: '0 8px'}}>
                                        <div style={{maxWidth: 110,padding: '4px 15px'}}>选中文件</div>
                                    </td>
                                    {list.map((t, index) => (
                                        <td key={index} style={{padding: '0 8px'}}>
                                            <div style={{maxWidth: 150}}>
                                                <GoodsFiles pid={t.pid} fileList={[]}/>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.goodsImport.list,
    }
}

GoodsInfo = connect(mapStateToProps)(GoodsInfo);
export default GoodsInfo;
