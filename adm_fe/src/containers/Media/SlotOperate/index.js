/**
 * @description 媒体添加、编辑页面组件
 */
import React from 'react'

import SlotBreadcrumb from './SlotOperateBreadcrumb'
import {
    FormList as SlotList,
    FormWell as SlotWell,
    readLevelInfo,
    removeLevelInfo
} from '../../../components/Form'
import SlotName from './SlotOperateName'
import SlotMedia from './SlotOperateMedia'
import SlotMediaType from './SlotOperateMediaType'
import SlotClass from './SlotOperateClass'
import SlotSlotChannelParent from './SlotOperateSlotChannelParent'
import SlotSlotChannel from './SlotOperateSlotChannel'
import SlotShield from './SlotOperateShield'
import SlotBlackIndustry from './SlotOperateBlackIndustry'
import SlotTemplates from './SlotOperateTemplates'
import SlotTemplatesConfig from './SlotOperateTemplatesConfig'
import SlotSubmit from './SlotOperateSubmit'

export {
    SlotBreadcrumb,
    SlotList,
    SlotWell,
    SlotName,
    SlotMedia,
    SlotMediaType,
    SlotClass,
    SlotSlotChannelParent,
    SlotSlotChannel,
    SlotShield,
    SlotBlackIndustry,
    SlotTemplates,
    SlotTemplatesConfig,
    SlotSubmit,
    //utils
    readLevelInfo,
    removeLevelInfo
}
