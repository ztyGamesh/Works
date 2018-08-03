/**
 * @class 广告位类型
 */
import React from 'react'
import { FormRadio } from '../../../components/Form'
import { SLOT_CLASS_LIST as classInfo } from '../../Media/SlotOperate/config'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: '广告位类型',
            field: 'slot_class',
            required: true,
            data: classInfo.map(t => ({
                value: t.classId,
                label: t.CN
            })),
            validate: (value) => {
            },
            disabled: true
        }
    }

    render() {
        return (
            <FormRadio full {...this.state} {...this.props} />
        )
    }
}