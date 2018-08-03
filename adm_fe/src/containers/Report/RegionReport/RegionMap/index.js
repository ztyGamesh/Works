import React, { Component } from 'react';
import ChinaMap from '../ChinaMap';

//为了让中国地图自适应
class RegionMap extends Component {
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
        let bar = <ChinaMap target={this.state.target}/>;
        return (
            <div>
                {this.state.show ? bar : null}
            </div>
        );
    }
}

export default RegionMap;
