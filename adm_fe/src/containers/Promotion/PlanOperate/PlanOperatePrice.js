/**
 * @class 出价
 */
import React from 'react'
import { FormInput } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '出价(元)',
            field: 'price',
            placeholder: '可输入金额范围：0.01~9999999999.99',
            validate: (value) => {
                const { ad_scene, promote_type } = this.props.view || {}
                // if (ad_scene == 2 && promote_type == 2) {
                //     const key_word = this.props.form.getFieldValue('key_word') || []
                //     if (key_word.length === 0) {
                //         if (value === '') {
                //             return '如果不设置关键词，系统将采用智能投放的方式，请设置计划出价'
                //         }
                //     } else if (value === '') {
                //         return
                //     }
                // }
                if (!(/^[0-9]{1,10}(|\.[0-9]{0,2})$/.test(value) && value >= 0.01)) {
                    return '请输入最多两位小数的数值！范围：0.01~9999999999.99'
                }
            }
        }
    }

    render() {
        const {
            purpose,
            ad_scene,
            promote_type
        } = this.props.view || {}
        return ad_scene == 2 
        // && promote_type == 1 
        ? null : (
            <FormInput required={true
                // !(ad_scene == 2 && promote_type == 2)
            } {...this.state} {...this.props} />
        )
    }
}