import React, { Component } from 'react';
import ListSortDemo from '../../../containers/ListSortDemo';

class ComposeEntry extends Component {
    componentDidMount() {
        console.log(this.context)
    }
    render() {
        return (
            <div>
                <ListSortDemo history={this.props.history}/>
            </div>
        );
    }
}

export default ComposeEntry;
