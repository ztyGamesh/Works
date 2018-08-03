/**
 * @class 广告位类型
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'
import { SLOT_CLASS_LIST as classInfo } from './config'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '广告位类型',
            field: 'class',
            required: true,
            data: classInfo.map(t => ({
                value: t.classId,
                label: t.CN
            })),
            validate: (value) => {
                if (!value) {
                    return '请选择广告位类型'
                }
            }
        }
    }

    render() {
        return (
            <FormRadio full {...this.state} {...this.props} />
        )
    }
}