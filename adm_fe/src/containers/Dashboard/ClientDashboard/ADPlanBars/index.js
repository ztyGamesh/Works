import React, { Component } from 'react';
import BarChart from '../BarChart';
import {connect} from 'react-redux';
import {Row, Col, Card, Icon} from 'antd';
class ADPlanBars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 花费量 income
            income: [],
            // 展现量 imp
            imp: [],
            // 点击量 clk
            clk: [],
            // 点击率 ctr
            ctr: []
        };
        this._handleData = this._handleData.bind(this)
    }

    _handleData(arrayData, xValueName, yValueName) {
        return arrayData.map((data) => {
            return {
                xValue: data[xValueName],
                yValue: parseFloat(data[yValueName])
            }
        })
    }

    componentWillMount() {
        // console.log("will", this.props.adplantop);
        const {clk_data, ctr_data, imp_data, income_data} = this.props.adplantop;
        this.setState({
            income: this._handleData(income_data, "plan_name", "income"),
            imp: this._handleData(imp_data, "plan_name", "imp"),
            clk: this._handleData(clk_data, "plan_name", "clk"),
            ctr: this._handleData(ctr_data, "plan_name", "ctr"),
        })
    }

    componentWillReceiveProps(nextProps) {
        // console.log("nextProps", nextProps.adplantop);
        const {clk_data, ctr_data, imp_data, income_data} = nextProps.adplantop;
        this.setState({
            income: this._handleData(income_data, "plan_name", "income"),
            imp: this._handleData(imp_data, "plan_name", "imp"),
            clk: this._handleData(clk_data, "plan_name", "clk"),
            ctr: this._handleData(ctr_data, "plan_name", "ctr"),
        })
    }



    render() {
        const titleStyle = {
            color: "#999"
        };
        return (
            <div>
                <Row gutter={16}>
                    <Col span={12} >
                        <Card
                            style={{margin: "10px 10px 20px"}}
                            title={<div style={titleStyle}>花费量 Top5 <Icon type="rocket"/></div>}
                            type="inner"
                        >
                            <BarChart data={this.state.income}/>
                        </Card>
                    </Col>
                    <Col span={12} >
                        <Card
                            style={{margin: "10px 10px 20px"}}
                            title={<div style={titleStyle}>展现量 Top5 <Icon type="rocket" /></div>}
                            type="inner"
                        >
                            <BarChart data={this.state.imp}/>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12} >
                        <Card
                            style={{margin: "20px 10px 10px"}}
                            title={<div style={titleStyle}>点击量 Top5 <Icon type="rocket" /></div>}
                            type="inner"
                        >
                            <BarChart data={this.state.clk}/>
                        </Card>
                    </Col>
                    <Col span={12} >
                        <Card
                            style={{margin: "20px 10px 10px"}}
                            title={<div style={titleStyle}>点击率 Top5 <Icon type="rocket" /></div>}
                            type="inner"
                        >
                            <BarChart data={this.state.ctr}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adplantop: state.clientDashboardReducers.adplantop
    }
}
export default connect(
    mapStateToProps
)(ADPlanBars);
