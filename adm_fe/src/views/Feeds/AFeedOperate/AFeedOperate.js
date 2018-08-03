import React from 'react';
import {Steps, Icon, Card} from 'antd';
import {connect} from 'react-redux';
const Step = Steps.Step;
import AFeedUploadInfoContainer from '../../../containers/Feeds/AFeedOperate/AFeedUploadInfo';
import DiagnoseContainer from '../../../containers/Feeds/AFeedOperate/Diagnose';
import AFeedDiagnoseResultContainer from '../../../containers/Feeds/AFeedOperate/AFeedDiagnoseResult';
import Loading from '../../../components/Loading/loading';
import {init, requestIndustrys, changeCurrent, getAFeed, changeLoading} from './flow/aFeedOperateActions';
import styles from "./AFeedOperate.less";
/**
 * AFeed新建/编辑页面
 * @fileId 上传csv、xml文件的ID 用于stepTwo的文件解析
 */

class AFeedOperate extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.init();
	}

	componentDidMount() {
		//请求数据标准
		this.props.requestIndustrys();
		if (this.props.match.params.id) {//编辑
			this.props.getAFeed(this.props.match.params.id);
		} else {//新建
			this.props.changeLoading(false);
		}
	}

	render() {
		const {current, loading} = this.props.state;
		const steps = [{
			title: '填写广告主商品库Feed接入基本信息',
			content: 'First-content',
			icon: 'edit'
		}, {
			title: '数据诊断',
			content: 'Second-content',
			icon: 'solution'
		}, {
			title: '确认信息',
			content: 'Last-content',
			icon: 'smile-o'
		}];
		return (
			<div>
				{loading ? <Loading/> :
					<Card bordered={false}>
						<Steps current={current} size="small">
							{steps.map(item => <Step key={item.title} title={item.title}
							                         icon={<Icon type={item.icon}/>}/>)}
						</Steps>
						<div className={styles.steps_content}>
							{
								current == 0 ?
									<AFeedUploadInfoContainer />
									: current == 1 ?
									<DiagnoseContainer />
									: current == 2 ?
									<div>
										<AFeedDiagnoseResultContainer />
									</div> : <div>steps error! Please contact developer</div>
							}
						</div>
					</Card>
				}
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state: state.aFeedOperateReducers,
	}
};
const mapDispatchToProps = (dispatch) => {
	return {
		init: () => {
			dispatch(init())
		},
		requestIndustrys: () => {
			dispatch(requestIndustrys())
		},
		changeCurrent: (current) => {
			dispatch(changeCurrent(current))
		},
		getAFeed: (feedId) => {
			dispatch(getAFeed(feedId))
		},
		changeLoading: (loading) => {
			dispatch(changeLoading(loading))
		},
	}
};
const AFeedOperateView = connect(mapStateToProps, mapDispatchToProps)(AFeedOperate);
export default AFeedOperateView;