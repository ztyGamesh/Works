/**
 * 关键字组件
 * @param editStyle: number, 缺省为0，0表示新建，1表示编辑
 * @param picsType: boolean, 缺省为false，是否为图集
 */
import React, {Component} from 'react';
import {Checkbox, Spin, Alert, Button} from 'antd';
import {DP_POST} from '../../utils/fetch';
import propTypes from 'prop-types';

const CheckboxGroup = Checkbox.Group;

class MachineTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            value: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const machineTag = nextProps.machineTag;
        console.log(machineTag)
        var tempValue = ('' === machineTag) ? [] : machineTag.split(',');
        this.setState({
            value: tempValue
        })
    }

    onChange(checkedValues) {
        var machineTag = checkedValues.join();
        console.log(machineTag)
        this.props.saveMachineTag(machineTag)
    }

    handleClick() {
        var content = '';
        //编辑图集时
        if(this.props.picsType){
            var propContent = this.props.content;
            for (var i = 0; i < propContent.length; i++) {
                content += propContent[i].description;
            }
        }else {
            content = UE.getEditor('content').getContentTxt();
        }
        const url = SERVICE_API_URL + "/api/machineTag";
        const option = {
            title: this.props.title,
            content: content
        }
        this.setState({
            spin: true
        })
        DP_POST(url, {body: option})
            .then((res) => {
                if (res.status !== 'ok') return
                var targetArr = res.data.map((item) => {
                    return {
                        label: item,
                        value: item
                    }
                })
                this.setState({
                    options: targetArr,
                    spin: false
                })
            })
    }

    render() {
        return (
            <div>
                {
                    this.props.editStyle ?
                        <Alert message="当前文章关键词" type="info" showIcon
                               description={this.state.value.map((item, index) => {
                                   return <Button type="dashed" key={index}>{item}</Button>
                               })}/> : null
                }
                {
                    <button onClick={this.handleClick.bind(this)}>关键词分析</button>
                }
                {
                    this.state.spin ?
                        <Spin/> : null
                }
                <CheckboxGroup
                    options={this.state.options}
                    onChange={this.onChange.bind(this)}
                    value={this.state.value}
                />
            </div>
        );
    }
}

MachineTag.propTypes = {
    title: propTypes.string,
    saveMachineTag: propTypes.func,
    machineTag: propTypes.string,
}
export default MachineTag;
