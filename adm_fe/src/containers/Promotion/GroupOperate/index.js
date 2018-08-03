/**
 * @description 广告组新建、编辑页面组件
 */
import React from 'react'

import {
    FormList as GroupList,
    FormWell as GroupWell,
    readLevelInfo,
    removeLevelInfo
} from '../../../components/Form'
import GroupBreadcrumb from './GroupOperateBreadcrumb'
import GroupName from './GroupOperateName'
import GroupAdScene from './GroupOperateAdScene'
import GroupPromoteType from './GroupOperatePromoteType'
import GroupPurpose from './GroupOperatePurpose'
import GroupBudget from './GroupOperateBudget'
import GroupSubmit from './GroupOperateSubmit'

export {
    GroupList,
    GroupWell,
    GroupBreadcrumb,
    GroupName,
    GroupAdScene,
    GroupPromoteType,
    GroupPurpose,
    GroupBudget,
    GroupSubmit,
    //utils
    readLevelInfo,
    removeLevelInfo
}
