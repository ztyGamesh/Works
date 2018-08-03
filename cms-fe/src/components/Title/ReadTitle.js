/**
 * 标题组件（只读）
 */
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Icon} from 'antd';

class ReadTitle extends Component {
    render() {
        return (
            <div>
                <div style={{
                    width: '100%',
                    fontSize: 12,
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    color: 'rgba(0, 0, 0, 0.65)',
                    backgroundColor: '#fff',
                }}>
                    <div style={{
                        height: 28,
                        padding: '4px 7px',
                        textAlign: 'center',
                        backgroundColor: '#eee',
                        borderRight: '1px solid #d9d9d9',
                        float: 'left',
                    }}>标题<Icon type="edit"/></div>
                    <div style={{
                        height: 28,
                        padding: '4px 7px',
                        float: 'left',
                    }}>{this.props.title}</div>
                    <div style={{clear: 'both'}}></div>
                </div>
                <div style={{height: 16}}></div>
            </div>
        );
    }
}

ReadTitle.propTypes = {
    title: propTypes.string,
}

export default ReadTitle;