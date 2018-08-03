//actions type composeSecondCreation
// 保存标题
const SAVE_TITLE = 'COMPOSESECONDCREATION_SAVE_TITLE';
// 保存马甲名
const SAVE_MASKMAN = 'COMPOSESECONDCREATION_SAVE_MASKMAN';
// 保存编辑器内容
const SAVE_EDITORCONTENT = 'COMPOSESECONDCREATION_SAVE_EDITORCONTENT';
// 保存封面图 图片
const SAVE_DISPLAYINFO = 'COMPOSESECONDCREATION_SAVE_DISPLAYINFO';
// 保存分类 code
const SAVE_CATEGORY = 'COMPOSESECONDCREATION_SAVE_CATEGORY';
// 保存标签
const SAVE_TAGS = 'COMPOSESECONDCREATION_SAVE_TAGS';
// 保存预览HTML
const SAVE_CONTENT = 'COMPOSESECONDCREATION_SAVE_CONTENT';
// 保存用户选中的关键字
const SAVE_MACHINETAG = 'COMPOSESECONDCREATION_SAVE_MACHINETAG';
// 保存用户提取的内容类型
const SAVE_TYPE = 'COMPOSESECONDCREATION_SAVE_TYPE';
// 保存用户上传封面图三图的临时变量
const SAVE_PICS = 'COMPOSESECONDCREATION_SAVE_PICS';
// 保存uid
const SAVE_UID = 'COMPOSESECONDCREATION_SAVE_UID';
// 初始化数据
const INIT_DATA = 'COMPOSESECONDCREATION_INIT_DATA';
// 清空数据
const CLEAR_DATA = "COMPOSESECONDCREATION_CLEAR_DATA";
const initialState = {
    uid: '',//uid
    title: '', //文章标题
    marksman: 0, //文章马甲名
    editorContent: '', //编辑产出的html
    content: '',  //详情页的html
    displayInfo: { //封面图的数据
        content: '', //单张或三张的的json格式字符串
        type: 1,//封面图的展示类型 1代表 大图+标题
        count: 1 //封面图的数量 1单张 or 3三张
    },
    category: '', //分类的code
    tags: '', //用户自己输入的标签
    machineTag: '', //用户选中的关键字 code
    type: 1, //提取的内容类型 pic:1 pics:2 vedio:3
    pics: [], // 作为存放三图的临时变量 下标0 1 2 分别对应三图的位置 json格式字符串
    contentUid: '',//非原创作品uid
}

const composeSecondCreation = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_DATA:
            return {
                anything: ""
            }
        case SAVE_TITLE:
            return {
                ...state,
                title: action.title
            }
        case SAVE_MASKMAN:
            return {
                ...state,
                marksman: action.marksman
            }
        case SAVE_EDITORCONTENT:
            return {
                ...state,
                editorContent: action.editorContent
            }
        case SAVE_CONTENT:
            return {
                ...state,
                content: action.content
            }
        case SAVE_DISPLAYINFO:
            return {
                ...state,
                displayInfo: {
                    ...state.displayInfo,
                    type: action.displayInfoContent.type || state.displayInfo.type,
                    content: action.displayInfoContent.content || '',
                    count: action.displayInfoContent.count || state.displayInfo.count
                }
            }
        case SAVE_CATEGORY:
            return {
                ...state,
                category: action.category
            }
        case SAVE_TAGS:
            return {
                ...state,
                tags: action.tags
            }
        case SAVE_MACHINETAG:
            return {
                ...state,
                machineTag: action.machineTag
            }
        case SAVE_TYPE:
            return {
                ...state,
                type: action.type
            }
        case INIT_DATA:
            return {
                ...state,
                ...action.initData
            }
        case SAVE_PICS:
            return {
                ...state,
                pics: action.pics
            }
        case SAVE_UID:
            return {
                ...state,
                uid: action.uid
            }
        default:
            return state
    }
};

export default composeSecondCreation;

// actions creators
export const saveTitle = (title) => {
    return {type: SAVE_TITLE, title}
}

export const saveMaskman = (marksman) => {
    return {type: SAVE_MASKMAN, marksman}
}

export const saveEditorContent = (editorContent) => {
    return {type: SAVE_EDITORCONTENT, editorContent}
}

export const saveContent = (content) => {
    return {type: SAVE_CONTENT, content}
}

export const saveDisplayInfo = (displayInfoContent) => {
    return {type: SAVE_DISPLAYINFO, displayInfoContent}
}

export const saveCategory = (category) => {
    return {type: SAVE_CATEGORY, category}
}

export const saveTags = (tags) => {
    return {type: SAVE_TAGS, tags}
}

export const saveMachineTag = (machineTag) => {
    return {type: SAVE_MACHINETAG, machineTag}
}

export const saveType = (type) => {
    return {type: SAVE_TYPE, type}
}

export const savePics = (pics) => {
    return {type: SAVE_PICS, pics}
}

export const saveUid = (uid) => {
    return {type: SAVE_UID, uid}
}

export const INITDATA = (initData) => {
    // initData 是一个与initialState结构相同的对象
    // initData 是经过初始化处理的对象
    return {type: INIT_DATA, initData: {...initialState, ...initData}}
}

export const CLEARDATA = (clearData) => {
    return {type: CLEAR_DATA, clearData}
}
