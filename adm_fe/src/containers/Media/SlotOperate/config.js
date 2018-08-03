/**
 * @description 广告位参数
 */
import React from 'react'

/**
 * @const {Object} CODE_LIST 广告位ID、模板ID
 */
export const CODE_LIST = {
    flow_root: '29076f0d-a923-47d4-bfef-2e3cf28fc099',//广告形式:信息流
    flow_img: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032',//大图样式
    flow_video: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a',//视频样式
    flow_imgAndChar: '7c44a357-ecd0-4c5b-80d0-db8bd5100149',//大图＋文字样式
    flow_videoAndChar: '4d918595-d2a1-47c7-8e4a-012f28ddd96e',//视频＋文字样式
    flow_smallimgAndChar: '7e1199fd-de4d-469f-8778-5de1268cddea',//图文样式
    flow_imgs: '6684515c-3b6d-40f5-969c-d137c3913aab',//组图样式
    flow_char: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0',//文字链样式

    // tail_root: '987b7cd8-2752-4a15-bc94-6c0a2764a5c4',//广告形式:开屏
    // tail_3_static_img: '8be1afb6-8d5c-4be9-917d-5d187ae03a48',//3S静图
    // tail_5_dynamic_img: '876de12b-5e92-41da-a4a3-2f9fa33eda33',//5S动图
    // tail_5_video: '7d42ec85-5533-4390-9338-84bfb0f725b5',//5S视频

    banner_root: '7b62026a-23aa-4592-836a-f4ee78f7ea2e',//广告形式:横幅
    banner_smallimgAndChar: '3fc13471-36a1-4dfc-abde-98c364e78e2e',//图文样式
    banner_img: 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318',//纯图样式

    plaque_root: '5b3e416f-d93a-4632-87de-5d4fbcc942fb',//广告形式:插屏
    plaque_img: '5e0e3da8-e3cc-4330-a409-ee7263a08711',//纯图样式

    sug_root: '2f18895e-2bc5-4d0b-bc2f-a9426b820d1e',//广告形式：搜索直达
    sug_smallimgAndChar: '5ee12a12-d1ca-45b3-90a7-f8b40b358b02',//图文
    sug_char: 'd499c4e0-50bd-44a3-af0e-ec71dc37cfeb',//文字链
    // sug_imgs: '0f4b8c8e-0acb-49ff-b0d7-bcb099163bfa',//组图

    res_root: 'f3106855-fc59-4e3f-9cf7-a86f2c0fed63',//广告形式：搜索结果页
    res_smallimgAndChar: '2854de8f-2e79-401b-aab3-0a23e4168cb5',//图文
    res_imgs: '47d38555-6a79-4222-8f81-4af3e8cdb106'//组图
}

/**
 * @const {Array} SLOT_CLASS_LIST 广告形式
 * @param {String} SLOT_CLASS_LIST[].classId ID
 * @param {String} SLOT_CLASS_LIST[].CN 名称
 */
export const SLOT_CLASS_LIST = [
    {
        classId: '29076f0d-a923-47d4-bfef-2e3cf28fc099',
        CN: '动态信息流'
    }, {
        classId: 'c96089f7-9cff-4149-997f-bb03d617cda0',
        CN: '固定信息流'
    }, {
        classId: '7b62026a-23aa-4592-836a-f4ee78f7ea2e',
        CN: '横幅'
    }, {
        classId: '5b3e416f-d93a-4632-87de-5d4fbcc942fb',
        CN: '插屏'
    }, {
        classId: '2f18895e-2bc5-4d0b-bc2f-a9426b820d1e',
        CN: '搜索直达'
    }, {
        classId: 'f3106855-fc59-4e3f-9cf7-a86f2c0fed63',
        CN: '搜索结果页'
    }
]

/**
 * @const {Object} SLOT_TEMPLATE_LIST 模板
 * @param {String} SLOT_TEMPLATE_LIST.key 广告位形式
 * @param {Array} SLOT_TEMPLATE_LIST.value 物料配置
 */
export const SLOT_TEMPLATE_LIST = {
    //广告形式:信息流
    '29076f0d-a923-47d4-bfef-2e3cf28fc099': [
        {
            templateId: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032',
            preview: require('./video/infor_flow_img.mp4'),
            CN: '大图样式',
            setting: {
                pic: ['16_9', '4_3', '3_2', '8_1', '4_1', '6_1', '3_1', '32_5'],
                picSize: {
                    '16_9': '720*405',
                    '4_3': '400*300',
                    '3_2': '960*640',
                    '8_1': '800*100',
                    '4_1': '800*200',
                    '6_1': '900*150',
                    '3_1': '720*240',
                    '32_5': '640*100'
                }
            }
        }, {
            templateId: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a',
            preview: require('./video/infor_flow_video.mp4'),
            CN: '视频样式',
            setting: {
                pic: ['16_9', '4_3'],
                picSize: {
                    '16_9': '720*405',
                    '4_3': '400*300'
                }
            }
        },
        {
            templateId: '7c44a357-ecd0-4c5b-80d0-db8bd5100149',
            preview: require('./video/infor_flow_imgAndChar.mp4'),
            CN: '大图＋文字样式',
            setting: {
                pic: ['4_3', '3_2', '2_1', '16_9'],
                picSize: {
                    '4_3': '400*300',
                    '3_2': '960*640',
                    '2_1': '600*300 640*320',
                    '16_9': '720*405 640*360'
                },
                title: {},
                description: {}
            }
        },
        {
            templateId: '4d918595-d2a1-47c7-8e4a-012f28ddd96e',
            preview: require('./video/infor_flow_videoAndChar.mp4'),
            CN: '视频＋文字样式',
            setting: {
                pic: ['4_3', '16_9'],
                picSize: {
                    '16_9': '720*405',
                    '4_3': '400*300'
                },
                video: ['mp4'],
                title: {},
                description: {}
            }
        },
        {
            templateId: '7e1199fd-de4d-469f-8778-5de1268cddea',
            preview: require('./video/infor_flow_smallimgAndChar.mp4'),
            CN: '图文样式',
            setting: {
                pic: ['3_2', '4_3', '1_1', '38_25', '32_21'],
                picSize: {
                    '4_3': '400*300',
                    '3_2': '960*640',
                    '1_1': '400*400',
                    '38_25': '228*150',
                    '32_21': '320*210'
                },
                picPosition: {},
                title: {},
                titleAlign: {},
                description: {}
            }
        },
        {
            templateId: '6684515c-3b6d-40f5-969c-d137c3913aab',
            preview: require('./video/infor_flow_imgs.mp4'),
            CN: '组图样式',
            setting: {
                pic: ['3_2', '4_3', '1_1', '32_21', '38_25'],
                picSize: {
                    '4_3': '400*300',
                    '3_2': '480*320',
                    '1_1': '400*400',
                    '38_25': '228*150',
                    '32_21': '320*210'
                },
                picNum: [3],
                title: {},
                titleAlign: {},
                description: {}
            }
        },
        {
            templateId: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0',
            preview: require('./video/infor_flow_char.mp4'),
            CN: '文字链样式',
            setting: {
                title: {}
            }
        }],
    //固定信息流
    'c96089f7-9cff-4149-997f-bb03d617cda0': [
        {
            templateId: 'c0bb62fe-fc21-4b0b-a5c7-d547db667032_fixed',
            preview: require('./video/infor_flow_img.mp4'),
            CN: '大图样式',
            setting: {
                pic: ['16_9', '4_3', '3_2', '8_1', '4_1', '6_1', '3_1', '32_5'],
                picSize: {
                    '16_9': '720*405',
                    '4_3': '400*300',
                    '3_2': '960*640',
                    '8_1': '800*100',
                    '4_1': '800*200',
                    '6_1': '900*150',
                    '3_1': '720*240',
                    '32_5': '640*100'
                }
            }
        }, {
            templateId: 'b2826850-b106-4cde-8a7c-d1d08dfaec7a_fixed',
            preview: require('./video/infor_flow_video.mp4'),
            CN: '视频样式',
            setting: {
                pic: ['16_9', '4_3'],
                picSize: {
                    '16_9': '720*405',
                    '4_3': '400*300'
                }
            }
        },
        {
            templateId: '7c44a357-ecd0-4c5b-80d0-db8bd5100149_fixed',
            preview: require('./video/infor_flow_imgAndChar.mp4'),
            CN: '大图＋文字样式',
            setting: {
                pic: ['4_3', '3_2', '2_1', '16_9'],
                picSize: {
                    '4_3': '400*300',
                    '3_2': '960*640',
                    '2_1': '600*300 640*320',
                    '16_9': '720*405 640*360'
                },
                title: {},
                description: {}
            }
        },
        {
            templateId: '4d918595-d2a1-47c7-8e4a-012f28ddd96e_fixed',
            preview: require('./video/infor_flow_videoAndChar.mp4'),
            CN: '视频＋文字样式',
            setting: {
                pic: ['4_3', '16_9'],
                picSize: {
                    '16_9': '720*405',
                    '4_3': '400*300'
                },
                video: ['mp4'],
                title: {},
                description: {}
            }
        },
        {
            templateId: '7e1199fd-de4d-469f-8778-5de1268cddea_fixed',
            preview: require('./video/infor_flow_smallimgAndChar.mp4'),
            CN: '图文样式',
            setting: {
                pic: ['3_2', '4_3', '1_1', '38_25', '32_21'],
                picSize: {
                    '4_3': '400*300',
                    '3_2': '960*640',
                    '1_1': '400*400',
                    '38_25': '228*150',
                    '32_21': '320*210'
                },
                picPosition: {},
                title: {},
                titleAlign: {},
                description: {}
            }
        },
        {
            templateId: '6684515c-3b6d-40f5-969c-d137c3913aab_fixed',
            preview: require('./video/infor_flow_imgs.mp4'),
            CN: '组图样式',
            setting: {
                pic: ['3_2', '4_3', '1_1', '32_21', '38_25'],
                picSize: {
                    '4_3': '400*300',
                    '3_2': '480*320',
                    '1_1': '400*400',
                    '38_25': '228*150',
                    '32_21': '320*210'
                },
                picNum: [3],
                title: {},
                description: {}
            }
        },
        {
            templateId: '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0_fixed',
            preview: require('./video/infor_flow_char.mp4'),
            CN: '文字链样式',
            setting: {
                title: {}
            }
        }
    ],
    //广告形式:开屏
    // '987b7cd8-2752-4a15-bc94-6c0a2764a5c4': [
    //     {
    //         templateId: '8be1afb6-8d5c-4be9-917d-5d187ae03a48',
    //         preview: require('./video/infor_static_tail.mp4'),
    //         CN: '3S静图',
    //         previewBorder: false
    //     },
    //     {
    //         templateId: '876de12b-5e92-41da-a4a3-2f9fa33eda33',
    //         preview: require('./video/infor_dynamics_tail.mp4'),
    //         CN: '5S动图',
    //         previewBorder: false
    //     },
    //     {
    //         templateId: '7d42ec85-5533-4390-9338-84bfb0f725b5',
    //         preview: require('./video/infor_video_tail.mp4'),
    //         CN: '5S视频',
    //         previewBorder: false
    //     }
    // ],
    //广告形式:横幅
    '7b62026a-23aa-4592-836a-f4ee78f7ea2e': [
        {
            templateId: '3fc13471-36a1-4dfc-abde-98c364e78e2e',
            preview: require('./video/infor_banner_graphic.mp4'),
            CN: '图文样式',
            setting: {
                pic: ['1_1'],
                picSize: {
                    '1_1': '72*72'
                },
                title: {},
                description: {}
            }
        },
        {
            templateId: 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318',
            preview: require('./video/infor_banner_pure_figure.mp4'),
            CN: '纯图样式',
            setting: {
                pic: ['32_5', '17_5'],
                picSize: {
                    '32_5': '640*100',
                    '17_5': '340*100'
                }
            }
        }
    ],
    //广告形式:插屏
    '5b3e416f-d93a-4632-87de-5d4fbcc942fb': [
        {
            templateId: '5e0e3da8-e3cc-4330-a409-ee7263a08711',
            preview: require('./video/infor_plaque.mp4'),
            CN: '纯图样式',
            setting: {
                pic: ['6_5', '4_3', '16_9'],
                picSize: {
                    '6_5': '600*500',
                    '4_3': '1024*768',
                    '16_9': '1280*720'
                }
            }
        }
    ],
    //广告形式:搜索直达
    '2f18895e-2bc5-4d0b-bc2f-a9426b820d1e': [
        {
            templateId: '5ee12a12-d1ca-45b3-90a7-f8b40b358b02',
            preview: require('./video/infor_sug_smallimgAndChar.mp4'),
            CN: '图文样式',
            setting: {
                pic: ['1_1', '3_2', '4_3'],
                picSize: {
                    '1_1': '400*400 138*138',
                    '3_2': '480*320',
                    '4_3': '400*300'
                },
                picPosition: {},
                title: {
                    max: 15
                },
                description: {
                    max: 25
                }
            }
        },
        {
            templateId: 'd499c4e0-50bd-44a3-af0e-ec71dc37cfeb',
            preview: require('./video/infor_sug_char.mp4'),
            CN: '文字链样式',
            setting: {
                title: {}
            }
        },
        // {
        //     templateId: '0f4b8c8e-0acb-49ff-b0d7-bcb099163bfa',
        //     preview: require('./video/infor_sug_imgs.mp4'),
        //     CN: '组图样式',
        //     setting: {
        //         pic: ['3_2', '4_3', '1_1', '32_21', '38_25'],
        //         picSize: {
        //             '3_2': '480*320',
        //             '4_3': '400*300',
        //             '1_1': '400*400',
        //             '32_21': '320*210',
        //             '38_25': '228*150'
        //         },
        //         picNum: [3],
        //         title: {},
        //         titleAlign: {}
        //     }
        // }
    ],
    //广告形式:搜索结果页
    'f3106855-fc59-4e3f-9cf7-a86f2c0fed63': [
        {
            templateId: '2854de8f-2e79-401b-aab3-0a23e4168cb5',
            preview: require('./video/infor_res_smallimgAndChar.mp4'),
            CN: '图文样式',
            setting: {
                pic: ['1_1', '3_2', '4_3'],
                picSize: {
                    '1_1': '400*400 138*138',
                    '3_2': '480*320',
                    '4_3': '400*300'
                },
                picPosition: {},
                title: {},
                description: {
                    max: 80
                }
            }
        },
        {
            templateId: '47d38555-6a79-4222-8f81-4af3e8cdb106',
            preview: require('./video/infor_res_imgs.mp4'),
            CN: '组图样式',
            setting: {
                pic: ['3_2', '4_3', '1_1', '32_21', '38_25'],
                picSize: {
                    '3_2': '480*320',
                    '4_3': '400*300',
                    '1_1': '400*400',
                    '32_21': '320*210',
                    '38_25': '228*150'
                },
                picNum: [3],
                title: {},
                titleAlign: {}
            }
        }
    ]
}

/**
 * @const {Object} SLOT_DICTIONARY ID=>CN字典表
 * @param {String} SLOT_DICTIONARY.key 广告位ID、模板ID
 * @param {String} SLOT_DICTIONARY.value 名称
 */
const SLOT_DICTIONARY = {}
SLOT_CLASS_LIST.forEach(t => SLOT_DICTIONARY[t.classId] = t.CN)
Object.values(SLOT_TEMPLATE_LIST).forEach(item =>
    item.forEach(t => SLOT_DICTIONARY[t.templateId] = t.CN)
)
export { SLOT_DICTIONARY }

//字体
const fontConfig = [
    { value: '', label: '系统默认字体' },
    { value: 'LiHei Pro Medium', label: '苹果丽黑 LiHei Pro Medium' },
    { value: 'LiSong Pro Light', label: '苹果丽宋 LiSong Pro Light' },
    { value: 'Apple LiGothic Medium', label: '苹果丽中黑 Apple LiGothic Medium' },
    { value: 'Apple LiSung Light', label: '苹果丽细宋 Apple LiSung Light' },
    { value: 'Hiragino Sans', label: '冬青黑体 Hiragino Sans' },
    { value: 'Droid Sans', label: 'Droid Sans' },
    { value: 'Droid Sans Fallback', label: 'Droid Sans Fallback' },
    { value: 'STHeiti', label: '华文黑体 STHeiti' },
    { value: 'STKaiti', label: '华文楷体 STKaiti' },
    { value: 'STSong', label: '华文宋体 STSong' },
    { value: 'STFangsong', label: '华文仿宋 STFangsong' },
    { value: 'STHeiti Light', label: '华文细黑 STHeiti Light' },
    { value: 'Microsoft YaHei', label: '微软雅黑 Microsoft YaHei' },
    { value: '方正兰亭中黑_GBK', label: '方正兰亭中黑_GBK' },
    { value: '方正兰亭黑_GBK', label: '方正兰亭黑_GBK' },
    { value: 'Source Han Sans', label: '思源黑体 Source Han Sans' },
    { value: 'ExtractBlack', label: '汉仪旗黑 ExtractBlacki' },
    { value: 'SimSun', label: '宋体 SimSun' },
    { value: 'SimHei', label: '黑体 SimHei' },
    { value: 'FZZhongDengXian', label: '方正等线 FZZhongDengXian' },
    { value: 'zysong', label: '中易宋体 zysong' },
    { value: 'WenQuanYi Micro Hei Mono', label: '文泉驿微米黑 WenQuanYi Micro Hei Mono' }
]
//字体大小
const fontSizeConfig = [
    { value: '12', label: '12px' },
    { value: '13', label: '13px' },
    { value: '14', label: '14px' },
    { value: '15', label: '15px' },
    { value: '16', label: '16px' },
    { value: '17', label: '17px' },
    { value: '18', label: '18px' },
    { value: '19', label: '19px' },
    { value: '20', label: '20px' },
    { value: '21', label: '21px' },
    { value: '22', label: '22px' },
    { value: '23', label: '23px' },
    { value: '24', label: '24px' },
    { value: '25', label: '25px' },
    { value: '26', label: '26px' }
]
//文字长度
const textLength = (min = 2, max = 23) => {
    const arr = []
    for (let i = min; i <= max; i++) {
        const v = '' + i
        arr.push({ value: v, label: v })
    }
    return arr
}
//物料配置
const SLOT_TEMPLATE_SETTING = {}
Object.values(SLOT_TEMPLATE_LIST).forEach(item =>
    item.forEach(t => {
        const { CN, setting = {} } = t
        const { pic, picSize, picNum, picPosition, video, title, titleAlign, description } = t.setting
        const obj = {}
        if (pic) {
            obj.pic = pic.map(t => ({ value: t, label: `${t.replace(/_/g, ':')} ${picSize[t]}` }))
            if (picNum) {
                obj.picNum = picNum.map(t => ({ value: t, label: t }))
            }
            if (picPosition) {
                obj.picPosition = [
                    { value: 'left', label: '左侧' },
                    { value: 'right', label: '右侧' }
                ]
            }
        }
        if (video) {
            obj.video = video.map(t => ({ value: t, label: t }))
        }
        if (title) {
            obj.title = {
                font: fontConfig,
                fontSize: fontSizeConfig,
                length: textLength(title.min, title.max)
            }
            if (titleAlign) {
                obj.title.align = [
                    { value: 'top', label: '顶部对齐' },
                    { value: 'middle', label: '垂直居中' }
                ]
            }
        }
        if (description) {
            obj.description = {
                font: fontConfig,
                fontSize: fontSizeConfig,
                length: textLength(description.min, description.max)
            }
        }
        SLOT_TEMPLATE_SETTING[t.templateId] = { CN, setting: obj }
    })
)
export { SLOT_TEMPLATE_SETTING }
// console.log(SLOT_TEMPLATE_LIST, SLOT_TEMPLATE_SETTING)

/**
 * @method sortSlotTemplates(data,field) 对模板数据排序
 * @param {Array} data 数据
 * @param {String} field 字段
 */
export function sortSlotTemplates(data = [], field = '') {
    var sortKeys = Object.keys(SLOT_DICTIONARY)
    var newData = []
    for (let i = 0, l = sortKeys.length; i < l; i++) {
        var sortKey = sortKeys[i]
        var theObj = data.find(t => field === '' ? t === sortKey : t[field] === sortKey)
        if (theObj !== undefined) {
            newData.push(theObj)
        }
    }
    return newData
}