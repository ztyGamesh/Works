/**
 * 分类组件
 */
import React, {Component} from 'react';
import {Cascader, Alert} from 'antd';
import {DP_POST} from '../../utils/fetch';
import _ from 'underscore';
import propTypes from 'prop-types';

class SortLabel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const url = SERVICE_API_URL + "/api/category/detail";
        const option = {
            code: nextProps.category
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === "failed") return;
            const {level1, level2} = res.data;
            var tempArr = [level1, level2];
            this.setState({
                value: tempArr,
            })
        })
    }

    onChange(value, options) {
        console.log(_.last(options).code)
        var category = _.last(options).code;
        this.props.fetchCategory(category)
    }

    handleData(arr, json) {
        // arr 是后台传来的数据
        // json 是1级目录的字典
        // 遍历所有传来的数据 生成符合结构的数据
        var len = json.length;
        var result = json.map((level) => {
            return {
                value: level,
                label: level,
                children: []
            }
        })
        arr.map((tag) => {
            for (let i = 0; i < len; i++) {
                if (tag.level1 === json[i]) {
                    // 根据level1做分类  如果该 tag 的level1找到了确定值 就给该level1的children数组中添加一个对象
                    result[i].children.push({
                        value: tag.level2,
                        label: tag.level2,
                        code: tag.code
                    })
                }
            }
        })
        return result
    }

    componentWillMount() {
        var url = SERVICE_API_URL + "/api/category/list";
        DP_POST(url, {body: ""})
            .then((res) => {
                console.log(res)
                if (res.status === 'ok') {
                    const {data} = res;
                    // console.log(data)
                    // 所有1级标签的集合
                    var temp = [];
                    for (let i = 0; i < data.length - 1; i++) {
                        temp.push(data[i].level1)
                    }
                    // 数组去重
                    temp = _.uniq(temp)
                    // 获取组件需要的数据格式
                    const result = this.handleData(data, temp);

                    this.setState({
                        data: result
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <Alert message="分类" type="info" showIcon description="请选择分类"/>
                <Cascader
                    options={this.state.data}
                    onChange={this.onChange.bind(this)}
                    style={{width: "50%"}}
                    popupPlacement="topLeft"
                    value={this.state.value}
                />
            </div>
        );
    }
}

SortLabel.propTypes = {
    fetchCategory: propTypes.func,
    category: propTypes.string,
}
export default SortLabel;
