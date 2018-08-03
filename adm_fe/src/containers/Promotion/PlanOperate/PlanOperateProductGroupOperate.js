/**
 * @class
 */
import React from 'react'
import { Button, Form, Select, Input, message } from 'antd'
import { FormWell, FormInput, FormSelect, FormCustom } from '../../../components/Form'
import { TableBase, Links, Link, Modal } from '../../../components/Table'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: {
                label: '商品组名称',
                field: 'product_group_name',
                required: true,
                validate: (value) => {
                    if (!value) {
                        return '商品组名称不能为空！'
                    }
                    const { isEdit, initData = {}, nameList = [] } = this.props
                    const { groupId = '' } = initData
                    const temp = nameList.reduce((r, t) => {
                        if (isEdit && t.value === groupId) {
                            return r
                        }
                        return r.concat(t.label)
                    }, [])
                    if (temp.includes(value)) {
                        return '商品组名称重复！'
                    }
                },
                onChange: () => {
                    if (typeof this.props.resetStatus === 'function') {
                        this.props.resetStatus()
                    }
                }
            },
            mfeedId: {
                label: '选择feed',
                field: 'product_group_mfeedId',
                required: true,
                validate: (value) => {
                    if (!value) {
                        return '请选择Feed文件！'
                    }
                },
                onChange: async (v) => {
                    if (typeof this.props.onSelectChange === 'function') {
                        const schemaList = await this.props.onSelectChange(v) || []
                        this.setState({ schemaList })
                    }
                    if (typeof this.props.resetStatus === 'function') {
                        this.props.resetStatus()
                    }
                }
            },
            filter: {
                label: '筛选条件',
                field: 'product_group_filter'
            },
            columns: [
                {
                    title: '已选条件',
                    dataIndex: 'text'
                }, {
                    title: '操作',
                    dataIndex: 'operate',
                    render: (value, row, index) => {
                        if (value === 'add') {
                            return <Links>
                                <Link text="添加"
                                    onClick={this.openHandle}
                                    modal={<ModalComp title="添加筛选条件"
                                        onSubmit={this.addHandle}
                                        fieldData={this.state.schemaList} />}
                                />
                            </Links>
                        }
                        if (value === 'operate') {
                            return <Links>
                                <Link text="编辑"
                                    onClick={this.openHandle}
                                    modal={<ModalComp title="修改筛选条件"
                                        row={row}
                                        onSubmit={e => this.modifyHandle(e, row.uid)}
                                        fieldData={this.state.schemaList} />}
                                />
                                <Link text="删除"
                                    onClick={(ks, rs, fn) => this.deleteHandle(row.uid, fn)}
                                />
                            </Links>
                        }
                    }
                }
            ],
            data: [],
            schemaList: [],
            initData: null,
            //商品组编辑数据是否初始化
            isInit: false,
            //编辑状态，表格数据延迟初始化
            init: !props.isEdit
        }
    }

    async componentWillReceiveProps(nextProps) {
        const { initData, onSelectChange } = nextProps
        if (!nextProps.isEdit || this.state.isInit || initData === null) {
            return
        }
        const schemaList = typeof onSelectChange === 'function' && await onSelectChange(initData.mfeedId) || []
        const key = + new Date()
        const data = (initData.filter || []).reduce((r, t = [], index) => {
            if (t.length) {
                const { field, operator } = t[0]
                const value = t.map(s => s.value)
                const text = turnFiltersToText({ field, operator, value }, {
                    fieldList: schemaList,
                    operatorList: [
                        { value: 'GE', label: '大于等于' },
                        { value: 'G', label: '大于' },
                        { value: 'L', label: '小于' },
                        { value: 'LE', label: '小于等于' },
                        { value: 'E', label: '等于' },
                        { value: 'B', label: '属于' },
                        { value: 'C', label: '包含' }
                    ]
                })
                return r.concat({
                    uid: key + '_' + index,
                    field,
                    operator,
                    value,
                    text,
                    operate: 'operate'
                })
            }
            return r
        }, [])
        this.setState({
            initData,
            isInit: true,
            data,
            schemaList,
            init: true
        })
        nextProps.form.setFieldsValue({
            product_group_name: initData.name,
            product_group_mfeedId: initData.mfeedId
        })
    }

    openHandle = () => {
        return new Promise(resolve => {
            this.props.form.validateFields(['product_group_mfeedId'], {}, errors => {
                resolve(errors === null)
            })
        })
    }

    addHandle = async (values) => {
        const data = await values
        if (data === false) {
            return false
        }
        if (typeof this.props.resetStatus === 'function') {
            this.props.resetStatus()
        }
        const { field, operator, value, text } = data
        this.setState({
            data: [
                ...this.state.data,
                {
                    uid: + new Date() + '_+',
                    field, operator, value, text,
                    operate: 'operate'
                }
            ]
        })
    }

    modifyHandle = async (values, key) => {
        const data = await values
        if (data === false) {
            return false
        }
        if (typeof this.props.resetStatus === 'function') {
            this.props.resetStatus()
        }
        const { field, operator, value, text } = data
        const newData = [...this.state.data]
        const index = newData.findIndex(t => t.uid === key)
        if (index !== -1) {
            newData[index] = {
                uid: + new Date() + '_+',
                field, operator, value, text,
                operate: 'operate'
            }
        }
        await this.setState({ data: newData })
    }

    deleteHandle = async (key, refresh) => {
        if (typeof this.props.resetStatus === 'function') {
            this.props.resetStatus()
        }
        const newData = [...this.state.data]
        const index = newData.findIndex(t => t.uid === key)
        if (index !== -1) {
            newData.splice(index, 1)
        }
        await this.setState({ data: newData })
        refresh()
    }

    updateHandle = (params = {}) => {
        const { current, pageSize } = params
        const { data = [] } = this.state
        const rows = data.concat([{
            uid: '1',
            text: ' ',
            operate: 'add'
        }])
        return { rows, total: rows.length }
    }

    submitHandle = async () => {
        const { onSubmit } = this.props
        const { data = [] } = this.state
        const newData = data.reduce((r, t = {}) => {
            const { field, operator, value } = t
            if (value) {
                r.push(value.map(s => ({
                    field,
                    operator,
                    value: s
                })))
            }
            return r
        }, [])
        if (typeof onSubmit === 'function') {
            onSubmit(newData)
        }
    }

    renderSubmit = () => {
        const { status, result = {} } = this.props
        switch (status) {
            case 'add-ing':
                return <div style={{ width: '100%' }}>
                    <div>正在新建...</div>
                </div>
                break
            case 'add-end':
                return <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>新建成功！已选择商品个数正在计算中，可在商品组处查看</div>
                    <div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.props.onCancel}>知道了</Button>
                    </div>
                </div>
                break
            case 'add-calc':
                return <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'inline-block', paddingRight: 12 }}>新建成功！已选择商品个数{result.size || 0}个</div>
                        {
                            result.size ? <a href={result.download}>点击下载（最多一万条）</a> : null

                        }
                    </div>
                    <div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.props.onCancel}>知道了</Button>
                    </div>
                </div>
                break
            case 'show':
                return <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>已选择商品个数正在计算中</div>
                    <div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.props.onCancel}>知道了</Button>
                    </div>
                </div>
                break
            case 'show-calc':
                return <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'inline-block', paddingRight: 12 }}>已选择商品个数{result.size || 0}个</div>
                        {
                            result.size ? <a href={result.download}>点击下载（最多一万条）</a> : null
                        }
                    </div>
                    <div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.props.onCancel}>知道了</Button>
                    </div>
                </div>
                break
            case 'modify-ing':
                return <div style={{ width: '100%' }}>
                    <div>正在修改...</div>
                </div>
                break
            case 'modify-end':
                return <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>已选择商品个数正在计算中</div>
                    <div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.props.onCancel}>知道了</Button>
                    </div>
                </div>
                break
            case 'modify-calc':
                return <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'inline-block', paddingRight: 12 }}>已选择商品个数{result.size || 0}个</div>
                        {
                            result.size ? <a href={result.download}>点击下载（最多一万条）</a> : null
                        }
                    </div>
                    <div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.props.onCancel}>知道了</Button>
                    </div>
                </div>
                break
            default:
                return <div style={{ width: '100%' }}>
                    <Button type="primary" onClick={this.submitHandle}>确定</Button>
                    <Button style={{ marginLeft: 12 }} onClick={this.props.onCancel}>取消</Button>
                </div>
                break
        }
    }

    render() {
        const { isEdit } = this.props
        return (
            <FormWell title={isEdit ? '查看商品组' : '新建商品组'} {...this.props}>
                <FormInput {...this.state.name} />
                <FormSelect {...this.state.mfeedId} data={this.props.receiveData} />
                <FormCustom {...this.state.filter}>
                    <div style={{ width: '100%', marginTop: -18 }}>
                        <TableBase init={this.state.init} columns={this.state.columns} onUpdate={this.updateHandle} />
                    </div>
                </FormCustom>
                <FormCustom label>{this.renderSubmit()}</FormCustom>

            </FormWell>
        )
    }
}

class ModalComp extends React.Component {
    constructor(props) {
        super(props)
        const { row = {} } = props
        this.state = {
            field: row.field,
            operator: row.operator,
            value: row.value && row.value.join('|'),
            fieldList: props.fieldData || [],
            operatorList: [
                { value: 'GE', label: '大于等于' },
                { value: 'G', label: '大于' },
                { value: 'L', label: '小于' },
                { value: 'LE', label: '小于等于' },
                { value: 'E', label: '等于' },
                { value: 'B', label: '属于' },
                { value: 'C', label: '包含' }
            ]
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fieldList: nextProps.fieldData || []
        })
    }

    renderFieldData = () => {
        const { fieldList = [] } = this.state
        return fieldList.reduce((r, t) => {
            if (['string',
                'integer',
                'decimal',
                'timestamp'].includes(t.type)) {
                return r.concat({
                    label: t.display,
                    value: t.field
                })
            }
            return r
        }, [])
    }

    renderOperatorData = () => {
        const { fieldList = [], operatorList, field = '' } = this.state
        const fieldInfo = fieldList.find(t => t.field === field)
        if (field && fieldInfo) {
            switch (fieldInfo.type) {
                case 'string':
                    return operatorList.filter(t => ['C', 'E'].includes(t.value))
                    break
                case 'integer':
                    return operatorList.filter(t => ['GE', 'G', 'L', 'LE', 'B', 'E'].includes(t.value))
                    break
                case 'decimal':
                    return operatorList.filter(t => ['GE', 'G', 'L', 'LE', 'B', 'E'].includes(t.value))
                    break
                case 'timestamp':
                    return operatorList.filter(t => ['GE', 'G', 'L', 'LE', 'B', 'E'].includes(t.value))
                    break
                default:
                    break
            }
        }
        return []
    }

    render() {
        const props = {
            ...this.props,
            isSubmit: true,
            onSubmit: () => {
                const { onSubmit } = this.props
                const { field = '', operator = '', value = '', fieldList = [], operatorList = [] } = this.state
                if (typeof onSubmit === 'function') {
                    if (field === '') {
                        message.warning('请选择筛选字段！')
                        return onSubmit(false)
                    }
                    if (operator === '') {
                        message.warning('请选择条件！')
                        return onSubmit(false)
                    }
                    let nValue = value.trim()
                    if (nValue === '') {
                        message.warning('请输入值！')
                        return onSubmit(false)
                    }
                    if (operator === 'B') {
                        const vs = nValue.split('-').map(t => t.trim())
                        if (vs.length !== 2 || (
                            (vs[0] === '' || isNaN(vs[0])) || (vs[1] === '' || isNaN(vs[1]))
                        )) {
                            message.warning('输入格式错误！')
                            return onSubmit(false)
                        }
                        if (+vs[0] > +vs[1]) {
                            message.warning('输入范围错误！')
                            return onSubmit(false)
                        }
                        nValue = vs.join('-')
                    }
                    const nValues = nValue.split('|').reduce((r, t) => {
                        if (!r.includes(t.trim())) {
                            return r.concat(t.trim())
                        }
                        return r
                    }, [])
                    const text = turnFiltersToText({ field, operator, value: nValues }, { fieldList, operatorList })
                    return onSubmit({ field, operator, value: nValues, text })
                }
            }
        }
        const { field, operator, value } = this.state
        return (
            <Modal {...props}>
                <div style={{ width: '100%', display: 'flex', paddingBottom: 12 }}>
                    <SelectComp style={{ width: 120, flexShrink: 0 }}
                        placeholder="筛选字段"
                        value={field}
                        data={this.renderFieldData()}
                        onChange={e => this.setState({
                            field: e,
                            operator: undefined,
                            value: undefined
                        })} />
                    <SelectComp style={{ marginLeft: 12, width: 80, flexShrink: 0 }}
                        placeholder="条件"
                        value={operator}
                        data={this.renderOperatorData()}
                        onChange={e => this.setState({
                            operator: e,
                            value: undefined
                        })} />
                    <InputComp style={{ marginLeft: 12, width: 0, flexGrow: 1 }}
                        placeholder="条件"
                        value={value}
                        onChange={e => this.setState({ value: e })} />
                </div>
                <div style={{ width: '100%', color: '#999', fontSize: 12, textAlign: 'left', paddingBottom: 24 }}>
                    <p style={{ lineHeight: '1.5', marginBottom: 0 }}>提示：</p>
                    <p style={{ lineHeight: '1.5', marginBottom: 0 }}>如需价格在1-10之间，则字段选择“价格”，条件选择“属于”，值输入“1-10”</p>
                    <p style={{ lineHeight: '1.5', marginBottom: 0 }}>如需品牌包含宝马或奔驰，则字段选择“品牌”，条件选择“等于”，值输入“宝马|奔驰”</p>
                </div>
            </Modal>
        )
    }
}
ModalComp = Form.create()(ModalComp)

function turnFiltersToText({ field, operator, value }, { fieldList = [], operatorList = [] }) {
    let text = ''
    const fieldInfo = fieldList.find(t => t.field === field)
    const operatorInfo = operatorList.find(t => t.value === operator)
    fieldInfo && (text += fieldInfo.display)
    operatorInfo && (text += operatorInfo.label)
    text += value.join('|')
    return text
}

class SelectComp extends React.Component {
    render() {
        const { style, placeholder, onChange, value, data = [] } = this.props
        return (
            <Select style={style}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                allowClear={false}>
                {
                    data.map(t =>
                        <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                    )
                }
            </Select>
        )
    }
}

class InputComp extends React.Component {
    render() {
        const { style, placeholder, onChange, value } = this.props
        return (
            <Input style={style}
                value={value}
                placeholder={placeholder}
                onChange={e => {
                    typeof onChange === 'function' && onChange(e.target.value.trim())
                }} />
        )
    }
}
