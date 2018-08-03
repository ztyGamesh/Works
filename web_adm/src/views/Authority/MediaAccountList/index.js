/**
 * Created by liuchangyu on 17/8/17.
 */
import React from 'react'
import {Button, message, Modal, Input} from 'antd'
import Table from '../../../components/table'
import './index.less'
import {mediaaccount} from '../../../mock/meidaaccount'
const Search = Input.Search;

export default class Music extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tData: [],
			item: {},
			loading: true,
			filteredInfo: null,
			sortedInfo: null,
		};
	}

	componentDidMount() {
		this.setState({
			tData: mediaaccount,
			loading: false
		})
	}

	handleChange(pagination, filters, sorter) {
		this.setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		});
	}

	rowSelection() {
		return {
			onChange: (selectedRowKeys, selectedRows) => {
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			getCheckboxProps: record => ({
				disabled: record.name === 'Disabled User',    // Column configuration not to be checked
			}),
		}
	}

	tableAction(actionKey, item) {
		console.log('操作row信息：',item);
		if (actionKey === 'edit') {
			message.success('TODO:点击修改')
		} else if (actionKey === 'detail') {
			message.success('TODO:点击查看')
		}
	}

	add() {
		message.success('TODO:添加')
	}

	render() {
		let {sortedInfo, filteredInfo} = this.state;
		sortedInfo = sortedInfo || {};
		filteredInfo = filteredInfo || {};

		const columns = [
			{title: '账号名', dataIndex: 'name', key: 'name'},
			{
				title: '账户类型', dataIndex: 'media_type', key: 'media_type',
				filters: [
					{text: 'media', value: 'media'},
					{text: 'adx', value: 'adx'},
				],
				filteredValue: filteredInfo.media_type || null,
				onFilter: (value, record) => record.media_type.includes(value),
			},
			{
				title: '状态', dataIndex: 'pause', key: 'pause',
				filters: [
					{text: '0', value: '0'},
					{text: '1', value: '1'},
					{text: '2', value: '2'},
				],
				filteredValue: filteredInfo.pause || null,
				onFilter: (value, record) => record.pause.includes(value),
				sorter: (a, b) => a.pause - b.pause,
				sortOrder: sortedInfo.columnKey === 'pause' && sortedInfo.order,
			},
			{title: '邮箱', dataIndex: 'mail', key: 'mail'},
			{title: '手机号码', dataIndex: 'tel', key: 'tel'},
			{title: '系统权限', dataIndex: 'platform_role', key: 'platform_role'},
		];

		return (
			<div id="wrap">
				<div className="tableBox">
					<Button onClick={this.add} className="addButton">添加</Button>
					<Search className="addSearch"
						placeholder="input search text"
						style={{ width: 200 }}
						onSearch={value => {console.log(value);message.success("TODO:重新请求数据，setState('tData')")}}
					/>
					<div style={{paddingTop: 43}}>
						<Table
							noIndex={true}
							rowSelection={this.rowSelection()}
							onCtrlClick={ this.tableAction }
							pagination={ true }
							pageSize={20}
							header={ columns }
							data={ this.state.tData }
							loading={ this.state.loading }
							onChange={ this.handleChange.bind(this)}
							action={row => [{
								key: 'detail',
								name: '查看',
								color: '#00d5cd',
								icon: 'eye'
							}, {
								key: 'edit',
								name: '修改',
								color: '#108ee9',
								icon: 'edit',
							},]}
							scroll={{}}
						/>
					</div>
				</div>
			</div>
		)
	}
}