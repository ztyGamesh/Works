import React, {Component} from 'react';

import ReadTitle from '../../../components/Title/ReadTitle';
import ReadMarksman from '../../../components/Marksman/ReadMarksman';
import ReadCoverMap from '../../../components/CoverMap/ReadCoverMap';
import ReadSortLabel from '../../../components/SortLabel/ReadSortLabel';
import ReadMachineTag from '../../../components/MachineTag/ReadMachineTag';
import ReadTags from '../../../components/Tags/ReadTags';

import Ueditor from '../../../containers/Compose/ComposeDetail/Ueditor';
import PictureList from '../../../containers/Compose/ComposeDetail/PictureList';
import SubmitCompose from '../../../containers/Compose/ComposeDetail/ComposeSubmitList';

import {DP_POST} from '../../../utils/fetch';

import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';

class ComposeDetail extends Component {
    constructor() {
        super();
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        const {uid} = this.props.location.state.cellData;
        const url = SERVICE_API_URL + '/api/compose/detail';
        const option = {
            uid: uid
        }
        DP_POST(url, {body: option}).then((res) => {
            console.log(res.data)
            if (res.status === 'ok') {
                var init = res.data;
                var compose = init.compose;
                var displayInfo = init.displayInfo;
                let model = {
                    uid: compose.uid,
                    title: compose.title,
                    marksman: compose.marksman,
                    editorContent: compose.editorContent,
                    content: compose.content,
                    displayInfo: {
                        content: displayInfo ? displayInfo.cover : '{}',
                        type: displayInfo ? displayInfo.type : '0',
                    },
                    category: compose.category,
                    tags: compose.tag,
                    machineTag: compose.machineTag,
                    type: compose.type,
                    pics: []
                };
                this.setState({
                    data: model
                });
            }
        })
    }

    render() {
        const {uid, type} = this.props.location.state.cellData;
        const {title, marksman, displayInfo, category, machineTag, tags, editorContent, content} = this.state.data;
        return (
            <div style={{width: "80%", "margin": "0 20px"}}>
                {/* 文章标题 */}
                <ReadTitle title={title}/>

                {/* 文章马甲名*/}
                <ReadMarksman marksman={marksman}/>

                {/* 编辑内容部分 (编辑器)*/}
                {
                    1 === type ? <Ueditor editorContent={editorContent}/> : null
                }
                {
                    2 === type ? <PictureList content={content}/> : null
                }


                {/* 上传封面图 */}
                <ReadCoverMap displayInfo={displayInfo}/>

                {/* 分类 */}
                <ReadSortLabel category={category}/>

                {/*  机器标签*/}
                <ReadMachineTag machineTag={machineTag}/>

                {/* 人工标签 */}
                <ReadTags tags={tags}/>

                {/* 发布功能按钮*/}
                <SubmitCompose {...this.props} uid={uid}/>
            </div>
        )
    }
};

ComposeDetail = wrapWithAccessionPermission(ComposeDetail);
export default ComposeDetail;
