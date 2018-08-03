/**
 * @description 表单组件
 * 
 * @description 嵌套关系：FormList>FormWell>"Form-Item"
 * 
 * @class FormList 表单整体
 * @class FormWell 表单分块
 * 
 * @class FormModal 在模态框中使用表单
 * 
 * @method readLevelInfo cascader初始化必须包含所有层级信息
 * @method removeLevelInfo cascader、tree取值时会获取所有层级信息，tree初始化不能包含层级信息
 */
import React from 'react'

import FormList from './FormList'
import FormWell from './FormWell'
import FormTabs from './FormTabs'
import FormModal from './FormModal'
import FormInput from './FormInput'
import FormTextarea from './FormTextarea'
import FormRadio from './FormRadio'
import FormSelect from './FormSelect'
import FormCascader from './FormCascader'
import FormTree from './FormTree'
import FormTreeDouble from './FormTreeDouble'
import FormTreeDoubleSearch from './FormTreeDoubleSearch'
import FormCheckbox from './FormCheckbox'
import FormImg from './FormImg'
import FormUploadImg from './FormUploadImg'
import FormUploadVideo from './FormUploadVideo'
import FormDate from './FormDate'
import FormHour from './FormHour'
import FormInfo from './FormInfo'
import FormCustom from './FormCustom'
import FormStorage from './FormStorage'
import FormSubmit from './FormSubmit'
import FormUpload from './FormUpload'

import { readLevelInfo, removeLevelInfo, updateFormState } from './FormUtil'

export {
    FormList,
    FormWell,
    FormTabs,
    FormModal,
    FormInput,
    FormTextarea,
    FormRadio,
    FormSelect,
    FormCascader,
    FormTree,
    FormTreeDouble,
    FormTreeDoubleSearch,
    FormCheckbox,
    FormImg,
    FormUploadImg,
    FormUploadVideo,
    FormDate,
    FormHour,
    FormInfo,
    FormCustom,
    FormStorage,
    FormSubmit,
    FormUpload,
    //@methods
    readLevelInfo,
    removeLevelInfo,
    updateFormState
}
