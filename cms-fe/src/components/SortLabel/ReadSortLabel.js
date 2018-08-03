/**
 * 分类组件（只读）
 */
import React, {Component} from 'react';
import {Button, Alert} from 'antd';
import {DP_POST} from '../../utils/fetch';
import propTypes from 'prop-types';

class ReadSortLabel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '未选择分类'
        };
    }

    componentWillMount() {
        this.getSortLabel(this.props.category);
    }

    componentWillReceiveProps(nextProps) {
        this.getSortLabel(nextProps.category);
    }

    getSortLabel(category) {
        if (!category) {
            this.state = {
                value: '未选择分类'
            };
            return;
        }
        const url = SERVICE_API_URL + "/api/category/detail";
        const option = {
            code: category
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === "failed") return;
            const {level1, level2} = res.data;
            this.setState({
                value: [level1, level2].join(' / '),
            })
        })
    }

    render() {
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Alert message="当前分类" type="info" showIcon description={
                        <Button type="dashed">{this.state.value}</Button>
                    }/>
                </div>
            </div>
        );
    }
}

ReadSortLabel.propTypes = {
    category: propTypes.string,
}
export default ReadSortLabel;
