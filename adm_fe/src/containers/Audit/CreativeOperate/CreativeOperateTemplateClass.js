/**
 * @class 选择模板
 */
import React from 'react'
import { Divider, Checkbox } from 'antd'
import { FormCustom } from '../../../components/Form'
import { CarouselHandle } from '../../../components/Carousel'
const CheckboxGroup = Checkbox.Group
import { SLOT_TEMPLATE_LIST as templateInfo } from '../../Media/SlotOperate/config'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 1,
            field: 'template_class',
            validate: (value) => {
            },
            initialValue: []
        }
    }

    templateVideoPlay = (e) => {
        e.target.play()
    }

    templateVideoPause = (e) => {
        e.target.pause()
        e.target.currentTime = 0
    }

    renderCarouse = ({ templateId, CN, preview }) => {
        return <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Checkbox value={templateId}>{CN}</Checkbox>
            <video width="145px" height="258px" style={{
                marginTop: 12,
                border: '1px solid #ccc'
            }} onMouseOver={this.templateVideoPlay} onMouseOut={this.templateVideoPause}>
                <source src={preview} />
            </video>
        </div>
    }

    render() {
        const { classId, disabled, onChange } = this.props
        const data = templateInfo[classId] || []
        return (
            <FormCustom {...this.state} {...this.props}>
                <CheckboxGroup style={{ width: '100%' }} disabled onChange={onChange}>
                    <CarouselHandle
                        width={155}
                        size={4}
                        itemKey="templateId"
                        data={data}
                        render={this.renderCarouse} />
                </CheckboxGroup>
            </FormCustom>
        )
    }
}