import React, { Component } from 'react';
import {Button} from 'antd';
import {Player} from 'video-react';
import AddTheGoods from '../AddTheGoods/AddTheGoods';
import ManagerCommodity from './ManagerCommodity';
import './index.css';
// import '../../../node_modules/video-react/styles/scss/video-react.scss';
import '../../../node_modules/video-react/dist/video-react.css'
class ComposeVedio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            video: null,
            goodsPromotion: null
        };
    }
    componentWillReceiveProps(nextProps) {
        // 1.去reducer拿到content 然后JSON.parse
        // 2.根据拿到的数据初始化组件
        // 3.然后根据用户的操作更新数据
        // 4.把数据实时保存到reducer
        let {content} = nextProps;
        console.log('nextProps')
        console.log(nextProps)
        content = JSON.parse(content);
        const {video, goodsPromotion} = content[0];
        console.log(video, goodsPromotion);
        this.setState({
            video: video,
            goodsPromotion: goodsPromotion[0]
        })
    }
    // 修改商品确认
    handleFetchResult(data) {
        this.setState({
            goodsData: {
                ...this.state.goodsData,
                pic: data.url,
                title: data.title,
                smallImages: data.smallImages
            },
            goodsPromotion: {
                ...this.state.goodsPromotion,
                pic: data.url,
                title: data.title,
                smallImages: data.smallImages.join(",")
            },
            managerShow: false
        }, function () {
            const content = [];
            const goodsPromotion = [];

            goodsPromotion.push(this.state.goodsPromotion);
            content[0] = {};
            content[0].video = this.state.video;
            content[0].goodsPromotion = goodsPromotion;

            console.log(JSON.stringify(content));
            this.props.saveVedio(JSON.stringify(content));
        });
    }
    // 打开商品编辑浮层
    handleClickEditGoods(e) {
        this.setState({
            managerShow: true
        });
    }
    // 关闭ManagerCommodity后触发父组件的回调
    handleCancelManagerCommodity() {
        this.setState({
            managerShow: false
        });
    }
    render() {
        return (
            <div style={{width:"400px"}}>
                <Player
                    playsInline
                    src={this.state.video}
                />
                {this.state.goodsPromotion
                    ? <div>
                        <div className="goodsWrapper">
                            <div className="goodsPicWrapper">
                                <img src={this.state.goodsPromotion.pic} alt="" title="" width="158px" height="160px"
                                className="goodsPic"/>
                                <div className="goodsMsg" onClick={this.handleClickEditGoods.bind(this)}>
                                    点击完善资料
                                </div>
                            </div>
                            <div className="goodsInfoWrapper">
                                <div className="goodsTitle">{this.state.goodsPromotion.title}</div>
                                <div className="goodsPrice">¥{this.state.goodsPromotion.price / 100}</div>
                            </div>

                            <ManagerCommodity visible={this.state.managerShow} goodsData={this.state.goodsPromotion}
                                cancelManagerCommodity={this.handleCancelManagerCommodity.bind(this)}
                                fetchResult={this.handleFetchResult.bind(this)}/>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}

export default ComposeVedio;
