/**
 * @class 选择模板
 */
import React from 'react'
import { Collapse } from 'antd'
const Panel = Collapse.Panel
import { SLOT_TEMPLATE_SETTING as tempSetting, sortSlotTemplates } from './config'
import {
    TemplatesPic,
    TemplatesPicNum,
    TemplatesPicPosition,
    TemplatesVideo,
    TemplatesTitleAlign,
    TemplatesTitleFont,
    TemplatesTitleFontSize,
    TemplatesTitleFontColor,
    TemplatesTitleLength,
    TemplatesDescriptionFont,
    TemplatesDescriptionFontSize,
    TemplatesDescriptionFontColor,
    TemplatesDescriptionLength
} from './Templates'
import { FormWell, FormStorage } from '../../../components/Form'

export default class extends React.Component {
    render() {
        const { disabled } = this.props
        const templates = sortSlotTemplates(this.props.templates || [])
        return templates && templates.length > 0 ? (
            <Collapse defaultActiveKey={templates}>
                {
                    templates.map(t => {
                        const { CN, setting = {} } = tempSetting[t] || {}
                        const { pic, picNum, picPosition, title, description, video } = setting
                        return <Panel header={CN} key={t} forceRender>
                            {
                                pic ?
                                    <FormWell {...this.props} title="图片素材设置" space={0}>
                                        <TemplatesPic disabled={disabled} templateId={t} config={pic} />
                                        {picNum ? <TemplatesPicNum disabled={disabled} templateId={t} config={picNum} /> : null}
                                        {picPosition ? <TemplatesPicPosition disabled={disabled} templateId={t} config={picPosition} /> : null}
                                    </FormWell> : null
                            }
                            {
                                video ?
                                    <FormWell {...this.props} title="视频素材设置" space={0}>
                                        <TemplatesVideo disabled={disabled} templateId={t} config={video} />
                                    </FormWell> : null
                            }
                            {
                                title ?
                                    <FormWell {...this.props} title="标题设置" space={0}>
                                        {title.align ? <TemplatesTitleAlign disabled={disabled} templateId={t} config={title.align} /> : null}
                                        <TemplatesTitleFont disabled={disabled} templateId={t} config={title.font} />
                                        <TemplatesTitleFontSize disabled={disabled} templateId={t} config={title.fontSize} />
                                        <TemplatesTitleFontColor disabled={disabled} templateId={t} />
                                        <TemplatesTitleLength disabled={disabled} templateId={t} config={title.length} />
                                    </FormWell> : null
                            }
                            {
                                description ?
                                    <FormWell {...this.props} title="描述设置" space={0}>
                                        <TemplatesDescriptionFont disabled={disabled} templateId={t} config={description.font} />
                                        <TemplatesDescriptionFontSize disabled={disabled} templateId={t} config={description.fontSize} />
                                        <TemplatesDescriptionFontColor disabled={disabled} templateId={t} />
                                        <TemplatesDescriptionLength disabled={disabled} templateId={t} config={description.length} />
                                    </FormWell> : null
                            }
                            <FormWell space={0} {...this.props}>
                                <FormStorage field={`templates.${t}.uid`} />
                            </FormWell>
                        </Panel>
                    })
                }
            </Collapse>
        ) : null
    }
}