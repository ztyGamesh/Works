import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TreeSelect, Button, Radio, Modal} from 'antd';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import TreeList from '../TreeList';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class Selector extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: "",
            onFocus: {
            	"a": true,
            	"b": false,
            	"c": false
            }
		}
	}
	render() {
		return <div style={{
				padding: "10px 0"
        }}>
        	<span>匹配方式:&nbsp;&nbsp;&nbsp;</span>
			<RadioGroup onChange={(e) => {
				//将this.state.onFocus中与target.value相同的字段的值赋为true。其余为false
				var condition = Object.assign({},this.state.onFocus);
				for (var i in condition) {
					condition[i] = false;
				}
				condition[e.target.value] = true;
				this.setState({
					onFocus: condition
				})
				// console.log(e.target.value);
				let answer;
				switch(e.target.value) {
					case "a":
						answer = "";
						break;
					case "b":
						answer = "3"
						break;
					case "c":
						answer = "1"
						break;
					default:
						answer = ""
				}
				this.props.matchType(answer)
			}} defaultValue="a">
				<RadioButton
					value="a"
					className={this.state.onFocus.a ? styles.onFocus : styles.onBlur}
				>全部</RadioButton>
				<RadioButton
					value="b"
					className={this.state.onFocus.b ? styles.onFocus : styles.onBlur}
				>前缀匹配</RadioButton>
				<RadioButton
					value="c"
					className={this.state.onFocus.c ? styles.onFocus : styles.onBlur}
				>短语精确包含</RadioButton>
			</RadioGroup>
		</div>;
	}
}


export default Selector;
