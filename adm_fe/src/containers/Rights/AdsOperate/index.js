/**
 * @description 广告主账户添加、编辑页面组件
 */
import React from 'react'
import {
    FormList as AdsList,
    FormWell as AdsWell,
    readLevelInfo,
    removeLevelInfo
} from '../../../components/Form'

import AdsName from './AdsOperateName'
import AdsCorporation_name from './AdsOperateCorporation_name'
import AdsMail from './AdsOperateMail'
import AdsTel from './AdsOperateTel'
import AdsPassword from './AdsOperatePassword'
import AdsRepassword from './AdsOperateRePassword'
import AdsMedia from './AdsOperateMedia'

import AdsBreadCrumb from './AdsOperateBreadcrumb'
import AdsSubmit from './AdsOperateSubmit'

export {
    AdsList,
    AdsWell,
    AdsName,
    AdsCorporation_name,
    AdsMail,
    AdsTel,
    AdsPassword,
    AdsRepassword,
    AdsMedia,
    AdsBreadCrumb,
    AdsSubmit,

    readLevelInfo,
    removeLevelInfo
}