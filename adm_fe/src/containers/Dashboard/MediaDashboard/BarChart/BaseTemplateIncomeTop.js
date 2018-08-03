import React, {Component} from 'react';
import {Chart, Axis, Geom, Tooltip, Legend} from 'bizcharts';
import { connect } from 'react-redux';
const cols = {
    'value': {
        alias: "收入(元)",
        range:[0, 0.9]
    }
};

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BARCHART: false,
            data: []
        };
    }

    componentWillMount() {
        this.setState({
            data: this.init(this.props.templateIncome)
        })
    }
    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: this.init(nextProps.templateIncome)
        })
    }
    init(x) {
        return x.map((item,index) => {
            return Object.assign({name: item.template_name, value: parseFloat(item.income)})
        })
    }
    componentDidMount() {
        this.setState({
            BARCHART: true
        })
    }
    render() {
        let chart;
        if (this.state.data.length === 0) {
            chart = <div style={{textAlign:"center",color:"rgba(0,0,0,0.45)"}}>暂无数据</div>
        } else {
            chart = <Chart height={400} data={this.state.data} scale={cols} forceFit padding={[20,'auto',50,,'auto']}>
                <Axis name="name" />
                <Axis
                    name="value"
                    line={{
                        stroke: "silver",
                        // fill: '#ffffff',
                        lineWidth: 1
                    }}
                    label={{
                        // textStyle: {
                        //     fill: "black"
                        // },
                        autoRotate: false,
                    }}
                    // grid={null}
                    title={{
                        offset:24,
                        position: 'end',
                        textStyle:{
                            fontSize: '12',
                            fill: "black",
                            // fontWeight: 'bold',
                            rotate: 0
                        }}}
                />
                <Tooltip crosshairs={{type : "y"}}/>
                <Geom type="interval" position="name*value"/>
            </Chart>;
        }
        return (
            <div>
                {!this.state.BARCHART ? null : chart}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        templateIncome: state.mediaDashboardReducers.template.templateIncome
    }
}

export default connect(
    mapStateToProps
)(BarChart);
