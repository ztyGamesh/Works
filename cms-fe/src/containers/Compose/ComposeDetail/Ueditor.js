import React, {Component} from 'react';

class Ueditor extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        UE.getEditor('content').ready(() =>
            UE.getEditor('content').setContent(nextProps.editorContent)
        )
    }

    componentDidMount() {
        this.initEditor()
    }

    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        UE.delEditor('content');
    }

    initEditor() {
        const ueEditor = UE.getEditor('content', {
            /*这里是配置*/
            toolbars: [
                [
                    'undo',
                    'redo',
                    'bold',
                    'italic',
                    'underline',
                    'justifyleft',
                    'justifycenter',
                    'justifyright',
                    'justifyjustify',
                    'simpleupload',
                ]
            ],
            allowDivTransToP: false,
            disabledTableInTable: true,
            readonly: true,
            wordCountMsg: '字数统计： {#count} 个字符&nbsp;&nbsp;',
            autoHeightEnabled: false,
        });
        const self = this;
        ueEditor.ready((ueditor) => {
            if (!ueditor) {
                UE.delEditor('content');
                self.initEditor();
            } else {
                UE.getEditor('content').setContent(this.props.editorContent || '');
            }
        })
    }

    render() {
        return (
            <div>
                <div id={'content'} style={{width: '100%'}} name="content" type="text/plain"></div>
            </div>
        )
    }
}

export default Ueditor;
