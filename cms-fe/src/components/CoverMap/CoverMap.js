/**
 * 封面组件
 * @param editStyle: number, 缺省为0，0表示新建，1表示编辑
 */
// 封面图组件
import React, {Component} from 'react';
import {Tabs, Icon, Alert, Upload, Button, message} from 'antd';
import propTypes from 'prop-types';
import './CoverMap.css';

/*大图+文字*/
import CropperLarge from './CropperLarge';
/*图文*/
import CropperImageText from './CropperImageText';
/*三图*/
import PhotoOne from './CropperPhotoesColletion/PhotoOne';
import PhotoTwo from './CropperPhotoesColletion/PhotoTwo';
import PhotoThree from './CropperPhotoesColletion/PhotoThree';

const TabPane = Tabs.TabPane;

class CoverMap extends Component {
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

    handleClick(key) {
        console.log(key)
    }

    handleConfirm() {
        if (this.props.pics.length !== 3) {
            message.error("三张图片没有完全上传")
            return
        }
        message.info("三张图片上传成功");
        var tempArr = {
            "pics": this.props.pics
        }
        // 将暂存的数据包装好 存入 redux
        this.props.fetchType({
            content: JSON.stringify(tempArr),
            type: 3
        })
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
                    this.props.editStyle ? <Alert message="当前封面图" type="info" showIcon description={imgType}/> : null
                }
                {
                    this.props.editStyle && this.state.type === 1 ?
                        <img src={this.state.initImg} style={{width: "20%"}}/> : null
                }
                {
                    this.props.editStyle && this.state.type === 2 ?
                        <img src={this.state.initImg} style={{width: "20%"}}/> : null
                }
                {
                    this.props.editStyle && this.state.type === 3 ? this.state.initImg.map((url, index) => {
                        return <img src={url} key={index} style={{width: "20%"}}/>
                    }) : null
                }
                <Alert message="封面图" type="info" showIcon description="请在下面选择模式并上传封面"/>
                <Tabs type="card" onTabClick={this.handleClick.bind(this)}>
                    <TabPane tab="大图模式" key="1">
                        <CropperLarge
                            fetchDisplayInfoContent={this.props.fetchDisplayInfoContent}
                            mode={this.props.mode}
                            modeContent={this.props.modeContent}
                        />
                    </TabPane>
                    <TabPane tab="图文模式" key="2">
                        <CropperImageText
                            fetchDisplayInfoContent={this.props.fetchDisplayInfoContent}
                            mode={this.props.mode}
                            modeContent={this.props.modeContent}
                        />
                    </TabPane>
                    {this.props.name === "video"
                        ? null
                        :   <TabPane tab="三图模式" key="3">
                            <PhotoOne pics={this.props.pics} savePics={this.props.savePics}
                                mode={this.props.mode}
                                modeContent={this.props.modeContent}/>
                            <PhotoTwo pics={this.props.pics} savePics={this.props.savePics}
                                mode={this.props.mode}
                                modeContent={this.props.modeContent}/>
                            <PhotoThree pics={this.props.pics} savePics={this.props.savePics}
                                mode={this.props.mode}
                                modeContent={this.props.modeContent}/>
                            <br style={{clear: 'both'}}/>
                            <Button
                                style={
                                    {
                                        float: "left",
                                        height: "60px",
                                        fontSize: "24px"
                                    }
                                }
                                type="primary"
                                value="large"
                                onClick={this.handleConfirm.bind(this)}>确认三图都已上传(必须确认)</Button>
                            <br style={{clear: 'both'}}/>
                        </TabPane>

                    }

                </Tabs>
            </div>
        );
    }
}

CoverMap.propTypes = {
    fetchType: propTypes.func,
    pics: propTypes.array,
    displayInfo: propTypes.object,
}
export default CoverMap;
