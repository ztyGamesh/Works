import React, {Component} from 'react';
import {Chart, Axis, Geom, Tooltip, Legend} from 'bizcharts';
import { connect } from 'react-redux';
// const cols = {
//     'value': {
//         alias: "点击率",
//         formatter:(text) => {
//             return `${text}%`
//         },
//     }
// };

const cols = {
    'value': {
        alias: "点击率(%)",
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
            data: this.init(this.props.templateCtr)
        })
    }
    // 更新reducer后重新渲染
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: this.init(nextProps.templateCtr)
        })
    }
    init(x) {
        return x.map((item,index) => {
            return Object.assign({name: item.template_name, value: parseFloat(item.ctr)})
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
            chart = <div style={{textAlign:"center",color:"rgba(0,0,0,0.45)"}}>暂无数据</div>;
        } else {
            chart = <Chart height={400} data={this.state.data} scale={cols} forceFit padding={[20,'auto',50,'auto']} >
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
                        offset:28,
                        position: 'end',
                        textStyle:{
                            fontSize: '12',
                            fill: "black",
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
        templateCtr: state.mediaDashboardReducers.template.templateCtr
    }
}

export default connect(
    mapStateToProps
)(BarChart);
