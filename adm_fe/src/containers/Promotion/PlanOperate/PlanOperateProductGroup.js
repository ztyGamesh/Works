/**
 * @class 商品组
 */
import React from 'react'
import { Button, Form } from 'antd'
import { FormCustom, FormSelect, FormWell, FormList, FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                field: 'product_group',
                placeholder: '选择商品组',
                validate: (value) => {
                    if (!value) {
                        return '请选择商品组'
                    }
                },
                onChange: props.onSelectChange
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <FormCustom label="商品组" required {...this.props}>
                    <div style={{
                        width: '100%',
                        height: 41,
                        display: 'flex'
                    }}>
                        <div style={{ minWidth: 210, flexGrow: 1, alignSelf: 'flex-start' }}>
                            <FormSelect full {...this.state.select} {...this.props} data={this.props.receiveData} />
                        </div>
                        {
                            this.props.canAdd ?
                                <Button style={{ margin: '4px 0 0 6px', flexShrink: 0 }} onClick={this.props.onAdd}>新建商品组</Button> :
                                null
                        }
                        <Button style={{ margin: '4px 0 0 6px', flexShrink: 0 }} onClick={this.props.onModify}>查看商品组</Button>
                    </div>
                </FormCustom>
            </React.Fragment>
        )
    }
}