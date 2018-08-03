import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';

import ComposeTitle from '../../../containers/Compose/ComposePic/ComposeTitle';
import ComposeMarksman from '../../../containers/Compose/ComposePic/ComposeMarksman';
// import PictureCollectionListContainer from '../../../containers/Compose/ComposePic/PictureCollectionListContainer';
import PictureCollectionDragContainer from '../../../containers/Compose/ComposePic/PictureCollectionDragContainer';
import ComposeCoverMap from '../../../containers/Compose/ComposePic/ComposeCoverMap';
import ComposeSortLabel from '../../../containers/Compose/ComposePic/ComposeSortLabel';
import ComposeTags from '../../../containers/Compose/ComposePic/ComposeTags';
import ComposeMachineTag from '../../../containers/Compose/ComposePic/ComposeMachineTag';
import SubmitCompose from '../../../containers/Compose/ComposePic/ComposeSubmitList';
import {DP_POST} from '../../../utils/fetch';
import {INITDATA, CLEARDATA} from '../../../reducers/composePic';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class ComposePic extends Component {
    constructor() {
        super();
        this.state = {
            //编辑状态，0：新建，1：编辑
            editStyle: 0,
        }
    }

    componentWillMount() {
        if (this.props.location.state) {
            const uid = this.props.location.state.cellData.uid;
            this.setState({
                editStyle: 1,
            });
            const url = SERVICE_API_URL + '/api/compose/detail';
            const option = {
                uid: uid
            };
            DP_POST(url, {body: option})
                .then((res) => {
                    if (res.status === "ok") {
                        var init = res.data;
                        var compose = init.compose;
                        var displayInfo = init.displayInfo;
                        //如果图集信息中没有商品，也需要初始化出商品的JSON结构，图集组件渲染时使用
                        var content = JSON.parse(compose.content);
                        for (var i = 0; i < content.length; i++) {
                            if (content[i].goodsPromotion.length == 0) {
                                content[i].goodsPromotion = [{
                                    uid: '',
                                    pic: '',
                                    title: '',
                                    price: '',
                                    smallImages: [],
                                    url: ''
                                }]
                            }
                        }
                        let model = {
                            uid: compose.uid,
                            title: compose.title,
                            marksman: compose.marksman,
                            editorContent: compose.editorContent,
                            content: content,
                            displayInfo: {
                                content: displayInfo ? displayInfo.cover : "[]",
                                type: displayInfo ? displayInfo.type : "0",
                            },
                            category: compose.category,
                            tags: compose.tag,
                            machineTag: compose.machineTag,
                            type: compose.type
                        };
                        this.props.initData(model);
                    }
                })
        }
    }

    componentWillUnmount() {
        this.props.clearData();
    }

    render() {
        const editStyle = this.state.editStyle;
        return (
            <div style={{width: "80%", "margin": "0 20px"}}>
                {/* 文章标题 */}
                <ComposeTitle/>
                {/* 文章马甲名*/}
                <ComposeMarksman/>
                {/* 上传图集 */}
                <PictureCollectionDragContainer/>
                {/* 上传封面图 */}
                <ComposeCoverMap editStyle={editStyle}/>
                {/* 分类 */}
                <ComposeSortLabel/>
                {/*  机器标签*/}
                <ComposeMachineTag editStyle={editStyle} picsType={true}/>
                {/* 人工标签 */}
                <ComposeTags/>

                {/* 发布功能按钮*/}
                <SubmitCompose {...this.props}/>
            </div>
        )
    }
}

ComposePic.propTypes = {
    initData: propTypes.func,
    clearData: propTypes.func
};

const mapDispatchToProps = (dispatch) => {
    return {
        initData: (data) => {
            dispatch(INITDATA(data))
        },
        clearData: () => {
            dispatch(CLEARDATA())
        }
    }
};
ComposePic = connect(null, mapDispatchToProps)(ComposePic);
ComposePic = wrapWithAccessionPermission(ComposePic);
export default ComposePic;
