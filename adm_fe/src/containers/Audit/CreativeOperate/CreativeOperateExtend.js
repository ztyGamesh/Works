/**
 * @class 附加创意
 */
import React from 'react'
import { FormSelect, FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '附加创意',
                field: 'extend_type',
                required: true,
                data: [
                    { label: '无', value: 'empty' },
                    { label: '电话拨打', value: 'phone' },
                    { label: '表单收集', value: 'form' }
                ],
                onChange: props.onSelectChange,
                validate: (value) => {
                    if (!value) {
                        // return '请选择附加创意'
                    }
                },
                initialValue: 'empty'
            },
            phoneBtn: {
                label: '按钮名称',
                field: 'extend_data.button_text',
                required: true,
                data: [
                    { label: '咨询热线', value: '咨询热线' },
                    { label: '免费热线', value: '免费热线' },
                    { label: '立即拨打', value: '立即拨打' },
                    { label: '电话咨询', value: '电话咨询' },
                    { label: '电话拨打', value: '电话拨打' },
                    { label: '咨询电话', value: '咨询电话' },
                    { label: '加盟热线', value: '加盟热线' },
                    { label: '订购热线', value: '订购热线' }
                ],
                initialValue: '咨询热线',
                validate: (value) => {

                }
            },
            phoneUrl: {
                label: '电话号码',
                field: 'extend_data.phone_number',
                required: true,
                placeholder: '请填写5-11位电话号码',
                validate: (value) => {
                    if (!/^\d{5,11}$/.test(value)) {
                        return '电话号码格式错误'
                    }
                }
            },
            formBtn: {
                label: '按钮名称',
                field: 'extend_data.button_text',
                required: true,
                placeholder: '1-8个字符，汉字占两个字符',
                validate: (value) => {
                    const { length } = value.replace(/[\u2E80-\u9FFF]/g, '**')
                    if (length < 1 || length > 8) {
                        return '1-8个字符，汉字占两个字符'
                    }
                }
            },
            formUrl: {
                label: '表单站点地址',
                field: 'extend_data.extend_url',
                required: true,
                placeholder: '填写以http(https)开头的有效着陆页',
                validate: (value) => {
                    if (!/^https?:\/\//.test(value)) {
                        return '请填写以http(https)开头的有效着陆页'
                    }
                }
            },
            extendTitle: {
                label: '附加创意标题',
                field: 'extend_data.extend_title',
                required: true,
                validate: (value) => {
                    const { length } = value.replace(/[\u2E80-\u9FFF]/g, '**')
                    if (length < 4 || length > 24) {
                        return '2-12个字'
                    }
                }
            }
        }
    }

    render() {
        const { select, phoneBtn, phoneUrl, formBtn, formUrl, extendTitle } = this.state
        const { showType } = this.props
        return showType !== 'download' ? (
            <React.Fragment>
                <FormSelect {...select} {...this.props} />
                {
                    showType == 'phone' ? <FormSelect {...phoneBtn} {...this.props} /> : null
                }
                {
                    showType == 'phone' ? <FormInput {...phoneUrl} {...this.props} /> : null
                }
                {
                    showType == 'form' ? <FormInput {...formBtn} {...this.props} /> : null
                }
                {
                    showType == 'form' ? <FormInput {...formUrl} {...this.props} /> : null
                }
                {
                    showType !== 'empty' ? <FormInput {...extendTitle} {...this.props} /> : null
                }
            </React.Fragment>
        ) : null
    }
}