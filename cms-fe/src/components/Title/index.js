/**
 * 标题组件
 */
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Input, Icon} from 'antd';

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
        })
    }

    handleChangeTitle(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleBlurTitle(e) {
        // redux 保存文章标题
        this.props.saveTitle(e.target.value)
    }

    render() {
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Input
                        addonBefore={<span>标题<Icon type="edit"/></span>}
                        value={this.state.title}
                        onChange={this.handleChangeTitle.bind(this)}
                        onBlur={this.handleBlurTitle.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

Title.propTypes = {
    title: propTypes.string,
    saveTitle: propTypes.func,
}

export default Title;