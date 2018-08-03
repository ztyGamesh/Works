/**
 * @class 媒体广告位定向
 */
import React from 'react'
import { message } from 'antd'
import { FormSelect, FormTreeDoubleSearch } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            select: {
                label: '媒体广告位定向',
                field: 'media_slot_target_select',
                data: [
                    { label: '不限', value: 0 },
                    { label: '自定义', value: 1 }
                ],
                validate: (value) => {
                },
                initialValue: 0,
                onChange: props.onSelectChange
            },
            detail: {
                label: true,
                field: 'media_slot_target',
                validate: (value) => {
                    if (value.length === 0) {
                        return '请选择媒体广告位定向'
                    }
                },
                search: '定向广告位',
                searchPlaceholder: '广告位ID以英文逗号隔开',
                onSearch: async (value, media) => {
                    const { onDetailSearch } = this.props
                    if (value !== '' && typeof onDetailSearch === 'function') {
                        const res = await onDetailSearch(media, Array.from(new Set(value.split(','))).join(','))
                        if (res === false) {
                            return []
                        }
                        if ((res.invalid || []).length) {
                            message.warning(res.invalid.map(t => t.slot_id).join(',') + '：广告位不存在')
                        }
                        return (res.valid || []).map(t => ({
                            value: t.slot_id,
                            label: t.name
                        }))
                    }
                    return []
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <FormSelect {...this.state.select} {...this.props} />
                {
                    this.props.showDetail ?
                        <FormTreeDoubleSearch {...this.state.detail} {...this.props} data={this.props.receiveData} /> :
                        null
                }
            </React.Fragment>
        )
    }
}