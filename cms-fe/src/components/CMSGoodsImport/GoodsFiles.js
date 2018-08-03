import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {Upload, Button, message} from 'antd';

import {saveFile, clearFiles} from "../../reducers/goodsImport";

import './Goods.css';

class GoodsFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: '',
            fileList: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            pid: nextProps.pid,
            fileList: nextProps.fileList
        });
    }

    /** 选择文件 **/
    handleBeforeUpload(file, filelist) {
        if (0 !== filelist.indexOf(file)) {
            return false;
        }
        const url = SERVICE_API_URL + '/api/cacheFiles';
        const option = new FormData();
        filelist.forEach((file) => {
            option.append('files', file);
        });
        fetch(url, {
            method: 'post',
            body: option
        }).then((res) => {
            return res.json()
        }).then((res) => {
            if ('ok' === res.status) {
                this.props.saveFile({pid: this.props.pid, files: res.data});
                this.setState({
                    fileList: filelist
                });
            } else {
                message.error(res.message);
            }
        });
        return false;
    }

    render() {
        return (
            <div>
                <div className={'good-import-upload'}>
                    <Upload
                        fileList={this.state.fileList}
                        multiple={true} accept={'.xlsx,.xls'}
                        beforeUpload={this.handleBeforeUpload.bind(this)}
                    ><Button>选择文件</Button></Upload>
                </div>
            </div>
        );
    }
}

const mapDispatchtoProps = (dispatch) => {
    return {
        saveFile: (file) => {
            dispatch(saveFile(file))
        }
    }
}

GoodsFiles = connect(null, mapDispatchtoProps)(GoodsFiles);
export default GoodsFiles;
