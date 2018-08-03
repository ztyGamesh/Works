import React, {Component} from 'react';
import {Input, Icon, Alert} from 'antd';

import {DP_POST} from "../../utils/fetch";

class ArticleURL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: ''
        };
    }

    componentWillMount() {
        this.getPreviewUrl(this.props.uid);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.url) return;
        this.getPreviewUrl(nextProps.uid);
    }

    getPreviewUrl(uid) {
        if (uid) {
            const url = SERVICE_API_URL + '/api/compose/preview';
            const option = {
                uid: uid,
            };
            DP_POST(url, {body: option}).then((res) => {
                if (res.status === "ok") {
                    this.setState({
                        url: res.data.url,
                    });
                }
            });
        }
    }

    handleChange(e) {
        this.setState({
            url: e.target.value
        })
    }

    handleBlur(e) {
        console.log(e.target.value)
    }

    render() {
        return (
            <div>
                <Alert message="文章URL" type="info" showIcon description={this.state.url}/>
                {/*<Input*/}
                {/*prefix={<Icon type="edit"/>}*/}
                {/*onChange={this.handleChange.bind(this)}*/}
                {/*onBlur={this.handleBlur.bind(this)}*/}
                {/*value={this.state.url}*/}
                {/*/>*/}
            </div>
        );
    }
}

export default ArticleURL;
