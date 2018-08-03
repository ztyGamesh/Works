/**
 * @class URL地址
 */
import React from 'react'
import { FormTextarea } from '../../../components/Form'
import { validateAField } from './'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'URL地址',
            field: 'link',
            required: true,
            size: 1,
            max: 1,
            only: true,
            line: true,
            validate: (value) => {
                const { promote_type } = this.props
                if (promote_type == 2) {
                    const flag = validateAField(value)
                    if (flag === false) {
                        return '手动输入和插入功能二选一，不能混合使用'
                    } else if (flag === 1) {
                        return
                    }
                }
                if (!/^https?:\/\//.test(value)) {
                    return '请填写以http(https)开头的链接地址'
                }
            }
        }
    }

    render() {
        const { promote_type, schemaList = [] } = this.props
        const list = promote_type == 2 ? [
            {
                type: 'select',
                label: '插入商品组字段',
                config: schemaList.reduce((r, t) => {
                    if (t.type === 'url') {
                        r.push({
                            label: t.display,
                            value: `[:${t.display}:]`
                        })
                    }
                    return r
                }, [])
            }
        ] : undefined
        return (
            <FormTextarea {...this.state} {...this.props} list={list} />
        )
    }
}