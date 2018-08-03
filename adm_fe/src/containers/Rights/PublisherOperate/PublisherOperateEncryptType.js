/**
 * @class 设备ID加密方式
 */
import React from 'react'
import { FormSelect } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '设备ID加密方式',
            required:true,
            field: 'encrypt_type',
            data: [
                {
                    value: 'plain',
                    label: '明文'
                }, {
                    value: 'md5',
                    label: 'MD5'
                },{
                    value: 'shal',
                    label: 'SHAL'
                }
            ],
            validate: (value) => {
                // if (value.length === 0) {
                //     return '请选择屏蔽类别'
                // }
            }
        }
    }

    render() {
        return (
            <FormSelect {...this.state} {...this.props} />
        )
    }
}