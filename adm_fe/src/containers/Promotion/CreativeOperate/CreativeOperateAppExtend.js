/**
 * @class 创意副标题
 */
import React from 'react'
import { FormStorage, FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                field: 'extend_type',
                initialValue: 'download'
            },
            extendBtn: {
                field: 'extend_data.button_text',
                initialValue: '立即下载'
            },
            extendUrl: {
                field: 'extend_data.extend_url',
                initialValue: ''
            },
            extendTitle: {
                label: '创意副标题',
                field: 'extend_data.extend_title',
                required: true,
                placeholder: '2-12个字',
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
        const { select, extendBtn, extendUrl, extendTitle } = this.state
        return (
            <React.Fragment>
                <FormStorage {...select} {...this.props} />
                <FormStorage {...extendBtn} {...this.props} />
                <FormStorage {...extendUrl} {...this.props} />
                <FormInput {...extendTitle} {...this.props} />
            </React.Fragment>
        )
    }
}