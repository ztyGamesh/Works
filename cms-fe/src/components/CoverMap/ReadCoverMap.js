/**
 * 封面组件（只读）
 */
import React, {Component} from 'react';
import {Alert} from 'antd';
import propTypes from 'prop-types';
import './CoverMap.css';

class ReadCoverMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initImg: "http://placehold.it/320x180",
            type: 1
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.displayInfo.content) return;
        const imgData = JSON.parse(nextProps.displayInfo.content);
        const imgType = JSON.parse(nextProps.displayInfo.type);
        if (imgData.pic) {
            this.setState({
                initImg: imgData.pic,
                type: imgType //代表大图 or 单图(图文)
            })
        } else if (imgData.pics) {
            this.setState({
                initImg: imgData.pics,
                type: imgType  //代表三图片
            })
        }
    }

    render() {
        var imgType = "封面图类型";
        switch (this.state.type) {
            case 1 :
                imgType = "当前封面图类型是: 大图+图文";
                break;
            case 2 :
                imgType = "当前封面图类型是: 图文";
                break;
            case 3 :
                imgType = "当前封面图类型是: 三图";
                break;
            default:
                imgType = "封面图类型";
        }
        return (
            <div className="card-container">
                {
                    <Alert message="当前封面图" type="info" showIcon description={imgType}/>
                }
                {
                    this.state.type === 1 ?
                        <img src={this.state.initImg} style={{width: "20%"}}/> : null
                }
                {
                    this.state.type === 2 ?
                        <img src={this.state.initImg} style={{width: "20%"}}/> : null
                }
                {
                    this.state.type === 3 ? this.state.initImg.map((url, index) => {
                        return <img src={url} key={index} style={{width: "20%"}}/>
                    }) : null
                }
            </div>
        );
    }
}

ReadCoverMap.propTypes = {
    fetchType: propTypes.func,
    pics: propTypes.array,
    displayInfo: propTypes.object,
}
export default ReadCoverMap;
