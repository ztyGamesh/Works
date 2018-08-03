import React, {Component} from 'react';
import {Icon, Button} from 'antd';
import PropTypes from 'prop-types';
import ListSort from '../../components/ListSort';
import './index.css';
class ListSortDemo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dataArray: [
				{
					icon: 'book',
					color: '#FF5500',
					title: '图文',
					text: 'Text Designer',
					url: '/compose/add',
				},
				{
					icon: 'switcher',
					color: '#5FC296',
					title: '图集',
					text: 'Picture Designer',
					url: '/compose/pic'
				},
				{
					icon: 'forward',
					color: '#2DB7F5',
					title: '视频',
					text: 'Visual Designer(还未开放)',
					url: '/compose/entry'
				},
			],
			childrenToRender: []
		};
	}

	componentWillMount() {
		this.setState({
			childrenToRender: this.state.dataArray.map((item, i) => {
				const {
					icon, color, title, text, url
				} = item;
				return (
					<div key={i} className={`${this.props.className}-list`} onClick={this.handleClick.bind(this, url)}>
						<div className={`${this.props.className}-icon`}>
							<Icon type={icon} style={{color}}/>
						</div>
						<div className={`${this.props.className}-text`}>
							<h1>{title}</h1>
							<p>{text}</p>
						</div>
					</div>
				);
			})
		})
	}
	handleClick(url) {
		console.log(this.props)
		console.log(url)
		this.props.history.push(url)
	}


	render() {
		return (
			<div className={`${this.props.className}-wrapper`}>
				<div className={this.props.className}>
					<ListSort
						dragClassName="list-drag-selected"
						appearAnim={{animConfig: {marginTop: [5, 30], opacity: [1, 0]}}}
					>
						{this.state.childrenToRender}
					</ListSort>
				</div>
			</div>
		);
	}
}
ListSortDemo.PropTypes = {
	className: PropTypes.string,
}
ListSortDemo.defaultProps = {
	className: 'list-sort-demo',
};
export default ListSortDemo;
