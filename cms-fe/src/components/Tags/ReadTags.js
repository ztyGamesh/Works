/**
 * 标签组件（只读）
 */
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Button, Alert} from 'antd';

class ReadTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '未选择标签',
        };
    }

    getTags() {
        const tags = this.props.tags;
        return !tags ? '未选择标签' :
            tags.split(',').map((item, index) =>
                <Button type="dashed" key={index}>{item}</Button>
            );
    }

    render() {
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Alert message="当前标签" type="info" showIcon description={this.getTags.bind(this)()}/>
                </div>
            </div>
        );
    }
}

ReadTags.propTypes = {
    tags: propTypes.string,
}

export default ReadTags;
