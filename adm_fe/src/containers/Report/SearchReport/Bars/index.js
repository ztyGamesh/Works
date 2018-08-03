import React, { Component } from 'react';
import BarChart from '../BarChart';

//为了让柱状图自适应
class Bars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            target: "imp"
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            target: nextProps.target
        })
    }
    componentDidMount() {
        this.setState({
            show: true
        })
    }
    render() {
        let bar = <BarChart target={this.state.target}/>;
        return (
            <div>
                {this.state.show ? bar : null}
            </div>
        );
    }
}

export default Bars;
