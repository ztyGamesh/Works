/**
 * 标签组件
 */
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Tag, Input, Tooltip, Button, Alert, Spin} from 'antd';

class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            inputVisible: false,
            inputValue: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tags) {
            this.setState({
                tags: nextProps.tags.split(','),
                initial: true
            })
        }
    }

    handleClose(removedTag) {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags.join())
        this.props.fetchTags(tags.join())
        this.setState({tags});
    }

    showInput() {
        this.setState({inputVisible: true}, () => this.input.focus());
    }

    handleInputChange(e) {
        this.setState({inputValue: e.target.value});
    }

    handleInputConfirm() {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags.join());
        this.props.fetchTags(tags.join())
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef(input) {
        this.input = input
    }

    render() {
        const {tags, inputVisible, inputValue} = this.state;
        return (
            <div>
                <Alert message="标签选择" type="info" showIcon description="请设置标签"/>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={index !== 1000} afterClose={this.handleClose.bind(this, tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef.bind(this)}
                        type="text"
                        size="small"
                        style={{width: 78}}
                        value={inputValue}
                        onChange={this.handleInputChange.bind(this)}
                        onBlur={this.handleInputConfirm.bind(this)}
                        onPressEnter={this.handleInputConfirm.bind(this)}
                    />
                )}
                {!inputVisible &&
                <Button size="small" type="dashed" onClick={this.showInput.bind(this)}>+ 添加标签</Button>}
            </div>
        );
    }
}

Tags.propTypes = {
    fetchTags: propTypes.func,
    title: propTypes.string,
    editorContent: propTypes.string,
    tags: propTypes.string,
}

export default Tags;
