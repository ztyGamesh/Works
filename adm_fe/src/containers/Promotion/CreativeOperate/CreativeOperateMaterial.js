/**
 * @class 物料配置
 */
import React from 'react'
import { FormWell, FormInput, FormTextarea, FormUploadImg, FormUploadVideo, FormSelect, FormStorage } from '../../../components/Form'
import { insertKeyword, insertUser, createInsertSchema, validateInsert, getKeyword } from './'
import { CODE_LIST } from '../../Media/SlotOperate/config'

export default class extends React.Component {
    constructor(props) {
        super(props)
        const { ad_scene, promote_type, setting = {}, slot_name, changeIndex, index, isEdit, initData } = props
        const { title_setting = {}, description_setting = {}, pic_setting, template_name, template } = setting
        let video_setting = setting.video_setting
        // 信息流视频样式video_settiong前端写死
        if (template === CODE_LIST.flow_video) {
            video_setting = {
                format: ['mp4'],
                size: { text: '5m', bytes: 5242880 }
            }
        }
        const key = isEdit ? `modify.${template}.` : `add.${template}.${index}.`
        let picScale = []
        let picStandard = {}
        let picExtra = ''
        if (pic_setting) {
            if (pic_setting.size) {
                picStandard.size = pic_setting.size.bytes
                if (pic_setting.size.text) {
                    picExtra += ` 图片大小：${pic_setting.size.text}以内 `
                }
            }
            if (pic_setting.format) {
                picStandard.format = pic_setting.format
                picExtra += ` 支持格式：${pic_setting.format.join('/')} `
            }
            if (pic_setting.scale) {
                picScale = pic_setting.scale.map(t => {
                    const text = t.replace(/_/g, ':')
                    return {
                        label: text,
                        value: t
                    }
                })
                picStandard.scale = (isEdit ?
                        (initData.modify[template].pic_scale || '') :
                        (picScale[0] && picScale[0].value || '')
                ).replace(/_/g, ':')
            }
        }
        let videoStandard = {}
        let videoExtra = ''
        if (video_setting) {
            if (video_setting.size) {
                videoStandard.size = video_setting.size.bytes
                if (video_setting.size.text) {
                    videoExtra += ` 视频大小：${video_setting.size.text}以内 `
                }
            }
            if (video_setting.format) {
                videoStandard.format = video_setting.format
                videoExtra += ` 支持格式：${video_setting.format.join('/')} `
            }
            if (picScale[0]) {
                videoStandard.scale = picScale[0].value.replace(/_/g, ':')
            }
        }
        this.state = {
            key,
            name: {
                label: '创意名称',
                field: key + 'name',
                required: true,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '创意名称不能为空'
                    }
                    const { length } = value.replace(/[\u2E80-\u9FFF]/g, '**')
                    if (length < 0 && length > 100) {
                        isEdit || changeIndex()
                        return '50个字以内，2个英文是1个字'
                    }
                },
                initialValue: isEdit ? '' : [1, 2, 3, 4, 5, 6].reduce((r, t) => {
                    return r + String.fromCharCode(65 + (Math.random() * 26 >> 0))
                }, slot_name + '-' + template_name)
            },
            title: {
                label: '创意标题',
                field: key + 'title',
                required: true,
                placeholder: `${title_setting.min}-${title_setting.max}个字`,
                max: 1,
                validate: (value) => {
                    let newValue = value
                    if (ad_scene == 2) {
                        const flag = validateInsert(value)
                        if (flag.info === false) {
                            return flag.data
                        }
                        newValue = flag.data
                    }
                    const { length } = newValue.replace(/[\u2E80-\u9FFF]/g, '**')
                    const { min = 2, max = 23 } = title_setting
                    const [minx, maxx] = [min * 2, max * 2]
                    if (length < minx || length > maxx) {
                        isEdit || changeIndex()
                        return `${min}-${max}个字`
                    }
                }
            },
            description: {
                label: '创意描述',
                field: key + 'description',
                required: [
                    CODE_LIST.flow_smallimgAndChar,
                    CODE_LIST.banner_smallimgAndChar
                ].includes(template),
                placeholder: `${description_setting.min}-${description_setting.max}个字`,
                max: 1,
                validate: (value) => {
                    let newValue = value
                    if (ad_scene == 2) {
                        const flag = validateInsert(value)
                        if (flag.info === false) {
                            return flag.data
                        }
                        const title = this.props.form.getFieldValue(key + 'title')
                        const titleKw = getKeyword(title)
                        const descKw = getKeyword(value)
                        if (titleKw !== '' && descKw !== '' && titleKw !== descKw) {
                            return '标题和描述的关键词通配符必须一致'
                        }
                        newValue = flag.data
                    }
                    if (![
                            CODE_LIST.flow_smallimgAndChar,
                            CODE_LIST.banner_smallimgAndChar,
                            CODE_LIST.res_smallimgAndChar
                        ].includes(template) && newValue === '') {
                        //创意描述不能为空
                        return
                    }
                    const { length } = newValue.replace(/[\u2E80-\u9FFF]/g, '**')
                    const { min = 2, max = 23 } = description_setting
                    const [minx, maxx] = [min * 2, max * 2]
                    if (length < minx || length > maxx) {
                        isEdit || changeIndex()
                        return `${min}-${max}个字`
                    }
                }
            },
            picScale: {
                label: '选择尺寸',
                field: key + 'pic_scale',
                required: true,
                data: picScale,
                initialValue: picScale[0] && picScale[0].value || '',
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择尺寸'
                    }
                },
                onChange: this.changePicScaleHandle
            },
            picSize: {
                field: key + 'pic_size'
            },
            pic: {
                label: '创意图片',
                field: key + 'pic',
                required: true,
                standard: picStandard,
                extra: <p>{picExtra}</p>,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择图片'
                    }
                },
                onChange: (e, more) => this.changePicHandle(e, more)
            },
            picBytes: {
                field: key + 'pic_bytes'
            },
            pic1: {
                label: '创意图片',
                field: key + 'pic1',
                required: true,
                standard: picStandard,
                extra: <React.Fragment>
                    <p>{picExtra}</p>
                    <p>组图图片尺寸要一致</p>
                </React.Fragment>,
                validate: this.validatePics,
                onChange: (e, more) => this.changePicHandle(e, more, 1)
            },
            picBytes1: {
                field: key + 'pic1_bytes'
            },
            pic2: {
                label: '创意图片',
                field: key + 'pic2',
                required: true,
                standard: picStandard,
                extra: <React.Fragment>
                    <p>{picExtra}</p>
                    <p>组图图片尺寸要一致</p>
                </React.Fragment>,
                validate: this.validatePics,
                onChange: (e, more) => this.changePicHandle(e, more, 2)
            },
            picBytes2: {
                field: key + 'pic2_bytes'
            },
            pic3: {
                label: '创意图片',
                field: key + 'pic3',
                required: true,
                standard: picStandard,
                extra: <React.Fragment>
                    <p>{picExtra}</p>
                    <p>组图图片尺寸要一致</p>
                </React.Fragment>,
                validate: this.validatePics,
                onChange: (e, more) => this.changePicHandle(e, more, 3)
            },
            picBytes3: {
                field: key + 'pic3_bytes'
            },
            video: {
                label: '创意视频',
                field: key + 'video',
                required: true,
                standard: videoStandard,
                extra: <p>{videoExtra}</p>,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择视频'
                    }
                }
            },
            dyProductNum: {
                label: '商品数量',
                field: key + 'product_num',
                required: true,
                data: [
                    { label: '单个商品', value: 1 },
                    { label: '三个商品', value: 3 }
                ],
                validate: (value) => {
                },
                initialValue: 1,
                onChange: (productNum) => {
                    this.setState({ productNum })
                    //清空已选择的图片
                    this.props.form.resetFields([
                        key + 'pic',
                        key + 'pic1',
                        key + 'pic2',
                        key + 'pic3'
                    ])
                }
            },
            dyPic: {
                label: '创意图片',
                field: key + 'pic',
                required: true,
                size: 1,
                max: 1,
                insertOnly: true,
                only: true,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择图片'
                    }
                }
            },
            dyPic1: {
                label: '创意图片1',
                field: key + 'pic1',
                required: true,
                size: 1,
                max: 1,
                insertOnly: true,
                only: true,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择图片'
                    }
                }
            },
            dyPic2: {
                label: '创意图片2',
                field: key + 'pic2',
                required: true,
                size: 1,
                max: 1,
                insertOnly: true,
                only: true,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择图片'
                    }
                }
            },
            dyPic3: {
                label: '创意图片3',
                field: key + 'pic3',
                required: true,
                size: 1,
                max: 1,
                insertOnly: true,
                only: true,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择图片'
                    }
                }
            },
            pDyPic1: {
                label: '创意图片',
                field: key + 'pic1',
                required: true,
                size: 1,
                max: 1,
                insertOnly: true,
                only: true,
                validate: (value) => {
                    if (!value) {
                        isEdit || changeIndex()
                        return '请选择图片'
                    }
                },
                onChange: (e) => {
                    const obj = {}
                    obj[key + 'pic2'] = e
                    obj[key + 'pic3'] = e
                    this.props.form.setFieldsValue(obj)
                }
            },
            pDyPic2: {
                field: key + 'pic2'
            },
            pDyPic3: {
                field: key + 'pic3'
            },
            productNum: isEdit && initData.modify[template].product_num || 1,
            //组图时保存图片尺寸信息
            picSizeList: isEdit && [
                initData.modify[template].pic_size,
                initData.modify[template].pic_size,
                initData.modify[template].pic_size
            ] || []
        }
    }

    /**
     * @method changePicHandle 图片尺寸变化
     */
    changePicScaleHandle = (e) => {
        const { key, pic, pic1, pic2, pic3, video } = this.state
        this.setState({
            pic: {
                ...pic,
                standard: {
                    ...pic.standard,
                    //更新图片上传比例要求
                    scale: e.replace(/_/g, ':')
                }
            },
            pic1: {
                ...pic1,
                standard: {
                    ...pic1.standard,
                    //更新图片上传比例要求
                    scale: e.replace(/_/g, ':')
                }
            },
            pic2: {
                ...pic2,
                standard: {
                    ...pic2.standard,
                    //更新图片上传比例要求
                    scale: e.replace(/_/g, ':')
                }
            },
            pic3: {
                ...pic3,
                standard: {
                    ...pic3.standard,
                    //更新图片上传比例要求
                    scale: e.replace(/_/g, ':')
                }
            },
            video: {
                ...video,
                standard: {
                    ...video.standard,
                    //更新视频上传比例要求
                    scale: e.replace(/_/g, ':')
                }
            }
        })
        //清空已上传的图片和视频
        this.props.form.resetFields([
            key + 'pic',
            key + 'pic_bytes',
            key + 'pic1',
            key + 'pic1_bytes',
            key + 'pic2',
            key + 'pic2_bytes',
            key + 'pic3',
            key + 'pic3_bytes',
            key + 'pic_size',
            key + 'video'
        ])
    }

    /**
     * @method changePicHandle 图片上传
     */
    changePicHandle = async (e, more = {}, num = '') => {
        const { key } = this.state
        const { size, width, height } = more
        //保存图片大小和尺寸信息
        const obj = {}
        obj[key + `pic${num}_bytes`] = size
        const sizeInfo = width + '_' + height
        obj[key + 'pic_size'] = sizeInfo
        if (num !== '') {
            //组图时保存当前尺寸，用于校验图片同等尺寸
            const list = [...this.state.picSizeList]
            list[num - 1] = sizeInfo
            await this.setState({
                picSizeList: list
            })
        }
        this.props.form.setFieldsValue(obj)
    }

    /**
     * @method validatePics 组图校验
     */
    validatePics = (value) => {
        const { changeIndex, isEdit } = this.props
        if (!value) {
            isEdit || changeIndex()
            return '请选择图片'
        }
        //已上传的组图的尺寸去重去空，数量超过1则有不同尺寸的图片
        if (this.state.picSizeList.reduce((r, t) => {
                if (t && !r.includes(t)) {
                    r.push(t)
                }
                return r
            }, []).length > 1) {
            isEdit || changeIndex()
            return '组图图片尺寸要一致'
        }
    }

    render() {
        const { name,
            title,
            description,
            picScale,
            picSize,
            pic,
            picBytes,
            pic1,
            picBytes1,
            pic2,
            picBytes2,
            pic3,
            picBytes3,
            video,
            dyProductNum,
            dyPic,
            dyPic1,
            dyPic2,
            dyPic3,
            productNum,
            pDyPic1,
            pDyPic2,
            pDyPic3 } = this.state
        const { ad_scene, promote_type, schemaList, setting = {} } = this.props
        const { title_setting, description_setting, pic_setting, template } = setting
        let video_setting = setting.video_setting
        // 信息流视频样式video_settiong前端写死
        if (template === CODE_LIST.flow_video) {
            video_setting = {
                format: ['mp4'],
                size: { text: '5m', bytes: 5242880 }
            }
        }
        return (
            <FormWell space={0} {...this.props}>
                <FormInput full {...name} />
                {
                    !title_setting ? null :
                        <FormTextarea full {...title} list={
                            ad_scene == 2 && promote_type == 2 ? [
                                insertKeyword, createInsertSchema(schemaList), insertUser
                            ] : ad_scene == 2 ? [
                                insertKeyword
                            ] : promote_type == 2 ? [
                                createInsertSchema(schemaList), insertUser
                            ] : undefined} />
                }
                {
                    !description_setting ? null :
                        <FormTextarea full {...description} list={
                            ad_scene == 2 && promote_type == 2 ? [
                                insertKeyword, createInsertSchema(schemaList)
                            ] : ad_scene == 2 ? [
                                insertKeyword
                            ] : promote_type == 2 ? [
                                createInsertSchema(schemaList)
                            ] : undefined
                        } />
                }
                {/* 比例选择/动态商品组图商品数量 */}
                {
                    !pic_setting ? null :
                        promote_type == 1 ?
                            <FormSelect full {...picScale} /> :
                            pic_setting.count == 3 ?
                                <FormSelect full {...dyProductNum} /> : null
                }
                {/* 存储图片尺寸信息 */}
                {
                    pic_setting && promote_type == 1 ?
                        <FormStorage full {...picSize} /> : null
                }
                {/* 单图 */}
                {
                    pic_setting && pic_setting.count == 1 ?
                        promote_type == 1 ?
                            <FormUploadImg full {...pic} /> :
                            <FormTextarea full {...dyPic} list={
                                promote_type == 2 ? [
                                    createInsertSchema(schemaList, 'image')
                                ] : undefined} /> :
                        null
                }
                {
                    pic_setting && pic_setting.count == 1 && promote_type == 1 ?
                        <FormStorage full {...picBytes} /> :
                        null
                }
                {/* 组图1 */}
                {
                    pic_setting && pic_setting.count == 3 ?
                        promote_type == 1 ?
                            <FormUploadImg full {...pic1} /> :
                            productNum == 1 ?
                                <FormTextarea full {...dyPic1} list={
                                    promote_type == 2 ? [
                                        createInsertSchema(schemaList, 'image')
                                    ] : undefined} /> :
                                // 组图三图只需选一张，三张相同
                                <FormTextarea full {...pDyPic1} list={
                                    promote_type == 2 ? [
                                        createInsertSchema(schemaList, 'image')
                                    ] : undefined} /> : null
                }
                {
                    pic_setting && pic_setting.count == 3 && promote_type == 1 ?
                        <FormStorage full {...picBytes1} /> :
                        null
                }
                {/* 组图2 */}
                {
                    pic_setting && pic_setting.count == 3 ?
                        promote_type == 1 ?
                            <FormUploadImg full {...pic2} /> :
                            productNum == 1 ?
                                <FormTextarea full {...dyPic2} list={
                                    promote_type == 2 ? [
                                        createInsertSchema(schemaList, 'image')
                                    ] : undefined} /> :
                                // 组图三图只需选一张，三张相同
                                <FormStorage {...pDyPic2} /> : null
                }
                {
                    pic_setting && pic_setting.count == 3 && promote_type == 1 ?
                        <FormStorage full {...picBytes2} /> :
                        null
                }
                {/* 组图3 */}
                {
                    pic_setting && pic_setting.count == 3 ?
                        promote_type == 1 ?
                            <FormUploadImg full {...pic3} /> :
                            productNum == 1 ?
                                <FormTextarea full {...dyPic3} list={
                                    promote_type == 2 ? [
                                        createInsertSchema(schemaList, 'image')
                                    ] : undefined} /> :
                                // 组图三图只需选一张，三张相同
                                <FormStorage {...pDyPic3} /> : null
                }
                {
                    pic_setting && pic_setting.count == 3 && promote_type == 1 ?
                        <FormStorage full {...picBytes3} /> :
                        null
                }
                {/* 视频 */}
                {
                    !video_setting ? null :
                        <FormUploadVideo full {...video} />
                }
            </FormWell>
        )
    }
}
