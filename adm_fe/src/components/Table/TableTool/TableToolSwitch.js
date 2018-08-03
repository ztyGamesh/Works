/**
 * @class 开关组件
 * 
 * @prop {Object} row 当前行数据
 * @prop {String} value 当前值
 * @prop {Array} config 选项配置
 * @prop {Object} config[] {label:String,text:String}
 * @prop {Object} config[0] 开
 * @prop {Object} config[1] 关
 * @prop {Object} config[2] 无效，和disabled不同
 * @prop {Boolean} disabled 禁用，不可修改
 * @prop {Function} onClick 编辑，完成并刷新表格
 * 
 * @method onClick
 * @param {String} value 编辑框值
 * @param {Object} row 当前行数据
 */
import React from 'react'
import styles from './style.less'
import { Switch, Tooltip } from 'antd'

export default class extends React.Component {
	constructor(props) {
		super(props)
		const { config, value, row, onClick, onUpdate, label } = this.props
		const [on = {}, off = {}, disabled = {}] = config
		const active = [on.value, off.value, disabled.value].indexOf(value)
		this.state = {
			row,
			onClick,
			onUpdate,
			on,
			off,
			disabled,
			active,
			title: active === 0 ? off.text : active === 1 ? on.text : active === 2 ? disabled.text : '',
			loading: false,
			label
		}
	}

	changeHandle = async (e) => {
		const { row, active, on, off, onClick, onUpdate } = this.state
		if (!(active === 1 || active === 0)) {
			return
		}
		this.setState({ loading: true, active: 1 ^ active })
		if (typeof onClick === 'function') {
			await onClick(e ? on.value : off.value, row)
		}
		this.setState({ loading: false })
		if (typeof onUpdate === 'function') {
			await onUpdate()
		}
	}

	render() {
		const { title, active, loading, label, showLabel } = this.state
		const disabled = this.props.disabled || active === 2
		if (label) {
			return <div className={styles.switch}>
				<div className={styles['switch-label']}>{label}</div>
				<Tooltip title={title}>
					<div className={styles['switch-view']} style={{ display: 'inline-block', cursor: disabled ? 'not-allowed' : undefined }}>
						<Switch checked={active === 0} loading={loading} disabled={disabled} onChange={this.changeHandle} />
					</div>
				</Tooltip>
			</div>
		}
		return [0, 1, 2].includes(active) ? (
			<Tooltip title={title}>
				<div style={{ display: 'inline-block', cursor: disabled ? 'not-allowed' : undefined }}>
					<Switch checked={active === 0} loading={loading} disabled={disabled} onChange={this.changeHandle} />
				</div>
			</Tooltip>
		) : null
	}
}
