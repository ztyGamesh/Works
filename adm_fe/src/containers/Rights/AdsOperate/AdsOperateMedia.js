/**
 * @class 配置媒体名单
 */

import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '选择媒体',
            field: 'media',
            multiple: true,
            placeholder: '媒体可多选',
            validate: (value) => {

            }
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}