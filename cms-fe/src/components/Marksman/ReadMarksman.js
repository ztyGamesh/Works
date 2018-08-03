/**
 * 马甲组件（只读）
 */
import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Icon} from 'antd';

import {DP_POST} from '../../utils/fetch';

class ReadMarksman extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: [],
        };
    }

    componentWillMount() {
        // 拉取马甲名列表
        const url = SERVICE_API_URL + "/api/marksman/list";
        DP_POST(url).then((res) => {
            this.setState({
                menuList: res.data
            })
        })
    }

    getMarksmanName() {
        const menu = this.state.menuList.find(t => t.id === this.props.marksman);
        return menu ? menu.name : '';
    }

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
                    }}>马甲名<Icon type="edit"/></div>
                    <div style={{
                        height: 28,
                        padding: '4px 7px',
                        float: 'left',
                    }}>{this.getMarksmanName.bind(this)()}</div>
                    <div style={{clear: 'both'}}></div>
                </div>
                <div style={{height: 1}}></div>
            </div>
        );
    }
}

ReadMarksman.propTypes = {
    title: propTypes.string,
}

export default ReadMarksman;